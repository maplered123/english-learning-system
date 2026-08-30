/** 专升本应用文金句数据库 - 50章节 */
const WRITING_DATA = {
 chapters: [
  {id:1, title:"求职信", openings:[
   {en:"I am writing to express my interest in the position of... advertised in...",cn:"我写信是为了表达对...（来源）刊登的...职位的兴趣。"},
   {en:"I would like to apply for the position of... which I saw advertised in...",cn:"我想申请...刊登的...职位。"},
   {en:"I am writing to apply for the position of... that you advertised on your website.",cn:"我写信申请贵公司网站刊登的...职位。"}
  ], middles:[
   {en:"I believe I am well-qualified for this position because I have a degree in... and rich experience in...",cn:"我相信我胜任此职位，因为我拥有...学位和丰富的...经验。"},
   {en:"During my studies/work, I have developed strong skills in...",cn:"在学习/工作期间，我培养了出色的...能力。"},
   {en:"I am a hardworking and responsible person who can work well under pressure.",cn:"我是一个努力负责的人，能很好地在压力下工作。"}
  ], endings:[
   {en:"I would appreciate it if you could grant me an opportunity for an interview.",cn:"如果您能给我面试机会，我将不胜感激。"},
   {en:"I am looking forward to hearing from you at your earliest convenience.",cn:"期待您尽早回复。"},
   {en:"Thank you for considering my application. I am looking forward to your reply.",cn:"感谢您考虑我的申请。期待您的回复。"}
  ]},
  {id:2, title:"感谢信", openings:[
   {en:"I am writing to express my sincere gratitude for your...",cn:"我写信表达我对您...的真诚感谢。"},
   {en:"Please accept my warmest thanks for...",cn:"请接受我对...的最诚挚的感谢。"},
   {en:"I am writing to thank you from the bottom of my heart for...",cn:"我写信发自内心地感谢您...。"}
  ], middles:[
   {en:"Your help/support meant a lot to me when I was in difficulty.",cn:"当我遇到困难时，您的帮助/支持对我来说意义重大。"},
   {en:"Without your assistance, I would not have been able to...",cn:"没有您的帮助，我不可能...。"},
   {en:"It was very kind of you to... and I truly appreciate your generosity.",cn:"您...真是太好了，我真心感谢您的慷慨。"}
  ], endings:[
   {en:"Once again, thank you for your kindness and support.",cn:"再次感谢您的善意和支持。"},
   {en:"I hope I can repay your kindness in the future.",cn:"希望将来能回报您的善意。"},
   {en:"I will always remember your help and be grateful to you.",cn:"我会永远记得您的帮助并心存感激。"}
  ]},
  {id:3, title:"道歉信", openings:[
   {en:"I am writing to sincerely apologize to you for...",cn:"我写信真诚地为您...向您道歉。"},
   {en:"Please accept my sincere apologies for...",cn:"请接受我对...的真诚道歉。"},
   {en:"I am writing to say sorry for...",cn:"我写信为...表示歉意。"}
  ], middles:[
   {en:"The reason for... is that...",cn:"...的原因是...。"},
   {en:"I must admit that it was my fault, and I take full responsibility.",cn:"我必须承认这是我的错，我负全责。"},
   {en:"I understand this has caused you inconvenience, and I am truly sorry.",cn:"我理解这给您带来了不便，我深感抱歉。"}
  ], endings:[
   {en:"I promise that this will not happen again in the future.",cn:"我保证将来不会再发生这样的事。"},
   {en:"I hope you can accept my apology and forgive me.",cn:"希望您能接受我的道歉并原谅我。"},
   {en:"I would like to make up for my mistake by...",cn:"我想通过...来弥补我的错误。"}
  ]},
  {id:4, title:"邀请信", openings:[
   {en:"I am writing to invite you to attend...",cn:"我写信邀请您参加...。"},
   {en:"It is my great honor to invite you to...",cn:"我很荣幸邀请您...。"},
   {en:"We would be delighted if you could join us for...",cn:"如果您能参加我们的...，我们将非常高兴。"}
  ], middles:[
   {en:"The event will be held at... on... from... to...",cn:"活动将于...在...举行，时间从...到...。"},
   {en:"As a renowned expert in..., your presence would be greatly appreciated.",cn:"作为...领域的知名专家，您的出席将备受感激。"},
   {en:"There will be various activities including...",cn:"将有各种活动包括...。"}
  ], endings:[
   {en:"Please let us know if you can attend by...",cn:"请于...前告知是否能参加。"},
   {en:"We look forward to your favorable reply.",cn:"期待您的肯定回复。"},
   {en:"Your participation would make the event more meaningful.",cn:"您的参与将使活动更有意义。"}
  ]},
  {id:5, title:"建议信", openings:[
   {en:"I am writing to offer some suggestions regarding...",cn:"我写信就...提出一些建议。"},
   {en:"I would like to make a few recommendations concerning...",cn:"我想就...提出几条建议。"},
   {en:"After careful consideration, I would like to suggest that...",cn:"经过仔细考虑，我想建议...。"}
  ], middles:[
   {en:"First and foremost, it would be beneficial to...",cn:"首先，...将是有益的。"},
   {en:"In addition, I strongly recommend that...",cn:"此外，我强烈建议...。"},
   {en:"Furthermore, it is advisable to...",cn:"此外，...是明智的。"}
  ], endings:[
   {en:"I hope you will find these suggestions helpful.",cn:"希望您觉得这些建议有帮助。"},
   {en:"I would appreciate it if you could take my suggestions into consideration.",cn:"如果您能考虑我的建议，我将不胜感激。"},
   {en:"I am looking forward to seeing improvements in the near future.",cn:"期待在不久的将来看到改善。"}
  ]},
  {id:6, title:"投诉信", openings:[
   {en:"I am writing to express my dissatisfaction with...",cn:"我写信表达我对...的不满。"},
   {en:"I am writing to complain about...",cn:"我写信投诉...。"},
   {en:"I feel reluctant to have to write to you about..., but...",cn:"我不愿写信给您关于...的事，但是...。"}
  ], middles:[
   {en:"The main problem is that...",cn:"主要问题是...。"},
   {en:"What is worse, the staff were very rude and unhelpful.",cn:"更糟的是，员工非常粗鲁且不愿帮忙。"},
   {en:"This has caused me great inconvenience and financial loss.",cn:"这给我带来了极大的不便和经济损失。"}
  ], endings:[
   {en:"I demand that you look into this matter and take appropriate action.",cn:"我要求您调查此事并采取适当行动。"},
   {en:"I would appreciate a full refund and an apology.",cn:"希望能全额退款并道歉。"},
   {en:"I look forward to your prompt response and a satisfactory solution.",cn:"期待您的及时回复和满意的解决方案。"}
  ]},
  {id:7, title:"推荐信", openings:[
   {en:"I am writing to recommend... for...",cn:"我写信推荐...担任/获得...。"},
   {en:"It is with great pleasure that I recommend... to you.",cn:"我很荣幸向您推荐...。"},
   {en:"I would like to take this opportunity to recommend...",cn:"我想借此机会推荐...。"}
  ], middles:[
   {en:"...is an excellent student/worker who has shown outstanding performance in...",cn:"...是一位优秀的学生/工作者，在...方面表现突出。"},
   {en:"He/She is not only intelligent but also hardworking and reliable.",cn:"他/她不仅聪明，而且勤奋可靠。"},
   {en:"I am confident that he/she will be a valuable addition to your team.",cn:"我相信他/她将成为贵团队的有价值的一员。"}
  ], endings:[
   {en:"I strongly recommend him/her without reservation.",cn:"我毫无保留地强烈推荐他/她。"},
   {en:"Please feel free to contact me if you need further information.",cn:"如需更多信息，请随时联系我。"},
   {en:"I am sure you will find him/her a worthy candidate.",cn:"我相信您会发现他/她是一位值得的候选人。"}
  ]},
  {id:8, title:"申请信", openings:[
   {en:"I am writing to apply for admission to your university/scholarship.",cn:"我写信申请贵校入学/奖学金。"},
   {en:"I would like to be considered as a candidate for...",cn:"我想作为...的候选人被考虑。"},
   {en:"I am writing to apply for the opportunity to study at your institution.",cn:"我写信申请在贵校学习的机会。"}
  ], middles:[
   {en:"I graduated from... with a degree in...",cn:"我毕业于...，获得...学位。"},
   {en:"I have been interested in... since I was a child, and I hope to further my studies in this field.",cn:"我从小对...感兴趣，希望在这一领域继续深造。"},
   {en:"I believe your university is the ideal place for me because of its excellent reputation in...",cn:"我相信贵校是理想之地，因为其在...方面的卓越声誉。"}
  ], endings:[
   {en:"I would be very grateful if you could consider my application.",cn:"如果您能考虑我的申请，我将非常感激。"},
   {en:"I am looking forward to your favorable reply.",cn:"期待您的肯定回复。"},
   {en:"Enclosed please find my resume and transcripts for your reference.",cn:"随信附上简历和成绩单供您参考。"}
  ]},
  {id:9, title:"祝贺信", openings:[
   {en:"I was thrilled to hear the news that you have...",cn:"听到你...的消息我非常激动。"},
   {en:"Congratulations on your recent achievement/success in...",cn:"祝贺你最近在...上的成就/成功。"},
   {en:"I am writing to extend my warmest congratulations on...",cn:"我写信对...表示最热烈的祝贺。"}
  ], middles:[
   {en:"You truly deserve this success after all your hard work.",cn:"经过所有的努力，你确实值得这个成功。"},
   {en:"Your achievement is a testament to your talent and dedication.",cn:"你的成就证明了你的才华和奉献。"},
   {en:"I have always known that you would achieve great things.",cn:"我一直知道你会取得伟大的成就。"}
  ], endings:[
   {en:"I wish you even greater success in the future.",cn:"祝你将来取得更大的成功。"},
   {en:"May all your dreams come true in the years to come.",cn:"愿你在未来实现所有梦想。"},
   {en:"Once again, congratulations and best wishes!",cn:"再次祝贺并致以最美好的祝愿！"}
  ]},
  {id:10, title:"电子邮件", openings:[
   {en:"I hope this email finds you well.",cn:"希望您收到此邮件时一切安好。"},
   {en:"I am writing to inform you that...",cn:"我写信通知您...。"},
   {en:"Thank you for your email regarding...",cn:"感谢您关于...的邮件。"}
  ], middles:[
   {en:"I would like to confirm the details of our meeting/arrangement.",cn:"我想确认我们会面/安排的细节。"},
   {en:"Please find attached the document you requested.",cn:"请查收附件中您要求的文件。"},
   {en:"As discussed, I have completed the task and submitted the report.",cn:"如所讨论，我已完成任务并提交了报告。"}
  ], endings:[
   {en:"Please do not hesitate to contact me if you have any questions.",cn:"如有任何问题，请随时联系我。"},
   {en:"I look forward to your response.",cn:"期待您的回复。"},
   {en:"Best regards, / Sincerely, / Yours,",cn:"此致敬礼，/ 诚挚地，/ 您的，"}
  ]},
 ]
};
// 生成第11-50章的通用模板
for(let i = 11; i <= 50; i++) {
  const topics = [
   "求助信","询问信","倡议书","演讲稿","通知","海报","启事","便条",
   "报告","总结","计划书","请假条","借条","收据","证明信","介绍信",
   "辞职信","辞退信","慰问信","吊唁信","邀请函","请柬","贺卡","感谢卡",
   "表扬信","批评信","建议书","意见书","说明书","指南","评论","读后感",
   "观后感","日记","周记","备忘录","会议记录","新闻稿","广告词","产品说明",
   "问卷调查","实验报告","实习报告","开题报告","结题报告","推荐表",
   "自荐信","应聘表","学生评语"
  ];
  const topic = topics[i-11] || `应用文写作${i}`;
  WRITING_DATA.chapters.push({
   id:i, title:topic,
   openings:[
    {en:`I am writing to you regarding the matter of ${topic}.`,cn:`我写信给您是关于${topic}的事宜。`},
    {en:`This letter serves as a formal notification concerning ${topic}.`,cn:`此信作为关于${topic}的正式通知。`}
   ],
   middles:[
    {en:`Please be advised that the details regarding ${topic} are as follows.`,cn:`请注意关于${topic}的细节如下。`},
    {en:`It is important to note that ${topic} requires careful consideration and attention.`,cn:`需要注意的是${topic}需要仔细考虑和关注。`}
   ],
   endings:[
    {en:`Thank you for your attention to this matter regarding ${topic}.`,cn:`感谢您对${topic}事宜的关注。`},
    {en:`Should you have any questions about ${topic}, please feel free to contact me.`,cn:`如有关于${topic}的任何问题，请随时联系我。`}
   ]
  });
}
