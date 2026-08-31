/**
 * 专升本英语学习系统 - 主应用逻辑
 */
(function() {
'use strict';

// ===== 数据合并（安全引用，防止数据文件加载失败导致崩溃） =====
const VOCAB_DATA = [].concat(
  typeof VOCAB_PART1 !== 'undefined' ? VOCAB_PART1 : [],
  typeof VOCAB_PART2 !== 'undefined' ? VOCAB_PART2 : [],
  typeof VOCAB_PART3 !== 'undefined' ? VOCAB_PART3 : [],
  typeof VOCAB_PART4 !== 'undefined' ? VOCAB_PART4 : [],
  typeof VOCAB_PART5 !== 'undefined' ? VOCAB_PART5 : []
);
const G_DATA = typeof GRAMMAR_DATA !== 'undefined' ? GRAMMAR_DATA : { chapters: [] };
const W_DATA = typeof WRITING_DATA !== 'undefined' ? WRITING_DATA : { chapters: [] };
const R_DATA = typeof READING_DATA !== 'undefined' ? READING_DATA : { articles: [] };

// ===== API 配置 =====
const API = {
  baseUrl: (window.location.protocol === 'file:' || window.location.hostname === '') 
    ? null  // 本地文件模式，不使用后端
    : '/api',
  
  isOnline() { return this.baseUrl !== null; },
  
  tokenKey: 'elsp_token',
  userKey: 'elsp_user',
  
  getToken() { return localStorage.getItem(this.tokenKey) || ''; },
  setToken(t) { if (t) localStorage.setItem(this.tokenKey, t); else localStorage.removeItem(this.tokenKey); },
  getUser() { 
    try { return JSON.parse(localStorage.getItem(this.userKey) || 'null'); } 
    catch(e) { return null; } 
  },
  setUser(u) { 
    if (u) localStorage.setItem(this.userKey, JSON.stringify(u)); 
    else localStorage.removeItem(this.userKey); 
  },
  isLoggedIn() { return !!this.getToken(); },
  
  async request(path, method, data) {
    if (!this.isOnline()) {
      return { error: '未连接服务器，请在本地模式下使用' };
    }
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    
    try {
      const res = await fetch(this.baseUrl + path, {
        method: method || 'GET',
        headers,
        body: data ? JSON.stringify(data) : undefined
      });
      const result = await res.json();
      if (!res.ok && result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
        return { error: '无法连接服务器' };
      }
      throw err;
    }
  }
};

// ===== 本地多账号认证（纯前端模式） =====
const LocalAuth = {
  usersKey: 'elsp_users',
  
  // 简单哈希（用于本地密码存储，非安全场景）
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
  },
  
  getUsers() {
    try { return JSON.parse(localStorage.getItem(this.usersKey) || '{}'); }
    catch(e) { return {}; }
  },
  
  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  },
  
  register(username, password) {
    const users = this.getUsers();
    if (users[username]) {
      return { success: false, error: '用户名已存在' };
    }
    users[username] = {
      username,
      password: this.simpleHash(password),
      createdAt: Date.now()
    };
    this.saveUsers(users);
    return { success: true, user: { username } };
  },
  
  login(username, password) {
    const users = this.getUsers();
    const user = users[username];
    if (!user) {
      return { success: false, error: '用户不存在' };
    }
    if (user.password !== this.simpleHash(password)) {
      return { success: false, error: '密码错误' };
    }
    return { success: true, user: { username } };
  },
  
  // 当前登录用户
  currentKey: 'elsp_current_user',
  
  getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(this.currentKey) || 'null'); }
    catch(e) { return null; }
  },
  
  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.currentKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.currentKey);
    }
  },
  
  isLoggedIn() { return !!this.getCurrentUser(); }
};

// ===== 状态管理 =====
const State = {
  currentModule: 'dashboard',
  currentChapter: 1,
  practiceIndex: 0,
  practiceQuestions: [],
  practiceAnswers: [],
  practiceCorrect: 0,
  practiceTotal: 0,
  searchResults: [],
  showSelector: true,
  syncTimer: null
};

// ===== 本地存储管理（按用户隔离） =====
const Storage = {
  getKey(key) {
    const user = LocalAuth.getCurrentUser();
    const prefix = user ? ('elsp_u_' + user.username + '_') : 'elsp_';
    return prefix + key;
  },
  get(key, def) {
    try { const v = localStorage.getItem(this.getKey(key)); return v ? JSON.parse(v) : def; }
    catch(e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem(this.getKey(key), JSON.stringify(val)); }
    catch(e) { console.warn('Storage error:', e); }
  },
  getProgress() { return this.get('progress', {}); },
  setProgress(p) { this.set('progress', p); },
  getChapterProgress(module, chId) {
    const p = this.getProgress();
    if (!p[module]) p[module] = {};
    if (!p[module][chId]) p[module][chId] = { studied: false, correct: 0, total: 0 };
    return p[module][chId];
  },
  setChapterProgress(module, chId, data) {
    const p = this.getProgress();
    if (!p[module]) p[module] = {};
    p[module][chId] = Object.assign(p[module][chId] || {}, data);
    this.setProgress(p);
    SyncManager.scheduleSync();
  },
  getWrongBook() { return this.get('wrongbook', {}); },
  addWrongQuestion(module, chId, question, userAnswer, correctAnswer) {
    const wb = this.getWrongBook();
    if (!wb[module]) wb[module] = {};
    if (!wb[module][chId]) wb[module][chId] = [];
    const exists = wb[module][chId].find(q => q.question === question);
    if (!exists) {
      wb[module][chId].push({ question, userAnswer, correctAnswer, addedAt: Date.now() });
      this.set('wrongbook', wb);
      SyncManager.scheduleSync();
    }
  },
  removeWrongQuestion(module, chId, question) {
    const wb = this.getWrongBook();
    if (wb[module] && wb[module][chId]) {
      wb[module][chId] = wb[module][chId].filter(q => q.question !== question);
      if (wb[module][chId].length === 0) delete wb[module][chId];
      if (Object.keys(wb[module]).length === 0) delete wb[module];
      this.set('wrongbook', wb);
    }
  },
  clearWrongChapter(module, chId) {
    const wb = this.getWrongBook();
    if (wb[module]) { delete wb[module][chId]; this.set('wrongbook', wb); }
  },
  // 同步相关
  async syncWithServer() {
    if (!API.isOnline() || !LocalAuth.isLoggedIn()) return;
    SyncManager.syncAll();
  }
};

// ===== 同步管理器 =====
const SyncManager = {
  syncing: false,
  
  showSync(text) {
    const el = Utils.$('syncStatus');
    if (el) {
      el.querySelector('.sync-text').textContent = text || '同步中...';
      el.classList.add('show');
    }
  },
  
  hideSync() {
    const el = Utils.$('syncStatus');
    if (el) el.classList.remove('show');
  },
  
  async syncAll() {
    if (this.syncing || !API.isOnline()) return;
    if (!LocalAuth.isLoggedIn()) return;
    this.syncing = true;
    this.showSync('同步中...');
    
    try {
      // 同步进度
      const localProgress = Storage.getProgress();
      if (Object.keys(localProgress).length > 0) {
        await API.request('/progress/sync', 'POST', { progress: localProgress });
      }
      
      // 同步错题本
      const localWrong = Storage.getWrongBook();
      if (Object.keys(localWrong).length > 0) {
        await API.request('/wrongbook/sync', 'POST', { wrongbook: localWrong });
      }
      
      // 从服务器拉取最新数据
      const [progRes, wbRes] = await Promise.all([
        API.request('/progress', 'GET'),
        API.request('/wrongbook', 'GET')
      ]);
      
      if (progRes && progRes.progress) {
        Storage.setProgress(progRes.progress);
      }
      if (wbRes && wbRes.wrongbook) {
        Storage.set('wrongbook', wbRes.wrongbook);
      }
      
      this.showSync('已同步');
      setTimeout(() => this.hideSync(), 1500);
      
      // 刷新界面
      Nav.updateProgress();
    } catch (err) {
      console.warn('同步失败:', err.message);
      this.showSync('同步失败');
      setTimeout(() => this.hideSync(), 2000);
    } finally {
      this.syncing = false;
    }
  },
  
  scheduleSync() {
    if (!API.isOnline()) return;
    if (State.syncTimer) clearTimeout(State.syncTimer);
    State.syncTimer = setTimeout(() => this.syncAll(), 2000);
  }
};

// ===== 工具函数 =====
const Utils = {
  $(id) { return document.getElementById(id); },
  $$$(sel) { return document.querySelectorAll(sel); },
  esc(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); },
  shuffle(arr) { const a = arr.slice(); for (let i = a.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; },
  toast(msg, type) {
    const c = Utils.$('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast toast-' + (type || 'info');
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.classList.add('toast-show'); }, 10);
    setTimeout(() => { t.classList.remove('toast-show'); setTimeout(() => t.remove(), 300); }, 3000);
  },
  getImageUrl(word, meaning) {
    const w = encodeURIComponent(word.toLowerCase());
    return 'https://loremflickr.com/400/240/' + w + '?lock=' + (word.length * 7 + word.charCodeAt(0));
  },

  async loadWordImages(container) {
    const cards = Array.from((container || document).querySelectorAll('.word-card'));
    for (const card of cards) {
      const word = card.dataset.word || '';
      const img = card.querySelector('.word-image-preview img');
      if (!img) continue;
      try {
        const resp = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(word));
        if (resp.ok) {
          const data = await resp.json();
          if (data.thumbnail && data.thumbnail.source) {
            img.src = data.thumbnail.source;
            img.alt = word;
            continue;
          }
        }
      } catch(e) {}
      img.src = Utils.getImageUrl(word, '');
      img.onerror = function() { this.parentElement.innerHTML = '<div class="img-placeholder">📷 暂无图片</div>'; };
    }
  },
  speak(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  }
};

// ===== 导航系统 =====
const Nav = {
  init() {
    Utils.$$$('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const mod = item.dataset.module;
        Nav.goTo(mod);
      });
    });
    const mt = Utils.$('menuToggle');
    if (mt) mt.addEventListener('click', () => { Utils.$('sidebar').classList.toggle('open'); });
    const mc = Utils.$('modalClose');
    if (mc) mc.addEventListener('click', () => Utils.$('modalOverlay').classList.remove('active'));
    const imc = Utils.$('imageModalClose');
    if (imc) imc.addEventListener('click', () => Utils.$('imageModalOverlay').classList.remove('active'));
    Utils.$('modalOverlay').addEventListener('click', (e) => { if (e.target === Utils.$('modalOverlay')) Utils.$('modalOverlay').classList.remove('active'); });
    Utils.$('imageModalOverlay').addEventListener('click', (e) => { if (e.target === Utils.$('imageModalOverlay')) Utils.$('imageModalOverlay').classList.remove('active'); });
  },
  goTo(module) {
    State.currentModule = module;
    State.currentChapter = 1;
    State.showSelector = true;
    State.practiceQuestions = [];
    Utils.$$$('.nav-item').forEach(i => i.classList.remove('active'));
    const ni = document.querySelector('.nav-item[data-module="' + module + '"]');
    if (ni) ni.classList.add('active');
    if (window.innerWidth <= 768) Utils.$('sidebar').classList.remove('open');
    Modules.render(module);
  },
  updateProgress() {
    const p = Storage.getProgress();
    let total = 0, done = 0;
    Object.values(p).forEach(mod => {
      Object.values(mod).forEach(ch => {
        total++;
        if (ch.studied) done++;
      });
    });
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    const bar = Utils.$('overallProgress');
    const txt = Utils.$('progressText');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = pct + '%';
  }
};

// ===== 模块渲染器 =====
const Modules = {
  render(module) {
    const c = Utils.$('mainContent');
    if (!c) return;
    const map = {
      'vocab-learn': () => Modules.vocabLearn(),
      'vocab-practice': () => Modules.vocabPractice(),
      'vocab-practice-choice': () => Modules.vocabPracticeChoice(),
      'grammar-learn': () => Modules.grammarLearn(),
      'grammar-practice': () => Modules.grammarPractice(),
      'writing-learn': () => Modules.writingLearn(),
      'writing-practice': () => Modules.writingPractice(),
      'reading-learn': () => Modules.readingLearn(),
      'reading-practice': () => Modules.readingPractice(),
      'trans-blank': () => Modules.transBlank(),
      'trans-input': () => Modules.transInput(),
      'wrong-book': () => Modules.wrongBook(),
      'dashboard': () => Modules.dashboard()
    };
    if (map[module]) { map[module](); Nav.updateProgress(); }
    else c.innerHTML = '<div class="empty-state"><p>模块开发中...</p></div>';
  },

  // --- 章节选择器 ---
  chapterSelector(title, totalChapters, onChapter) {
    let html = '<div class="module-header"><h2>' + Utils.esc(title) + '</h2></div>';
    html += '<div class="chapter-grid">';
    for (let i = 1; i <= totalChapters; i++) {
      const p = Storage.getChapterProgress(State.currentModule, i);
      const cls = p.studied ? 'chapter-card completed' : 'chapter-card';
      const wb = Storage.getWrongBook();
      const hasWrong = wb[State.currentModule] && wb[State.currentModule][i];
      html += '<div class="' + cls + '" data-chapter="' + i + '">';
      html += '<div class="chapter-num">' + i + '</div>';
      html += '<div class="chapter-label">第' + i + '章</div>';
      if (p.studied) html += '<span class="badge badge-success">已完成</span>';
      if (hasWrong) html += '<span class="badge badge-danger">有错题</span>';
      html += '</div>';
    }
    html += '</div>';
    const c = Utils.$('mainContent');
    c.innerHTML = html;
    c.querySelectorAll('.chapter-card').forEach(card => {
      card.addEventListener('click', () => {
        State.currentChapter = parseInt(card.dataset.chapter);
        onChapter();
      });
    });
  },

  // --- 词汇学习 ---
  vocabLearn() {
    const total = VOCAB_DATA.length;
    if (State.currentChapter > total) State.currentChapter = total;
    if (State.showSelector) {
      State.showSelector = false;
      Modules.chapterSelector('词汇学习', total, () => Modules.vocabLearn());
      return;
    }
    const chapter = VOCAB_DATA.find(c => c[0][0] === State.currentChapter) || VOCAB_DATA[0];
    const chId = chapter[0][0];
    const chName = chapter[0][1];
    const words = chapter[1];

    let html = '<div class="module-header">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app.back()">← 返回章节</button>';
    html += '<h2>词汇学习 - 第' + chId + '章: ' + Utils.esc(chName) + '</h2>';
    html += '<span class="badge badge-info">' + words.length + ' 词</span>';
    html += '</div>';

    html += '<div class="word-list">';
    words.forEach((w, idx) => {
      const [word, phonetic, pos, meaning, synonyms, exEn, exCn] = w;
      const imgUrl = Utils.getImageUrl(word, meaning);
      html += '<div class="word-card" data-word="' + Utils.esc(word) + '">';
      html += '<div class="word-card-header">';
      html += '<div class="word-main">';
      html += '<span class="word-text">' + Utils.esc(word) + '</span>';
      html += '<span class="word-phonetic">' + Utils.esc(phonetic) + '</span>';
      html += '<span class="word-pos">' + Utils.esc(pos) + '</span>';
      html += '</div>';
      html += '<div class="word-actions">';
      html += '<button class="btn-icon" onclick="window.__app.speak(\'' + Utils.esc(word) + '\')" title="朗读">🔊</button>';
      html += '<button class="btn-icon" onclick="window.__app.showImage(\'' + Utils.esc(word) + '\',\'' + Utils.esc(meaning) + '\')" title="图片">🖼️</button>';
      html += '</div>';
      html += '</div>';
      html += '<div class="word-meaning">' + Utils.esc(meaning) + '</div>';
      if (synonyms && synonyms.length) {
        html += '<div class="word-synonyms"><span class="syn-label">近义词:</span> ';
        html += synonyms.map(s => '<span class="syn-tag">' + Utils.esc(s) + '</span>').join('');
        html += '</div>';
      }
      html += '<div class="word-example">';
      html += '<div class="ex-en">' + Utils.esc(exEn) + '</div>';
      html += '<div class="ex-cn">' + Utils.esc(exCn) + '</div>';
      html += '</div>';
      html += '<div class="word-image-preview">';
      html += '<img src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'240\'%3E%3Crect fill=\'%232a2a2a\' width=\'400\' height=\'240\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23888\' font-size=\'14\' text-anchor=\'middle\' dy=\'.3em\'%3E📷 加载中...%3C/text%3E%3C/svg%3E" alt="' + Utils.esc(word) + '" loading="lazy" />';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="module-footer">';
    html += '<button class="btn btn-primary" onclick="window.__app.markStudied(\'vocab-learn\',' + chId + ')">标记本章已学完</button>';
    if (chId < total) html += '<button class="btn btn-outline" onclick="window.__app.nextChapter(' + (chId + 1) + ',\'vocab-learn\')">下一章 →</button>';
    html += '</div>';

    Utils.$('mainContent').innerHTML = html;
    Storage.setChapterProgress('vocab-learn', chId, { studied: true });
    Nav.updateProgress();
    Utils.loadWordImages();
  },

  // --- 词汇练习 ---
  vocabPractice() {
    const total = VOCAB_DATA.length;
    if (State.showSelector) {
      State.showSelector = false;
      Modules.chapterSelector('词汇练习', total, () => Modules.vocabPractice());
      return;
    }

    if (State.practiceQuestions.length === 0 || State._vpChapter !== State.currentChapter) {
      State._vpChapter = State.currentChapter;
      const chapter = VOCAB_DATA.find(c => c[0][0] === State.currentChapter) || VOCAB_DATA[0];
      const words = chapter[1];
      const questions = [];
      words.forEach(w => {
        const [word, phonetic, pos, meaning, synonyms, exEn, exCn] = w;
        const allAnswers = (meaning.split(/[;；、]/).map(s => s.trim())).concat(synonyms || []);
        questions.push({
          type: 'word-to-cn',
          word: word,
          phonetic: phonetic,
          pos: pos,
          meaning: meaning,
          synonyms: allAnswers,
          example: exEn,
          exampleCn: exCn,
          chapterId: chapter[0][0],
          chapterName: chapter[0][1]
        });
      });
      State.practiceQuestions = Utils.shuffle(questions).slice(0, Math.min(15, questions.length));
      State.practiceIndex = 0;
      State.practiceCorrect = 0;
      State.practiceTotal = State.practiceQuestions.length;
      State.practiceAnswers = [];
    }

    Modules._renderPracticeQuestion('vocab-practice', '词汇翻译练习');
  },

  // --- 词汇选择题练习 ---
  vocabPracticeChoice() {
    const total = VOCAB_DATA.length;
    if (State.showSelector) {
      State.showSelector = false;
      Modules.chapterSelector('词汇选择题', total, () => Modules.vocabPracticeChoice());
      return;
    }

    if (State.practiceQuestions.length === 0 || State._vpcChapter !== State.currentChapter) {
      State._vpcChapter = State.currentChapter;
      const chapter = VOCAB_DATA.find(c => c[0][0] === State.currentChapter) || VOCAB_DATA[0];
      const words = chapter[1];
      const questions = [];
      // 收集所有词义用于生成干扰项
      const allMeanings = VOCAB_DATA.reduce((acc, ch) => {
        ch[1].forEach(w => { acc.push(w[3]); });
        return acc;
      }, []);

      words.forEach(w => {
        const [word, phonetic, pos, meaning, synonyms, exEn, exCn] = w;
        const correctMeaning = meaning.split(/[;；、]/)[0].trim();
        // 从其他单词中随机取3个干扰项
        const wrongOptions = Utils.shuffle(allMeanings.filter(m => m !== meaning))
          .slice(0, 3)
          .map(m => m.split(/[;；、]/)[0].trim());
        const options = Utils.shuffle([correctMeaning, ...wrongOptions]);
        questions.push({
          type: 'choice',
          word: word,
          phonetic: phonetic,
          pos: pos,
          meaning: meaning,
          correctMeaning: correctMeaning,
          options: options,
          answer: options.indexOf(correctMeaning),
          synonyms: synonyms || [],
          example: exEn,
          exampleCn: exCn,
          chapterId: chapter[0][0],
          chapterName: chapter[0][1]
        });
      });
      State.practiceQuestions = Utils.shuffle(questions).slice(0, Math.min(15, questions.length));
      State.practiceIndex = 0;
      State.practiceCorrect = 0;
      State.practiceTotal = State.practiceQuestions.length;
      State.practiceAnswers = [];
    }

    Modules._renderPracticeQuestion('vocab-practice-choice', '词汇选择题');
  },

  // --- 通用练习题渲染 ---
  _renderPracticeQuestion(module, title) {
    if (State.practiceIndex >= State.practiceTotal) {
      Modules._renderPracticeResult(module, title);
      return;
    }
    const q = State.practiceQuestions[State.practiceIndex];
    let html = '<div class="module-header">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app.backPractice(\'' + module + '\')">← 返回章节</button>';
    html += '<h2>' + Utils.esc(title) + ' - 第' + State.currentChapter + '章</h2></div>';

    html += '<div class="practice-progress">';
    html += '<span>第 ' + (State.practiceIndex + 1) + ' / ' + State.practiceTotal + ' 题</span>';
    html += '<span>已答对 ' + State.practiceCorrect + ' 题</span>';
    html += '</div>';

    html += '<div class="practice-card">';
    if (q.type === 'word-to-cn') {
      html += '<div class="practice-question">';
      html += '<div class="practice-word">' + Utils.esc(q.word) + '</div>';
      html += '<div class="practice-phonetic">' + Utils.esc(q.phonetic) + ' <button class="btn-icon" onclick="window.__app.speak(\'' + Utils.esc(q.word) + '\')">🔊</button></div>';
      html += '<div class="practice-pos">' + Utils.esc(q.pos) + '</div>';
      html += '<div class="practice-hint">请输入该单词的中文释义（近义词也可）</div>';
      html += '<input type="text" class="practice-input" id="practiceInput" placeholder="输入中文释义..." autocomplete="off" />';
      html += '<div class="practice-actions">';
      html += '<button class="btn btn-primary" onclick="window.__app.submitAnswer(\'' + module + '\')">提交答案</button>';
      html += '<button class="btn btn-outline" onclick="window.__app.skipQuestion(\'' + module + '\')">跳过</button>';
      html += '</div>';
      html += '<div class="practice-feedback" id="practiceFeedback"></div>';
      html += '</div>';
    } else if (q.type === 'fill-blank') {
      html += '<div class="practice-question">';
      html += '<div class="practice-instruction">' + Utils.esc(q.instruction || '填空题') + '</div>';
      html += '<div class="practice-sentence">' + Utils.esc(q.sentence).replace('___', '<span class="blank">______</span>') + '</div>';
      html += '<input type="text" class="practice-input" id="practiceInput" placeholder="填入正确答案..." autocomplete="off" />';
      html += '<div class="practice-actions">';
      html += '<button class="btn btn-primary" onclick="window.__app.submitAnswer(\'' + module + '\')">提交</button>';
      html += '<button class="btn btn-outline" onclick="window.__app.skipQuestion(\'' + module + '\')">跳过</button>';
      html += '</div>';
      html += '<div class="practice-feedback" id="practiceFeedback"></div>';
      html += '</div>';
    } else if (q.type === 'choice') {
      html += '<div class="practice-question">';
      if (q.word) {
        html += '<div class="practice-word">' + Utils.esc(q.word) + '</div>';
        html += '<div class="practice-phonetic">' + Utils.esc(q.phonetic) + ' <button class="btn-icon" onclick="window.__app.speak(\'' + Utils.esc(q.word) + '\')">🔊</button></div>';
        html += '<div class="practice-pos">' + Utils.esc(q.pos) + '</div>';
        html += '<div class="practice-hint">请选择该单词的正确中文释义</div>';
      } else {
        html += '<div class="practice-instruction">' + Utils.esc(q.question) + '</div>';
      }
      html += '<div class="practice-options">';
      q.options.forEach((opt, i) => {
        html += '<div class="practice-option" data-idx="' + i + '" onclick="window.__app.selectOption(' + i + ',\'' + module + '\')">';
        html += '<span class="option-letter">' + String.fromCharCode(65 + i) + '</span>';
        html += '<span class="option-text">' + Utils.esc(opt) + '</span>';
        html += '</div>';
      });
      html += '</div>';
      html += '<div class="practice-feedback" id="practiceFeedback"></div>';
      html += '</div>';
    }
    html += '</div>';

    Utils.$('mainContent').innerHTML = html;
    const input = Utils.$('practiceInput');
    if (input) {
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') window.__app.submitAnswer(module);
      });
    }
  },

  _renderPracticeResult(module, title) {
    const pct = State.practiceTotal > 0 ? Math.round(State.practiceCorrect / State.practiceTotal * 100) : 0;
    let html = '<div class="module-header"><h2>' + Utils.esc(title) + ' - 练习完成</h2></div>';
    html += '<div class="result-card">';
    html += '<div class="result-score">' + pct + '%</div>';
    html += '<div class="result-detail">';
    html += '<p>总题数: ' + State.practiceTotal + '</p>';
    html += '<p>答对: <span class="text-success">' + State.practiceCorrect + '</span></p>';
    html += '<p>答错: <span class="text-danger">' + (State.practiceTotal - State.practiceCorrect) + '</span></p>';
    html += '</div>';

    // 错题回顾
    const wrong = State.practiceAnswers.filter(a => !a.correct);
    if (wrong.length > 0) {
      html += '<div class="wrong-review"><h3>错题回顾</h3>';
      wrong.forEach(w => {
        html += '<div class="wrong-item">';
        html += '<div class="wrong-q">' + Utils.esc(w.question) + '</div>';
        html += '<div class="wrong-a">你的答案: ' + Utils.esc(w.userAnswer || '(空)') + '</div>';
        html += '<div class="wrong-correct">正确答案: ' + Utils.esc(w.correctAnswer) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '<div class="result-actions">';
    html += '<button class="btn btn-primary" onclick="window.__app.retryPractice(\'' + module + '\')">再练一次</button>';
    html += '<button class="btn btn-outline" onclick="window.__app.backPractice(\'' + module + '\')">返回章节</button>';
    html += '</div>';
    html += '</div>';
    Utils.$('mainContent').innerHTML = html;

    const ch = State.currentChapter;
    const p = Storage.getChapterProgress(module, ch);
    Storage.setChapterProgress(module, ch, {
      studied: true,
      correct: (p.correct || 0) + State.practiceCorrect,
      total: (p.total || 0) + State.practiceTotal
    });
    Nav.updateProgress();
  },

  // --- 语法学习 ---
  grammarLearn() {
    const total = G_DATA.chapters.length;
    if (State.showSelector) {
      State.showSelector = false;
      Modules.chapterSelector('语法学习', total, () => Modules.grammarLearn());
      return;
    }
    const ch = G_DATA.chapters.find(c => c.id === State.currentChapter) || G_DATA.chapters[0];

    let html = '<div class="module-header">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app.back()">← 返回章节</button>';
    html += '<h2>语法学习 - 第' + ch.id + '章: ' + Utils.esc(ch.title) + '</h2></div>';
    html += '<div class="grammar-content">';
    ch.c.forEach(line => {
      html += '<p class="grammar-line">' + Utils.esc(line) + '</p>';
    });
    html += '</div>';
    html += '<div class="module-footer">';
    html += '<button class="btn btn-primary" onclick="window.__app.markStudied(\'grammar-learn\',' + ch.id + ')">标记已学完</button>';
    if (ch.id < total) html += '<button class="btn btn-outline" onclick="window.__app.nextChapter(' + (ch.id + 1) + ',\'grammar-learn\')">下一章 →</button>';
    html += '</div>';
    Utils.$('mainContent').innerHTML = html;
    Storage.setChapterProgress('grammar-learn', ch.id, { studied: true });
    Nav.updateProgress();
  },

  // --- 语法练习 ---
  grammarPractice() {
    const total = G_DATA.chapters.length;
    if (State.showSelector) {
      State.showSelector = false;
      Modules.chapterSelector('语法练习', total, () => Modules.grammarPractice());
      return;
    }

    if (State.practiceQuestions.length === 0 || State._gpChapter !== State.currentChapter) {
      State._gpChapter = State.currentChapter;
      const ch = G_DATA.chapters.find(c => c.id === State.currentChapter) || G_DATA.chapters[0];
      const questions = [];
      ch.c.forEach(line => {
        // 从语法内容生成选择题
        if (line.includes('【例】') || line.includes('例：') || line.includes('例:')) {
          const parts = line.split(/[【】]/).filter(p => p.trim());
          questions.push({
            type: 'choice',
            question: '选择正确的语法用法:',
            sentence: line,
            options: ['正确用法', '错误用法A', '错误用法B', '错误用法D'],
            answer: 0,
            chapterId: ch.id
          });
        }
      });
      // 如果没有从内容生成足够的题，用通用题
      if (questions.length < 5) {
        const genericQs = [
          { type: 'choice', question: '"' + ch.title + '"的核心考点是什么？', options: ch.c.slice(0, 4).map(l => l.substring(0, 30)), answer: 0, chapterId: ch.id },
          { type: 'fill-blank', instruction: '根据语法规则填空', sentence: ch.c[0].replace(/[【】]/g, ''), answer: '', chapterId: ch.id }
        ];
        questions.push(...genericQs);
      }
      State.practiceQuestions = Utils.shuffle(questions).slice(0, Math.min(10, questions.length));
      State.practiceIndex = 0;
      State.practiceCorrect = 0;
      State.practiceTotal = State.practiceQuestions.length;
      State.practiceAnswers = [];
    }
    Modules._renderPracticeQuestion('grammar-practice', '语法练习');
  },

  // --- 应用文学习 ---
  writingLearn() {
    const total = W_DATA.chapters.length;
    if (State.showSelector) {
      State.showSelector = false;
      Modules.chapterSelector('应用文学习', total, () => Modules.writingLearn());
      return;
    }
    const ch = W_DATA.chapters.find(c => c.id === State.currentChapter) || W_DATA.chapters[0];

    let html = '<div class="module-header">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app.back()">← 返回章节</button>';
    html += '<h2>应用文学习 - 第' + ch.id + '章: ' + Utils.esc(ch.title) + '</h2></div>';

    html += '<div class="writing-section"><h3 class="section-title">📝 开头金句</h3>';
    (ch.openings || []).forEach(s => {
      html += '<div class="writing-sentence">';
      html += '<div class="ws-en">' + Utils.esc(s.en) + ' <button class="btn-icon" onclick="window.__app.speak(\'' + Utils.esc(s.en).replace(/'/g, "\\'") + '\')">🔊</button></div>';
      html += '<div class="ws-cn">' + Utils.esc(s.cn) + '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="writing-section"><h3 class="section-title">📋 中间段金句</h3>';
    (ch.middles || []).forEach(s => {
      html += '<div class="writing-sentence">';
      html += '<div class="ws-en">' + Utils.esc(s.en) + ' <button class="btn-icon" onclick="window.__app.speak(\'' + Utils.esc(s.en).replace(/'/g, "\\'") + '\')">🔊</button></div>';
      html += '<div class="ws-cn">' + Utils.esc(s.cn) + '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="writing-section"><h3 class="section-title">✅ 结尾金句</h3>';
    (ch.endings || []).forEach(s => {
      html += '<div class="writing-sentence">';
      html += '<div class="ws-en">' + Utils.esc(s.en) + ' <button class="btn-icon" onclick="window.__app.speak(\'' + Utils.esc(s.en).replace(/'/g, "\\'") + '\')">🔊</button></div>';
      html += '<div class="ws-cn">' + Utils.esc(s.cn) + '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="module-footer">';
    html += '<button class="btn btn-primary" onclick="window.__app.markStudied(\'writing-learn\',' + ch.id + ')">标记已学完</button>';
    if (ch.id < total) html += '<button class="btn btn-outline" onclick="window.__app.nextChapter(' + (ch.id + 1) + ',\'writing-learn\')">下一章 →</button>';
    html += '</div>';

    Utils.$('mainContent').innerHTML = html;
    Storage.setChapterProgress('writing-learn', ch.id, { studied: true });
    Nav.updateProgress();
  },

  // --- 应用文练习 ---
  writingPractice() {
    const total = W_DATA.chapters.length;
    if (State.showSelector) {
      State.showSelector = false;
      Modules.chapterSelector('应用文练习', total, () => Modules.writingPractice());
      return;
    }

    if (State.practiceQuestions.length === 0 || State._wpChapter !== State.currentChapter) {
      State._wpChapter = State.currentChapter;
      const ch = W_DATA.chapters.find(c => c.id === State.currentChapter) || W_DATA.chapters[0];
      const questions = [];

      // 从开头金句中出翻译题
      (ch.openings || []).forEach((s, i) => {
        questions.push({
          type: 'fill-blank',
          instruction: '根据中文提示补全英文句子',
          sentence: s.en.replace(/\.\.\./g, '___'),
          answer: s.en,
          cnHint: s.cn,
          chapterId: ch.id
        });
      });
      // 从中间段金句中出翻译题
      (ch.middles || []).forEach(s => {
        questions.push({
          type: 'fill-blank',
          instruction: '根据中文提示补全英文句子',
          sentence: s.en.replace(/\.\.\./g, '___'),
          answer: s.en,
          cnHint: s.cn,
          chapterId: ch.id
        });
      });

      State.practiceQuestions = Utils.shuffle(questions).slice(0, Math.min(10, questions.length));
      State.practiceIndex = 0;
      State.practiceCorrect = 0;
      State.practiceTotal = State.practiceQuestions.length;
      State.practiceAnswers = [];
    }
    Modules._renderWritingPractice();
  },

  _renderWritingPractice() {
    if (State.practiceIndex >= State.practiceTotal) {
      Modules._renderPracticeResult('writing-practice', '应用文练习');
      return;
    }
    const q = State.practiceQuestions[State.practiceIndex];
    let html = '<div class="module-header">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app.backPractice(\'writing-practice\')">← 返回章节</button>';
    html += '<h2>应用文练习 - 第' + State.currentChapter + '章</h2></div>';
    html += '<div class="practice-progress"><span>第 ' + (State.practiceIndex + 1) + ' / ' + State.practiceTotal + ' 题</span><span>已答对 ' + State.practiceCorrect + ' 题</span></div>';
    html += '<div class="practice-card">';
    html += '<div class="practice-question">';
    html += '<div class="practice-instruction">' + Utils.esc(q.instruction) + '</div>';
    if (q.cnHint) html += '<div class="practice-hint">中文: ' + Utils.esc(q.cnHint) + '</div>';
    html += '<div class="practice-sentence">' + Utils.esc(q.sentence).replace(/___/g, '<span class="blank">______</span>') + '</div>';
    html += '<input type="text" class="practice-input" id="practiceInput" placeholder="填入英文..." autocomplete="off" />';
    html += '<div class="practice-actions">';
    html += '<button class="btn btn-primary" onclick="window.__app.submitWritingAnswer()">提交</button>';
    html += '<button class="btn btn-outline" onclick="window.__app.skipWritingQuestion()">跳过</button>';
    html += '</div>';
    html += '<div class="practice-feedback" id="practiceFeedback"></div>';
    html += '</div></div>';
    Utils.$('mainContent').innerHTML = html;
    const input = Utils.$('practiceInput');
    if (input) { input.focus(); input.addEventListener('keydown', e => { if (e.key === 'Enter') window.__app.submitWritingAnswer(); }); }
  },

  // --- 阅读文库 ---
  readingLearn() {
    const articles = R_DATA.articles;
    let html = '<div class="module-header"><h2>阅读文库</h2></div>';
    html += '<div class="search-bar">';
    html += '<input type="text" id="readingSearch" placeholder="搜索文章标题、主题或关键词..." autocomplete="off" />';
    html += '<button class="btn btn-primary" onclick="window.__app.searchReading()">搜索</button>';
    html += '</div>';
    html += '<div class="reading-filters">';
    const cats = [...new Set(articles.map(a => a.category))];
    cats.forEach(cat => {
      html += '<span class="filter-tag" onclick="window.__app.filterReading(\'' + Utils.esc(cat) + '\')">' + Utils.esc(cat) + '</span>';
    });
    html += '</div>';
    html += '<div class="article-list" id="articleList">';
    articles.forEach(a => {
      html += '<div class="article-card" data-id="' + a.id + '" onclick="window.__app.viewArticle(' + a.id + ')">';
      html += '<div class="article-title">' + Utils.esc(a.title) + '</div>';
      html += '<div class="article-title-cn">' + Utils.esc(a.titleCn) + '</div>';
      html += '<div class="article-meta">';
      html += '<span class="tag">' + Utils.esc(a.category) + '</span>';
      html += '<span class="tag">' + Utils.esc(a.difficulty) + '</span>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
    Utils.$('mainContent').innerHTML = html;
    const si = Utils.$('readingSearch');
    if (si) si.addEventListener('keydown', e => { if (e.key === 'Enter') window.__app.searchReading(); });
  },

  _renderArticle(a) {
    let html = '<div class="module-header">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app.backToReadingList()">← 返回文库</button>';
    html += '<h2>' + Utils.esc(a.title) + '</h2>';
    html += '<div class="article-meta"><span class="tag">' + Utils.esc(a.category) + '</span><span class="tag">' + Utils.esc(a.difficulty) + '</span></div>';
    html += '</div>';

    // 文章正文，高亮3500词
    let content = a.content;
    const kwMap = {};
    a.keywords.forEach(kw => { kwMap[kw.word.toLowerCase()] = kw; });
    const words = content.split(/(\s+)/);
    const highlighted = words.map(w => {
      const clean = w.toLowerCase().replace(/[^a-z']/g, '');
      if (kwMap[clean]) {
        const kw = kwMap[clean];
        return '<span class="vocab-highlight" title="' + Utils.esc(kw.meaning) + '" data-word="' + Utils.esc(kw.word) + '" data-phonetic="' + Utils.esc(kw.phonetic) + '" data-meaning="' + Utils.esc(kw.meaning) + '">' + w + '</span>';
      }
      return w;
    }).join('');
    html += '<div class="article-content">' + highlighted + '</div>';

    // 词汇表
    html += '<div class="article-vocab"><h3>📖 本文核心词汇</h3><div class="vocab-table">';
    a.keywords.forEach(kw => {
      html += '<div class="vocab-row">';
      html += '<span class="vw">' + Utils.esc(kw.word) + '</span>';
      html += '<span class="vp">' + Utils.esc(kw.phonetic) + '</span>';
      html += '<span class="vm">' + Utils.esc(kw.meaning) + '</span>';
      html += '<button class="btn-icon" onclick="window.__app.speak(\'' + Utils.esc(kw.word) + '\')">🔊</button>';
      html += '</div>';
    });
    html += '</div></div>';

    Utils.$('mainContent').innerHTML = html;
    Utils.$$$('.vocab-highlight').forEach(el => {
      el.addEventListener('click', () => {
        Utils.toast(el.dataset.word + ' ' + el.dataset.phonetic + ' — ' + el.dataset.meaning, 'info');
      });
    });
  },

  // --- 阅读练习 ---
  readingPractice() {
    const articles = R_DATA.articles;
    if (State.showSelector) {
      State.showSelector = false;
      let html = '<div class="module-header"><h2>阅读练习</h2></div>';
      html += '<div class="article-list">';
      articles.forEach(a => {
        html += '<div class="article-card" onclick="window.__app.startReadingPractice(' + a.id + ')">';
        html += '<div class="article-title">' + Utils.esc(a.title) + '</div>';
        html += '<div class="article-title-cn">' + Utils.esc(a.titleCn) + '</div>';
        html += '<div class="article-meta"><span class="tag">' + Utils.esc(a.category) + '</span><span class="tag">' + Utils.esc(a.difficulty) + '</span></div>';
        html += '</div>';
      });
      html += '</div>';
      Utils.$('mainContent').innerHTML = html;
      return;
    }
    // 阅读理解练习：词汇选择题
    if (State.practiceQuestions.length === 0 || State._rpArticle !== State._rpArticleId) {
      State._rpArticle = State._rpArticleId;
      const a = articles.find(ar => ar.id === State._rpArticleId) || articles[0];
      const questions = a.keywords.slice(0, 10).map(kw => {
        const wrong = a.keywords.filter(k => k.word !== kw.word).map(k => k.meaning);
        const opts = Utils.shuffle([kw.meaning, ...wrong.slice(0, 3)]);
        return {
          type: 'choice',
          question: 'What does "' + kw.word + '" mean? (' + kw.phonetic + ')',
          options: opts,
          answer: opts.indexOf(kw.meaning),
          chapterId: a.id
        };
      });
      State.practiceQuestions = questions;
      State.practiceIndex = 0;
      State.practiceCorrect = 0;
      State.practiceTotal = questions.length;
      State.practiceAnswers = [];
    }
    Modules._renderPracticeQuestion('reading-practice', '阅读练习');
  },

  // --- 选词翻译（类似多邻国） ---
  transBlank() {
    if (typeof TRANSLATION_DATA === 'undefined' || !TRANSLATION_DATA.length) {
      Utils.$('mainContent').innerHTML = '<div class="empty-state"><p>翻译数据加载中...</p></div>';
      return;
    }
    if (State.practiceQuestions.length === 0 || State._tbInit !== true) {
      State._tbInit = true;
      State.practiceQuestions = Utils.shuffle(TRANSLATION_DATA.map((t, i) => ({ ...t, idx: i })));
      State.practiceIndex = 0;
      State.practiceCorrect = 0;
      State.practiceTotal = State.practiceQuestions.length;
      State.practiceAnswers = [];
    }
    Modules._renderTransBlankQuestion();
  },

  _renderTransBlankQuestion() {
    if (State.practiceIndex >= State.practiceTotal) {
      Modules._renderPracticeResult('trans-blank', '选词翻译');
      State._tbInit = false;
      return;
    }
    const t = State.practiceQuestions[State.practiceIndex];
    const enWords = t.en.split(/\s+/);
    const cleanWord = (w) => w.replace(/[^a-zA-Z']/g, '').toLowerCase();
    const blankSet = new Set(t.blanks.map(b => cleanWord(b)));
    const correctSlots = enWords.map(w => blankSet.has(cleanWord(w)));

    const actualBlanks = enWords.filter((w, i) => correctSlots[i]).map(w => cleanWord(w));
    const limitedDistractors = Utils.shuffle(t.distractors).slice(0, Math.max(2, 5 - actualBlanks.length));
    const wordBank = Utils.shuffle([...actualBlanks, ...limitedDistractors]);

    let html = '<div class="module-header">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app.backPractice(\'trans-blank\')">← 返回</button>';
    html += '<h2>选词翻译 - 第 ' + (State.practiceIndex + 1) + ' / ' + State.practiceTotal + ' 题</h2>';
    html += '</div>';

    html += '<div class="trans-blank-card">';
    html += '<div class="trans-cn">' + Utils.esc(t.cn) + '</div>';
    html += '<div class="trans-hint">请从下方词库中选择正确的单词填入空格</div>';

    html += '<div class="trans-blank-sentence" id="transSentence">';
    enWords.forEach((w, i) => {
      if (correctSlots[i]) {
        html += '<span class="trans-blank-slot" data-correct="' + Utils.esc(cleanWord(w)) + '" data-filled="" onclick="window.__app._unselectTransWord(this)"></span>';
      } else {
        html += '<span class="trans-fixed-word">' + Utils.esc(w) + '</span>';
      }
      if (i < enWords.length - 1) html += ' ';
    });
    html += '</div>';

    html += '<div class="trans-word-bank" id="transWordBank">';
    wordBank.forEach(w => {
      html += '<button class="trans-word-chip" data-word="' + Utils.esc(w) + '" onclick="window.__app.selectTransWord(this)">' + Utils.esc(w) + '</button>';
    });
    html += '</div>';

    html += '<div class="practice-actions">';
    html += '<button class="btn btn-primary" onclick="window.__app.submitTransBlank()">提交</button>';
    html += '<button class="btn btn-outline" onclick="window.__app.skipTransBlank()">跳过</button>';
    html += '</div>';
    html += '<div class="practice-feedback" id="practiceFeedback"></div>';
    html += '</div>';

    Utils.$('mainContent').innerHTML = html;
  },

  // --- 手动翻译 ---
  transInput() {
    if (typeof TRANSLATION_DATA === 'undefined' || !TRANSLATION_DATA.length) {
      Utils.$('mainContent').innerHTML = '<div class="empty-state"><p>翻译数据加载中...</p></div>';
      return;
    }
    if (State.practiceQuestions.length === 0 || State._tiInit !== true) {
      State._tiInit = true;
      State.practiceQuestions = Utils.shuffle(TRANSLATION_DATA.map((t, i) => ({ ...t, idx: i })));
      State.practiceIndex = 0;
      State.practiceCorrect = 0;
      State.practiceTotal = State.practiceQuestions.length;
      State.practiceAnswers = [];
    }
    Modules._renderTransInputQuestion();
  },

  _renderTransInputQuestion() {
    if (State.practiceIndex >= State.practiceTotal) {
      Modules._renderPracticeResult('trans-input', '手动翻译');
      State._tiInit = false;
      return;
    }
    const t = State.practiceQuestions[State.practiceIndex];
    let html = '<div class="module-header">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app.backPractice(\'trans-input\')">← 返回</button>';
    html += '<h2>手动翻译 - 第 ' + (State.practiceIndex + 1) + ' / ' + State.practiceTotal + ' 题</h2>';
    html += '</div>';

    html += '<div class="trans-input-card">';
    html += '<div class="trans-cn">' + Utils.esc(t.cn) + '</div>';
    html += '<div class="trans-hint">请将该句子翻译为英文（近义表达也可）</div>';
    html += '<textarea class="practice-input trans-textarea" id="practiceInput" placeholder="输入英文翻译..." rows="3"></textarea>';
    html += '<div class="practice-actions">';
    html += '<button class="btn btn-primary" onclick="window.__app.submitTransInput()">提交</button>';
    html += '<button class="btn btn-outline" onclick="window.__app.skipTransInput()">跳过</button>';
    html += '</div>';
    html += '<div class="practice-feedback" id="practiceFeedback"></div>';
    html += '</div>';

    Utils.$('mainContent').innerHTML = html;
    const input = Utils.$('practiceInput');
    if (input) input.focus();
  },

  // --- 错题本 ---
  wrongBook() {
    const wb = Storage.getWrongBook();
    let html = '<div class="module-header"><h2>错题本</h2>';
    html += '<button class="btn btn-sm btn-danger" onclick="window.__app.clearAllWrong()">清空全部</button>';
    html += '</div>';

    let totalWrong = 0;
    Object.values(wb).forEach(mod => { Object.values(mod).forEach(ch => { totalWrong += ch.length; }); });

    if (totalWrong === 0) {
      html += '<div class="empty-state"><p>暂无错题，继续加油！</p></div>';
      Utils.$('mainContent').innerHTML = html;
      return;
    }

    // 按模块和章节显示
    const moduleNames = { 'vocab-practice': '词汇', 'grammar-practice': '语法', 'writing-practice': '应用文', 'reading-practice': '阅读' };
    html += '<div class="wrong-book-stats"><p>共 ' + totalWrong + ' 道错题</p></div>';

    // 显示50个章节的错题
    html += '<div class="chapter-grid">';
    for (let i = 1; i <= 50; i++) {
      let chapterTotal = 0;
      Object.values(wb).forEach(mod => {
        if (mod[i]) chapterTotal += mod[i].length;
      });
      const cls = chapterTotal > 0 ? 'chapter-card has-wrong' : 'chapter-card';
      html += '<div class="' + cls + '" data-chapter="' + i + '">';
      html += '<div class="chapter-num">' + i + '</div>';
      html += '<div class="chapter-label">第' + i + '章</div>';
      if (chapterTotal > 0) html += '<span class="badge badge-danger">' + chapterTotal + '题</span>';
      html += '</div>';
    }
    html += '</div>';

    // 显示当前章节错题
    if (State._wbChapter) {
      const chId = State._wbChapter;
      html += '<div class="wrong-chapter-detail"><h3>第' + chId + '章 错题</h3>';
      let hasAny = false;
      Object.keys(wb).forEach(mod => {
        if (wb[mod][chId] && wb[mod][chId].length > 0) {
          hasAny = true;
          html += '<div class="wrong-module-section"><h4>' + (moduleNames[mod] || mod) + '</h4>';
          wb[mod][chId].forEach((q, qi) => {
            html += '<div class="wrong-item">';
            html += '<div class="wrong-q">' + Utils.esc(q.question) + '</div>';
            html += '<div class="wrong-a">你的答案: ' + Utils.esc(q.userAnswer || '(空)') + '</div>';
            html += '<div class="wrong-correct">正确答案: ' + Utils.esc(q.correctAnswer) + '</div>';
            html += '<button class="btn btn-sm btn-success" onclick="window.__app.practiceWrong(\'' + mod + '\',' + chId + ')">再练习</button>';
            html += '<button class="btn btn-sm btn-outline" onclick="window.__app.deleteWrong(\'' + mod + '\',' + chId + ',' + qi + ')">删除</button>';
            html += '</div>';
          });
          html += '</div>';
        }
      });
      if (!hasAny) html += '<p>本章无错题</p>';
      html += '</div>';
    }

    html += '<div class="module-footer">';
    html += '<button class="btn btn-primary" onclick="window.__app.practiceAllWrong()">全部错题再练习</button>';
    html += '</div>';

    Utils.$('mainContent').innerHTML = html;

    // 绑定章节点击
    Utils.$$$('.chapter-card').forEach(card => {
      card.addEventListener('click', () => {
        State._wbChapter = parseInt(card.dataset.chapter);
        Modules.wrongBook();
      });
    });
  },

  // --- 仪表盘 ---
  dashboard() {
    const p = Storage.getProgress();
    const wb = Storage.getWrongBook();
    let totalStudied = 0, totalChapters = 0, totalCorrect = 0, totalAnswered = 0;
    let totalWrong = 0;
    Object.values(p).forEach(mod => {
      Object.values(mod).forEach(ch => {
        totalChapters++;
        if (ch.studied) totalStudied++;
        totalCorrect += ch.correct || 0;
        totalAnswered += ch.total || 0;
      });
    });
    Object.values(wb).forEach(mod => {
      Object.values(mod).forEach(ch => { totalWrong += ch.length; });
    });

    const accuracy = totalAnswered > 0 ? Math.round(totalCorrect / totalAnswered * 100) : 0;
    const completion = totalChapters > 0 ? Math.round(totalStudied / totalChapters * 100) : 0;

    let html = '<div class="module-header"><h2>📊 学习仪表盘</h2></div>';
    html += '<div class="dashboard-grid">';

    html += '<div class="stat-card stat-blue"><div class="stat-icon">📖</div><div class="stat-info"><div class="stat-value">' + totalStudied + '/' + totalChapters + '</div><div class="stat-label">已学章节</div></div></div>';
    html += '<div class="stat-card stat-green"><div class="stat-icon">✅</div><div class="stat-info"><div class="stat-value">' + accuracy + '%</div><div class="stat-label">练习正确率</div></div></div>';
    html += '<div class="stat-card stat-orange"><div class="stat-icon">📝</div><div class="stat-info"><div class="stat-value">' + totalAnswered + '</div><div class="stat-label">总练习题数</div></div></div>';
    html += '<div class="stat-card stat-red"><div class="stat-icon">❌</div><div class="stat-info"><div class="stat-value">' + totalWrong + '</div><div class="stat-label">错题数量</div></div></div>';

    html += '</div>';

    // 模块进度
    const modules = [
      { key: 'vocab-learn', name: '词汇学习', total: VOCAB_DATA.length },
      { key: 'vocab-practice', name: '词汇练习', total: VOCAB_DATA.length },
      { key: 'grammar-learn', name: '语法学习', total: G_DATA.chapters.length },
      { key: 'grammar-practice', name: '语法练习', total: G_DATA.chapters.length },
      { key: 'writing-learn', name: '应用文学习', total: W_DATA.chapters.length },
      { key: 'writing-practice', name: '应用文练习', total: W_DATA.chapters.length }
    ];

    html += '<div class="dashboard-section"><h3>各模块进度</h3>';
    modules.forEach(m => {
      const mp = p[m.key] || {};
      const studied = Object.values(mp).filter(c => c.studied).length;
      const pct = m.total > 0 ? Math.round(studied / m.total * 100) : 0;
      html += '<div class="module-progress-item">';
      html += '<div class="mp-header"><span>' + m.name + '</span><span>' + studied + '/' + m.total + ' (' + pct + '%)</span></div>';
      html += '<div class="mp-bar"><div class="mp-fill" style="width:' + pct + '%"></div></div>';
      html += '</div>';
    });
    html += '</div>';

    // 快速入口
    html += '<div class="dashboard-section"><h3>快速入口</h3><div class="quick-links">';
    html += '<a class="quick-link" onclick="window.__app.nav(\'vocab-learn\')">📖 词汇学习</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'vocab-practice\')">✏️ 词汇翻译练习</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'vocab-practice-choice\')">🔘 词汇选择题</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'grammar-learn\')">📐 语法学习</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'grammar-practice\')">📝 语法练习</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'writing-learn\')">✒️ 应用文学习</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'writing-practice\')">📋 应用文练习</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'reading-learn\')">🔍 阅读文库</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'trans-blank\')">🧩 选词翻译</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'trans-input\')">✍️ 手动翻译</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'wrong-book\')">❌ 错题本</a>';
    html += '</div></div>';

    Utils.$('mainContent').innerHTML = html;
  }
};

// ===== 全局API（供HTML onclick调用） =====
window.__app = {
  init() { 
    Nav.init(); 
    Nav.goTo('dashboard'); 
    this.updateUserUI();
    this._setupAuthForms();
    // 已登录且在线则自动同步
    if (API.isOnline() && LocalAuth.isLoggedIn()) {
      setTimeout(() => SyncManager.syncAll(), 1000);
    }
  },
  
  _setupAuthForms() {
    const loginForm = Utils.$('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = Utils.$('loginUsername').value.trim();
        const p = Utils.$('loginPassword').value;
        if (!u || !p) { Utils.toast('请输入用户名和密码', 'warning'); return; }
        window.__app.doLogin(u, p);
      });
    }
    const regForm = Utils.$('registerForm');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = Utils.$('registerUsername').value.trim();
        const p1 = Utils.$('registerPassword').value;
        const p2 = Utils.$('registerPassword2').value;
        if (!u || !p1) { Utils.toast('请输入用户名和密码', 'warning'); return; }
        if (p1 !== p2) { Utils.toast('两次密码不一致', 'warning'); return; }
        window.__app.doRegister(u, p1);
      });
    }
  },

  nav(module) { Nav.goTo(module); },
  back() { State.showSelector = true; Modules.render(State.currentModule); },
  backPractice(module) {
    State.showSelector = true;
    State.practiceQuestions = [];
    State._tbInit = false;
    State._tiInit = false;
    Modules.render(module);
  },

  speak(text) { Utils.speak(text); },

  showImage(word, meaning) {
    const url = Utils.getImageUrl(word, meaning);
    const overlay = Utils.$('imageModalOverlay');
    const content = Utils.$('imageModalContent');
    content.innerHTML = '<div class="image-viewer"><h3>' + Utils.esc(word) + '</h3><img src="' + url + '" alt="' + Utils.esc(word) + '" onerror="this.parentElement.innerHTML=\'<p>图片加载失败</p>\'" /></div>';
    overlay.classList.add('active');
  },

  markStudied(module, chId) { Storage.setChapterProgress(module, chId, { studied: true }); Utils.toast('已标记为已学完！', 'success'); Nav.updateProgress(); },

  nextChapter(next, module) { State.currentChapter = next; State.showSelector = false; Modules.render(module); },

  // 练习答题
  submitAnswer(module) {
    const input = Utils.$('practiceInput');
    if (!input) return;
    const userAns = input.value.trim();
    if (!userAns) { Utils.toast('请输入答案', 'warning'); return; }
    const q = State.practiceQuestions[State.practiceIndex];
    let correct = false;

    if (q.type === 'word-to-cn') {
      // 优化判定：分号/顿号分隔的多义匹配，去除标点和空格
      const normalize = (s) => s.replace(/[；;，,。.\s]/g, '').trim().toLowerCase();
      const userNorm = normalize(userAns);
      // 将正确答案按分隔符拆分，逐一匹配
      const allAcceptable = (q.meaning.split(/[;；、，,]/).map(s => s.trim())).concat(q.synonyms || []);
      correct = allAcceptable.some(s => {
        const sNorm = normalize(s);
        if (!sNorm) return false;
        // 精确匹配
        if (sNorm === userNorm) return true;
        // 用户答案包含完整正确答案（如输入"放弃;抛弃"匹配"放弃"）
        if (userNorm.includes(sNorm) && sNorm.length >= 2) return true;
        // 正确答案包含用户答案（如输入"放弃"匹配"放弃;抛弃"）—— 但用户输入至少2字
        if (sNorm.includes(userNorm) && userNorm.length >= 2) return true;
        return false;
      });
    } else if (q.type === 'fill-blank') {
      const correctAns = (q.answer || '').toLowerCase().trim();
      correct = userAns.toLowerCase().trim() === correctAns || correctAns.includes(userAns.toLowerCase().trim());
    }

    State.practiceAnswers.push({
      question: q.type === 'word-to-cn' ? q.word + ' (' + q.phonetic + ')' : (q.sentence || q.question),
      userAnswer: userAns,
      correctAnswer: q.type === 'word-to-cn' ? q.meaning : (q.answer || q.options[q.answer]),
      correct: correct
    });

    if (correct) {
      State.practiceCorrect++;
      Utils.toast('回答正确！', 'success');
    } else {
      const correctAns = q.type === 'word-to-cn' ? q.meaning : (q.answer || q.options[q.answer]);
      Utils.toast('回答错误，正确答案: ' + correctAns, 'error');
      Storage.addWrongQuestion(module, State.currentChapter,
        q.type === 'word-to-cn' ? q.word + ' (' + q.phonetic + ')' : (q.sentence || q.question),
        userAns, correctAns);
    }

    const fb = Utils.$('practiceFeedback');
    if (fb) {
      fb.innerHTML = correct
        ? '<div class="feedback-correct">✅ 正确！' + (q.type === 'word-to-cn' ? q.meaning : '') + '</div>'
        : '<div class="feedback-wrong">❌ 正确答案: ' + (q.type === 'word-to-cn' ? q.meaning : (q.answer || q.options[q.answer])) + '</div>';
    }

    setTimeout(() => {
      State.practiceIndex++;
      let title = '阅读练习';
      if (module.includes('vocab-practice-choice')) title = '词汇选择题';
      else if (module.includes('vocab')) title = '词汇翻译练习';
      else if (module.includes('grammar')) title = '语法练习';
      Modules._renderPracticeQuestion(module, title);
    }, 1500);
  },

  selectOption(idx, module) {
    Utils.$$$('.practice-option').forEach(o => o.classList.remove('selected'));
    const opt = document.querySelector('.practice-option[data-idx="' + idx + '"]');
    if (opt) opt.classList.add('selected');
    const q = State.practiceQuestions[State.practiceIndex];
    const correct = idx === q.answer;
    const questionText = q.word ? q.word + ' (' + q.phonetic + ')' : q.question;
    State.practiceAnswers.push({
      question: questionText,
      userAnswer: q.options[idx],
      correctAnswer: q.options[q.answer],
      correct: correct
    });
    if (correct) { State.practiceCorrect++; Utils.toast('回答正确！', 'success'); }
    else {
      Utils.toast('回答错误，正确答案: ' + q.options[q.answer], 'error');
      Storage.addWrongQuestion(module, State.currentChapter, questionText, q.options[idx], q.options[q.answer]);
    }
    const fb = Utils.$('practiceFeedback');
    if (fb) {
      fb.innerHTML = correct
        ? '<div class="feedback-correct">✅ 正确！</div>'
        : '<div class="feedback-wrong">❌ 正确答案: ' + q.options[q.answer] + '</div>';
    }
    setTimeout(() => {
      State.practiceIndex++;
      let title = '阅读练习';
      if (module.includes('vocab-practice-choice')) title = '词汇选择题';
      else if (module.includes('vocab')) title = '词汇翻译练习';
      else if (module.includes('grammar')) title = '语法练习';
      Modules._renderPracticeQuestion(module, title);
    }, 1500);
  },

  skipQuestion(module) {
    const q = State.practiceQuestions[State.practiceIndex];
    const questionText = q.word ? q.word + ' (' + q.phonetic + ')' : (q.sentence || q.question);
    State.practiceAnswers.push({
      question: questionText,
      userAnswer: '(跳过)',
      correctAnswer: q.type === 'word-to-cn' ? q.meaning : (q.answer !== undefined ? q.options[q.answer] : ''),
      correct: false
    });
    State.practiceIndex++;
    let title = '阅读练习';
    if (module.includes('vocab-practice-choice')) title = '词汇选择题';
    else if (module.includes('vocab')) title = '词汇翻译练习';
    else if (module.includes('grammar')) title = '语法练习';
    Modules._renderPracticeQuestion(module, title);
  },

  retryPractice(module) {
    State.practiceQuestions = [];
    State.showSelector = false;
    State._vpChapter = null;
    State._vpcChapter = null;
    State._gpChapter = null;
    State._wpChapter = null;
    State._tbInit = false;
    State._tiInit = false;
    Modules.render(module);
  },

  // --- 选词翻译交互 ---
  selectTransWord(btn) {
    if (btn.classList.contains('used')) return;
    const word = btn.dataset.word;
    const slots = Array.from(Utils.$$$('.trans-blank-slot'));
    const emptySlot = slots.find(s => !s.dataset.filled);
    if (emptySlot) {
      emptySlot.dataset.filled = word;
      emptySlot.textContent = word;
      emptySlot.classList.add('filled');
      btn.classList.add('used');
    }
  },

  _unselectTransWord(slot) {
    const word = slot.dataset.filled;
    if (!word) return;
    slot.dataset.filled = '';
    slot.textContent = '';
    slot.classList.remove('filled');
    const chip = document.querySelector('.trans-word-chip[data-word="' + word + '"]');
    if (chip) chip.classList.remove('used');
  },

  submitTransBlank() {
    const t = State.practiceQuestions[State.practiceIndex];
    const slots = Utils.$$$('.trans-blank-slot');
    let allFilled = true;
    let allCorrect = true;
    const userAnswer = [];
    slots.forEach(s => {
      const filled = (s.dataset.filled || '').toLowerCase().trim();
      const correct = (s.dataset.correct || '').toLowerCase().trim();
      userAnswer.push(s.dataset.filled || '(空)');
      if (!filled) allFilled = false;
      if (filled !== correct) allCorrect = false;
    });

    if (!allFilled) { Utils.toast('请填完所有空格', 'warning'); return; }

    State.practiceAnswers.push({
      question: t.cn,
      userAnswer: userAnswer.join(' '),
      correctAnswer: t.en,
      correct: allCorrect
    });

    const fb = Utils.$('practiceFeedback');
    if (allCorrect) {
      State.practiceCorrect++;
      Utils.toast('翻译正确！', 'success');
      if (fb) fb.innerHTML = '<div class="feedback-correct">✅ 正确！' + this._formatKeyVocab(t.keyVocab) + '</div>';
      setTimeout(() => {
        State.practiceIndex++;
        Modules._renderTransBlankQuestion();
      }, 1200);
    } else {
      Utils.toast('翻译错误', 'error');
      Storage.addWrongQuestion('trans-blank', 1, t.cn, userAnswer.join(' '), t.en);
      if (fb) {
        let fbHtml = '<div class="feedback-wrong">❌ 正确翻译: ' + Utils.esc(t.en) + this._formatKeyVocab(t.keyVocab) + '</div>';
        fbHtml += '<button class="btn btn-primary" style="margin-top:12px" onclick="window.__app.nextTransBlank()">下一题 →</button>';
        fb.innerHTML = fbHtml;
      }
    }
  },

  nextTransBlank() {
    State.practiceIndex++;
    Modules._renderTransBlankQuestion();
  },

  skipTransBlank() {
    const t = State.practiceQuestions[State.practiceIndex];
    State.practiceAnswers.push({
      question: t.cn,
      userAnswer: '(跳过)',
      correctAnswer: t.en,
      correct: false
    });
    State.practiceIndex++;
    Modules._renderTransBlankQuestion();
  },

  // --- 手动翻译交互 ---
  submitTransInput() {
    const input = Utils.$('practiceInput');
    if (!input) return;
    const userAns = input.value.trim();
    if (!userAns) { Utils.toast('请输入翻译', 'warning'); return; }

    const t = State.practiceQuestions[State.practiceIndex];
    const correct = this._checkTranslation(userAns, t.en);

    State.practiceAnswers.push({
      question: t.cn,
      userAnswer: userAns,
      correctAnswer: t.en,
      correct: correct
    });

    const fb = Utils.$('practiceFeedback');
    if (correct) {
      State.practiceCorrect++;
      Utils.toast('翻译正确！', 'success');
      if (fb) fb.innerHTML = '<div class="feedback-correct">✅ 正确！' + this._formatKeyVocab(t.keyVocab) + '</div>';
    } else {
      Utils.toast('翻译不完整，请查看正确翻译', 'error');
      Storage.addWrongQuestion('trans-input', 1, t.cn, userAns, t.en);
      if (fb) fb.innerHTML = '<div class="feedback-wrong">❌ 正确翻译: ' + Utils.esc(t.en) + this._formatKeyVocab(t.keyVocab) + '</div>';
    }

    setTimeout(() => {
      State.practiceIndex++;
      Modules._renderTransInputQuestion();
    }, 3000);
  },

  skipTransInput() {
    const t = State.practiceQuestions[State.practiceIndex];
    State.practiceAnswers.push({
      question: t.cn,
      userAnswer: '(跳过)',
      correctAnswer: t.en,
      correct: false
    });
    State.practiceIndex++;
   Modules._renderTransInputQuestion();
  },

  // --- 翻译判定与格式化工具 ---
  _checkTranslation(userAns, correctEn) {
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const userNorm = normalize(userAns);
    const correctNorm = normalize(correctEn);
    const userWords = userNorm.split(' ').filter(w => w.length > 0);
    const correctWords = correctNorm.split(' ').filter(w => w.length > 0);

    if (userNorm === correctNorm) return true;

    const correctSet = new Set(correctWords);
    let matched = 0;
    userWords.forEach(w => { if (correctSet.has(w)) matched++; });

    const coverage = matched / correctWords.length;
    const reverseCoverage = correctWords.filter(w => userWords.includes(w)).length / correctWords.length;

    return coverage >= 0.7 && reverseCoverage >= 0.6;
  },

  _formatKeyVocab(keyVocab) {
    if (!keyVocab || !keyVocab.length) return '';
    let html = '<div class="key-vocab-list">';
    keyVocab.forEach(kv => {
      const tag = kv.above ? '<span class="vocab-tag above">超纲</span>' : '<span class="vocab-tag">重点</span>';
      html += '<div class="key-vocab-item">' + tag + ' <b>' + Utils.esc(kv.word) + '</b> — ' + Utils.esc(kv.meaning) + '</div>';
    });
    html += '</div>';
    return html;
  },

  // 应用文练习
  submitWritingAnswer() {
    const input = Utils.$('practiceInput');
    if (!input) return;
    const userAns = input.value.trim();
    if (!userAns) { Utils.toast('请输入答案', 'warning'); return; }
    const q = State.practiceQuestions[State.practiceIndex];
    const correctAns = q.answer.toLowerCase().trim();
    const userLower = userAns.toLowerCase().trim();
    const correct = userLower === correctAns || correctAns.includes(userLower) || userLower.includes(correctAns);

    State.practiceAnswers.push({
      question: q.cnHint + ' -> ' + q.sentence,
      userAnswer: userAns,
      correctAnswer: q.answer,
      correct: correct
    });

    if (correct) { State.practiceCorrect++; Utils.toast('回答正确！', 'success'); }
    else {
      Utils.toast('回答错误，正确答案: ' + q.answer, 'error');
      Storage.addWrongQuestion('writing-practice', State.currentChapter, q.cnHint + ' -> ' + q.sentence, userAns, q.answer);
    }
    const fb = Utils.$('practiceFeedback');
    if (fb) {
      fb.innerHTML = correct
        ? '<div class="feedback-correct">✅ 正确！</div>'
        : '<div class="feedback-wrong">❌ 正确答案: ' + q.answer + '</div>';
    }
    setTimeout(() => { State.practiceIndex++; Modules._renderWritingPractice(); }, 1500);
  },

  retryWritingPractice() {
    State.practiceQuestions = [];
    State.showSelector = false;
    State._wpChapter = null;
    Modules.writingPractice();
  },

  skipWritingQuestion() {
    const q = State.practiceQuestions[State.practiceIndex];
    State.practiceAnswers.push({
      question: q.cnHint + ' -> ' + q.sentence,
      userAnswer: '(跳过)',
      correctAnswer: q.answer,
      correct: false
    });
    State.practiceIndex++;
    Modules._renderWritingPractice();
  },

  // 阅读搜索
  searchReading() {
    const kw = Utils.$('readingSearch').value.trim().toLowerCase();
    const list = Utils.$('articleList');
    if (!list) return;
    const articles = R_DATA.articles.filter(a => {
      return a.title.toLowerCase().includes(kw) ||
             a.titleCn.includes(kw) ||
             a.category.toLowerCase().includes(kw) ||
             a.content.toLowerCase().includes(kw) ||
             a.keywords.some(k => k.word.toLowerCase().includes(kw) || k.meaning.includes(kw));
    });
    if (articles.length === 0) { list.innerHTML = '<p class="empty-state">未找到相关文章</p>'; return; }
    list.innerHTML = articles.map(a => {
      return '<div class="article-card" onclick="window.__app.viewArticle(' + a.id + ')">' +
        '<div class="article-title">' + Utils.esc(a.title) + '</div>' +
        '<div class="article-title-cn">' + Utils.esc(a.titleCn) + '</div>' +
        '<div class="article-meta"><span class="tag">' + Utils.esc(a.category) + '</span><span class="tag">' + Utils.esc(a.difficulty) + '</span></div>' +
        '</div>';
    }).join('');
  },

  filterReading(cat) {
    const list = Utils.$('articleList');
    if (!list) return;
    const articles = R_DATA.articles.filter(a => a.category === cat);
    list.innerHTML = articles.map(a => {
      return '<div class="article-card" onclick="window.__app.viewArticle(' + a.id + ')">' +
        '<div class="article-title">' + Utils.esc(a.title) + '</div>' +
        '<div class="article-title-cn">' + Utils.esc(a.titleCn) + '</div>' +
        '<div class="article-meta"><span class="tag">' + Utils.esc(a.category) + '</span><span class="tag">' + Utils.esc(a.difficulty) + '</span></div>' +
        '</div>';
    }).join('');
  },

  viewArticle(id) {
    const a = R_DATA.articles.find(ar => ar.id === id);
    if (a) Modules._renderArticle(a);
  },

  backToReadingList() { Modules.readingLearn(); },

  startReadingPractice(id) {
    State.showSelector = false;
    State._rpArticleId = id;
    State.practiceQuestions = [];
    Modules.readingPractice();
  },

  // 错题本操作
  deleteWrong(mod, chId, idx) {
    const wb = Storage.getWrongBook();
    if (wb[mod] && wb[mod][chId]) {
      wb[mod][chId].splice(idx, 1);
      if (wb[mod][chId].length === 0) delete wb[mod][chId];
      if (Object.keys(wb[mod]).length === 0) delete wb[mod];
      Storage.set('wrongbook', wb);
      Utils.toast('已删除', 'success');
      Modules.wrongBook();
    }
  },

  practiceWrong(mod, chId) {
    const wb = Storage.getWrongBook();
    if (!wb[mod] || !wb[mod][chId] || wb[mod][chId].length === 0) { Utils.toast('无错题可练习', 'info'); return; }
    const questions = wb[mod][chId].map(q => ({
      type: 'fill-blank',
      instruction: '请写出正确答案',
      sentence: q.question,
      answer: q.correctAnswer,
      chapterId: chId
    }));
    State.practiceQuestions = questions;
    State.practiceIndex = 0;
    State.practiceCorrect = 0;
    State.practiceTotal = questions.length;
    State.practiceAnswers = [];
    State.currentChapter = chId;
    State._wrongPracticeMod = mod;
    Modules._renderWrongPractice();
  },

  practiceAllWrong() {
    const wb = Storage.getWrongBook();
    const questions = [];
    Object.keys(wb).forEach(mod => {
      Object.keys(wb[mod]).forEach(chId => {
        wb[mod][chId].forEach(q => {
          questions.push({
            type: 'fill-blank',
            instruction: '请写出正确答案',
            sentence: q.question,
            answer: q.correctAnswer,
            chapterId: parseInt(chId),
            module: mod
          });
        });
      });
    });
    if (questions.length === 0) { Utils.toast('无错题可练习', 'info'); return; }
    State.practiceQuestions = Utils.shuffle(questions);
    State.practiceIndex = 0;
    State.practiceCorrect = 0;
    State.practiceTotal = questions.length;
    State.practiceAnswers = [];
    State._wrongPracticeAll = true;
    Modules._renderWrongPractice();
  },

  clearAllWrong() {
    if (confirm('确定要清空所有错题吗？此操作不可撤销。')) {
      Storage.set('wrongbook', {});
      Utils.toast('已清空全部错题', 'success');
      Modules.wrongBook();
    }
  }
};

// 补充错题练习渲染
Modules._renderWrongPractice = function() {
  if (State.practiceIndex >= State.practiceTotal) {
    let html = '<div class="module-header"><h2>错题练习完成</h2></div>';
    const pct = State.practiceTotal > 0 ? Math.round(State.practiceCorrect / State.practiceTotal * 100) : 0;
    html += '<div class="result-card">';
    html += '<div class="result-score">' + pct + '%</div>';
    html += '<div class="result-detail"><p>总题数: ' + State.practiceTotal + '</p><p>答对: <span class="text-success">' + State.practiceCorrect + '</span></p><p>答错: <span class="text-danger">' + (State.practiceTotal - State.practiceCorrect) + '</span></p></div>';
    const wrong = State.practiceAnswers.filter(a => !a.correct);
    if (wrong.length > 0) {
      html += '<div class="wrong-review"><h3>仍需复习</h3>';
      wrong.forEach(w => {
        html += '<div class="wrong-item"><div class="wrong-q">' + Utils.esc(w.question) + '</div><div class="wrong-a">你的答案: ' + Utils.esc(w.userAnswer) + '</div><div class="wrong-correct">正确答案: ' + Utils.esc(w.correctAnswer) + '</div></div>';
      });
      html += '</div>';
    }
    html += '<div class="result-actions"><button class="btn btn-primary" onclick="window.__app.nav(\'wrong-book\')">返回错题本</button></div>';
    html += '</div>';
    Utils.$('mainContent').innerHTML = html;
    // 答对的错题从错题本中删除
    State.practiceAnswers.forEach(a => {
      if (a.correct && State._wrongPracticeAll) {
        // 全部错题练习中答对的，从错题本删除
        const wb = Storage.getWrongBook();
        Object.keys(wb).forEach(mod => {
          Object.keys(wb[mod]).forEach(chId => {
            wb[mod][chId] = wb[mod][chId].filter(q => q.question !== a.question);
            if (wb[mod][chId].length === 0) delete wb[mod][chId];
          });
          if (Object.keys(wb[mod]).length === 0) delete wb[mod];
        });
        Storage.set('wrongbook', wb);
      }
    });
    return;
  }
  const q = State.practiceQuestions[State.practiceIndex];
  let html = '<div class="module-header"><h2>错题再练习</h2></div>';
  html += '<div class="practice-progress"><span>第 ' + (State.practiceIndex + 1) + ' / ' + State.practiceTotal + ' 题</span><span>已答对 ' + State.practiceCorrect + ' 题</span></div>';
  html += '<div class="practice-card"><div class="practice-question">';
  html += '<div class="practice-instruction">' + Utils.esc(q.instruction) + '</div>';
  html += '<div class="practice-sentence">' + Utils.esc(q.sentence) + '</div>';
  html += '<input type="text" class="practice-input" id="practiceInput" placeholder="输入正确答案..." autocomplete="off" />';
  html += '<div class="practice-actions"><button class="btn btn-primary" onclick="window.__app.submitWrongAnswer()">提交</button><button class="btn btn-outline" onclick="window.__app.skipWrong()">跳过</button></div>';
  html += '<div class="practice-feedback" id="practiceFeedback"></div>';
  html += '</div></div>';
  Utils.$('mainContent').innerHTML = html;
  const input = Utils.$('practiceInput');
  if (input) { input.focus(); input.addEventListener('keydown', e => { if (e.key === 'Enter') window.__app.submitWrongAnswer(); }); }
};

window.__app.submitWrongAnswer = function() {
  const input = Utils.$('practiceInput');
  if (!input) return;
  const userAns = input.value.trim();
  if (!userAns) { Utils.toast('请输入答案', 'warning'); return; }
  const q = State.practiceQuestions[State.practiceIndex];
  const correctAns = (q.answer || '').toLowerCase().trim();
  const userLower = userAns.toLowerCase().trim();
  const correct = userLower === correctAns || correctAns.includes(userLower) || userLower.includes(correctAns);
  State.practiceAnswers.push({ question: q.sentence, userAnswer: userAns, correctAnswer: q.answer, correct: correct });
  if (correct) { State.practiceCorrect++; Utils.toast('回答正确！', 'success'); }
  else Utils.toast('回答错误，正确答案: ' + q.answer, 'error');
  const fb = Utils.$('practiceFeedback');
  if (fb) fb.innerHTML = correct ? '<div class="feedback-correct">✅ 正确！</div>' : '<div class="feedback-wrong">❌ 正确答案: ' + q.answer + '</div>';
  setTimeout(() => { State.practiceIndex++; Modules._renderWrongPractice(); }, 1500);
};

window.__app.skipWrong = function() {
  const q = State.practiceQuestions[State.practiceIndex];
  State.practiceAnswers.push({ question: q.sentence, userAnswer: '(跳过)', correctAnswer: q.answer, correct: false });
  State.practiceIndex++;
  Modules._renderWrongPractice();
};

// ===== 认证相关 =====
window.__app.showLogin = function() {
  Utils.$('authModalOverlay').classList.add('active');
  this.switchAuthTab('login');
};

window.__app.closeAuthModal = function() {
  Utils.$('authModalOverlay').classList.remove('active');
};

window.__app.switchAuthTab = function(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.auth-tab[data-tab="' + tab + '"]').classList.add('active');
  Utils.$('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  Utils.$('registerForm').style.display = tab === 'register' ? 'block' : 'none';
};

window.__app.doLogin = async function(username, password) {
  try {
    // 优先本地认证
    const res = LocalAuth.login(username, password);
    if (res.success) {
      LocalAuth.setCurrentUser(res.user);
      this.updateUserUI();
      this.closeAuthModal();
      Utils.toast('登录成功！', 'success');
      // 如果在线则同步数据
      if (API.isOnline()) {
        SyncManager.syncAll();
      }
      return true;
    }
    Utils.toast(res.error || '登录失败', 'error');
    return false;
  } catch (err) {
    Utils.toast(err.message || '登录失败', 'error');
    return false;
  }
};

window.__app.doRegister = async function(username, password) {
  try {
    if (username.length < 2) { Utils.toast('用户名至少2位', 'warning'); return false; }
    if (password.length < 4) { Utils.toast('密码至少4位', 'warning'); return false; }
    const res = LocalAuth.register(username, password);
    if (res.success) {
      LocalAuth.setCurrentUser(res.user);
      this.updateUserUI();
      this.closeAuthModal();
      Utils.toast('注册成功，已自动登录', 'success');
      if (API.isOnline()) {
        SyncManager.syncAll();
      }
      return true;
    }
    Utils.toast(res.error || '注册失败', 'error');
    return false;
  } catch (err) {
    Utils.toast(err.message || '注册失败', 'error');
    return false;
  }
};

window.__app.logout = function() {
  if (confirm('确定要退出登录吗？学习数据会保留在本机上。')) {
    LocalAuth.setCurrentUser(null);
    this.updateUserUI();
    Utils.toast('已退出登录', 'info');
    // 刷新页面以重置状态
    location.reload();
  }
};

window.__app.updateUserUI = function() {
  const user = LocalAuth.getCurrentUser();
  const nameEl = Utils.$('userName');
  const btnEl = Utils.$('loginBtn');
  if (user) {
    nameEl.textContent = '👤 ' + user.username;
    btnEl.textContent = '退出';
    btnEl.onclick = () => window.__app.logout();
  } else {
    nameEl.textContent = '未登录';
    btnEl.textContent = '登录';
    btnEl.onclick = () => window.__app.showLogin();
  }
};

window.__app.manualSync = function() {
  if (!LocalAuth.isLoggedIn()) {
    Utils.toast('请先登录', 'warning');
    return;
  }
  if (!API.isOnline()) {
    Utils.toast('本地模式下数据已保存在本机', 'info');
    return;
  }
  SyncManager.syncAll();
};

// ===== PWA 安装提示 =====
let _deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  _deferredInstallPrompt = e;
  // 延迟一点显示，避免页面刚加载就弹
  setTimeout(() => {
    if (_deferredInstallPrompt && !localStorage.getItem('pwa_install_dismissed')) {
      window.__app.showInstallBanner();
    }
  }, 3000);
});

window.addEventListener('appinstalled', function() {
  _deferredInstallPrompt = null;
  Utils.toast('安装成功！已添加到桌面', 'success');
});

window.__app.showInstallPrompt = function() {
  // 兼容旧版触发
  if (_deferredInstallPrompt && !localStorage.getItem('pwa_install_dismissed')) {
    this.showInstallBanner();
  }
};

window.__app.showInstallBanner = function() {
  // 避免重复显示
  if (document.getElementById('pwaInstallBanner')) return;
  
  const banner = document.createElement('div');
  banner.id = 'pwaInstallBanner';
  banner.className = 'pwa-install-banner';
  banner.innerHTML = `
    <div class="pwa-banner-content">
      <div class="pwa-banner-icon">📚</div>
      <div class="pwa-banner-text">
        <div class="pwa-banner-title">添加到桌面</div>
        <div class="pwa-banner-desc">像APP一样使用，更方便</div>
      </div>
      <button class="btn btn-primary btn-sm" id="pwaInstallBtn">安装</button>
      <button class="pwa-banner-close" id="pwaCloseBtn" aria-label="关闭">×</button>
    </div>
  `;
  document.body.appendChild(banner);
  
  Utils.$('pwaInstallBtn').onclick = () => {
    if (_deferredInstallPrompt) {
      _deferredInstallPrompt.prompt();
      _deferredInstallPrompt.userChoice.then(() => {
        _deferredInstallPrompt = null;
      });
    } else {
      // iOS Safari 或不支持自动安装的浏览器，显示手动添加指引
      this.showInstallGuide();
    }
    banner.remove();
  };
  
  Utils.$('pwaCloseBtn').onclick = () => {
    banner.remove();
    localStorage.setItem('pwa_install_dismissed', '1');
  };
};

window.__app.showInstallGuide = function() {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const guide = document.createElement('div');
  guide.className = 'modal-overlay';
  guide.style.zIndex = '9999';
  guide.innerHTML = `
    <div class="modal" style="max-width: 400px; margin: 10vh auto;">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
      <div class="modal-content">
        <h3 style="margin-top:0">📱 添加到桌面</h3>
        ${isIOS ? `
          <p>1. 点击浏览器底部的 <strong>分享</strong> 按钮 <span style="font-size: 20px;">⬆️</span></p>
          <p>2. 向下滑动，找到并点击 <strong>"添加到主屏幕"</strong></p>
          <p>3. 点击右上角的 <strong>"添加"</strong> 即可</p>
        ` : `
          <p>1. 点击浏览器右上角的 <strong>菜单</strong> 按钮 <span style="font-size: 20px;">⋮</span></p>
          <p>2. 找到并点击 <strong>"添加到桌面"</strong> 或 <strong>"安装应用"</strong></p>
          <p>3. 点击 <strong>"添加"</strong> 即可</p>
        `}
        <p style="color: #666; font-size: 14px; margin-top: 20px;">添加后可从桌面直接打开，和APP一样好用！</p>
        <button class="btn btn-primary btn-block" onclick="this.closest('.modal-overlay').remove()">知道了</button>
      </div>
    </div>
  `;
  document.body.appendChild(guide);
};

// ===== 启动 =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.__app.init());
} else {
  window.__app.init();
}

})();
