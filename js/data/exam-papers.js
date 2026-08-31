/**
 * 四川省专升本英语真题数据库 (10套)
 * 每套包含: 词汇与语法结构(20题) / 阅读理解(2-3篇) / 完形填空(10空) / 翻译(5英译汉+5汉译英) / 写作(1题)
 * 难度: 专升本水平, 涵盖 abandon, absorb, adapt 等常见词汇与核心语法点
 */
const EXAM_PAPERS = [
  {
    id: 1,
    title: "四川省专升本英语真题（一）",
    year: "2024",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "He ______ to Paris twice this year.", options: ["has been", "has gone", "went", "had been"], answer: "A" },
          { q: "The novel is well worth ______.", options: ["reading", "to read", "read", "being read"], answer: "A" },
          { q: "Not until he got home ______ that he had left his keys in the office.", options: ["did he realize", "he realized", "he did realize", "realized he"], answer: "A" },
          { q: "I would rather you ______ smoking right now.", options: ["gave up", "give up", "will give up", "giving up"], answer: "A" },
          { q: "It was in 2020 ______ he graduated from college.", options: ["that", "when", "which", "in which"], answer: "A" },
          { q: "The teacher demanded that the exam ______ before Friday.", options: ["be finished", "must finish", "finished", "would finish"], answer: "A" },
          { q: "______ you work harder, you will not pass the exam.", options: ["Unless", "If", "When", "As long as"], answer: "A" },
          { q: "She is the only one of the students who ______ passed the test.", options: ["has", "have", "is", "are"], answer: "A" },
          { q: "By the end of next month, we ______ the project.", options: ["will have completed", "will complete", "complete", "have completed"], answer: "A" },
          { q: "The question ______ at the meeting is of great importance.", options: ["discussed", "discussing", "being discussed", "to discuss"], answer: "A" },
          { q: "He suggested ______ a meeting to discuss the problem.", options: ["holding", "to hold", "hold", "held"], answer: "A" },
          { q: "______ is known to all, the earth is round.", options: ["As", "It", "What", "Which"], answer: "A" },
          { q: "The book is ______ more interesting than the one I read last week.", options: ["much", "very", "so", "too"], answer: "A" },
          { q: "Hardly ______ the station when the train left.", options: ["had I reached", "I had reached", "did I reach", "I reached"], answer: "A" },
          { q: "He was about to leave ______ the phone rang.", options: ["when", "while", "as", "then"], answer: "A" },
          { q: "She has adapted ______ the new working environment quickly.", options: ["to", "with", "in", "for"], answer: "A" },
          { q: "The number of students in this school ______ increasing every year.", options: ["is", "are", "has", "have"], answer: "A" },
          { q: "He absorbed ______ the book and forgot to eat dinner.", options: ["himself in", "himself to", "in", "with"], answer: "A" },
          { q: "It is high time that we ______ action to protect the environment.", options: ["took", "take", "will take", "have taken"], answer: "A" },
          { q: "I will never forget the day ______ I spent with you in Chengdu.", options: ["that", "when", "on which", "in which"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "Education plays a vital role in our lives. It is not merely about acquiring knowledge from textbooks, but also about developing critical thinking and problem-solving abilities. In today's rapidly changing world, a good education provides individuals with the foundation they need to succeed.\n\nMany people believe that education is limited to schools and universities. However, true education extends far beyond the classroom. It includes learning from daily experiences, interacting with others, and exploring new ideas. A well-educated person is not someone who has memorized numerous facts, but someone who can apply knowledge to solve real-world problems.\n\nFurthermore, education promotes social development. When people receive quality education, they are more likely to contribute positively to society. They become responsible citizens who can make informed decisions and participate actively in their communities. Education also helps reduce inequality by providing equal opportunities for people from different backgrounds.\n\nIn conclusion, education is the cornerstone of personal growth and social progress. We should value education and never stop learning throughout our lives.",
            questions: [
              { q: "According to the passage, education is mainly about ______.", options: ["acquiring knowledge and developing abilities", "memorizing facts from textbooks", "getting high scores in exams", "going to famous universities"], answer: "A" },
              { q: "The word \"extends\" in Paragraph 2 most probably means ______.", options: ["goes beyond", "limits", "reduces", "ignores"], answer: "A" },
              { q: "A well-educated person is someone who ______.", options: ["can apply knowledge to solve problems", "has memorized many facts", "always gets high grades", "has read many books"], answer: "A" },
              { q: "Education helps reduce inequality by ______.", options: ["providing equal opportunities", "giving everyone the same salary", "eliminating all differences", "limiting opportunities for the rich"], answer: "A" },
              { q: "What is the best title for this passage?", options: ["The Importance of Education", "How to Get High Scores", "Schools and Universities", "Facts and Knowledge"], answer: "A" }
            ]
          },
          {
            text: "Mobile phones have become an essential part of modern life. Almost everyone, from young children to the elderly, uses a mobile phone daily. While these devices bring great convenience, they also raise concerns about their impact on our health and social relationships.\n\nOn the positive side, mobile phones allow us to communicate instantly with people across the world. We can access information, navigate unfamiliar places, and even pay for goods without carrying cash. During emergencies, a mobile phone can be a lifesaver.\n\nHowever, excessive use of mobile phones has been linked to several problems. Studies suggest that staring at screens for long periods can cause eye strain and sleep disorders. Moreover, many people, especially teenagers, become so absorbed in their phones that they neglect face-to-face communication. This can weaken real-world relationships and lead to feelings of isolation.\n\nTo enjoy the benefits of mobile phones while minimizing their negative effects, we should use them wisely. Setting limits on screen time and engaging in more in-person activities can help maintain a healthy balance between the digital and real world.",
            questions: [
              { q: "What is the main idea of the passage?", options: ["Mobile phones have both benefits and drawbacks", "Mobile phones are completely harmful", "Mobile phones should be banned", "Mobile phones are only for the young"], answer: "A" },
              { q: "According to the passage, a positive effect of mobile phones is ______.", options: ["instant communication across the world", "better sleep quality", "stronger face-to-face relationships", "reduced screen time"], answer: "A" },
              { q: "The word \"neglect\" in Paragraph 3 is closest in meaning to ______.", options: ["ignore", "improve", "strengthen", "increase"], answer: "A" },
              { q: "Excessive use of mobile phones can lead to all of the following EXCEPT ______.", options: ["better eye sight", "eye strain", "sleep disorders", "feelings of isolation"], answer: "A" },
              { q: "What does the author suggest to maintain a healthy balance?", options: ["Setting limits on screen time", "Using phones more frequently", "Avoiding all in-person activities", "Buying more expensive phones"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Many people dream of becoming successful, but only a few actually achieve their goals. The difference often lies in their attitude and effort. Successful people are those who never (1)______ up when facing difficulties. They understand that failure is a (2)______ of life, not the end of the road. Instead of (3)______ excuses, they look for solutions. They are (4)______ to learn from their mistakes and improve themselves. (5)______, they set clear goals and work (6)______ to reach them. They also know the (7)______ of time management, so they plan their days carefully. Moreover, successful people are (8)______ optimistic even in hard times. They believe that hard work will (9)______ pay off. In short, success comes to those who are (10)______ to work for it.",
        blanks: [
          { num: 1, options: ["give", "take", "put", "make"], answer: "A" },
          { num: 2, options: ["part", "whole", "end", "beginning"], answer: "A" },
          { num: 3, options: ["making", "doing", "taking", "having"], answer: "A" },
          { num: 4, options: ["willing", "unwilling", "afraid", "unable"], answer: "A" },
          { num: 5, options: ["Furthermore", "However", "Therefore", "Otherwise"], answer: "A" },
          { num: 6, options: ["hard", "hardly", "easy", "easily"], answer: "A" },
          { num: 7, options: ["importance", "unimportance", "uselessness", "meaninglessness"], answer: "A" },
          { num: 8, options: ["always", "never", "seldom", "rarely"], answer: "A" },
          { num: 9, options: ["eventually", "never", "rarely", "hardly"], answer: "A" },
          { num: 10, options: ["willing", "unwilling", "forced", "reluctant"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "He abandoned his plan to study abroad due to financial difficulties.", cn: "由于经济困难，他放弃了出国留学的计划。" },
          { en: "We should absorb the valuable experience of our predecessors.", cn: "我们应该吸收前人的宝贵经验。" },
          { en: "It took her several months to adapt to the new working environment.", cn: "她花了好几个月才适应新的工作环境。" },
          { en: "The government has taken measures to cope with the economic crisis.", cn: "政府已经采取措施来应对经济危机。" },
          { en: "Hardly had he arrived at the station when the train left.", cn: "他一到火车站，火车就开走了。" }
        ],
        cnToEn: [
          { cn: "直到昨天我才收到他的来信。", en: "Not until yesterday did I receive his letter." },
          { cn: "这本书值得一读。", en: "This book is well worth reading." },
          { cn: "他建议我们开会讨论这个问题。", en: "He suggested that we hold a meeting to discuss the problem." },
          { cn: "众所周知，中国是一个伟大的国家。", en: "As is known to all, China is a great country." },
          { cn: "到下个月底，我们将完成这个项目。", en: "By the end of next month, we will have completed this project." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"The Importance of Lifelong Learning\". You should write at least three reasons to support your idea.",
        sample: "The Importance of Lifelong Learning\n\nIn today's rapidly changing world, lifelong learning has become more important than ever. First, knowledge becomes outdated quickly, so we must keep learning to stay competitive in our careers. Second, learning new skills helps us adapt to technological changes and seize new opportunities. Third, lifelong learning keeps our minds active and enriches our personal lives.\n\nIn conclusion, learning should not stop when we leave school. By continuing to learn throughout our lives, we can grow both professionally and personally. Therefore, we should make learning a lifelong habit and never stop exploring new knowledge."
      }
    ]
  },

  {
    id: 2,
    title: "四川省专升本英语真题（二）",
    year: "2023",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "If I ______ you, I would accept the offer.", options: ["were", "am", "was", "be"], answer: "A" },
          { q: "The boy denied ______ the window.", options: ["breaking", "to break", "break", "broke"], answer: "A" },
          { q: "She complained that the service was far from ______.", options: ["satisfactory", "satisfy", "satisfied", "satisfyingly"], answer: "A" },
          { q: "It was not until midnight ______ he finished his homework.", options: ["that", "when", "which", "than"], answer: "A" },
          { q: "No sooner ______ home than it started to rain.", options: ["had I arrived", "I had arrived", "did I arrive", "I arrived"], answer: "A" },
          { q: "The meeting ______ tomorrow is very important.", options: ["to be held", "held", "holding", "being held"], answer: "A" },
          { q: "He insisted that he ______ innocent.", options: ["was", "be", "is", "were"], answer: "A" },
          { q: "You ______ have seen the film; you know every detail of it.", options: ["must", "can't", "shouldn't", "needn't"], answer: "A" },
          { q: "______, we would have caught the train.", options: ["Had we left earlier", "We had left earlier", "Did we leave earlier", "If we leave earlier"], answer: "A" },
          { q: "The professor, together with his students, ______ going to attend the conference.", options: ["is", "are", "have", "has"], answer: "A" },
          { q: "She attributed her success ______ hard work and persistence.", options: ["to", "for", "with", "in"], answer: "A" },
          { q: "Not only ______ English, but also French.", options: ["does he speak", "he speaks", "he does speak", "speaks he"], answer: "A" },
          { q: "The reason ______ he was late was the heavy traffic.", options: ["why", "that", "which", "for"], answer: "A" },
          { q: "I am looking forward to ______ from you soon.", options: ["hearing", "hear", "be heard", "heard"], answer: "A" },
          { q: "The new bridge ______ by the end of last year.", options: ["had been completed", "has been completed", "was completed", "completed"], answer: "A" },
          { q: "He was accused ______ stealing the company's secrets.", options: ["of", "for", "with", "about"], answer: "A" },
          { q: "______ what to do, she turned to her teacher for advice.", options: ["Not knowing", "Not known", "Not to know", "Not having known"], answer: "A" },
          { q: "She is ______ honest girl that everyone trusts her.", options: ["such an", "so an", "such a", "so a"], answer: "A" },
          { q: "The weather being fine, we ______ out for a picnic.", options: ["went", "go", "will go", "had gone"], answer: "A" },
          { q: "He would have passed the exam if he ______ harder.", options: ["had studied", "studied", "studies", "would study"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "Sleep is essential for our physical and mental health. During sleep, our bodies repair tissues, strengthen the immune system, and consolidate memories. Research shows that adults need seven to nine hours of sleep each night to function at their best.\n\nUnfortunately, many people today suffer from sleep deprivation. Busy work schedules, stress, and the constant use of electronic devices keep people awake late into the night. Over time, lack of sleep can lead to serious health problems, including obesity, heart disease, and depression. It also impairs memory and reduces our ability to concentrate.\n\nTo improve sleep quality, experts recommend establishing a regular sleep schedule. Going to bed and waking up at the same time every day helps regulate the body's internal clock. It is also advisable to avoid caffeine and heavy meals before bedtime. Creating a quiet, dark, and comfortable sleeping environment can make a significant difference.\n\nIn short, sleep should never be treated as a luxury. It is a biological necessity that we should all prioritize for a healthier and more productive life.",
            questions: [
              { q: "According to the passage, how many hours of sleep do adults need?", options: ["Seven to nine hours", "Four to five hours", "Ten to twelve hours", "Three to four hours"], answer: "A" },
              { q: "Lack of sleep can lead to all of the following EXCEPT ______.", options: ["improved memory", "obesity", "heart disease", "depression"], answer: "A" },
              { q: "The word \"impairs\" in Paragraph 2 means ______.", options: ["weakens", "strengthens", "improves", "increases"], answer: "A" },
              { q: "Experts recommend going to bed at the same time to ______.", options: ["regulate the body's internal clock", "reduce work schedules", "increase caffeine intake", "use more electronic devices"], answer: "A" },
              { q: "What is the author's attitude toward sleep?", options: ["It is a biological necessity", "It is a luxury", "It is a waste of time", "It is unimportant"], answer: "A" }
            ]
          },
          {
            text: "Online shopping has grown enormously in recent years. With just a few clicks, consumers can buy almost anything and have it delivered to their door. This convenience has changed the way people shop and has posed a great challenge to traditional retail stores.\n\nOne major advantage of online shopping is the wide selection of products. Consumers can compare prices across different sellers and read reviews from other buyers before making a decision. This transparency helps shoppers make informed choices and often saves money. Additionally, online stores are open 24 hours a day, making it possible to shop at any time.\n\nHowever, online shopping also has its drawbacks. Customers cannot physically examine products before purchasing, which sometimes leads to disappointment. Delivery delays and the hassle of returning goods are also common complaints. Furthermore, the rise of online shopping has caused many brick-and-mortar stores to close, resulting in job losses in the retail sector.\n\nIn conclusion, while online shopping offers great convenience, consumers should be aware of its limitations and shop responsibly.",
            questions: [
              { q: "What is the passage mainly about?", options: ["The advantages and disadvantages of online shopping", "How to open an online store", "The history of retail stores", "How to compare prices"], answer: "A" },
              { q: "A major advantage of online shopping is ______.", options: ["wide selection of products", "physical examination of goods", "no delivery delays", "guaranteed product quality"], answer: "A" },
              { q: "The word \"transparency\" in Paragraph 2 refers to ______.", options: ["openness of information", "hidden prices", "closed stores", "lack of reviews"], answer: "A" },
              { q: "Which of the following is a drawback of online shopping?", options: ["Customers cannot examine products physically", "Stores are open 24 hours", "Prices are always higher", "There are too many products"], answer: "A" },
              { q: "The rise of online shopping has caused ______ in the retail sector.", options: ["job losses", "more jobs", "higher salaries", "no change"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Reading is one of the most beneficial habits a person can develop. First of all, reading (1)______ our knowledge and broadens our horizons. Through books, we can (2)______ about different cultures, historical events, and scientific discoveries (3)______ leaving our homes. Moreover, reading improves our language skills. The more we read, the (4)______ vocabulary we acquire. Reading also enhances our (5)______ thinking abilities, as it requires us to analyze and (6)______ information. In addition, reading is an excellent way to (7)______ stress. Getting lost in a good book can help us (8)______ our daily worries for a while. However, it is (9)______ to choose books that are both interesting and meaningful. In short, reading is a habit that (10)______ a lifetime of benefits.",
        blanks: [
          { num: 1, options: ["enriches", "reduces", "limits", "destroys"], answer: "A" },
          { num: 2, options: ["learn", "forget", "ignore", "avoid"], answer: "A" },
          { num: 3, options: ["without", "with", "by", "through"], answer: "A" },
          { num: 4, options: ["more", "less", "fewer", "little"], answer: "A" },
          { num: 5, options: ["critical", "criticizing", "criticized", "criticize"], answer: "A" },
          { num: 6, options: ["evaluate", "ignore", "reject", "dismiss"], answer: "A" },
          { num: 7, options: ["relieve", "increase", "create", "cause"], answer: "A" },
          { num: 8, options: ["forget", "remember", "recall", "keep"], answer: "A" },
          { num: 9, options: ["important", "unimportant", "useless", "harmful"], answer: "A" },
          { num: 10, options: ["brings", "takes", "costs", "wastes"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "If I were you, I would not hesitate to accept the offer.", cn: "如果我是你，我会毫不犹豫地接受这个提议。" },
          { en: "The boy denied breaking the window of the classroom.", cn: "那个男孩否认打破了教室的窗户。" },
          { en: "She attributed her success to hard work and persistence.", cn: "她把自己的成功归因于努力和坚持。" },
          { en: "No sooner had I arrived home than it started to rain.", cn: "我刚到家就开始下雨了。" },
          { en: "He was accused of stealing the company's confidential information.", cn: "他被指控窃取公司的机密信息。" }
        ],
        cnToEn: [
          { cn: "他坚持说自己是无辜的。", en: "He insisted that he was innocent." },
          { cn: "你一定看过这部电影，你对每个细节都很了解。", en: "You must have seen the film; you know every detail of it." },
          { cn: "我期待着不久能收到你的回信。", en: "I am looking forward to hearing from you soon." },
          { cn: "他不仅会说英语，还会说法语。", en: "Not only does he speak English, but also French." },
          { cn: "要是我们早点出发就好了。", en: "If only we had left earlier." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"The Benefits of Reading\". You should give at least three benefits of reading.",
        sample: "The Benefits of Reading\n\nReading is a wonderful habit that brings numerous benefits. First, reading broadens our knowledge and horizons. Through books, we can learn about different cultures and ideas without traveling. Second, reading improves our language skills. The more we read, the richer our vocabulary becomes. Third, reading is a great way to relieve stress. A good book can help us forget our worries and relax our minds.\n\nIn conclusion, reading is not only educational but also entertaining. We should develop the habit of reading regularly and choose books that are both interesting and meaningful. Reading truly enriches our lives in many ways."
      }
    ]
  },

  {
    id: 3,
    title: "四川省专升本英语真题（三）",
    year: "2022",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "By the time he arrived, the meeting ______ for half an hour.", options: ["had been on", "has been on", "was on", "is on"], answer: "A" },
          { q: "The flowers need ______. Let me water them.", options: ["watering", "to water", "water", "watered"], answer: "A" },
          { q: "Little ______ that she was in danger.", options: ["did she know", "she knew", "she did know", "knew she"], answer: "A" },
          { q: "______ is a good habit to get up early.", options: ["It", "That", "This", "There"], answer: "A" },
          { q: "The factory ______ output has doubled this year is famous.", options: ["whose", "which", "that", "what"], answer: "A" },
          { q: "He bought a dictionary, ______ is helpful for his English study.", options: ["which", "that", "who", "whose"], answer: "A" },
          { q: "Were it not for your help, we ______ in trouble now.", options: ["would be", "will be", "are", "were"], answer: "A" },
          { q: "The teacher made the students ______ the text three times.", options: ["read", "to read", "reading", "readed"], answer: "A" },
          { q: "I will have my car ______ tomorrow.", options: ["repaired", "repair", "repairing", "to repair"], answer: "A" },
          { q: "He emphasized the necessity ______ punctual.", options: ["of being", "to be", "being", "be"], answer: "A" },
          { q: "______ caused the accident is still a mystery.", options: ["What", "That", "Which", "Who"], answer: "A" },
          { q: "She devoted herself ______ the poor.", options: ["to helping", "to help", "helping", "help"], answer: "A" },
          { q: "The population of China is ______ than that of any other country.", options: ["larger", "large", "largest", "the largest"], answer: "A" },
          { q: "I prefer reading ______ watching television.", options: ["to", "than", "rather", "instead"], answer: "A" },
          { q: "He acted as if nothing ______ happened.", options: ["had", "has", "have", "having"], answer: "A" },
          { q: "There is no point ______ about the past.", options: ["in worrying", "to worry", "worry", "worried"], answer: "A" },
          { q: "The criminal escaped ______.", options: ["being caught", "to be caught", "catching", "caught"], answer: "A" },
          { q: "Not only ______ the book, but also he wrote a review.", options: ["did he read", "he read", "he did read", "read he"], answer: "A" },
          { q: "It is required that everyone ______ present at the meeting.", options: ["be", "is", "was", "will be"], answer: "A" },
          { q: "He is the most capable person ______ I have ever met.", options: ["that", "which", "who", "whom"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "Exercise is widely recognized as one of the most important factors in maintaining good health. Regular physical activity strengthens the heart, improves blood circulation, and helps control body weight. Studies have shown that people who exercise regularly have a lower risk of developing chronic diseases such as diabetes and high blood pressure.\n\nExercise also benefits mental health. When we exercise, our brains release chemicals called endorphins, which naturally improve our mood and reduce feelings of stress and anxiety. This is why many people feel refreshed and energized after a workout. Furthermore, exercise can improve sleep quality and boost self-confidence.\n\nHowever, it is important to exercise in moderation. Overtraining can lead to injuries, exhaustion, and even a weakened immune system. Beginners should start slowly and gradually increase the intensity of their workouts. It is also advisable to choose activities that one enjoys, as this makes it easier to maintain a long-term exercise routine.\n\nTo sum up, regular and moderate exercise is a powerful tool for improving both physical and mental well-being. Everyone should find a form of exercise that suits them and make it part of their daily routine.",
            questions: [
              { q: "According to the passage, exercise helps control ______.", options: ["body weight", "blood pressure only", "heart rate only", "appetite only"], answer: "A" },
              { q: "Endorphins are chemicals that ______.", options: ["improve mood and reduce stress", "cause injuries", "weaken the immune system", "increase anxiety"], answer: "A" },
              { q: "Overtraining can result in ______.", options: ["injuries and exhaustion", "better immune system", "improved mood", "weight gain"], answer: "A" },
              { q: "The word \"moderation\" in Paragraph 3 means ______.", options: ["not too much", "as much as possible", "very little", "nothing at all"], answer: "A" },
              { q: "What is the main idea of the passage?", options: ["Exercise benefits both physical and mental health", "Exercise is always harmful", "Only young people should exercise", "Exercise is only for weight loss"], answer: "A" }
            ]
          },
          {
            text: "Sichuan province, located in southwest China, is known for its rich culture, spicy cuisine, and beautiful landscapes. The provincial capital, Chengdu, is famous for its relaxed lifestyle and the giant pandas that live in the nearby breeding centers. Each year, millions of tourists visit Sichuan to experience its unique charm.\n\nSichuan cuisine is one of the eight great culinary traditions of China. It is characterized by its bold flavors, particularly the use of chili peppers and Sichuan peppercorns. Dishes like mapo tofu and hot pot have become popular not only across China but around the world. The spicy flavors reflect the warm and humid climate of the region, as spices are believed to help remove dampness from the body.\n\nBeyond food, Sichuan boasts breathtaking natural scenery. The Jiuzhaigou Valley, with its colorful lakes and waterfalls, is a UNESCO World Heritage site. Mount Emei, one of China's four sacred Buddhist mountains, attracts both pilgrims and hikers. The province is also home to diverse ethnic groups whose traditions add to the cultural richness of the region.\n\nWith its combination of natural beauty, delicious food, and vibrant culture, Sichuan truly has something for everyone.",
            questions: [
              { q: "What is Chengdu famous for?", options: ["Pandas and a relaxed lifestyle", "Cold climate", "Seafood dishes", "Industrial factories"], answer: "A" },
              { q: "Sichuan cuisine is characterized by ______.", options: ["bold and spicy flavors", "mild and sweet flavors", "sour flavors only", "no spices"], answer: "A" },
              { q: "Jiuzhaigou Valley is a UNESCO World Heritage site known for ______.", options: ["colorful lakes and waterfalls", "giant pandas", "spicy food", "Buddhist temples"], answer: "A" },
              { q: "Spices in Sichuan food are believed to ______.", options: ["remove dampness from the body", "cause illnesses", "reduce appetite completely", "cool the body down"], answer: "A" },
              { q: "The passage mainly describes Sichuan's ______.", options: ["culture, food, and scenery", "industrial development", "political history", "educational system"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Time management is a skill that everyone should master. In today's fast-paced world, we often feel that there is never (1)______ time to do everything. However, the truth is that we all have the (2)______ 24 hours each day. The key is how we (3)______ it. Effective time management begins with setting clear (4)______. When we know what we want to (5)______, we can focus our energy on the most important tasks. Another useful strategy is to (6)______ tasks by their urgency and importance. By tackling the most (7)______ tasks first, we can reduce stress and increase productivity. Moreover, it is (8)______ to avoid procrastination, which is the habit of delaying tasks. Procrastination only (9)______ to more pressure later. In short, by managing our time wisely, we can achieve more and live a more (10)______ life.",
        blanks: [
          { num: 1, options: ["enough", "little", "few", "much"], answer: "A" },
          { num: 2, options: ["same", "different", "more", "less"], answer: "A" },
          { num: 3, options: ["use", "waste", "lose", "ignore"], answer: "A" },
          { num: 4, options: ["goals", "problems", "excuses", "delays"], answer: "A" },
          { num: 5, options: ["achieve", "avoid", "ignore", "delay"], answer: "A" },
          { num: 6, options: ["prioritize", "ignore", "postpone", "skip"], answer: "A" },
          { num: 7, options: ["important", "trivial", "unnecessary", "useless"], answer: "A" },
          { num: 8, options: ["essential", "unnecessary", "impossible", "useless"], answer: "A" },
          { num: 9, options: ["leads", "reduces", "prevents", "stops"], answer: "A" },
          { num: 10, options: ["balanced", "stressful", "chaotic", "empty"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "By the time he arrived, the meeting had been on for half an hour.", cn: "他到达时，会议已经进行了半个小时。" },
          { en: "Little did she know that she was in great danger.", cn: "她几乎不知道自己正处于极大的危险之中。" },
          { en: "She devoted herself to helping the poor in the community.", cn: "她致力于帮助社区里的穷人。" },
          { en: "There is no point in worrying about the past.", cn: "担心过去是没有意义的。" },
          { en: "He acted as if nothing had happened between them.", cn: "他表现得好像他们之间什么也没发生过。" }
        ],
        cnToEn: [
          { cn: "早起是一个好习惯。", en: "It is a good habit to get up early." },
          { cn: "那个工厂今年的产量翻了一番。", en: "The factory whose output has doubled this year is famous." },
          { cn: "我明天要去修车。", en: "I will have my car repaired tomorrow." },
          { cn: "他是我见过的最有能力的人。", en: "He is the most capable person that I have ever met." },
          { cn: "中国的人口比其他任何国家都多。", en: "The population of China is larger than that of any other country." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"The Importance of Time Management\". You should explain why managing time well is important and give some suggestions.",
        sample: "The Importance of Time Management\n\nTime management is essential in our daily lives. With good time management, we can accomplish more tasks in less time and reduce stress. First, setting clear goals helps us focus on what matters most. Second, prioritizing tasks by urgency and importance allows us to work more efficiently. Third, avoiding procrastination prevents last-minute panic and ensures quality work.\n\nTo manage time well, I suggest making a daily to-do list and sticking to it. We should also learn to say no to distractions like social media. In conclusion, effective time management leads to a more balanced and productive life. Everyone should develop this important skill as early as possible."
      }
    ]
  },

  {
    id: 4,
    title: "四川省专升本英语真题（四）",
    year: "2021",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "The project ______ now will be completed next month.", options: ["being discussed", "discussed", "discussing", "to discuss"], answer: "A" },
          { q: "He is accustomed to ______ early.", options: ["getting up", "get up", "got up", "gets up"], answer: "A" },
          { q: "______ you have any difficulty, please let me know.", options: ["Should", "Would", "Will", "Shall"], answer: "A" },
          { q: "We must prevent the environment ______ being polluted.", options: ["from", "of", "against", "with"], answer: "A" },
          { q: "She couldn't help ______ when she heard the news.", options: ["crying", "to cry", "cry", "cried"], answer: "A" },
          { q: "It is the third time that you ______ late this week.", options: ["have been", "had been", "are", "were"], answer: "A" },
          { q: "______ strange was that he didn't say a word.", options: ["What", "It", "That", "How"], answer: "A" },
          { q: "He will not come to the party unless ______.", options: ["invited", "inviting", "to invite", "being inviting"], answer: "A" },
          { q: "I feel it an honor ______ to speak here.", options: ["to be invited", "to invite", "inviting", "invited"], answer: "A" },
          { q: "The reason for his failure was ______ he had not prepared well.", options: ["that", "because", "why", "due to"], answer: "A" },
          { q: "She is interested in ______ on the internet.", options: ["surfing", "to surf", "surf", "surfed"], answer: "A" },
          { q: "So ______ that no one could catch up with him.", options: ["fast did he run", "he ran fast", "did he run fast", "fast he ran"], answer: "A" },
          { q: "The old man needs ______ after carefully.", options: ["to be looked", "look", "looking", "looked"], answer: "A" },
          { q: "I'd appreciate ______ if you could help me.", options: ["it", "that", "this", "you"], answer: "A" },
          { q: "He came in quietly ______ wake the sleeping baby.", options: ["so as not to", "so as to", "in order to", "so that"], answer: "A" },
          { q: "The more you practice, ______ you will become.", options: ["the better", "better", "the best", "best"], answer: "A" },
          { q: "She wishes she ______ more time to prepare for the exam.", options: ["had", "has", "will have", "having"], answer: "A" },
          { q: "Not a single word ______ at the meeting.", options: ["was said", "said", "is saying", "says"], answer: "A" },
          { q: "He had no choice but ______ the truth.", options: ["to tell", "tell", "telling", "told"], answer: "A" },
          { q: "The experiment ______, we went home happily.", options: ["done", "doing", "to do", "did"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "Social media has transformed the way people communicate and share information. Platforms like WeChat, Weibo, and Instagram allow users to connect with friends, share photos, and express opinions instantly. For many young people, social media has become an indispensable part of daily life.\n\nHowever, the rise of social media has also brought concerns. One major issue is the spread of false information. Because anyone can post content online, it is often difficult to distinguish between facts and rumors. This can lead to misunderstanding and even panic. Another problem is cyberbullying, where people use digital platforms to harass or intimidate others. The anonymity of the internet sometimes encourages behavior that people would never display in person.\n\nPrivacy is yet another concern. Many users share personal information online without realizing the risks. Once data is posted, it can be difficult to remove and may be used by companies or criminals. Experts advise users to think carefully before sharing sensitive information and to adjust their privacy settings regularly.\n\nIn conclusion, while social media offers great convenience, users must be responsible and cautious to protect themselves and others from its potential harms.",
            questions: [
              { q: "What is the passage mainly about?", options: ["The benefits and risks of social media", "How to use WeChat", "The history of the internet", "How to make friends online"], answer: "A" },
              { q: "A major concern about social media is ______.", options: ["the spread of false information", "too many friends", "high costs", "lack of platforms"], answer: "A" },
              { q: "Cyberbullying refers to ______.", options: ["using digital platforms to harass others", "playing online games", "sharing photos with friends", "adjusting privacy settings"], answer: "A" },
              { q: "Experts advise users to ______ before sharing sensitive information.", options: ["think carefully", "share everything", "ignore privacy settings", "post anonymously"], answer: "A" },
              { q: "The word \"anonymity\" in Paragraph 2 means ______.", options: ["the state of being unknown", "being famous", "being popular", "being honest"], answer: "A" }
            ]
          },
          {
            text: "China's high-speed rail network is the largest in the world. Since the first line opened in 2008, it has expanded rapidly, connecting major cities across the country. Trains can travel at speeds of up to 350 kilometers per hour, making long-distance travel much faster and more convenient.\n\nThe benefits of high-speed rail go beyond speed. Trains are generally more environmentally friendly than airplanes and cars, producing fewer carbon emissions per passenger. They are also comfortable and punctual, with delays being rare. For many travelers, taking a high-speed train is now the preferred way to travel between cities.\n\nHowever, the construction of the network has faced challenges. The cost of building tracks and stations is enormous, and some routes in less populated areas operate at a loss. There have also been concerns about safety, although China's high-speed rail system maintains a strong safety record overall.\n\nDespite these challenges, the government continues to invest in expanding the network. New lines are being built to connect more cities, and technology is constantly being improved. The high-speed rail system has become a symbol of China's modernization and engineering capability.",
            questions: [
              { q: "How fast can high-speed trains travel in China?", options: ["Up to 350 km/h", "Up to 100 km/h", "Up to 500 km/h", "Up to 200 km/h"], answer: "A" },
              { q: "An environmental benefit of high-speed rail is ______.", options: ["fewer carbon emissions", "more pollution", "higher fuel consumption", "more traffic jams"], answer: "A" },
              { q: "A challenge of building the network is ______.", options: ["enormous construction costs", "lack of passengers", "low demand for travel", "slow speeds"], answer: "A" },
              { q: "The word \"punctual\" in Paragraph 2 means ______.", options: ["on time", "late", "cancelled", "slow"], answer: "A" },
              { q: "The high-speed rail system has become a symbol of China's ______.", options: ["modernization and engineering capability", "agricultural development", "cultural heritage", "population growth"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Happiness is something that everyone (1)______, but it means different things to different people. Some believe that wealth is the (2)______ to happiness. They think that money can buy everything and (3)______ all problems. However, studies have shown that (4)______ a certain level of income, more money does not necessarily bring more happiness. Others believe that happiness comes from good (5)______. Having friends and family who care about you is far more valuable than any material (6)______. When we share our joys and sorrows with loved ones, our happiness is (7)______. Moreover, many people find happiness in (8)______ others. Helping those in need gives us a sense of (9)______ and fulfillment. In conclusion, true happiness does not depend on external wealth but on inner peace, loving relationships, and a (10)______ attitude toward life.",
        blanks: [
          { num: 1, options: ["seeks", "avoids", "ignores", "hides"], answer: "A" },
          { num: 2, options: ["key", "door", "lock", "wall"], answer: "A" },
          { num: 3, options: ["solve", "create", "cause", "increase"], answer: "A" },
          { num: 4, options: ["beyond", "below", "without", "under"], answer: "A" },
          { num: 5, options: ["relationships", "wealth", "money", "houses"], answer: "A" },
          { num: 6, options: ["possessions", "problems", "debts", "losses"], answer: "A" },
          { num: 7, options: ["doubled", "halved", "lost", "destroyed"], answer: "A" },
          { num: 8, options: ["helping", "ignoring", "harming", "avoiding"], answer: "A" },
          { num: 9, options: ["purpose", "failure", "loss", "confusion"], answer: "A" },
          { num: 10, options: ["positive", "negative", "pessimistic", "hopeless"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "We must prevent the environment from being polluted.", cn: "我们必须防止环境受到污染。" },
          { en: "She couldn't help crying when she heard the bad news.", cn: "听到这个坏消息时，她忍不住哭了起来。" },
          { en: "He came in quietly so as not to wake the sleeping baby.", cn: "他悄悄地走进来，以免吵醒熟睡的婴儿。" },
          { en: "The more you practice, the better you will become.", cn: "你练习得越多，就会变得越好。" },
          { en: "He had no choice but to tell the truth.", cn: "他别无选择，只能说出真相。" }
        ],
        cnToEn: [
          { cn: "他已经习惯了早起。", en: "He is accustomed to getting up early." },
          { cn: "如果你有任何困难，请告诉我。", en: "Should you have any difficulty, please let me know." },
          { cn: "这是你这周第三次迟到了。", en: "It is the third time that you have been late this week." },
          { cn: "未经邀请，他不会来参加聚会的。", en: "He will not come to the party unless invited." },
          { cn: "如果你能帮我，我将不胜感激。", en: "I'd appreciate it if you could help me." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"The Influence of Social Media on Our Lives\". You should discuss both positive and negative effects.",
        sample: "The Influence of Social Media on Our Lives\n\nSocial media has greatly influenced our lives in both positive and negative ways. On the positive side, it helps us stay connected with friends and share information instantly. We can express our opinions and learn about the world with just a few taps on our phones.\n\nHowever, social media also has negative effects. False information can spread quickly and cause panic. Cyberbullying is another serious problem that harms many people. Moreover, spending too much time on social media can lead to addiction and weaken real-life relationships.\n\nIn conclusion, we should use social media wisely. By being responsible and cautious, we can enjoy its benefits while avoiding its harms. Social media is a tool, and how we use it matters."
      }
    ]
  },

  {
    id: 5,
    title: "四川省专升本英语真题（五）",
    year: "2020",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "______ you return the book, you will not get a new one.", options: ["Unless", "If", "When", "As"], answer: "A" },
          { q: "The information ______ to us is very important.", options: ["given", "giving", "to give", "give"], answer: "A" },
          { q: "It is no use ______ over spilt milk.", options: ["crying", "to cry", "cry", "cried"], answer: "A" },
          { q: "He is believed ______ the prize last year.", options: ["to have won", "to win", "winning", "won"], answer: "A" },
          { q: "______ his help, we would have failed.", options: ["But for", "Thanks to", "Because of", "Due to"], answer: "A" },
          { q: "She objects to ______ treated like a child.", options: ["being", "be", "is", "been"], answer: "A" },
          { q: "Only in this way ______ the problem.", options: ["can we solve", "we can solve", "we solve", "solve we"], answer: "A" },
          { q: "The boy stood there, ______ what to do next.", options: ["wondering", "wondered", "to wonder", "wonder"], answer: "A" },
          { q: "He is ______ a fool to believe such a lie.", options: ["too", "so", "such", "very"], answer: "A" },
          { q: "I found ______ difficult to learn a foreign language.", options: ["it", "that", "this", "what"], answer: "A" },
          { q: "_____, he could not lift the heavy box.", options: ["Try as he might", "As he might try", "He might try", "Try he might"], answer: "A" },
          { q: "I have two brothers, ______ are doctors.", options: ["both of whom", "both of who", "both of them", "both of which"], answer: "A" },
          { q: "We regard it as our duty ______ others.", options: ["to help", "help", "helping", "helped"], answer: "A" },
          { q: "The situation is ______ worse than we expected.", options: ["much", "very", "so", "too"], answer: "A" },
          { q: "He spoke so fast that I couldn't ______ what he said.", options: ["catch up with", "come up with", "put up with", "keep up with"], answer: "A" },
          { q: "You ______ be tired; you have been working all day.", options: ["must", "can't", "shouldn't", "needn't"], answer: "A" },
          { q: "There is a growing ______ of English learning in China.", options: ["trend", "trendy", "trendily", "trendiness"], answer: "A" },
          { q: "______ has been mentioned above, the situation is serious.", options: ["As", "It", "What", "Which"], answer: "A" },
          { q: "He was about to leave ______ I called him.", options: ["when", "while", "as", "then"], answer: "A" },
          { q: "No matter ______ hard it is, I will not give up.", options: ["how", "what", "which", "that"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "Drinking enough water is one of the simplest yet most important things we can do for our health. The human body is made up of about 60 percent water, and every system in the body depends on water to function properly. Water helps regulate body temperature, transport nutrients, and remove waste.\n\nDespite its importance, many people do not drink enough water. Some wait until they feel thirsty, but thirst is not always a reliable indicator of dehydration. By the time you feel thirsty, your body may already be mildly dehydrated. Symptoms of dehydration include headaches, fatigue, dry skin, and poor concentration.\n\nThe amount of water a person needs varies depending on factors such as age, activity level, and climate. A general recommendation is to drink at least eight glasses of water a day. People who exercise or live in hot climates may need more. Eating fruits and vegetables, which contain high amounts of water, can also help maintain hydration.\n\nIn short, staying hydrated is a simple but powerful way to support overall health. Developing the habit of drinking water regularly is something everyone should do.",
            questions: [
              { q: "About how much of the human body is water?", options: ["About 60 percent", "About 20 percent", "About 90 percent", "About 10 percent"], answer: "A" },
              { q: "Thirst is not always reliable because ______.", options: ["the body may already be dehydrated when thirsty", "it always comes too early", "it is a sign of good health", "it means you drank enough"], answer: "A" },
              { q: "Which of the following is a symptom of dehydration?", options: ["Headaches", "High energy", "Clear skin", "Good concentration"], answer: "A" },
              { q: "The amount of water needed depends on all of the following EXCEPT ______.", options: ["hair color", "age", "activity level", "climate"], answer: "A" },
              { q: "A general recommendation is to drink at least ______ glasses of water a day.", options: ["eight", "two", "twenty", "one"], answer: "A" }
            ]
          },
          {
            text: "Volunteering is an activity that benefits both the community and the volunteer. When people volunteer, they contribute their time and skills to help others without expecting financial reward. This spirit of giving is what makes communities stronger and more united.\n\nFor volunteers, the experience can be deeply rewarding. Many volunteers report a sense of satisfaction and purpose that comes from helping those in need. Volunteering can also help people develop new skills, expand their social networks, and gain valuable experience that may benefit their careers. For students, volunteering can enhance their resumes and demonstrate their commitment to social responsibility.\n\nCommunities benefit from volunteering in countless ways. Volunteers help the elderly, tutor children, clean up parks, and support charitable events. Without volunteers, many essential services would be difficult to maintain, especially in areas with limited resources.\n\nIn conclusion, volunteering is a win-win activity. It enriches the lives of volunteers while making the world a better place. Everyone should consider giving some of their time to help others.",
            questions: [
              { q: "What is the main idea of the passage?", options: ["Volunteering benefits both volunteers and communities", "Volunteering is a waste of time", "Only students should volunteer", "Volunteers should be paid"], answer: "A" },
              { q: "Volunteers contribute their time and skills ______.", options: ["without expecting financial reward", "for high salaries", "to become rich", "to avoid work"], answer: "A" },
              { q: "For students, volunteering can ______.", options: ["enhance their resumes", "reduce their grades", "waste their time", "isolate them from peers"], answer: "A" },
              { q: "The word \"rewarding\" in Paragraph 2 means ______.", options: ["satisfying", "boring", "useless", "costly"], answer: "A" },
              { q: "Without volunteers, many essential services would be ______.", options: ["difficult to maintain", "easier to run", "unnecessary", "cheaper"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Travel is one of the best ways to (1)______ the world. When we travel, we (2)______ the opportunity to see new places, meet different people, and (3)______ diverse cultures. Travel broadens our (4)______ and changes the way we think about the world. For many people, travel is also a way to (5)______ stress. Leaving behind our daily routine and (6)______ into an unfamiliar environment can be refreshing. However, travel also requires careful (7)______. We need to plan our routes, book tickets, and (8)______ our budgets. It is also important to respect local (9)______ and traditions when visiting foreign places. Travelers should be open-minded and willing to (10)______ differences rather than judge them. In this way, travel becomes not just a physical journey but a journey of personal growth.",
        blanks: [
          { num: 1, options: ["explore", "ignore", "destroy", "avoid"], answer: "A" },
          { num: 2, options: ["have", "lack", "lose", "miss"], answer: "A" },
          { num: 3, options: ["experience", "avoid", "reject", "ignore"], answer: "A" },
          { num: 4, options: ["horizons", "walls", "doors", "eyes"], answer: "A" },
          { num: 5, options: ["relieve", "increase", "cause", "create"], answer: "A" },
          { num: 6, options: ["stepping", "falling", "hiding", "running"], answer: "A" },
          { num: 7, options: ["planning", "ignoring", "avoiding", "canceling"], answer: "A" },
          { num: 8, options: ["manage", "waste", "lose", "ignore"], answer: "A" },
          { num: 9, options: ["customs", "violations", "crimes", "rules"], answer: "A" },
          { num: 10, options: ["embrace", "reject", "criticize", "avoid"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "But for his help, we would have failed the project.", cn: "要不是他的帮助，我们的项目就失败了。" },
          { en: "It is no use crying over spilt milk.", cn: "覆水难收（为打翻的牛奶哭泣是没用的）。" },
          { en: "Only in this way can we solve the problem effectively.", cn: "只有这样我们才能有效地解决问题。" },
          { en: "He is believed to have won the prize last year.", cn: "人们相信他去年获得了那个奖项。" },
          { en: "No matter how hard it is, I will not give up.", cn: "无论有多难，我都不会放弃。" }
        ],
        cnToEn: [
          { cn: "除非你把书还了，否则你拿不到新书。", en: "Unless you return the book, you will not get a new one." },
          { cn: "我发现学一门外语很难。", en: "I found it difficult to learn a foreign language." },
          { cn: "他太傻了，竟然相信这样的谎言。", en: "He is too much of a fool to believe such a lie." },
          { cn: "我有两个兄弟，他们都是医生。", en: "I have two brothers, both of whom are doctors." },
          { cn: "中国英语学习的趋势日益增长。", en: "There is a growing trend of English learning in China." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"The Value of Volunteering\". You should explain why volunteering is important and encourage people to participate.",
        sample: "The Value of Volunteering\n\nVolunteering is a meaningful activity that benefits both individuals and society. First, volunteering helps those in need. Whether we help the elderly, tutor children, or clean up parks, our efforts make the community a better place. Second, volunteers gain a sense of satisfaction and purpose. Helping others brings happiness that money cannot buy. Third, volunteering helps us develop new skills and expand our social networks.\n\nI strongly encourage everyone to participate in volunteer work. Even a few hours a week can make a big difference. Volunteering not only enriches our own lives but also spreads kindness to others. Together, we can build a warmer and more united society."
      }
    ]
  },

  {
    id: 6,
    title: "四川省专升本英语真题（六）",
    year: "2019",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "The chairman insisted that the meeting ______ postponed.", options: ["be", "was", "is", "would be"], answer: "A" },
          { q: "______ for your laziness, you would have passed the exam.", options: ["Had it not been", "Were it not", "If it is not", "If it was not"], answer: "A" },
          { q: "Such ______ the result that everyone was surprised.", options: ["was", "is", "were", "are"], answer: "A" },
          { q: "She is content ______ what she has achieved.", options: ["with", "for", "at", "to"], answer: "A" },
          { q: "He raised his voice so as to make himself ______.", options: ["heard", "hear", "hearing", "to hear"], answer: "A" },
          { q: "I will never forget the village ______ I grew up.", options: ["where", "which", "that", "what"], answer: "A" },
          { q: "The book is said to ______ into several languages.", options: ["have been translated", "translate", "be translating", "translated"], answer: "A" },
          { q: "______, he would have come to the party.", options: ["Had he been invited", "If he invited", "If he is invited", "Were he invited"], answer: "A" },
          { q: "I have no idea ______ he will come or not.", options: ["whether", "that", "which", "what"], answer: "A" },
          { q: "It was not the money but the principle ______ mattered.", options: ["that", "which", "what", "who"], answer: "A" },
          { q: "The girl ______ mother is a doctor is my classmate.", options: ["whose", "who", "which", "that"], answer: "A" },
          { q: "He went to the station, ______ to find the train gone.", options: ["only", "just", "merely", "simply"], answer: "A" },
          { q: "______, the plan is feasible.", options: ["Considering everything", "Considered everything", "To consider everything", "Having considered everything"], answer: "A" },
          { q: "I would appreciate ______ back this afternoon.", options: ["your calling", "you call", "you to call", "you called"], answer: "A" },
          { q: "There ______ a book and two pens on the desk.", options: ["is", "are", "have", "has"], answer: "A" },
          { q: "He is senior ______ me by two years.", options: ["to", "than", "with", "over"], answer: "A" },
          { q: "The news ______ he had won the first prize spread quickly.", options: ["that", "which", "what", "whether"], answer: "A" },
          { q: "______, we set off for the destination.", options: ["The weather being fine", "The weather was fine", "The weather is fine", "The weather fine"], answer: "A" },
          { q: "Never before ______ such a beautiful sunset.", options: ["have I seen", "I have seen", "I saw", "did I see"], answer: "A" },
          { q: "The task ______, we can go home now.", options: ["accomplished", "accomplishing", "to accomplish", "accomplish"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "Artificial intelligence, or AI, is changing the world in ways that were unimaginable just a few decades ago. From voice assistants on our phones to self-driving cars, AI technology is becoming part of our daily lives. Many experts believe that AI will eventually transform nearly every industry, from healthcare to transportation.\n\nIn healthcare, AI is being used to analyze medical images, diagnose diseases, and even assist in surgeries. AI systems can process huge amounts of data much faster than humans, potentially catching diseases at earlier stages. In education, AI-powered tools can personalize learning experiences, adapting to each student's pace and level of understanding.\n\nHowever, the rapid development of AI has raised concerns. One major worry is job displacement. As AI becomes more capable, some fear that machines will replace human workers in many fields. Others worry about privacy, as AI systems often rely on collecting large amounts of personal data. There are also ethical questions about how to ensure AI makes fair and unbiased decisions.\n\nDespite these concerns, most experts agree that AI is here to stay. The challenge for society is to develop rules and guidelines that maximize its benefits while minimizing its risks.",
            questions: [
              { q: "According to the passage, AI is used in healthcare to ______.", options: ["analyze medical images and diagnose diseases", "replace all doctors", "build cars", "teach languages only"], answer: "A" },
              { q: "A major concern about AI is ______.", options: ["job displacement", "too many jobs", "low cost", "slow processing"], answer: "A" },
              { q: "AI-powered tools in education can ______.", options: ["personalize learning experiences", "replace all teachers", "increase class sizes", "slow down learning"], answer: "A" },
              { q: "The word \"displacement\" in Paragraph 3 means ______.", options: ["replacement", "creation", "improvement", "addition"], answer: "A" },
              { q: "What is the challenge for society regarding AI?", options: ["Developing rules to maximize benefits and minimize risks", "Banning AI completely", "Making AI as fast as possible", "Replacing all human workers"], answer: "A" }
            ]
          },
          {
            text: "Environmental protection has become a global priority. With rapid industrialization and population growth, our planet faces serious environmental problems, including air pollution, water contamination, and climate change. These issues threaten not only wildlife but also human health and future prosperity.\n\nAir pollution is one of the most pressing problems, especially in developing countries. Factories and vehicles release harmful gases that pollute the air we breathe. This leads to respiratory diseases and contributes to global warming. Water pollution is equally alarming. Industrial waste and plastic garbage pollute rivers and oceans, endangering marine life and contaminating drinking water sources.\n\nTo address these problems, both governments and individuals must take action. Governments should pass stricter environmental laws and invest in clean energy. Individuals can contribute by reducing waste, recycling, and using public transportation. Planting trees and protecting natural habitats are also effective measures.\n\nProtecting the environment is not just the responsibility of governments; it is a duty we all share. If everyone makes small changes, together we can make a big difference for our planet and future generations.",
            questions: [
              { q: "What is the passage mainly about?", options: ["Environmental protection and its importance", "Industrial development", "Population growth", "Economic prosperity"], answer: "A" },
              { q: "Air pollution leads to ______.", options: ["respiratory diseases and global warming", "cleaner air", "better health", "cooler climate"], answer: "A" },
              { q: "What can individuals do to help the environment?", options: ["Reduce waste and recycle", "Produce more pollution", "Cut down more trees", "Use more private cars"], answer: "A" },
              { q: "The word \"contamination\" in Paragraph 2 means ______.", options: ["pollution", "cleaning", "protection", "improvement"], answer: "A" },
              { q: "Protecting the environment is the responsibility of ______.", options: ["everyone", "governments only", "factories only", "scientists only"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Teamwork is essential in almost every area of life. Whether in school, at work, or in sports, working together (1)______ us achieve more than we could alone. A good team combines the (2)______ of its members, each contributing their unique skills and (3)______. When people collaborate, they can solve (4)______ problems and generate creative ideas that no single person could (5)______ up with alone. However, teamwork also requires good (6)______. Members must listen to each other, share information openly, and (7)______ disagreements respectfully. Without trust and respect, a team cannot (8)______ effectively. Moreover, every team needs a clear (9)______ who can guide the group and keep everyone focused on the common goal. In conclusion, successful teamwork depends on cooperation, communication, and shared (10)______ to achieve the same objective.",
        blanks: [
          { num: 1, options: ["helps", "hinders", "stops", "prevents"], answer: "A" },
          { num: 2, options: ["strengths", "weaknesses", "flaws", "faults"], answer: "A" },
          { num: 3, options: ["perspectives", "prejudices", "biases", "complaints"], answer: "A" },
          { num: 4, options: ["complex", "simple", "easy", "minor"], answer: "A" },
          { num: 5, options: ["come", "put", "give", "make"], answer: "A" },
          { num: 6, options: ["communication", "silence", "secrecy", "isolation"], answer: "A" },
          { num: 7, options: ["resolve", "create", "avoid", "ignore"], answer: "A" },
          { num: 8, options: ["function", "fail", "break", "divide"], answer: "A" },
          { num: 9, options: ["leader", "follower", "outsider", "stranger"], answer: "A" },
          { num: 10, options: ["commitment", "refusal", "reluctance", "opposition"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "The chairman insisted that the meeting be postponed.", cn: "主席坚持会议应该推迟。" },
          { en: "He raised his voice so as to make himself heard.", cn: "他提高了嗓门，以便让别人听到他的话。" },
          { en: "The book is said to have been translated into several languages.", cn: "据说这本书已被翻译成多种语言。" },
          { en: "I have no idea whether he will come or not.", cn: "我不知道他是否会来。" },
          { en: "Never before have I seen such a beautiful sunset.", cn: "我以前从未见过如此美丽的日落。" }
        ],
        cnToEn: [
          { cn: "要不是你懒惰，你就通过考试了。", en: "Had it not been for your laziness, you would have passed the exam." },
          { cn: "我永远不会忘记我长大的那个村庄。", en: "I will never forget the village where I grew up." },
          { cn: "那个女孩的母亲是医生，她是我的同学。", en: "The girl whose mother is a doctor is my classmate." },
          { cn: "他比我大两岁。", en: "He is senior to me by two years." },
          { cn: "考虑到一切因素，这个计划是可行的。", en: "Considering everything, the plan is feasible." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"How to Protect the Environment\". You should give at least three suggestions.",
        sample: "How to Protect the Environment\n\nEnvironmental protection is everyone's responsibility. Here are three things we can do to help. First, we should reduce waste and recycle as much as possible. For example, we can use reusable bags instead of plastic ones. Second, we should use public transportation or ride bicycles instead of driving private cars. This reduces air pollution and carbon emissions. Third, we should plant more trees and protect natural habitats, as trees absorb carbon dioxide and provide homes for wildlife.\n\nIn conclusion, protecting the environment requires collective effort. If everyone makes small changes in daily life, we can make a big difference for our planet. Let us act now before it is too late."
      }
    ]
  },

  {
    id: 7,
    title: "四川省专升本英语真题（七）",
    year: "2018",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "______ from the top of the hill, the city looks beautiful.", options: ["Seen", "Seeing", "To see", "See"], answer: "A" },
          { q: "He devoted all his time to ______ English.", options: ["studying", "study", "studied", "studies"], answer: "A" },
          { q: "Rarely ______ such a talented musician.", options: ["have I met", "I have met", "I met", "did I meet"], answer: "A" },
          { q: "She was busy ______ her homework when I called.", options: ["doing", "to do", "do", "done"], answer: "A" },
          { q: "It is requested that a report ______ within a week.", options: ["be submitted", "submit", "is submitted", "will be submitted"], answer: "A" },
          { q: "______, I would have told you earlier.", options: ["Had I known", "If I know", "If I knew", "Did I know"], answer: "A" },
          { q: "He is one of those who ______ always ready to help.", options: ["are", "is", "was", "has"], answer: "A" },
          { q: "The car ______ broke down on the highway.", options: ["which we bought last week", "we bought last week which", "that we bought it last week", "which we bought last week it"], answer: "A" },
          { q: "There used to be a cinema here, ______?", options: ["usedn't there", "didn't there", "wasn't there", "used there not"], answer: "B" },
          { q: "I prefer to stay at home rather than ______ out in the rain.", options: ["go", "to go", "going", "went"], answer: "A" },
          { q: "_____, the more mistakes you will make.", options: ["The more hurried you are", "The more you are hurried", "You are more hurried", "More hurried you are"], answer: "A" },
          { q: "He was charged ______ murder.", options: ["with", "of", "for", "about"], answer: "A" },
          { q: "Do what you think is right, ______ what others say.", options: ["regardless of", "in spite", "despite of", "although"], answer: "A" },
          { q: "The company is reported ______ a large profit this year.", options: ["to have made", "to make", "making", "made"], answer: "A" },
          { q: "I cannot but ______ his decision.", options: ["respect", "to respect", "respecting", "respected"], answer: "A" },
          { q: "______, the experiment was a success.", options: ["Considering all things", "Considered all things", "To consider all things", "All things consider"], answer: "A" },
          { q: "He spoke loudly ______ all of us could hear.", options: ["so that", "such that", "in order", "so as"], answer: "A" },
          { q: "You ______ have left your umbrella at home; it is raining now.", options: ["should", "shouldn't", "must", "can't"], answer: "A" },
          { q: "______ difficult, the problem is not impossible to solve.", options: ["However", "No matter", "Although", "As"], answer: "A" },
          { q: "All ______ glitters is not gold.", options: ["that", "which", "what", "who"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "The giant panda, native to China, is one of the most beloved animals in the world. With its black and white fur and gentle nature, the panda has become a symbol of wildlife conservation. However, pandas have long faced the threat of extinction due to habitat loss and low birth rates.\n\nPandas primarily live in the mountainous regions of Sichuan, Shaanxi, and Gansu provinces. Their diet consists almost entirely of bamboo, which means they need large areas of forest to survive. As human populations grew and forests were cleared for farming and development, pandas lost much of their natural habitat. This, combined with their naturally low reproductive rate, pushed the species to the brink of extinction.\n\nTo save the panda, the Chinese government established dozens of nature reserves and breeding centers. The most famous of these is the Chengdu Research Base of Giant Panda Breeding, where scientists work to increase the panda population through careful breeding programs. Thanks to these efforts, the panda's status was upgraded from \"endangered\" to \"vulnerable\" in 2016, a sign that conservation measures are working.\n\nHowever, the work is not finished. Climate change threatens bamboo forests, and pandas still face risks. Continued protection and research are essential to ensure that future generations can enjoy these remarkable animals.",
            questions: [
              { q: "What is the main topic of the passage?", options: ["Giant panda conservation", "Bamboo forests", "Chinese mountains", "Animal breeding methods"], answer: "A" },
              { q: "Pandas primarily eat ______.", options: ["bamboo", "meat", "fish", "fruit"], answer: "A" },
              { q: "Pandas faced extinction mainly due to ______.", options: ["habitat loss and low birth rates", "too many predators", "excessive hunting", "cold weather"], answer: "A" },
              { q: "The panda's status was upgraded to \"vulnerable\" in ______.", options: ["2016", "2008", "1990", "2020"], answer: "A" },
              { q: "What still threatens pandas according to the passage?", options: ["Climate change", "Too much bamboo", "Excessive breeding", "Cold mountains"], answer: "A" }
            ]
          },
          {
            text: "E-commerce, or electronic commerce, refers to buying and selling goods and services over the internet. Over the past two decades, it has grown into one of the largest sectors of the global economy. Platforms like Taobao, JD.com, and Amazon have millions of users and generate billions of dollars in sales each year.\n\nThe success of e-commerce can be attributed to several factors. First, it offers unmatched convenience. Consumers can shop anytime and anywhere, comparing products and prices with ease. Second, advances in logistics and payment systems have made online transactions secure and fast. Third, the widespread use of smartphones has made internet access available to a vast number of people.\n\nHowever, e-commerce also presents challenges for traditional businesses. Many physical stores have been forced to close because they cannot compete with the low prices and convenience of online shopping. This shift has led to job losses in some sectors while creating new opportunities in others, such as delivery services and digital marketing.\n\nLooking ahead, e-commerce is expected to continue growing. Innovations like live-stream shopping and same-day delivery are reshaping the industry. Both businesses and consumers will need to adapt to this rapidly changing landscape to make the most of what e-commerce has to offer.",
            questions: [
              { q: "What does e-commerce refer to?", options: ["Buying and selling goods over the internet", "Selling goods only in stores", "Advertising on television", "International trade agreements"], answer: "A" },
              { q: "A factor contributing to e-commerce success is ______.", options: ["unmatched convenience", "limited internet access", "slow payment systems", "no product comparison"], answer: "A" },
              { q: "E-commerce has caused many physical stores to ______.", options: ["close", "expand", "lower prices", "hire more staff"], answer: "A" },
              { q: "The word \"logistics\" in Paragraph 2 refers to ______.", options: ["the management of goods transportation", "advertising methods", "payment security", "smartphone technology"], answer: "A" },
              { q: "An innovation reshaping the e-commerce industry is ______.", options: ["live-stream shopping", "physical stores", "cash payments", "slower delivery"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Confidence is an essential quality for success in life. Confident people believe in their (1)______ and are not afraid to take on challenges. They know that (2)______ are a natural part of any journey and do not let them (3)______ their progress. Instead, they view setbacks as (4)______ to learn and grow. Building confidence is not something that (5)______ overnight. It requires practice and (6)______. One effective way to build confidence is to set small, achievable (7)______. Each time you reach a goal, your confidence (8)______ a little. Another way is to focus on your (9)______ rather than your weaknesses. Everyone has unique talents, and recognizing them helps build self-assurance. Finally, surrounding yourself with supportive people can (10)______ your confidence significantly. In short, confidence is a skill that can be developed with patience and effort.",
        blanks: [
          { num: 1, options: ["abilities", "failures", "flaws", "weaknesses"], answer: "A" },
          { num: 2, options: ["failures", "successes", "victories", "triumphs"], answer: "A" },
          { num: 3, options: ["stop", "help", "accelerate", "improve"], answer: "A" },
          { num: 4, options: ["opportunities", "threats", "dangers", "obstacles"], answer: "A" },
          { num: 5, options: ["happens", "disappears", "ends", "finishes"], answer: "A" },
          { num: 6, options: ["persistence", "laziness", "doubt", "fear"], answer: "A" },
          { num: 7, options: ["goals", "excuses", "delays", "failures"], answer: "A" },
          { num: 8, options: ["grows", "shrinks", "drops", "falls"], answer: "A" },
          { num: 9, options: ["strengths", "weaknesses", "flaws", "mistakes"], answer: "A" },
          { num: 10, options: ["boost", "reduce", "lower", "destroy"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "Seen from the top of the hill, the city looks beautiful.", cn: "从山顶上看，这座城市很美。" },
          { en: "Rarely have I met such a talented musician.", cn: "我很少遇到这样有才华的音乐家。" },
          { en: "Had I known the truth, I would have told you earlier.", cn: "如果我知道真相，我早就告诉你了。" },
          { en: "The company is reported to have made a large profit this year.", cn: "据报道，这家公司今年获得了巨额利润。" },
          { en: "Do what you think is right, regardless of what others say.", cn: "做你认为正确的事，不管别人怎么说。" }
        ],
        cnToEn: [
          { cn: "他致力于学习英语。", en: "He devoted all his time to studying English." },
          { cn: "要求在一周内提交报告。", en: "It is requested that a report be submitted within a week." },
          { cn: "我宁愿待在家里也不愿冒雨外出。", en: "I prefer to stay at home rather than go out in the rain." },
          { cn: "他因为谋杀被起诉。", en: "He was charged with murder." },
          { cn: "闪光的不都是金子。", en: "All that glitters is not gold." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"The Importance of Confidence\". You should explain why confidence is important and how to build it.",
        sample: "The Importance of Confidence\n\nConfidence is one of the most important qualities for success. Confident people believe in their abilities and are not afraid to take on challenges. When faced with difficulties, they do not give up easily but view failures as opportunities to learn and grow.\n\nBuilding confidence takes time and effort. First, we can set small, achievable goals. Each success, no matter how small, strengthens our self-belief. Second, we should focus on our strengths rather than our weaknesses. Everyone has unique talents, and recognizing them builds self-assurance. Third, surrounding ourselves with supportive people boosts our confidence significantly.\n\nIn conclusion, confidence is not something we are born with but a skill we can develop. With patience and effort, everyone can become more confident and achieve their goals."
      }
    ]
  },

  {
    id: 8,
    title: "四川省专升本英语真题（八）",
    year: "2017",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "I remember ______ the door before I left.", options: ["locking", "to lock", "lock", "locked"], answer: "A" },
          { q: "Were it not for the rain, we ______ a picnic.", options: ["would have", "will have", "have", "had"], answer: "A" },
          { q: "He is superior ______ me in mathematics.", options: ["to", "than", "with", "over"], answer: "A" },
          { q: "Only when you lose something ______ its value.", options: ["do you realize", "you realize", "you do realize", "realize you"], answer: "A" },
          { q: "The doctor suggested that he ______ smoking.", options: ["give up", "gives up", "gave up", "giving up"], answer: "A" },
          { q: "______ the truth, he didn't want to hurt her feelings.", options: ["To tell", "Telling", "Told", "Having told"], answer: "A" },
          { q: "He insisted on ______ the work himself.", options: ["doing", "to do", "do", "done"], answer: "A" },
          { q: "Seldom ______ to the cinema nowadays.", options: ["do I go", "I go", "I do go", "go I"], answer: "A" },
          { q: "The fact ______ he passed the exam is true.", options: ["that", "which", "what", "whether"], answer: "A" },
          { q: "I'd rather you ______ anything about it now.", options: ["didn't do", "don't do", "won't do", "haven't done"], answer: "A" },
          { q: "He is ______ clever a boy that everyone likes him.", options: ["so", "such", "too", "very"], answer: "A" },
          { q: "It is essential that he ______ the meeting on time.", options: ["attend", "attends", "attended", "attending"], answer: "A" },
          { q: "______ tired, he continued to work.", options: ["Though", "Although", "Despite", "In spite"], answer: "B" },
          { q: "He denied ______ anything about the plan.", options: ["knowing", "to know", "know", "knew"], answer: "A" },
          { q: "You are supposed to ______ the truth.", options: ["tell", "telling", "told", "tells"], answer: "A" },
          { q: "______, we would have finished earlier.", options: ["Given more time", "Giving more time", "To give more time", "Having given more time"], answer: "A" },
          { q: "The problem ______ at the last meeting remains unsolved.", options: ["discussed", "discussing", "being discussed", "to discuss"], answer: "A" },
          { q: "I cannot help ______ that he is lying.", options: ["thinking", "to think", "think", "thought"], answer: "A" },
          { q: "It was ______ that she burst into tears.", options: ["so sad a story", "a so sad story", "such sad story", "so a sad story"], answer: "A" },
          { q: "He talked as if he ______ everything.", options: ["knew", "knows", "has known", "knowing"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "Stress is a normal part of life, and not all stress is harmful. In fact, a certain amount of stress can motivate us to work harder and meet deadlines. This kind of positive stress, known as eustress, can help us perform at our best. However, when stress becomes overwhelming and constant, it can seriously affect our physical and mental health.\n\nChronic stress has been linked to a wide range of health problems. It can raise blood pressure, weaken the immune system, and increase the risk of heart disease. Mentally, prolonged stress can lead to anxiety, depression, and difficulty concentrating. It can also disrupt sleep and affect our relationships with others.\n\nFortunately, there are many effective ways to manage stress. Regular exercise is one of the best stress relievers, as it releases tension and produces mood-improving endorphins. Deep breathing, meditation, and yoga can also calm the mind and relax the body. Additionally, talking to friends, family, or a professional counselor can help us process our emotions and gain perspective. Time management and learning to say no to excessive commitments are equally important.\n\nBy recognizing the signs of stress and taking proactive steps to manage it, we can lead healthier and happier lives. Stress may be unavoidable, but it does not have to control us.",
            questions: [
              { q: "According to the passage, positive stress can ______.", options: ["motivate us to work harder", "always harm our health", "cause depression", "disrupt sleep"], answer: "A" },
              { q: "Chronic stress can lead to all of the following EXCEPT ______.", options: ["improved concentration", "high blood pressure", "anxiety", "weakened immune system"], answer: "A" },
              { q: "One of the best stress relievers mentioned is ______.", options: ["regular exercise", "eating junk food", "working longer hours", "ignoring problems"], answer: "A" },
              { q: "The word \"prolonged\" in Paragraph 2 means ______.", options: ["lasting a long time", "very short", "sudden", "ending quickly"], answer: "A" },
              { q: "What is the main idea of the passage?", options: ["Stress management and its importance", "All stress is harmful", "Stress should be ignored", "Only medicine can reduce stress"], answer: "A" }
            ]
          },
          {
            text: "Traditional Chinese Medicine, or TCM, has a history of thousands of years and remains an important part of China's cultural heritage. Unlike Western medicine, which often focuses on treating specific symptoms, TCM takes a holistic approach, aiming to balance the whole body and prevent illness before it occurs.\n\nOne of the key concepts in TCM is the balance of yin and yang, two opposing forces that exist in the body and the universe. According to TCM theory, illness occurs when this balance is disturbed. Another important concept is qi, the vital energy that flows through the body along pathways called meridians. When the flow of qi is blocked or unbalanced, health problems can arise.\n\nCommon TCM treatments include herbal medicine, acupuncture, and cupping. Herbal medicine uses natural plants and minerals to restore balance. Acupuncture involves inserting thin needles into specific points on the body to stimulate the flow of qi. These treatments are increasingly recognized worldwide for their effectiveness in managing pain and certain chronic conditions.\n\nWhile TCM should not replace Western medicine in all cases, the two approaches can complement each other. More and more people are turning to TCM as a natural alternative or supplement to conventional treatment.",
            questions: [
              { q: "How does TCM differ from Western medicine?", options: ["TCM takes a holistic approach", "TCM focuses on specific symptoms", "TCM ignores prevention", "TCM uses only surgery"], answer: "A" },
              { q: "In TCM, illness occurs when ______.", options: ["the balance of yin and yang is disturbed", "there is too much qi", "needles are not used", "herbs are taken in large amounts"], answer: "A" },
              { q: "Acupuncture involves ______.", options: ["inserting thin needles into the body", "taking herbal medicine", "using cupping therapy", "performing surgery"], answer: "A" },
              { q: "The word \"holistic\" in Paragraph 1 means ______.", options: ["treating the whole body", "treating one symptom", "ignoring the body", "using only medicine"], answer: "A" },
              { q: "According to the passage, TCM and Western medicine can ______.", options: ["complement each other", "never be combined", "always conflict", "be exactly the same"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Friendship is one of the most valuable things in life. True friends are those who stand by you (1)______ good times and bad. They celebrate your (2)______ and comfort you in your (3)______. A genuine friend does not judge you but accepts you for who you are. Building a strong friendship takes (4)______ and effort. It requires honesty, trust, and mutual (5)______. Friends should be willing to listen to each other and (6)______ support when it is needed most. However, friendships can face (7)______. Misunderstandings and disagreements are (8)______ in any relationship. What matters is how friends handle these challenges. A true friend will (9)______ and work through difficulties rather than walk away. In conclusion, friendship is a treasure that (10)______ to be cherished and nurtured throughout our lives.",
        blanks: [
          { num: 1, options: ["in", "at", "on", "for"], answer: "A" },
          { num: 2, options: ["successes", "failures", "losses", "misfortunes"], answer: "A" },
          { num: 3, options: ["sorrows", "triumphs", "victories", "joys"], answer: "A" },
          { num: 4, options: ["time", "money", "space", "nothing"], answer: "A" },
          { num: 5, options: ["respect", "disrespect", "anger", "doubt"], answer: "A" },
          { num: 6, options: ["offer", "refuse", "deny", "withdraw"], answer: "A" },
          { num: 7, options: ["challenges", "rewards", "prizes", "gifts"], answer: "A" },
          { num: 8, options: ["inevitable", "impossible", "avoidable", "rare"], answer: "A" },
          { num: 9, options: ["forgive", "blame", "accuse", "punish"], answer: "A" },
          { num: 10, options: ["deserves", "avoids", "ignores", "rejects"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "I remember locking the door before I left.", cn: "我记得离开前锁了门。" },
          { en: "Were it not for the rain, we would have a picnic.", cn: "要不是下雨，我们就去野餐了。" },
          { en: "Only when you lose something do you realize its value.", cn: "只有当你失去某样东西时，你才会意识到它的价值。" },
          { en: "The doctor suggested that he give up smoking.", cn: "医生建议他戒烟。" },
          { en: "To tell the truth, he didn't want to hurt her feelings.", cn: "说实话，他不想伤害她的感情。" }
        ],
        cnToEn: [
          { cn: "他坚持自己做这项工作。", en: "He insisted on doing the work himself." },
          { cn: "现在这附近很少有电影院了。", en: "Seldom do I go to the cinema nowadays." },
          { cn: "我希望你现在什么都别做。", en: "I'd rather you didn't do anything about it now." },
          { cn: "他否认了解关于这个计划的任何事。", en: "He denied knowing anything about the plan." },
          { cn: "如果多给些时间，我们就会早点完成。", en: "Given more time, we would have finished earlier." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"How to Manage Stress\". You should explain the causes of stress and give suggestions for managing it.",
        sample: "How to Manage Stress\n\nStress is a normal part of life, but too much stress can harm our health. Common causes of stress include heavy workloads, exams, and relationship problems. If not managed well, stress can lead to anxiety, poor sleep, and even illness.\n\nFortunately, there are many ways to manage stress. First, regular exercise is one of the best stress relievers, as it releases tension and improves our mood. Second, deep breathing and meditation can calm the mind. Third, talking to friends or family helps us process our emotions. Finally, good time management prevents last-minute panic.\n\nIn conclusion, stress may be unavoidable, but it does not have to control us. By recognizing the signs and taking proactive steps, we can lead healthier and happier lives."
      }
    ]
  },

  {
    id: 9,
    title: "四川省专升本英语真题（九）",
    year: "2016",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "I regret ______ you that your application has been rejected.", options: ["to inform", "informing", "inform", "informed"], answer: "A" },
          { q: "______ the heavy rain, the match was canceled.", options: ["Due to", "Thanks to", "Because", "Since"], answer: "A" },
          { q: "The man ______ to be a famous scientist turned out to be a fraud.", options: ["claiming", "claimed", "to claim", "claim"], answer: "A" },
          { q: "Scarcely ______ when the phone rang.", options: ["had I sat down", "I had sat down", "did I sit down", "I sat down"], answer: "A" },
          { q: "He would rather starve than ______ for food.", options: ["steal", "to steal", "stealing", "stole"], answer: "A" },
          { q: "It was the boy ______ stole the bike.", options: ["who", "which", "whom", "whose"], answer: "A" },
          { q: "He spoke slowly so that everyone ______ him.", options: ["could understand", "understands", "understood", "had understood"], answer: "A" },
          { q: "The girl ______ in red is my sister.", options: ["dressed", "dressing", "to dress", "dress"], answer: "A" },
          { q: "______ is no doubt that he will succeed.", options: ["There", "It", "That", "What"], answer: "A" },
          { q: "I'll have my watch ______ this afternoon.", options: ["repaired", "repair", "repairing", "to repair"], answer: "A" },
          { q: "He was so tired that he could ______ stand.", options: ["hardly", "hard", "almost", "nearly"], answer: "A" },
          { q: "It is no good ______ him; he won't listen.", options: ["persuading", "to persuade", "persuade", "persuaded"], answer: "A" },
          { q: "______ I know, he has gone abroad.", options: ["As far as", "As long as", "As soon as", "As well as"], answer: "A" },
          { q: "He suggested that the work ______ at once.", options: ["be done", "is done", "was done", "doing"], answer: "A" },
          { q: "The reason ______ he gave is unacceptable.", options: ["that", "why", "because", "for"], answer: "A" },
          { q: "So ______ that nobody could solve it.", options: ["difficult was the problem", "the problem was difficult", "difficult the problem was", "was the problem difficult"], answer: "A" },
          { q: "He is junior ______ me.", options: ["to", "than", "with", "from"], answer: "A" },
          { q: "If ______, I will attend the conference.", options: ["invited", "inviting", "to invite", "being inviting"], answer: "A" },
          { q: "______ in 1949, the country has changed greatly.", options: ["Founded", "Founding", "To found", "Having founded"], answer: "A" },
          { q: "There is no sense ______ about it now.", options: ["in worrying", "to worry", "worry", "worried"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "The concept of lifelong learning has gained increasing attention in recent years. In a world where technology and knowledge evolve rapidly, the skills we learn in school are no longer enough to last a lifetime. Continuous learning has become essential for both personal growth and career development.\n\nLifelong learning takes many forms. It can include formal education, such as attending courses or pursuing advanced degrees. It can also be informal, like reading books, watching educational videos, or learning from colleagues at work. The rise of online learning platforms has made education more accessible than ever, allowing people to study at their own pace and from any location.\n\nThe benefits of lifelong learning are significant. For individuals, it keeps the mind sharp and adaptable, reducing the risk of cognitive decline. It also opens doors to new career opportunities and helps professionals stay competitive in a changing job market. For society, a culture of continuous learning promotes innovation and economic growth.\n\nHowever, lifelong learning requires motivation and discipline. Busy schedules and the comfort of routine can make it difficult to find time for learning. Setting clear goals, creating a study plan, and celebrating small achievements can help maintain the habit over the long term.",
            questions: [
              { q: "Why is lifelong learning becoming more important?", options: ["Skills learned in school are no longer enough", "Schools have stopped teaching", "Technology is no longer changing", "Jobs require no skills"], answer: "A" },
              { q: "Online learning platforms have made education ______.", options: ["more accessible", "less accessible", "more expensive", "impossible"], answer: "A" },
              { q: "A benefit of lifelong learning for individuals is ______.", options: ["keeping the mind sharp", "causing cognitive decline", "reducing career opportunities", "losing competitiveness"], answer: "A" },
              { q: "The word \"cognitive\" in Paragraph 3 relates to ______.", options: ["mental processes", "physical strength", "social skills", "financial management"], answer: "A" },
              { q: "What can help maintain the learning habit long-term?", options: ["Setting clear goals and celebrating achievements", "Avoiding all study plans", "Giving up after one failure", "Relying only on motivation"], answer: "A" }
            ]
          },
          {
            text: "Urbanization, the movement of people from rural areas to cities, has been one of the most significant social trends of the past century. While cities offer better job opportunities, education, and healthcare, rapid urbanization also creates serious challenges.\n\nOne major problem is overcrowding. As more people move to cities, housing becomes scarce and expensive. Many migrants end up living in crowded conditions or informal settlements with poor sanitation. Traffic congestion is another common issue, as urban road systems struggle to handle growing numbers of vehicles. Air and water pollution tend to be worse in cities, affecting the health of residents.\n\nDespite these problems, urbanization also brings benefits. Cities are centers of innovation and economic activity. They concentrate talented people and resources, which can accelerate development. Cities also offer better access to cultural events, entertainment, and social services. For many people, moving to a city is the best path to a better life.\n\nThe key to managing urbanization is smart city planning. Governments need to invest in infrastructure, public transportation, and affordable housing. By addressing the challenges proactively, cities can continue to be engines of growth while providing a good quality of life for their residents.",
            questions: [
              { q: "What is a major problem caused by urbanization?", options: ["Overcrowding", "More job opportunities", "Better healthcare", "Lower pollution"], answer: "A" },
              { q: "A benefit of urbanization is that cities are centers of ______.", options: ["innovation and economic activity", "agriculture", "pollution only", "unemployment"], answer: "A" },
              { q: "Traffic congestion happens because ______.", options: ["urban road systems cannot handle growing vehicle numbers", "there are too few cars", "everyone walks", "public transport is too efficient"], answer: "A" },
              { q: "The word \"scarce\" in Paragraph 2 means ______.", options: ["not enough", "plentiful", "cheap", "abundant"], answer: "A" },
              { q: "What is the key to managing urbanization?", options: ["Smart city planning", "Stopping all migration", "Ignoring infrastructure", "Reducing all housing"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "Health is the most valuable thing we possess, yet many of us (1)______ it for granted until we lose it. Maintaining good health requires a combination of (2)______ habits. First, a balanced (3)______ is essential. We should eat plenty of fruits and vegetables while (4)______ the intake of sugar and fat. Second, regular (5)______ keeps our bodies strong and our minds sharp. Even a daily walk can make a (6)______. Third, getting enough (7)______ is crucial, as it allows our bodies to recover and recharge. Moreover, mental health is just as (8)______ as physical health. We should manage stress, maintain positive (9)______, and seek help when needed. Finally, avoiding harmful habits like smoking and excessive drinking protects us from many diseases. In conclusion, good health is not a (10)______ but the result of daily choices we make.",
        blanks: [
          { num: 1, options: ["take", "make", "give", "get"], answer: "A" },
          { num: 2, options: ["healthy", "unhealthy", "harmful", "destructive"], answer: "A" },
          { num: 3, options: ["diet", "exercise", "sleep", "work"], answer: "A" },
          { num: 4, options: ["reducing", "increasing", "maintaining", "boosting"], answer: "A" },
          { num: 5, options: ["exercise", "rest", "eating", "sleeping"], answer: "A" },
          { num: 6, options: ["difference", "mistake", "problem", "excuse"], answer: "A" },
          { num: 7, options: ["sleep", "work", "food", "stress"], answer: "A" },
          { num: 8, options: ["important", "unnecessary", "useless", "harmful"], answer: "A" },
          { num: 9, options: ["relationships", "habits", "addictions", "prejudices"], answer: "A" },
          { num: 10, options: ["gift", "burden", "curse", "mistake"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "I regret to inform you that your application has been rejected.", cn: "我很遗憾地通知您，您的申请已被拒绝。" },
          { en: "Scarcely had I sat down when the phone rang.", cn: "我刚坐下电话就响了。" },
          { en: "The man claiming to be a famous scientist turned out to be a fraud.", cn: "那个自称是著名科学家的人结果是个骗子。" },
          { en: "As far as I know, he has gone abroad.", cn: "据我所知，他已经出国了。" },
          { en: "Founded in 1949, the country has changed greatly.", cn: "成立于1949年，这个国家已经发生了巨大的变化。" }
        ],
        cnToEn: [
          { cn: "由于大雨，比赛被取消了。", en: "Due to the heavy rain, the match was canceled." },
          { cn: "那个穿红衣服的女孩是我妹妹。", en: "The girl dressed in red is my sister." },
          { cn: "毫无疑问，他会成功的。", en: "There is no doubt that he will succeed." },
          { cn: "他宁可挨饿也不愿去偷食物。", en: "He would rather starve than steal for food." },
          { cn: "现在担心这件事没有意义。", en: "There is no sense in worrying about it now." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"How to Maintain Good Health\". You should give at least three suggestions for keeping healthy.",
        sample: "How to Maintain Good Health\n\nHealth is the most valuable thing we possess. To maintain good health, we should develop healthy habits. First, a balanced diet is essential. We should eat plenty of fruits and vegetables while reducing the intake of sugar and fat. Second, regular exercise keeps our bodies strong and our minds sharp. Even a daily walk can make a big difference. Third, getting enough sleep is crucial, as it allows our bodies to recover.\n\nMoreover, mental health is just as important as physical health. We should manage stress and maintain positive relationships. By making healthy choices every day, we can enjoy a long and happy life. Health is not a gift but the result of our daily efforts."
      }
    ]
  },

  {
    id: 10,
    title: "四川省专升本英语真题（十）",
    year: "2015",
    sections: [
      {
        type: "vocabulary",
        title: "Part I Vocabulary and Structure",
        instruction: "Directions: There are 20 incomplete sentences in this part. For each sentence there are 4 choices marked A, B, C and D. Choose the ONE that best completes the sentence.",
        questions: [
          { q: "______ surprised me was his attitude.", options: ["What", "That", "Which", "Whether"], answer: "A" },
          { q: "He was charged ______ theft.", options: ["with", "of", "for", "about"], answer: "A" },
          { q: "The boss made him ______ overtime.", options: ["work", "to work", "working", "worked"], answer: "A" },
          { q: "Not a single mistake ______.", options: ["was found", "found", "is finding", "finds"], answer: "A" },
          { q: "I don't think he is right, ______?", options: ["is he", "do I", "isn't he", "don't I"], answer: "A" },
          { q: "______, he has made great progress.", options: ["To be fair", "To be honest", "To tell the truth", "Needless to say"], answer: "D" },
          { q: "The prisoner attempted ______ but failed.", options: ["to escape", "escaping", "escape", "escaped"], answer: "A" },
          { q: "He is accused ______ a crime.", options: ["of", "with", "for", "about"], answer: "A" },
          { q: "______ leaves last should turn off the lights.", options: ["Whoever", "Who", "Whomever", "Which"], answer: "A" },
          { q: "Had he worked harder, he ______ the exam.", options: ["would have passed", "would pass", "will pass", "had passed"], answer: "A" },
          { q: "I prefer ______ alone to ______ in a group.", options: ["working, working", "to work, to work", "work, work", "worked, worked"], answer: "A" },
          { q: "The teacher, as well as the students, ______ excited.", options: ["was", "were", "are", "have been"], answer: "A" },
          { q: "It is high time we ______ a decision.", options: ["made", "make", "will make", "have made"], answer: "A" },
          { q: "He acted ______ nothing had happened.", options: ["as if", "even if", "if", "unless"], answer: "A" },
          { q: "______ the bad weather, the flight was delayed.", options: ["Owing to", "Owing", "Due", "Because"], answer: "A" },
          { q: "You had better ______ the truth.", options: ["tell", "to tell", "telling", "told"], answer: "A" },
          { q: "The book is worth ______ twice.", options: ["reading", "to read", "read", "being read"], answer: "A" },
          { q: "He is the only person ______ I can trust.", options: ["whom", "which", "whose", "what"], answer: "A" },
          { q: "It is important that he ______ well prepared.", options: ["be", "is", "was", "will be"], answer: "A" },
          { q: "There ______ a pen and two books on the desk.", options: ["is", "are", "have", "has"], answer: "A" }
        ]
      },
      {
        type: "reading",
        title: "Part II Reading Comprehension",
        instruction: "Directions: There are 2 passages in this part. Each passage is followed by 5 questions. For each question there are 4 choices marked A, B, C and D. Choose the best answer.",
        passages: [
          {
            text: "Culture shock refers to the feelings of confusion and anxiety that people experience when they move to a new cultural environment. It is a normal reaction to being surrounded by unfamiliar customs, language, and social norms. While culture shock can be challenging, it is also a natural part of adapting to a new culture.\n\nCulture shock typically occurs in several stages. The first stage is often called the honeymoon phase, during which everything in the new culture seems exciting and fascinating. Soon, however, differences become more noticeable, and the individual may feel frustrated, homesick, and confused. This is the most difficult stage. Over time, as the person learns to understand and navigate the new culture, they gradually adjust and feel more comfortable.\n\nThere are several ways to cope with culture shock. Learning the local language is one of the most effective strategies, as it allows for better communication and deeper understanding. Making friends with locals and participating in community activities can also help. It is equally important to stay in touch with family and friends back home, as their support provides comfort during difficult times.\n\nUltimately, overcoming culture shock leads to personal growth. Living abroad broadens one's perspective, builds resilience, and fosters a deeper appreciation of cultural diversity. The experience, though difficult, is often one of the most rewarding of a person's life.",
            questions: [
              { q: "What is culture shock?", options: ["Feelings of confusion in a new culture", "Excitement about traveling", "Learning a new language", "Making new friends"], answer: "A" },
              { q: "The first stage of culture shock is called the ______.", options: ["honeymoon phase", "frustration phase", "adjustment phase", "rejection phase"], answer: "A" },
              { q: "An effective way to cope with culture shock is ______.", options: ["learning the local language", "avoiding locals", "staying indoors", "ignoring the culture"], answer: "A" },
              { q: "The word \"resilience\" in the last paragraph means ______.", options: ["ability to recover from difficulties", "physical strength", "language skill", "cultural knowledge"], answer: "A" },
              { q: "Overcoming culture shock leads to ______.", options: ["personal growth", "isolation", "homesickness", "confusion"], answer: "A" }
            ]
          },
          {
            text: "Renewable energy is energy that comes from natural sources that are continuously replenished, such as sunlight, wind, and water. Unlike fossil fuels like coal and oil, which are finite and produce harmful emissions, renewable energy is clean and sustainable. As the world faces the threat of climate change, the shift toward renewable energy has become increasingly urgent.\n\nSolar energy is one of the most widely used forms of renewable energy. Solar panels convert sunlight directly into electricity, providing power for homes, businesses, and even entire communities. Wind energy is another fast-growing sector. Wind turbines, often placed in open areas or offshore, generate electricity without producing any pollution. Hydropower, which harnesses the energy of flowing water, has been used for decades and remains the largest source of renewable electricity worldwide.\n\nDespite its benefits, renewable energy faces challenges. The main issue is that sources like wind and sunlight are not always available, making energy storage essential. Developing better batteries and energy storage systems is a major focus of current research. Additionally, the initial cost of installing renewable energy systems can be high, though prices have been falling steadily.\n\nGovernments around the world are investing heavily in renewable energy. With continued technological advances and policy support, renewable energy is expected to play a central role in the future of global energy.",
            questions: [
              { q: "What is a key difference between renewable energy and fossil fuels?", options: ["Renewable energy is clean and sustainable", "Fossil fuels are cleaner", "Renewable energy is finite", "Fossil fuels produce no emissions"], answer: "A" },
              { q: "Solar panels convert sunlight into ______.", options: ["electricity", "water", "wind", "coal"], answer: "A" },
              { q: "A challenge of renewable energy is that ______.", options: ["sources are not always available", "it produces too much pollution", "it is always cheap", "it is non-renewable"], answer: "A" },
              { q: "The word \"replenished\" in Paragraph 1 means ______.", options: ["restored", "used up", "destroyed", "reduced"], answer: "A" },
              { q: "Which is the largest source of renewable electricity worldwide?", options: ["Hydropower", "Solar energy", "Wind energy", "Coal power"], answer: "A" }
            ]
          }
        ]
      },
      {
        type: "cloze",
        title: "Part III Cloze",
        instruction: "Directions: There is a passage with 10 blanks. For each blank there are 4 choices marked A, B, C and D. Choose the best one.",
        passage: "In today's competitive job market, having a good education alone is no longer enough to (1)______ a good job. Employers look for candidates who possess a (2)______ of skills beyond academic knowledge. One of the most important skills is (3)______. The ability to express ideas clearly and listen to others is (4)______ in any workplace. Teamwork is another (5)______ quality. Most modern jobs require people to (6)______ with others to achieve common goals. Problem-solving ability is also highly (7)______. Employers value workers who can think (8)______ and find creative solutions to challenges. Moreover, adaptability has become (9)______ important in a rapidly changing world. Workers must be willing to learn new skills and adjust to new situations. Finally, a positive attitude and a strong work ethic can set a candidate (10)______ from the rest. In short, success in the job market requires both hard skills and soft skills.",
        blanks: [
          { num: 1, options: ["secure", "lose", "avoid", "reject"], answer: "A" },
          { num: 2, options: ["range", "lack", "shortage", "absence"], answer: "A" },
          { num: 3, options: ["communication", "silence", "isolation", "secrecy"], answer: "A" },
          { num: 4, options: ["essential", "unnecessary", "useless", "harmful"], answer: "A" },
          { num: 5, options: ["crucial", "trivial", "minor", "unimportant"], answer: "A" },
          { num: 6, options: ["collaborate", "compete", "argue", "conflict"], answer: "A" },
          { num: 7, options: ["valued", "ignored", "avoided", "rejected"], answer: "A" },
          { num: 8, options: ["critically", "carelessly", "blindly", "randomly"], answer: "A" },
          { num: 9, options: ["increasingly", "decreasingly", "rarely", "never"], answer: "A" },
          { num: 10, options: ["apart", "together", "behind", "below"], answer: "A" }
        ]
      },
      {
        type: "translation",
        title: "Part IV Translation",
        instruction: "Directions: This part consists of two sections. Section A: Translate 5 sentences from English into Chinese. Section B: Translate 5 sentences from Chinese into English.",
        enToCn: [
          { en: "What surprised me was his attitude toward the matter.", cn: "让我惊讶的是他对这件事的态度。" },
          { en: "Had he worked harder, he would have passed the exam.", cn: "如果他再努力一些，他就会通过考试了。" },
          { en: "Whoever leaves last should turn off the lights.", cn: "无论谁最后离开，都应该关灯。" },
          { en: "He is the only person whom I can trust completely.", cn: "他是我唯一能完全信任的人。" },
          { en: "Owing to the bad weather, the flight was delayed.", cn: "由于天气恶劣，航班延误了。" }
        ],
        cnToEn: [
          { cn: "他被指控犯了罪。", en: "He is accused of a crime." },
          { cn: "囚犯企图逃跑但失败了。", en: "The prisoner attempted to escape but failed." },
          { cn: "现在是做决定的时候了。", en: "It is high time we made a decision." },
          { cn: "他表现得好像什么也没发生过。", en: "He acted as if nothing had happened." },
          { cn: "我更喜欢独自工作而不是在小组中工作。", en: "I prefer working alone to working in a group." }
        ]
      },
      {
        type: "writing",
        title: "Part V Writing",
        instruction: "Directions: For this part, you are required to write a short essay of about 120 words based on the following topic.",
        prompt: "Write an essay of about 120 words on the topic \"The Skills Needed for Career Success\". You should discuss at least three important skills.",
        sample: "The Skills Needed for Career Success\n\nIn today's competitive job market, having a good education is no longer enough. Employers look for candidates with a range of skills. First, communication is essential. The ability to express ideas clearly and listen to others is crucial in any workplace. Second, teamwork is important. Most jobs require people to collaborate with others to achieve common goals. Third, problem-solving ability is highly valued. Workers who can think critically and find creative solutions stand out.\n\nMoreover, adaptability has become increasingly important in a rapidly changing world. Workers must be willing to learn new skills and adjust to new situations. In short, success requires both hard skills and soft skills. By developing these abilities, we can build a successful career."
      }
    ]
  }
];
