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
  _voicesLoaded: false,
  _enVoice: null,
  _audioCtx: null,
  initVoices() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        this._enVoice = voices.find(v => v.lang.startsWith('en') && /Google|Female|Male/i.test(v.name))
                     || voices.find(v => v.lang.startsWith('en'))
                     || null;
        this._voicesLoaded = voices.length > 0;
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  },
  speak(text) {
    const word = text.trim();
    const isShort = word.split(/\s+/).length <= 3;
    if (isShort) {
      this._playTTS(word);
    } else {
      this._speakFallback(word);
    }
  },
  async _playTTS(word) {
    // 1. Web Audio API（移动端最兼容）
    try {
      if (!this._audioCtx) {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this._audioCtx.state === 'suspended') {
        await this._audioCtx.resume();
      }
      const resp = await fetch('/api/tts?word=' + encodeURIComponent(word) + '&type=2');
      if (resp.ok) {
        const buf = await resp.arrayBuffer();
        const audioBuffer = await this._audioCtx.decodeAudioData(buf);
        const src = this._audioCtx.createBufferSource();
        src.buffer = audioBuffer;
        src.connect(this._audioCtx.destination);
        src.start(0);
        return;
      }
    } catch (e) { /* fall to next */ }
    // 2. audio 元素直接播放
    try {
      let audioEl = document.getElementById('tts-audio');
      if (!audioEl) {
        audioEl = document.createElement('audio');
        audioEl.id = 'tts-audio';
        audioEl.preload = 'auto';
        audioEl.style.display = 'none';
        document.body.appendChild(audioEl);
      }
      audioEl.src = '/api/tts?word=' + encodeURIComponent(word) + '&type=2';
      audioEl.load();
      await audioEl.play();
      return;
    } catch (e) { /* fall to next */ }
    // 3. 直接有道 URL
    try {
      let audioEl = document.getElementById('tts-audio');
      audioEl.src = 'https://dict.youdao.com/dictvoice?audio=' + encodeURIComponent(word) + '&type=2';
      audioEl.load();
      await audioEl.play();
      return;
    } catch (e) { /* fall to next */ }
    // 4. 最终后备
    this._speakFallback(word);
  },
  _speakFallback(text) {
    if ('speechSynthesis' in window && this._voicesLoaded) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.8; u.pitch = 1; u.volume = 1;
        if (this._enVoice) u.voice = this._enVoice;
        u.onerror = () => this._speakAudioApi(text);
        window.speechSynthesis.speak(u);
      }, 100);
    } else {
      this._speakAudioApi(text);
    }
  },
  async _speakAudioApi(text) {
    try {
      const seUrl = 'https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=' + encodeURIComponent(text);
      const resp = await fetch(seUrl);
      if (resp.ok) {
        const blob = await resp.blob();
        await this._playBlob(blob);
        return;
      }
    } catch (e) { /* fallback */ }
    Utils.toast('语音播放失败，请检查网络', 'warning');
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
      'writing-learn': () => Modules.writingLearn(),
      'writing-practice': () => Modules.writingPractice(),
      'reading-learn': () => Modules.readingLearn(),
      'reading-practice': () => Modules.readingPractice(),
      'trans-blank': () => Modules.transBlank(),
      'trans-input': () => Modules.transInput(),
      'wrong-book': () => Modules.wrongBook(),
      'exam-papers': () => window.__app.examPapers(),
      'daily-checkin': () => window.__app.dailyCheckin(),
      'dictionary': () => window.__app.dictionary(),
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
      html += '<button class="btn btn-outline" onclick="window.__app.showHint(\'vocab\')">提示</button>';
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
      html += '<button class="btn btn-outline" onclick="window.__app.showHint(\'blank\')">提示</button>';
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
      html += '<div class="practice-actions">';
      html += '<button class="btn btn-outline" onclick="window.__app.showHint(\'choice\')">提示</button>';
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
    html += '<button class="btn btn-outline" onclick="window.__app.showHint(\'writing\')">提示</button>';
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
    html += '<button class="btn btn-outline" onclick="window.__app.showHint(\'trans-blank\')">提示</button>';
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
    html += '<button class="btn btn-outline" onclick="window.__app.showHint(\'trans-input\')">提示</button>';
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
        setTimeout(() => {
          const detail = Utils.$('mainContent').querySelector('.wrong-chapter-detail');
          if (detail) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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
    html += '<a class="quick-link" onclick="window.__app.nav(\'writing-learn\')">✒️ 应用文学习</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'writing-practice\')">📋 应用文练习</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'reading-learn\')">🔍 阅读文库</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'trans-blank\')">🧩 选词翻译</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'trans-input\')">✍️ 手动翻译</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'exam-papers\')">📄 真题套题</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'wrong-book\')">❌ 错题本</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'daily-checkin\')">📅 每日打卡</a>';
    html += '<a class="quick-link" onclick="window.__app.nav(\'dictionary\')">📚 词典查词</a>';
    html += '</div></div>';

    Utils.$('mainContent').innerHTML = html;
  }
};

// ===== 全局API（供HTML onclick调用） =====
// ===== 打卡管理器 =====
const CheckinManager = {
  dateStr(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  },
  getData() {
    return Storage.get('checkin', { dates: [] });
  },
  saveData(data) {
    Storage.set('checkin', data);
  },
  checkin() {
    const data = this.getData();
    const today = this.dateStr(new Date());
    if (!data.dates.includes(today)) {
      data.dates.push(today);
      data.lastCheckin = today;
      this.saveData(data);
    }
    return data;
  },
  isCheckedToday() {
    const data = this.getData();
    return data.dates.includes(this.dateStr(new Date()));
  },
  getStreak() {
    const data = this.getData();
    if (data.dates.length === 0) return 0;
    const sorted = [...data.dates].sort();
    let streak = 0;
    let d = new Date();
    while (true) {
      const ds = this.dateStr(d);
      if (sorted.includes(ds)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },
  autoCheckin() {
    if (!this.isCheckedToday()) {
      this.checkin();
    }
  }
};

// ===== Word文档下载 =====
function downloadWordDoc(filename, content) {
  const header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + filename + '</title><style>body{font-family:"Times New Roman",serif;font-size:14pt;line-height:1.8;}h1{font-size:18pt;text-align:center;}h2{font-size:16pt;}h3{font-size:14pt;}.question{margin:8pt 0;}.options{margin-left:20pt;}.answer-key{margin-top:20pt;color:#0066cc;}</style></head><body>';
  const footer = '</body></html>';
  const html = header + content + footer;
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename + '.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

window.__app = {
  init() {
    Nav.init();
    Nav.goTo('dashboard');
    this.updateUserUI();
    this._setupAuthForms();
    Utils.initVoices();
    // 自动打卡
    CheckinManager.autoCheckin();
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

  // 真题查看
  viewExamPaper(id) {
    const papers = typeof EXAM_PAPERS !== 'undefined' ? EXAM_PAPERS : [];
    const paper = papers.find(p => p.id === id);
    if (!paper) { Utils.toast('未找到该套题', 'error'); return; }
    let html = '<div class="module-header"><h2>' + Utils.esc(paper.title) + '</h2>';
    html += '<button class="btn btn-primary" onclick="window.__app.downloadExamPaper(' + paper.id + ')">⬇ 下载Word文档</button>';
    html += '<button class="btn btn-outline" onclick="window.__app.nav(\'exam-papers\')">← 返回列表</button></div>';

    paper.sections.forEach((sec, si) => {
      html += '<div class="section-card" style="margin-bottom:20px;">';
      html += '<h3 style="color:var(--text);margin-bottom:12px;">' + Utils.esc(sec.title) + '</h3>';
      html += '<p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">' + Utils.esc(sec.instruction || '') + '</p>';

      if (sec.type === 'vocabulary' && sec.questions) {
        sec.questions.forEach((q, qi) => {
          html += '<div class="question" style="margin:12px 0;">';
          html += '<p style="color:var(--text);">' + (qi+1) + '. ' + Utils.esc(q.q) + '</p>';
          html += '<div class="options" style="margin-left:20px;color:var(--text-secondary);">';
          q.options.forEach((opt, oi) => {
            html += '<label style="display:block;"><input type="radio" name="exam-' + si + '-' + qi + '" value="' + String.fromCharCode(65+oi) + '" /> ' + String.fromCharCode(65+oi) + '. ' + Utils.esc(opt) + '</label>';
          });
          html += '</div></div>';
        });
      } else if (sec.type === 'reading' && sec.passages) {
        sec.passages.forEach((p, pi) => {
          html += '<div style="margin:16px 0;padding:16px;background:var(--light);border-radius:var(--radius-sm);">';
          html += '<p style="color:var(--text);line-height:1.8;white-space:pre-wrap;">' + Utils.esc(p.text) + '</p></div>';
          if (p.questions) {
            p.questions.forEach((q, qi) => {
              html += '<div class="question" style="margin:12px 0;">';
              html += '<p style="color:var(--text);">' + (qi+1) + '. ' + Utils.esc(q.q) + '</p>';
              html += '<div class="options" style="margin-left:20px;color:var(--text-secondary);">';
              q.options.forEach((opt, oi) => {
                html += '<label style="display:block;"><input type="radio" name="exam-r-' + si + '-' + pi + '-' + qi + '" value="' + String.fromCharCode(65+oi) + '" /> ' + String.fromCharCode(65+oi) + '. ' + Utils.esc(opt) + '</label>';
              });
              html += '</div></div>';
            });
          }
        });
      } else if (sec.type === 'cloze' && sec.blanks) {
        if (sec.passage) html += '<div style="margin:16px 0;padding:16px;background:var(--light);border-radius:var(--radius-sm);"><p style="color:var(--text);line-height:2;">' + Utils.esc(sec.passage) + '</p></div>';
        sec.blanks.forEach((b, bi) => {
          html += '<div class="question" style="margin:12px 0;">';
          html += '<p style="color:var(--text);">' + (bi+1) + '. ';
          b.options.forEach((opt, oi) => {
            html += '<label style="margin-right:12px;"><input type="radio" name="exam-c-' + si + '-' + bi + '" value="' + String.fromCharCode(65+oi) + '" /> ' + String.fromCharCode(65+oi) + '. ' + Utils.esc(opt) + '</label>';
          });
          html += '</p></div>';
        });
      } else if (sec.type === 'translation') {
        if (sec.enToCn) {
          html += '<h4 style="color:var(--text);margin:12px 0;">Section A: English to Chinese</h4>';
          sec.enToCn.forEach((t, ti) => {
            html += '<div style="margin:12px 0;padding:12px;background:var(--light);border-radius:var(--radius-sm);"><p style="color:var(--text);">' + (ti+1) + '. ' + Utils.esc(t.en) + '</p></div>';
          });
        }
        if (sec.cnToEn) {
          html += '<h4 style="color:var(--text);margin:12px 0;">Section B: Chinese to English</h4>';
          sec.cnToEn.forEach((t, ti) => {
            html += '<div style="margin:12px 0;padding:12px;background:var(--light);border-radius:var(--radius-sm);"><p style="color:var(--text);">' + (ti+1) + '. ' + Utils.esc(t.cn) + '</p></div>';
          });
        }
      } else if (sec.type === 'writing') {
        html += '<div style="margin:12px 0;padding:16px;background:var(--light);border-radius:var(--radius-sm);">';
        html += '<p style="color:var(--text);font-weight:600;">' + Utils.esc(sec.prompt || '') + '</p>';
        if (sec.sample) html += '<p style="color:var(--text-secondary);margin-top:12px;font-size:13px;">Sample Answer:</p><p style="color:var(--text);line-height:1.8;white-space:pre-wrap;">' + Utils.esc(sec.sample) + '</p>';
        html += '</div>';
      }
      html += '</div>';
    });

    // 答案
    html += '<div class="section-card" style="margin-top:20px;border:1px solid var(--success);"><h3 style="color:var(--success);">参考答案</h3>';
    paper.sections.forEach((sec, si) => {
      if (sec.type === 'vocabulary' && sec.questions) {
        html += '<p style="color:var(--text);"><strong>' + sec.title + ':</strong> ';
        html += sec.questions.map((q, qi) => (qi+1) + '.' + q.answer).join('  ') + '</p>';
      } else if (sec.type === 'reading' && sec.passages) {
        html += '<p style="color:var(--text);"><strong>' + sec.title + ':</strong> ';
        const all = [];
        sec.passages.forEach((p, pi) => {
          if (p.questions) p.questions.forEach((q, qi) => all.push((pi+1) + '-' + (qi+1) + '.' + q.answer));
        });
        html += all.join('  ') + '</p>';
      } else if (sec.type === 'cloze' && sec.blanks) {
        html += '<p style="color:var(--text);"><strong>' + sec.title + ':</strong> ';
        html += sec.blanks.map((b, bi) => (bi+1) + '.' + b.answer).join('  ') + '</p>';
      } else if (sec.type === 'translation') {
        html += '<p style="color:var(--text);"><strong>' + sec.title + ' (参考):</strong></p>';
        if (sec.enToCn) sec.enToCn.forEach((t, ti) => { html += '<p style="color:var(--text-secondary);font-size:13px;">' + (ti+1) + '. ' + Utils.esc(t.cn) + '</p>'; });
        if (sec.cnToEn) sec.cnToEn.forEach((t, ti) => { html += '<p style="color:var(--text-secondary);font-size:13px;">' + (ti+1) + '. ' + Utils.esc(t.en) + '</p>'; });
      }
    });
    html += '</div>';

    Utils.$('mainContent').innerHTML = html;
  },

  // 下载Word文档
  downloadExamPaper(id) {
    const papers = typeof EXAM_PAPERS !== 'undefined' ? EXAM_PAPERS : [];
    const paper = papers.find(p => p.id === id);
    if (!paper) { Utils.toast('未找到该套题', 'error'); return; }

    let content = '<h1>' + paper.title + '</h1>';
    content += '<p style="text-align:center;color:#999;">' + (paper.year || '') + ' 年四川省普通高校专升本考试英语试题</p>';

    paper.sections.forEach(sec => {
      content += '<h2>' + sec.title + '</h2>';
      content += '<p style="color:#666;font-size:12pt;">' + (sec.instruction || '') + '</p>';

      if (sec.type === 'vocabulary' && sec.questions) {
        sec.questions.forEach((q, qi) => {
          content += '<div class="question"><p>' + (qi+1) + '. ' + q.q + '</p>';
          content += '<div class="options">';
          q.options.forEach((opt, oi) => {
            content += String.fromCharCode(65+oi) + '. ' + opt + '&nbsp;&nbsp;&nbsp;';
          });
          content += '</div></div>';
        });
      } else if (sec.type === 'reading' && sec.passages) {
        sec.passages.forEach((p, pi) => {
          content += '<p>' + p.text + '</p>';
          if (p.questions) {
            p.questions.forEach((q, qi) => {
              content += '<div class="question"><p>' + (qi+1) + '. ' + q.q + '</p>';
              content += '<div class="options">';
              q.options.forEach((opt, oi) => {
                content += String.fromCharCode(65+oi) + '. ' + opt + '&nbsp;&nbsp;&nbsp;';
              });
              content += '</div></div>';
            });
          }
        });
      } else if (sec.type === 'cloze') {
        if (sec.passage) content += '<p>' + sec.passage + '</p>';
        if (sec.blanks) {
          sec.blanks.forEach((b, bi) => {
            content += '<div class="question"><p>' + (bi+1) + '. ';
            b.options.forEach((opt, oi) => {
              content += String.fromCharCode(65+oi) + '. ' + opt + '&nbsp;&nbsp;&nbsp;';
            });
            content += '</p></div>';
          });
        }
      } else if (sec.type === 'translation') {
        if (sec.enToCn) {
          content += '<h3>Section A: English to Chinese</h3>';
          sec.enToCn.forEach((t, ti) => {
            content += '<p>' + (ti+1) + '. ' + t.en + '</p>';
          });
        }
        if (sec.cnToEn) {
          content += '<h3>Section B: Chinese to English</h3>';
          sec.cnToEn.forEach((t, ti) => {
            content += '<p>' + (ti+1) + '. ' + t.cn + '</p>';
          });
        }
      } else if (sec.type === 'writing') {
        content += '<p>' + (sec.prompt || '') + '</p>';
      }
    });

    // 答案
    content += '<h2 style="margin-top:30pt;">参考答案</h2>';
    paper.sections.forEach(sec => {
      if (sec.type === 'vocabulary' && sec.questions) {
        content += '<p><strong>' + sec.title + ':</strong> ' + sec.questions.map((q, qi) => (qi+1) + '.' + q.answer).join('  ') + '</p>';
      } else if (sec.type === 'reading' && sec.passages) {
        const all = [];
        sec.passages.forEach((p, pi) => { if (p.questions) p.questions.forEach((q, qi) => all.push((pi+1) + '-' + (qi+1) + '.' + q.answer)); });
        content += '<p><strong>' + sec.title + ':</strong> ' + all.join('  ') + '</p>';
      } else if (sec.type === 'cloze' && sec.blanks) {
        content += '<p><strong>' + sec.title + ':</strong> ' + sec.blanks.map((b, bi) => (bi+1) + '.' + b.answer).join('  ') + '</p>';
      } else if (sec.type === 'translation') {
        content += '<p><strong>' + sec.title + ' (参考):</strong></p>';
        if (sec.enToCn) sec.enToCn.forEach((t, ti) => { content += '<p>' + (ti+1) + '. ' + t.cn + '</p>'; });
        if (sec.cnToEn) sec.cnToEn.forEach((t, ti) => { content += '<p>' + (ti+1) + '. ' + t.en + '</p>'; });
      }
    });

    downloadWordDoc(paper.title, content);
    Utils.toast('Word文档已下载', 'success');
  },

  // 日历月份切换
  _changeCalMonth(delta) {
    if (!State._calDate) State._calDate = new Date();
    State._calDate.setMonth(State._calDate.getMonth() + delta);
    this._renderCalendar();
  },
  // 手动打卡
  manualCheckin() {
    if (CheckinManager.isCheckedToday()) {
      Utils.toast('今日已打卡', 'info');
      return;
    }
    CheckinManager.checkin();
    Utils.toast('🎉 打卡成功！', 'success');
    this.dailyCheckin();
  },
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

  showHint(type) {
    const fb = Utils.$('practiceFeedback');
    if (!fb) return;
    if (type === 'choice') {
      const q = State.practiceQuestions[State.practiceIndex];
      const correctIdx = q.answer !== undefined ? q.answer : q.correctIdx;
      const opts = Utils.$$$('.practice-option');
      Array.from(opts).forEach((opt, i) => {
        if (i === correctIdx) opt.classList.add('correct-highlight');
      });
      fb.innerHTML = '<div class="feedback-hint">💡 正确答案: ' + String.fromCharCode(65 + correctIdx) + '. ' + Utils.esc(q.options[correctIdx]) + '</div>';
    } else if (type === 'vocab') {
      const q = State.practiceQuestions[State.practiceIndex];
      fb.innerHTML = '<div class="feedback-hint">💡 释义: ' + Utils.esc(q.meaning) + '</div>';
    } else if (type === 'blank') {
      const q = State.practiceQuestions[State.practiceIndex];
      fb.innerHTML = '<div class="feedback-hint">💡 答案: ' + Utils.esc(q.answer !== undefined ? q.answer : (q.options ? q.options[q.answer] : '')) + '</div>';
    } else if (type === 'writing') {
      const q = State.practiceQuestions[State.practiceIndex];
      fb.innerHTML = '<div class="feedback-hint">💡 答案: ' + Utils.esc(q.answer) + '</div>';
    } else if (type === 'trans-blank' || type === 'trans-input') {
      const t = State.practiceQuestions[State.practiceIndex];
      let html = '<div class="feedback-hint">💡 正确翻译: ' + Utils.esc(t.en) + '</div>';
      if (t.keyVocab && t.keyVocab.length) html += this._formatKeyVocab(t.keyVocab);
      fb.innerHTML = html;
    } else if (type === 'wrong') {
      const q = State.practiceQuestions[State.practiceIndex];
      fb.innerHTML = '<div class="feedback-hint">💡 正确答案: ' + Utils.esc(q.correctAnswer) + '</div>';
    }
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
    const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','to','of','in','on','at','by','for','with','from','as','it','its','that','this','these','those','he','she','they','we','you','i','his','her','their','our','your','my','and','or','but','not','no','do','does','did','has','have','had','will','would','can','could','should','shall','may','might']);
    const stem = (w) => w.replace(/(ingly?|edly?|ies|s|ing|ed|ment|ness|tion|sion)$/i, '');
    const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const toStems = (s) => normalize(s).split(' ').filter(w => w.length > 1 && !stopWords.has(w)).map(stem);
    const userStems = toStems(userAns);
    const correctStems = toStems(correctEn);

    if (normalize(userAns) === normalize(correctEn)) return true;
    if (userStems.length === 0 || correctStems.length === 0) return false;

    const correctSet = new Set(correctStems);
    let matched = 0;
    userStems.forEach(s => { if (correctSet.has(s)) matched++; });

    const coverage = matched / correctStems.length;
    const reverseCoverage = correctStems.filter(s => userStems.includes(s)).length / correctStems.length;

    return coverage >= 0.45 && reverseCoverage >= 0.4;
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
  },

  // ===== 真题套题 =====
  examPapers() {
    const papers = typeof EXAM_PAPERS !== 'undefined' ? EXAM_PAPERS : [];
    let html = '<div class="module-header"><h2>📄 四川省专升本英语真题</h2></div>';
    html += '<div class="exam-intro" style="margin-bottom:20px;padding:16px;background:var(--light);border-radius:var(--radius-sm);border-left:4px solid var(--secondary);">';
    html += '<p style="color:var(--text-secondary);font-size:14px;">共 ' + papers.length + ' 套真题，支持在线查看和下载Word文档。点击套题卡片查看详情，可下载打印复习。</p>';
    html += '</div>';
    html += '<div class="chapter-grid">';
    papers.forEach(p => {
      html += '<div class="chapter-card" onclick="window.__app.viewExamPaper(' + p.id + ')">';
      html += '<div class="chapter-num">' + p.id + '</div>';
      html += '<div class="chapter-label">' + Utils.esc(p.title) + '</div>';
      html += '<div style="margin-top:8px;font-size:12px;color:var(--gray);">' + (p.year || '') + ' 年</div>';
      html += '<div style="margin-top:8px;"><button class="btn btn-sm btn-primary" onclick="event.stopPropagation();window.__app.downloadExamPaper(' + p.id + ')">⬇ 下载Word</button></div>';
      html += '</div>';
    });
    html += '</div>';
    Utils.$('mainContent').innerHTML = html;
  },

  // ===== 每日打卡 =====
  dailyCheckin() {
    const data = CheckinManager.getData();
    const today = new Date();
    const todayStr = CheckinManager.dateStr(today);
    const checkedToday = data.dates.includes(todayStr);
    const streak = CheckinManager.getStreak();
    const totalDays = data.dates.length;

    let html = '<div class="checkin-page">';
    html += '<div class="checkin-header">';
    html += '<h2 style="color:var(--text);">📅 每日打卡</h2>';
    html += '<div class="checkin-stats-row">';
    html += '<div class="checkin-stat"><span class="checkin-stat-num">' + streak + '</span><span class="checkin-stat-label">连续打卡</span></div>';
    html += '<div class="checkin-stat"><span class="checkin-stat-num">' + totalDays + '</span><span class="checkin-stat-label">累计天数</span></div>';
    html += '<div class="checkin-stat"><span class="checkin-stat-num">' + (checkedToday ? '✅' : '⭕') + '</span><span class="checkin-stat-label">今日</span></div>';
    html += '</div>';

    // 一键打卡按钮
    if (checkedToday) {
      html += '<button class="btn btn-lg btn-success checkin-btn" disabled style="margin-top:16px;cursor:default;opacity:0.8;">✅ 今日已打卡</button>';
    } else {
      html += '<button class="btn btn-lg btn-primary checkin-btn" onclick="window.__app.manualCheckin()" style="margin-top:16px;">✋ 立即打卡</button>';
    }
    html += '</div>';

    // 日历
    html += '<div class="checkin-calendar-wrapper">';
    html += '<div class="checkin-calendar">';
    html += '<div class="calendar-nav">';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app._changeCalMonth(-1)">‹</button>';
    html += '<span class="calendar-month-label" id="calMonthLabel"></span>';
    html += '<button class="btn btn-sm btn-outline" onclick="window.__app._changeCalMonth(1)">›</button>';
    html += '</div>';
    html += '<div class="calendar-grid" id="calGrid"></div>';
    html += '</div>';
    html += '</div>';

    // 打卡记录
    if (totalDays > 0) {
      html += '<div class="checkin-history">';
      html += '<h3 style="color:var(--text);">最近打卡记录</h3>';
      const recent = [...data.dates].sort().reverse().slice(0, 10);
      html += '<div class="checkin-history-list">';
      recent.forEach(d => {
        const date = new Date(d);
        const week = '日一二三四五六'[date.getDay()];
        html += '<div class="checkin-history-item">';
        html += '<span class="checkin-history-date">' + (date.getMonth()+1) + '月' + date.getDate() + '日</span>';
        html += '<span class="checkin-history-week">周' + week + '</span>';
        html += '<span class="checkin-history-badge">✅ 已打卡</span>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    }

    html += '</div>';
    Utils.$('mainContent').innerHTML = html;
    State._calDate = new Date();
    this._renderCalendar();
  },

  _renderCalendar() {
    const data = CheckinManager.getData();
    const d = State._calDate || new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

    const label = Utils.$('calMonthLabel');
    if (label) label.textContent = year + '年 ' + monthNames[month];

    const grid = Utils.$('calGrid');
    if (!grid) return;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = CheckinManager.dateStr(new Date());

    let html = '';
    ['日','一','二','三','四','五','六'].forEach(w => {
      html += '<div class="cal-weekday">' + w + '</div>';
    });
    for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = year + '-' + String(month+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
      const checked = data.dates.includes(dateStr);
      const isToday = dateStr === todayStr;
      let cls = 'cal-day';
      if (checked) cls += ' checked';
      if (isToday) cls += ' today';
      html += '<div class="' + cls + '">';
      html += '<span class="cal-day-num">' + day + '</span>';
      if (checked) html += '<span class="cal-day-check">✓</span>';
      html += '</div>';
    }
    grid.innerHTML = html;
  },

  // ===== 词典查词 =====
  _dictIndex: null,
  _dictHistory: [],

  _buildDictIndex() {
    if (this._dictIndex) return this._dictIndex;
    this._dictIndex = {};
    if (typeof VOCAB_DATA === 'undefined') return this._dictIndex;
    VOCAB_DATA.forEach(chapter => {
      if (!chapter || !chapter[1]) return;
      chapter[1].forEach(entry => {
        if (entry && entry[0]) {
          this._dictIndex[entry[0].toLowerCase()] = {
            word: entry[0],
            phonetic: entry[1] || '',
            pos: entry[2] || '',
            meaning: entry[3] || '',
            synonyms: entry[4] || [],
            example: entry[5] || '',
            exampleZh: entry[6] || ''
          };
        }
      });
    });
    return this._dictIndex;
  },

  dictionary() {
    this._buildDictIndex();
    let html = '<div class="dict-page">';

    html += '<div class="dict-search-box">';
    html += '<div class="dict-search-row">';
    html += '<input type="text" class="dict-search-input" id="dictInput" placeholder="输入英文单词查词..." autocomplete="off" />';
    html += '<button class="btn btn-primary dict-search-btn" onclick="window.__app.dictSearch()">🔍 查词</button>';
    html += '</div>';
    html += '<div class="dict-suggestions" id="dictSuggestions"></div>';
    html += '</div>';

    const history = this._dictHistory;
    if (history.length > 0) {
      html += '<div class="dict-history">';
      html += '<div class="dict-history-title">📖 最近查词</div>';
      html += '<div class="dict-history-tags">';
      history.slice(-12).reverse().forEach(w => {
        html += '<span class="dict-history-tag" onclick="window.__app.dictLookup(\'' + Utils.esc(w) + '\')">' + Utils.esc(w) + '</span>';
      });
      html += '</div></div>';
    }

    const totalWords = Object.keys(this._dictIndex).length;
    html += '<div class="dict-intro">';
    html += '<div class="dict-intro-card">';
    html += '<div class="dict-intro-icon">📚</div>';
    html += '<div class="dict-intro-text">';
    html += '<h3>智能词典</h3>';
    html += '<p>收录 ' + totalWords + ' 个核心词汇，支持在线查词。输入单词即可查看中文释义、音标、同义词、例句及词形变换。</p>';
    html += '</div></div>';
    html += '<div class="dict-features">';
    html += '<div class="dict-feature"><span class="dict-feature-icon">🔤</span><span>音标发音</span></div>';
    html += '<div class="dict-feature"><span class="dict-feature-icon">📝</span><span>中文释义</span></div>';
    html += '<div class="dict-feature"><span class="dict-feature-icon">🔀</span><span>同义词</span></div>';
    html += '<div class="dict-feature"><span class="dict-feature-icon">📐</span><span>词形变换</span></div>';
    html += '<div class="dict-feature"><span class="dict-feature-icon">💬</span><span>例句</span></div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    Utils.$('mainContent').innerHTML = html;

    const input = Utils.$('dictInput');
    if (input) {
      input.focus();
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') window.__app.dictSearch();
      });
      input.addEventListener('input', () => {
        window.__app.dictSuggest(input.value);
      });
    }
  },

  dictSuggest(query) {
    const container = Utils.$('dictSuggestions');
    if (!container) return;
    query = query.trim().toLowerCase();
    if (!query || query.length < 1) { container.innerHTML = ''; return; }
    const index = this._buildDictIndex();
    const matches = Object.keys(index).filter(w => w.startsWith(query)).slice(0, 8);
    if (matches.length === 0) { container.innerHTML = ''; return; }
    let html = '';
    matches.forEach(w => {
      const entry = index[w];
      html += '<div class="dict-suggest-item" onclick="window.__app.dictLookup(\'' + Utils.esc(w) + '\')">';
      html += '<span class="dict-suggest-word">' + Utils.esc(entry.word) + '</span>';
      html += '<span class="dict-suggest-meaning">' + Utils.esc(entry.meaning.split(/[;；]/)[0]) + '</span>';
      html += '</div>';
    });
    container.innerHTML = html;
  },

  dictSearch() {
    const input = Utils.$('dictInput');
    if (!input) return;
    const word = input.value.trim();
    if (!word) { Utils.toast('请输入要查询的单词', 'warning'); return; }
    this.dictLookup(word);
  },

  async dictLookup(word) {
    word = word.trim().toLowerCase();
    if (!word) return;

    Utils.$('dictSuggestions').innerHTML = '';
    const input = Utils.$('dictInput');
    if (input) input.value = word;

    const resultArea = Utils.$('mainContent');
    let html = '<div class="dict-page">';
    html += '<div class="dict-search-box">';
    html += '<div class="dict-search-row">';
    html += '<input type="text" class="dict-search-input" id="dictInput" value="' + Utils.esc(word) + '" placeholder="输入英文单词查词..." autocomplete="off" />';
    html += '<button class="btn btn-primary dict-search-btn" onclick="window.__app.dictSearch()">🔍 查词</button>';
    html += '</div>';
    html += '<div class="dict-suggestions" id="dictSuggestions"></div>';
    html += '</div>';
    html += '<div class="dict-loading"><div class="dict-loading-spinner"></div><p>正在查询 "' + Utils.esc(word) + '"...</p></div>';
    html += '</div>';
    resultArea.innerHTML = html;

    const newInput = Utils.$('dictInput');
    if (newInput) {
      newInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') window.__app.dictSearch();
      });
      newInput.addEventListener('input', () => {
        window.__app.dictSuggest(newInput.value);
      });
    }

    let entry = this._buildDictIndex()[word] || null;
    let apiData = null;

    if (!entry) {
      try {
        apiData = await this._fetchDictApi(word);
        if (apiData && ((apiData.translation && apiData.translation.length > 0) || (apiData.explains && apiData.explains.length > 0))) {
          const hasZhTrans = apiData.translation && apiData.translation.length > 0;
          entry = {
            word: word,
            phonetic: apiData.phonetic || '',
            pos: apiData.pos || '',
            meaning: hasZhTrans ? apiData.translation.join('; ') : (apiData.explains || []).join('; '),
            synonyms: apiData.synonyms || [],
            example: (apiData.examples && apiData.examples[0] && apiData.examples[0].en) || '',
            exampleZh: (apiData.examples && apiData.examples[0] && apiData.examples[0].zh) || '',
            explains: apiData.explains || []
          };
          if (apiData.examples && apiData.examples.length > 0) {
            entry.examples = apiData.examples;
          }
        }
      } catch (e) {
        console.warn('Dict API failed:', e);
      }
    }

    if (!entry) {
      let nfHtml = '<div class="dict-page">';
      nfHtml += '<div class="dict-search-box">';
      nfHtml += '<div class="dict-search-row">';
      nfHtml += '<input type="text" class="dict-search-input" id="dictInput" value="' + Utils.esc(word) + '" placeholder="输入英文单词查词..." autocomplete="off" />';
      nfHtml += '<button class="btn btn-primary dict-search-btn" onclick="window.__app.dictSearch()">🔍 查词</button>';
      nfHtml += '</div>';
      nfHtml += '<div class="dict-suggestions" id="dictSuggestions"></div>';
      nfHtml += '</div>';
      nfHtml += '<div class="dict-not-found">';
      nfHtml += '<div class="dict-nf-icon">🔍</div>';
      nfHtml += '<p>未找到 "' + Utils.esc(word) + '" 的释义</p>';
      nfHtml += '<p class="dict-nf-hint">该词不在本地词库中，请检查拼写或尝试其他单词</p>';
      nfHtml += '</div>';
      nfHtml += '</div>';
      resultArea.innerHTML = nfHtml;
      const nfInput = Utils.$('dictInput');
      if (nfInput) {
        nfInput.focus();
        nfInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') window.__app.dictSearch();
        });
        nfInput.addEventListener('input', () => {
          window.__app.dictSuggest(nfInput.value);
        });
      }
      return;
    }

    if (!this._dictHistory.includes(word)) {
      this._dictHistory.push(word);
      if (this._dictHistory.length > 50) this._dictHistory.shift();
    }

    let rHtml = '<div class="dict-page">';
    rHtml += '<div class="dict-search-box">';
    rHtml += '<div class="dict-search-row">';
    rHtml += '<input type="text" class="dict-search-input" id="dictInput" value="' + Utils.esc(word) + '" placeholder="输入英文单词查词..." autocomplete="off" />';
    rHtml += '<button class="btn btn-primary dict-search-btn" onclick="window.__app.dictSearch()">🔍 查词</button>';
    rHtml += '</div>';
    rHtml += '<div class="dict-suggestions" id="dictSuggestions"></div>';
    rHtml += '</div>';

    rHtml += this._renderDictResult(entry);
    rHtml += '</div>';

    resultArea.innerHTML = rHtml;

    const rInput = Utils.$('dictInput');
    if (rInput) {
      rInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') window.__app.dictSearch();
      });
      rInput.addEventListener('input', () => {
        window.__app.dictSuggest(rInput.value);
      });
    }
  },

  _renderDictResult(entry) {
    let html = '<div class="dict-result">';

    // 头部：单词 + 音标 + 发音
    html += '<div class="dict-result-header">';
    html += '<div class="dict-word-main">';
    html += '<h2 class="dict-word">' + Utils.esc(entry.word) + '</h2>';
    if (entry.phonetic) {
      html += '<span class="dict-phonetic">/' + Utils.esc(entry.phonetic) + '/</span>';
    }
    html += '<button class="dict-speak-btn" onclick="window.__app.speak(decodeURIComponent(\'' + encodeURIComponent(entry.word) + '\'))" title="点击发音">🔊 发音</button>';
    html += '</div>';
    if (entry.pos) {
      html += '<span class="dict-pos-tag">' + Utils.esc(entry.pos) + '</span>';
    }
    html += '</div>';

    // 中文释义
    html += '<div class="dict-section dict-section-translation">';
    html += '<div class="dict-section-title"><span class="dict-section-icon">📖</span> 释义</div>';
    html += '<div class="dict-meaning">';
    if (entry.explains && entry.explains.length > 0) {
      entry.explains.forEach(exp => {
        html += '<div class="dict-meaning-line">' + Utils.esc(exp) + '</div>';
      });
    } else {
      html += '<div class="dict-meaning-line">' + Utils.esc(entry.meaning) + '</div>';
    }
    html += '</div>';
    html += '</div>';

    // 词形变换
    const forms = this._generateWordForms(entry);
    if (forms && forms.length > 0) {
      html += '<div class="dict-section dict-section-forms">';
      html += '<div class="dict-section-title"><span class="dict-section-icon">🔄</span> 词形变换</div>';
      html += '<div class="dict-forms-grid">';
      forms.forEach(f => {
        html += '<div class="dict-form-item" onclick="window.__app.dictLookup(\'' + Utils.esc(f.form) + '\')">';
        html += '<span class="dict-form-label">' + Utils.esc(f.label) + '</span>';
        html += '<span class="dict-form-word">' + Utils.esc(f.form) + '</span>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    }

    // 同义词
    const synonyms = entry.synonyms || [];
    if (synonyms.length > 0) {
      const enSyns = synonyms.filter(s => /^[a-zA-Z]/.test(s));
      const zhSyns = synonyms.filter(s => !/^[a-zA-Z]/.test(s));
      if (enSyns.length > 0) {
        html += '<div class="dict-section dict-section-synonyms">';
        html += '<div class="dict-section-title"><span class="dict-section-icon">🔀</span> 同义词</div>';
        html += '<div class="dict-synonyms">';
        enSyns.forEach(s => {
          html += '<span class="dict-syn-tag" onclick="window.__app.dictLookup(\'' + Utils.esc(s) + '\')">' + Utils.esc(s) + '</span>';
        });
        html += '</div>';
        html += '</div>';
      }
      if (zhSyns.length > 0) {
        html += '<div class="dict-section dict-section-synonyms-zh">';
        html += '<div class="dict-section-title"><span class="dict-section-icon">📝</span> 中文近义词</div>';
        html += '<div class="dict-synonyms-zh-list">';
        zhSyns.forEach(s => {
          html += '<span class="dict-syn-zh-tag">' + Utils.esc(s) + '</span>';
        });
        html += '</div>';
        html += '</div>';
      }
    }

    // 例句
    const examples = [];
    if (entry.example) {
      examples.push({ en: entry.example, zh: entry.exampleZh });
    }
    if (entry.examples && entry.examples.length > 0) {
      entry.examples.forEach(ex => {
        if (ex.en && (!examples[0] || ex.en !== examples[0].en)) {
          examples.push(ex);
        }
      });
    }
    if (examples.length > 0) {
      html += '<div class="dict-section dict-section-examples">';
      html += '<div class="dict-section-title"><span class="dict-section-icon">💬</span> 例句</div>';
      examples.slice(0, 3).forEach((ex, i) => {
        html += '<div class="dict-example">';
        html += '<div class="dict-example-en">' + Utils.esc(ex.en) + ' <button class="dict-ex-speak" onclick="window.__app.speak(decodeURIComponent(\'' + encodeURIComponent(ex.en) + '\'))" title="朗读">🔊</button></div>';
        if (ex.zh) {
          html += '<div class="dict-example-zh">' + Utils.esc(ex.zh) + '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
    }

    html += '</div>';
    return html;
  },

  _generateWordForms(entry) {
    if (typeof WordFormsUtil === 'undefined') return [];
    const word = entry.word.toLowerCase();
    const pos = (entry.pos || '').toLowerCase();
    const forms = [];

    // 动词变形
    if (pos === 'v.' || pos.startsWith('v.') || pos.includes('vt') || pos.includes('vi')) {
      const vf = WordFormsUtil.getVerbForms(word);
      if (vf.thirdPerson && vf.thirdPerson !== word) forms.push({ label: '第三人称', form: vf.thirdPerson });
      if (vf.pastTense && vf.pastTense !== word) forms.push({ label: '过去式', form: vf.pastTense });
      if (vf.pastParticiple && vf.pastParticiple !== word) forms.push({ label: '过去分词', form: vf.pastParticiple });
      if (vf.presentParticiple && vf.presentParticiple !== word) forms.push({ label: '现在分词', form: vf.presentParticiple });
    }

    // 名词复数
    if (pos === 'n.' || pos.startsWith('n.')) {
      const plural = WordFormsUtil.getNounPlural(word);
      if (plural && plural !== word) forms.push({ label: '复数', form: plural });
    }

    // 形容词比较级/最高级
    if (pos.includes('adj') || pos.includes('a.')) {
      const af = WordFormsUtil.getAdjForms(word);
      if (af.comparative && af.comparative !== word) forms.push({ label: '比较级', form: af.comparative });
      if (af.superlative && af.superlative !== word) forms.push({ label: '最高级', form: af.superlative });
    }

    // 无词性信息时，根据后缀推断
    if (!pos && word.length > 2) {
      if (/(ize|ise|ify|en)$/.test(word) && !/(ation|tion|ment|ness|ity)$/.test(word)) {
        const vf = WordFormsUtil.getVerbForms(word);
        if (vf.thirdPerson !== word) forms.push({ label: '第三人称', form: vf.thirdPerson });
        if (vf.pastTense !== word) forms.push({ label: '过去式', form: vf.pastTense });
        if (vf.pastParticiple !== word) forms.push({ label: '过去分词', form: vf.pastParticiple });
        if (vf.presentParticiple !== word) forms.push({ label: '现在分词', form: vf.presentParticiple });
      }
      if (/(tion|sion|ment|ness|ity|ship|hood)$/.test(word)) {
        const plural = WordFormsUtil.getNounPlural(word);
        if (plural !== word) forms.push({ label: '复数', form: plural });
      }
      if (/(ful|less|ous|ive|al|able|ible)$/.test(word)) {
        const af = WordFormsUtil.getAdjForms(word);
        if (af.comparative !== word) forms.push({ label: '比较级', form: af.comparative });
        if (af.superlative !== word) forms.push({ label: '最高级', form: af.superlative });
      }
    }

    // 派生词（所有词性都尝试）
    const der = WordFormsUtil.getDerivations(word);
    if (der) {
      if (der.noun && der.noun !== word && !forms.find(f => f.form === der.noun)) {
        forms.push({ label: '名词', form: der.noun });
      }
      if (der.verb && der.verb !== word && !forms.find(f => f.form === der.verb)) {
        forms.push({ label: '动词', form: der.verb });
      }
      if (der.adjective && der.adjective !== word && !forms.find(f => f.form === der.adjective)) {
        forms.push({ label: '形容词', form: der.adjective });
      }
      if (der.adverb && der.adverb !== word && !forms.find(f => f.form === der.adverb)) {
        forms.push({ label: '副词', form: der.adverb });
      }
    }

    return forms;
  },

  async _fetchDictApi(word) {
    const isOnline = window.location.protocol !== 'file:' && window.location.hostname !== '';
    if (!isOnline) return null;

    try {
      const resp = await fetch('/api/dict?word=' + encodeURIComponent(word));
      if (resp.ok) {
        const data = await resp.json();
        if (data && !data.error) return data;
      }
    } catch (e) {
      console.warn('Dict API fetch failed:', e);
    }

    try {
      const resp2 = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word));
      if (resp2.ok) {
        const data2 = await resp2.json();
        if (Array.isArray(data2) && data2.length > 0) {
          const d = data2[0];
          const phonetic = (d.phonetic || (d.phonetics && d.phonetics[0] && d.phonetics[0].text) || '').replace(/\//g, '');
          const meanings = d.meanings || [];
          const explains = [];
          const synonyms = [];
          const examples = [];
          meanings.forEach(m => {
            const pos = m.partOfSpeech || '';
            (m.definitions || []).forEach(def => {
              let line = '';
              if (pos) line += pos + ' ';
              line += def.definition || '';
              if (def.example) {
                examples.push({ en: def.example, zh: '' });
              }
              explains.push(line);
            });
            if (m.synonyms && m.synonyms.length > 0) {
              synonyms.push(...m.synonyms.slice(0, 5));
            }
          });
          return {
            word: word,
            phonetic: phonetic,
            pos: '',
            translation: [],
            explains: explains,
            synonyms: [...new Set(synonyms)].slice(0, 8),
            examples: examples.slice(0, 5)
          };
        }
      }
    } catch (e) {
      console.warn('Free Dictionary API failed:', e);
    }

    return null;
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
  html += '<div class="practice-actions"><button class="btn btn-primary" onclick="window.__app.submitWrongAnswer()">提交</button><button class="btn btn-outline" onclick="window.__app.showHint(\'wrong\')">提示</button><button class="btn btn-outline" onclick="window.__app.skipWrong()">跳过</button></div>';
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
      CheckinManager.autoCheckin();
      Utils.toast('登录成功！' + (!CheckinManager.isCheckedToday() ? '' : ' 今日已打卡'), 'success');
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
  const acctEl = Utils.$('sidebarAccount');
  if (!acctEl) return;
  if (user) {
    acctEl.innerHTML = '<div class="account-name">👤 ' + Utils.esc(user.username) + '</div>' +
      '<button class="btn btn-sm btn-outline btn-block" style="margin-top:8px;" onclick="window.__app.logout()">退出登录</button>';
  } else {
    acctEl.innerHTML = '<button class="btn btn-primary btn-block" id="sidebarLoginBtn" onclick="window.__app.showLogin()">👤 登录 / 注册</button>';
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
