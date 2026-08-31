/**
 * 专升本英语翻译题数据库
 * 格式: { cn, en, keyVocab: [{word, meaning, above}], blanks: [word], distractors: [word] }
 * above: true 表示超纲词汇
 */
const TRANSLATION_DATA = [
  {
    cn: "他放弃了出国留学的计划。",
    en: "He abandoned his plan to study abroad.",
    keyVocab: [
      { word: "abandon", meaning: "放弃;抛弃", above: false },
      { word: "abroad", meaning: "在国外;到国外", above: false }
    ],
    blanks: ["abandoned", "abroad"],
    distractors: ["gave", "up", "overseas", "quit"]
  },
  {
    cn: "我们应该吸收前人的经验。",
    en: "We should absorb the experience of our predecessors.",
    keyVocab: [
      { word: "absorb", meaning: "吸收;吸引", above: false },
      { word: "predecessor", meaning: "前任;前辈", above: true }
    ],
    blanks: ["absorb", "experience"],
    distractors: ["take", "in", "knowledge", "learn"]
  },
  {
    cn: "政府采取了措施来应对经济危机。",
    en: "The government took measures to cope with the economic crisis.",
    keyVocab: [
      { word: "measure", meaning: "措施;测量", above: false },
      { word: "cope with", meaning: "应对;处理", above: false },
      { word: "crisis", meaning: "危机", above: false }
    ],
    blanks: ["measures", "cope", "with", "crisis"],
    distractors: ["actions", "deal", "and", "problem"]
  },
  {
    cn: "这所大学以其优秀的学术氛围而闻名。",
    en: "This university is famous for its excellent academic atmosphere.",
    keyVocab: [
      { word: "be famous for", meaning: "因...而闻名", above: false },
      { word: "academic", meaning: "学术的", above: false },
      { word: "atmosphere", meaning: "氛围;大气", above: false }
    ],
    blanks: ["famous", "for", "academic", "atmosphere"],
    distractors: ["known", "as", "good", "environment"]
  },
  {
    cn: "他对音乐有浓厚的兴趣。",
    en: "He has a strong interest in music.",
    keyVocab: [
      { word: "interest", meaning: "兴趣;利益", above: false },
      { word: "strong", meaning: "强烈的;坚强的", above: false }
    ],
    blanks: ["strong", "interest"],
    distractors: ["deep", "hobby", "big", "love"]
  },
  {
    cn: "如果你努力工作，你最终会成功的。",
    en: "If you work hard, you will eventually succeed.",
    keyVocab: [
      { word: "eventually", meaning: "最终;终于", above: false },
      { word: "succeed", meaning: "成功", above: false }
    ],
    blanks: ["eventually", "succeed"],
    distractors: ["finally", "win", "at", "last"]
  },
  {
    cn: "环境保护已经成为全球关注的问题。",
    en: "Environmental protection has become a global concern.",
    keyVocab: [
      { word: "environmental", meaning: "环境的", above: false },
      { word: "protection", meaning: "保护", above: false },
      { word: "global", meaning: "全球的", above: false },
      { word: "concern", meaning: "关注;关心", above: false }
    ],
    blanks: ["Environmental", "protection", "global", "concern"],
    distractors: ["Nature", "saving", "world", "worry"]
  },
  {
    cn: "这本书对初学者来说太难理解了。",
    en: "This book is too difficult for beginners to understand.",
    keyVocab: [
      { word: "difficult", meaning: "困难的", above: false },
      { word: "beginner", meaning: "初学者", above: false }
    ],
    blanks: ["difficult", "beginners", "understand"],
    distractors: ["hard", "starters", "know", "easy"]
  },
  {
    cn: "我们应该充分利用时间来学习。",
    en: "We should make full use of time to study.",
    keyVocab: [
      { word: "make use of", meaning: "利用", above: false },
      { word: "full", meaning: "充分的;满的", above: false }
    ],
    blanks: ["full", "use", "of"],
    distractors: ["good", "take", "advantage", "all"]
  },
  {
    cn: "由于大雨，比赛被推迟了。",
    en: "Due to the heavy rain, the match was postponed.",
    keyVocab: [
      { word: "due to", meaning: "由于;因为", above: false },
      { word: "postpone", meaning: "推迟;延期", above: false }
    ],
    blanks: ["Due", "to", "postponed"],
    distractors: ["Because", "of", "delayed", "cancelled"]
  },
  {
    cn: "他不仅会说英语，还会说法语。",
    en: "He can speak not only English but also French.",
    keyVocab: [
      { word: "not only...but also", meaning: "不仅...而且", above: false }
    ],
    blanks: ["not", "only", "but", "also"],
    distractors: ["both", "and", "as", "well", "just"]
  },
  {
    cn: "这项新技术被广泛应用于医疗领域。",
    en: "This new technology is widely used in the medical field.",
    keyVocab: [
      { word: "technology", meaning: "技术", above: false },
      { word: "widely", meaning: "广泛地", above: false },
      { word: "medical", meaning: "医疗的;医学的", above: false }
    ],
    blanks: ["technology", "widely", "medical", "field"],
    distractors: ["skill", "broadly", "hospital", "area"]
  },
  {
    cn: "越来越多的人意识到健康的重要性。",
    en: "More and more people realize the importance of health.",
    keyVocab: [
      { word: "realize", meaning: "意识到;实现", above: false },
      { word: "importance", meaning: "重要性", above: false }
    ],
    blanks: ["realize", "importance"],
    distractors: ["know", "value", "understand", "meaning"]
  },
  {
    cn: "老师鼓励学生积极参与课堂讨论。",
    en: "The teacher encourages students to participate actively in class discussions.",
    keyVocab: [
      { word: "encourage", meaning: "鼓励", above: false },
      { word: "participate", meaning: "参与", above: false },
      { word: "actively", meaning: "积极地", above: false }
    ],
    blanks: ["encourages", "participate", "actively"],
    distractors: ["asks", "join", "happily", "take"]
  },
  {
    cn: "这个项目需要大量的资金投入。",
    en: "This project requires a large amount of funding.",
    keyVocab: [
      { word: "require", meaning: "需要;要求", above: false },
      { word: "amount", meaning: "数量;总额", above: false },
      { word: "funding", meaning: "资金", above: true }
    ],
    blanks: ["requires", "amount", "funding"],
    distractors: ["needs", "lot", "money", "cost"]
  },
  {
    cn: "教育的目的不仅仅是传授知识。",
    en: "The purpose of education is not merely to impart knowledge.",
    keyVocab: [
      { word: "purpose", meaning: "目的", above: false },
      { word: "merely", meaning: "仅仅;只是", above: false },
      { word: "impart", meaning: "传授", above: true }
    ],
    blanks: ["purpose", "merely", "impart"],
    distractors: ["goal", "only", "give", "aim"]
  },
  {
    cn: "他在演讲中强调了团队合作的重要性。",
    en: "He emphasized the importance of teamwork in his speech.",
    keyVocab: [
      { word: "emphasize", meaning: "强调", above: false },
      { word: "teamwork", meaning: "团队合作", above: false }
    ],
    blanks: ["emphasized", "teamwork"],
    distractors: ["stressed", "cooperation", "highlighted", "group"]
  },
  {
    cn: "我们必须适应不断变化的社会。",
    en: "We must adapt to the constantly changing society.",
    keyVocab: [
      { word: "adapt", meaning: "适应;改编", above: false },
      { word: "constantly", meaning: "不断地", above: false },
      { word: "society", meaning: "社会", above: false }
    ],
    blanks: ["adapt", "constantly", "society"],
    distractors: ["fit", "always", "world", "change"]
  },
  {
    cn: "研究表明，运动有助于减轻压力。",
    en: "Research shows that exercise helps reduce stress.",
    keyVocab: [
      { word: "research", meaning: "研究", above: false },
      { word: "reduce", meaning: "减少;降低", above: false },
      { word: "stress", meaning: "压力", above: false }
    ],
    blanks: ["Research", "reduce", "stress"],
    distractors: ["Study", "lower", "pressure", "decrease"]
  },
  {
    cn: "她决心克服一切困难完成学业。",
    en: "She was determined to overcome all difficulties and complete her studies.",
    keyVocab: [
      { word: "determine", meaning: "决心;决定", above: false },
      { word: "overcome", meaning: "克服", above: false },
      { word: "difficulty", meaning: "困难", above: false }
    ],
    blanks: ["determined", "overcome", "difficulties"],
    distractors: ["ready", "beat", "problems", "solve"]
  },
  {
    cn: "互联网极大地改变了我们的生活方式。",
    en: "The Internet has greatly changed our way of life.",
    keyVocab: [
      { word: "greatly", meaning: "极大地", above: false },
      { word: "way of life", meaning: "生活方式", above: false }
    ],
    blanks: ["greatly", "way", "life"],
    distractors: ["much", "style", "living", "habit"]
  },
  {
    cn: "每个人都有责任保护环境。",
    en: "Everyone has a responsibility to protect the environment.",
    keyVocab: [
      { word: "responsibility", meaning: "责任", above: false },
      { word: "protect", meaning: "保护", above: false }
    ],
    blanks: ["responsibility", "protect", "environment"],
    distractors: ["duty", "save", "nature", "guard"]
  },
  {
    cn: "考试结果将在下周公布。",
    en: "The exam results will be announced next week.",
    keyVocab: [
      { word: "result", meaning: "结果", above: false },
      { word: "announce", meaning: "宣布;公布", above: false }
    ],
    blanks: ["results", "announced"],
    distractors: ["scores", "published", "told", "shown"]
  },
  {
    cn: "我对未来充满信心。",
    en: "I am full of confidence in the future.",
    keyVocab: [
      { word: "confidence", meaning: "信心", above: false },
      { word: "future", meaning: "未来", above: false }
    ],
    blanks: ["confidence", "future"],
    distractors: ["hope", "tomorrow", "faith", "belief"]
  },
  {
    cn: "这部小说被翻译成了多种语言。",
    en: "This novel has been translated into many languages.",
    keyVocab: [
      { word: "novel", meaning: "小说", above: false },
      { word: "translate", meaning: "翻译", above: false }
    ],
    blanks: ["novel", "translated", "languages"],
    distractors: ["book", "changed", "forms", "story"]
  },
  {
    cn: "虽然他很累，但他坚持完成了任务。",
    en: "Although he was tired, he insisted on finishing the task.",
    keyVocab: [
      { word: "although", meaning: "虽然", above: false },
      { word: "insist on", meaning: "坚持", above: false }
    ],
    blanks: ["Although", "insisted", "on", "task"],
    distractors: ["Though", "kept", "doing", "job"]
  },
  {
    cn: "学生们应该养成每天阅读的习惯。",
    en: "Students should form the habit of reading every day.",
    keyVocab: [
      { word: "form a habit", meaning: "养成习惯", above: false }
    ],
    blanks: ["form", "habit", "reading"],
    distractors: ["make", "custom", "study", "build"]
  },
  {
    cn: "科技的发展给我们带来了便利也带来了挑战。",
    en: "The development of technology has brought us both convenience and challenges.",
    keyVocab: [
      { word: "development", meaning: "发展", above: false },
      { word: "convenience", meaning: "便利", above: false },
      { word: "challenge", meaning: "挑战", above: false }
    ],
    blanks: ["development", "convenience", "challenges"],
    distractors: ["growth", "ease", "problems", "progress"]
  },
  {
    cn: "他花了三天时间完成这篇论文。",
    en: "He spent three days finishing this paper.",
    keyVocab: [
      { word: "spend", meaning: "花费", above: false }
    ],
    blanks: ["spent", "finishing"],
    distractors: ["took", "completing", "used", "doing"]
  },
  {
    cn: "只有不断练习，你才能提高英语口语水平。",
    en: "Only by practicing constantly can you improve your spoken English.",
    keyVocab: [
      { word: "practice", meaning: "练习", above: false },
      { word: "improve", meaning: "提高;改善", above: false }
    ],
    blanks: ["practicing", "constantly", "improve"],
    distractors: ["training", "always", "better", "exercise"]
  }
];
