/**
 * 专升本英语学习系统 - 后端服务器
 * 使用 JSON 文件作为数据库（无需编译，跨平台）
 * 功能：用户注册/登录、学习进度同步、错题本同步
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'english_learning_system_secret_key_2024';

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const WRONGBOOK_FILE = path.join(DATA_DIR, 'wrongbook.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化数据文件
function initDataFile(file, defaultData) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}
initDataFile(USERS_FILE, {});
initDataFile(PROGRESS_FILE, {});
initDataFile(WRONGBOOK_FILE, {});

// 数据读写工具
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return {};
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务 - 前端页面
app.use(express.static(path.join(__dirname, '..')));

// ===== 认证中间件 =====
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }
  
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: '登录已过期，请重新登录' });
  }
}

// ===== API 路由 =====

// 注册
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: '用户名长度需在3-20位之间' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少6位' });
  }
  
  try {
    const users = readJSON(USERS_FILE);
    
    // 检查用户名是否存在
    if (users[username]) {
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    // 加密密码
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // 创建用户
    const userId = Date.now().toString();
    users[username] = {
      id: userId,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    writeJSON(USERS_FILE, users);
    
    // 生成token
    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '30d' });
    
    res.json({
      success: true,
      token,
      user: { id: userId, username }
    });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({ error: '注册失败，请重试' });
  }
});

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '请输入用户名和密码' });
  }
  
  try {
    const users = readJSON(USERS_FILE);
    const user = users[username];
    
    if (!user) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }
    
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    
    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ error: '登录失败，请重试' });
  }
});

// 获取用户信息
app.get('/api/user', authenticateToken, (req, res) => {
  res.json({
    user: { id: req.user.id, username: req.user.username }
  });
});

// ===== 学习进度 API =====

// 获取学习进度
app.get('/api/progress', authenticateToken, (req, res) => {
  try {
    const allProgress = readJSON(PROGRESS_FILE);
    const progress = allProgress[req.user.id] || {};
    res.json({ progress });
  } catch (err) {
    console.error('获取进度错误:', err);
    res.status(500).json({ error: '获取进度失败' });
  }
});

// 更新学习进度
app.post('/api/progress', authenticateToken, (req, res) => {
  const { module, chapterId, studied, correct, total } = req.body;
  
  if (!module || !chapterId) {
    return res.status(400).json({ error: '参数不完整' });
  }
  
  try {
    const allProgress = readJSON(PROGRESS_FILE);
    if (!allProgress[req.user.id]) allProgress[req.user.id] = {};
    if (!allProgress[req.user.id][module]) allProgress[req.user.id][module] = {};
    
    const existing = allProgress[req.user.id][module][chapterId] || { studied: false, correct: 0, total: 0 };
    allProgress[req.user.id][module][chapterId] = {
      studied: studied !== undefined ? studied : existing.studied,
      correct: correct !== undefined ? correct : existing.correct,
      total: total !== undefined ? total : existing.total
    };
    
    writeJSON(PROGRESS_FILE, allProgress);
    res.json({ success: true });
  } catch (err) {
    console.error('更新进度错误:', err);
    res.status(500).json({ error: '保存进度失败' });
  }
});

// 批量同步进度
app.post('/api/progress/sync', authenticateToken, (req, res) => {
  const { progress } = req.body;
  
  if (!progress) {
    return res.status(400).json({ error: '参数不完整' });
  }
  
  try {
    const allProgress = readJSON(PROGRESS_FILE);
    if (!allProgress[req.user.id]) allProgress[req.user.id] = {};
    
    // 合并进度：已学过的保持已学，正确数和总数累加
    Object.keys(progress).forEach(module => {
      if (!allProgress[req.user.id][module]) allProgress[req.user.id][module] = {};
      Object.keys(progress[module]).forEach(chId => {
        const local = progress[module][chId];
        const server = allProgress[req.user.id][module][chId] || { studied: false, correct: 0, total: 0 };
        allProgress[req.user.id][module][chId] = {
          studied: server.studied || local.studied,
          correct: (server.correct || 0) + (local.correct || 0),
          total: (server.total || 0) + (local.total || 0)
        };
      });
    });
    
    writeJSON(PROGRESS_FILE, allProgress);
    res.json({ success: true, progress: allProgress[req.user.id] });
  } catch (err) {
    console.error('同步进度错误:', err);
    res.status(500).json({ error: '同步失败' });
  }
});

// ===== 错题本 API =====

// 获取错题本
app.get('/api/wrongbook', authenticateToken, (req, res) => {
  try {
    const allWrong = readJSON(WRONGBOOK_FILE);
    const wrongbook = allWrong[req.user.id] || {};
    res.json({ wrongbook });
  } catch (err) {
    console.error('获取错题本错误:', err);
    res.status(500).json({ error: '获取错题本失败' });
  }
});

// 添加错题
app.post('/api/wrongbook', authenticateToken, (req, res) => {
  const { module, chapterId, question, userAnswer, correctAnswer } = req.body;
  
  if (!module || !chapterId || !question) {
    return res.status(400).json({ error: '参数不完整' });
  }
  
  try {
    const allWrong = readJSON(WRONGBOOK_FILE);
    if (!allWrong[req.user.id]) allWrong[req.user.id] = {};
    if (!allWrong[req.user.id][module]) allWrong[req.user.id][module] = {};
    if (!allWrong[req.user.id][module][chapterId]) allWrong[req.user.id][module][chapterId] = [];
    
    // 查重
    const exists = allWrong[req.user.id][module][chapterId].find(q => q.question === question);
    if (!exists) {
      allWrong[req.user.id][module][chapterId].push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        question,
        userAnswer: userAnswer || '',
        correctAnswer: correctAnswer || '',
        addedAt: new Date().toISOString()
      });
      writeJSON(WRONGBOOK_FILE, allWrong);
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('添加错题错误:', err);
    res.status(500).json({ error: '添加失败' });
  }
});

// 删除错题（按题目）
app.delete('/api/wrongbook/question', authenticateToken, (req, res) => {
  const { module, chapterId, question } = req.body;
  
  try {
    const allWrong = readJSON(WRONGBOOK_FILE);
    if (allWrong[req.user.id] && allWrong[req.user.id][module] && allWrong[req.user.id][module][chapterId]) {
      allWrong[req.user.id][module][chapterId] = allWrong[req.user.id][module][chapterId].filter(q => q.question !== question);
      if (allWrong[req.user.id][module][chapterId].length === 0) {
        delete allWrong[req.user.id][module][chapterId];
      }
      if (Object.keys(allWrong[req.user.id][module]).length === 0) {
        delete allWrong[req.user.id][module];
      }
      writeJSON(WRONGBOOK_FILE, allWrong);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('删除错题错误:', err);
    res.status(500).json({ error: '删除失败' });
  }
});

// 清空某章节错题
app.delete('/api/wrongbook/:module/:chapterId', authenticateToken, (req, res) => {
  try {
    const allWrong = readJSON(WRONGBOOK_FILE);
    if (allWrong[req.user.id] && allWrong[req.user.id][req.params.module]) {
      delete allWrong[req.user.id][req.params.module][req.params.chapterId];
      if (Object.keys(allWrong[req.user.id][req.params.module]).length === 0) {
        delete allWrong[req.user.id][req.params.module];
      }
      writeJSON(WRONGBOOK_FILE, allWrong);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('清空错题错误:', err);
    res.status(500).json({ error: '清空失败' });
  }
});

// 批量同步错题本
app.post('/api/wrongbook/sync', authenticateToken, (req, res) => {
  const { wrongbook } = req.body;
  
  if (!wrongbook) {
    return res.status(400).json({ error: '参数不完整' });
  }
  
  try {
    const allWrong = readJSON(WRONGBOOK_FILE);
    if (!allWrong[req.user.id]) allWrong[req.user.id] = {};
    
    // 合并错题：以服务器为准，本地新增的追加进去（去重）
    Object.keys(wrongbook).forEach(module => {
      if (!allWrong[req.user.id][module]) allWrong[req.user.id][module] = {};
      Object.keys(wrongbook[module]).forEach(chId => {
        if (!allWrong[req.user.id][module][chId]) allWrong[req.user.id][module][chId] = [];
        
        wrongbook[module][chId].forEach(item => {
          const exists = allWrong[req.user.id][module][chId].find(q => q.question === item.question);
          if (!exists) {
            allWrong[req.user.id][module][chId].push({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
              question: item.question,
              userAnswer: item.userAnswer || item.user_answer || '',
              correctAnswer: item.correctAnswer || item.correct_answer || '',
              addedAt: item.addedAt || item.added_at || new Date().toISOString()
            });
          }
        });
      });
    });
    
    writeJSON(WRONGBOOK_FILE, allWrong);
    res.json({ success: true, wrongbook: allWrong[req.user.id] });
  } catch (err) {
    console.error('同步错题本错误:', err);
    res.status(500).json({ error: '同步失败' });
  }
});

// ===== 首页路由 =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 获取本机IP地址
function getLocalIPs() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPs();
  console.log('========================================');
  console.log('  专升本英语学习系统 - 服务器已启动');
  console.log('========================================');
  console.log('');
  console.log('  本机访问:  http://localhost:' + PORT);
  if (ips.length > 0) {
    console.log('');
    console.log('  局域网访问地址:');
    ips.forEach(ip => {
      console.log('    http://' + ip + ':' + PORT);
    });
  }
  console.log('');
  console.log('  手机和电脑在同一WiFi下，用浏览器打开上面的地址即可使用');
  console.log('');
  console.log('  按 Ctrl+C 停止服务器');
  console.log('========================================');
});
