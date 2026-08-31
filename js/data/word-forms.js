/**
 * 不规则词形变换数据库
 * 覆盖专升本常见不规则动词、形容词比较级/最高级、不规则复数等
 */
const IRREGULAR_FORMS = {
  // === 不规则动词: base => { third, past, pastParticiple, presentParticiple } ===
  verbs: {
    'arise':   { third: 'arises',   past: 'arose',     ppart: 'arisen',    ing: 'arising' },
    'awake':   { third: 'awakes',   past: 'awoke',     ppart: 'awoken',    ing: 'awaking' },
    'be':      { third: 'is/am/are', past: 'was/were', ppart: 'been',      ing: 'being' },
    'bear':    { third: 'bears',    past: 'bore',      ppart: 'born/borne', ing: 'bearing' },
    'beat':    { third: 'beats',    past: 'beat',      ppart: 'beaten',    ing: 'beating' },
    'become':  { third: 'becomes',  past: 'became',    ppart: 'become',    ing: 'becoming' },
    'begin':   { third: 'begins',   past: 'began',     ppart: 'begun',     ing: 'beginning' },
    'bind':    { third: 'binds',    past: 'bound',     ppart: 'bound',     ing: 'binding' },
    'bite':    { third: 'bites',    past: 'bit',       ppart: 'bitten',    ing: 'biting' },
    'blow':    { third: 'blows',    past: 'blew',      ppart: 'blown',     ing: 'blowing' },
    'break':   { third: 'breaks',   past: 'broke',     ppart: 'broken',    ing: 'breaking' },
    'bring':   { third: 'brings',   past: 'brought',   ppart: 'brought',   ing: 'bringing' },
    'build':   { third: 'builds',   past: 'built',     ppart: 'built',     ing: 'building' },
    'burn':    { third: 'burns',    past: 'burnt',     ppart: 'burnt',     ing: 'burning' },
    'buy':     { third: 'buys',     past: 'bought',    ppart: 'bought',    ing: 'buying' },
    'cast':    { third: 'casts',    past: 'cast',      ppart: 'cast',      ing: 'casting' },
    'catch':   { third: 'catches',  past: 'caught',    ppart: 'caught',    ing: 'catching' },
    'choose':  { third: 'chooses',  past: 'chose',     ppart: 'chosen',    ing: 'choosing' },
    'come':    { third: 'comes',    past: 'came',      ppart: 'come',      ing: 'coming' },
    'cost':    { third: 'costs',    past: 'cost',      ppart: 'cost',      ing: 'costing' },
    'creep':   { third: 'creeps',   past: 'crept',     ppart: 'crept',     ing: 'creeping' },
    'cut':     { third: 'cuts',     past: 'cut',       ppart: 'cut',       ing: 'cutting' },
    'deal':    { third: 'deals',    past: 'dealt',     ppart: 'dealt',     ing: 'dealing' },
    'dig':     { third: 'digs',     past: 'dug',       ppart: 'dug',       ing: 'digging' },
    'do':      { third: 'does',     past: 'did',       ppart: 'done',      ing: 'doing' },
    'draw':    { third: 'draws',    past: 'drew',      ppart: 'drawn',     ing: 'drawing' },
    'drink':   { third: 'drinks',   past: 'drank',     ppart: 'drunk',     ing: 'drinking' },
    'drive':   { third: 'drives',   past: 'drove',     ppart: 'driven',    ing: 'driving' },
    'eat':     { third: 'eats',     past: 'ate',       ppart: 'eaten',     ing: 'eating' },
    'fall':    { third: 'falls',    past: 'fell',      ppart: 'fallen',    ing: 'falling' },
    'feed':    { third: 'feeds',    past: 'fed',       ppart: 'fed',       ing: 'feeding' },
    'feel':    { third: 'feels',    past: 'felt',      ppart: 'felt',      ing: 'feeling' },
    'fight':   { third: 'fights',   past: 'fought',    ppart: 'fought',    ing: 'fighting' },
    'find':    { third: 'finds',    past: 'found',     ppart: 'found',     ing: 'finding' },
    'fly':     { third: 'flies',    past: 'flew',      ppart: 'flown',     ing: 'flying' },
    'forbid':  { third: 'forbids',  past: 'forbade',   ppart: 'forbidden',  ing: 'forbidding' },
    'forget':  { third: 'forgets',  past: 'forgot',    ppart: 'forgotten', ing: 'forgetting' },
    'forgive': { third: 'forgives', past: 'forgave',   ppart: 'forgiven',   ing: 'forgiving' },
    'freeze':  { third: 'freezes',  past: 'froze',     ppart: 'frozen',    ing: 'freezing' },
    'get':     { third: 'gets',     past: 'got',       ppart: 'got/gotten', ing: 'getting' },
    'give':    { third: 'gives',    past: 'gave',      ppart: 'given',     ing: 'giving' },
    'go':      { third: 'goes',     past: 'went',      ppart: 'gone',      ing: 'going' },
    'grow':    { third: 'grows',    past: 'grew',      ppart: 'grown',     ing: 'growing' },
    'hang':    { third: 'hangs',    past: 'hung',      ppart: 'hung',      ing: 'hanging' },
    'have':    { third: 'has',     past: 'had',       ppart: 'had',       ing: 'having' },
    'hear':    { third: 'hears',    past: 'heard',     ppart: 'heard',     ing: 'hearing' },
    'hide':    { third: 'hides',    past: 'hid',       ppart: 'hidden',    ing: 'hiding' },
    'hit':     { third: 'hits',     past: 'hit',       ppart: 'hit',       ing: 'hitting' },
    'hold':    { third: 'holds',    past: 'held',      ppart: 'held',      ing: 'holding' },
    'hurt':    { third: 'hurts',    past: 'hurt',      ppart: 'hurt',      ing: 'hurting' },
    'keep':    { third: 'keeps',    past: 'kept',      ppart: 'kept',      ing: 'keeping' },
    'know':    { third: 'knows',    past: 'knew',      ppart: 'known',     ing: 'knowing' },
    'lay':     { third: 'lays',     past: 'laid',      ppart: 'laid',      ing: 'laying' },
    'lead':    { third: 'leads',    past: 'led',       ppart: 'led',       ing: 'leading' },
    'lean':    { third: 'leans',    past: 'leant',     ppart: 'leant',     ing: 'leaning' },
    'leap':    { third: 'leaps',    past: 'leapt',     ppart: 'leapt',     ing: 'leaping' },
    'learn':   { third: 'learns',   past: 'learnt',    ppart: 'learnt',    ing: 'learning' },
    'leave':   { third: 'leaves',   past: 'left',      ppart: 'left',      ing: 'leaving' },
    'lend':    { third: 'lends',    past: 'lent',      ppart: 'lent',      ing: 'lending' },
    'let':     { third: 'lets',     past: 'let',       ppart: 'let',       ing: 'letting' },
    'lie':     { third: 'lies',     past: 'lay',       ppart: 'lain',      ing: 'lying' },
    'light':   { third: 'lights',   past: 'lit',       ppart: 'lit',       ing: 'lighting' },
    'lose':    { third: 'loses',    past: 'lost',      ppart: 'lost',      ing: 'losing' },
    'make':    { third: 'makes',    past: 'made',      ppart: 'made',      ing: 'making' },
    'mean':    { third: 'means',    past: 'meant',     ppart: 'meant',     ing: 'meaning' },
    'meet':    { third: 'meets',    past: 'met',       ppart: 'met',       ing: 'meeting' },
    'mistake': { third: 'mistakes', past: 'mistook',   ppart: 'mistaken',  ing: 'mistaking' },
    'pay':     { third: 'pays',     past: 'paid',      ppart: 'paid',      ing: 'paying' },
    'put':     { third: 'puts',     past: 'put',       ppart: 'put',       ing: 'putting' },
    'read':    { third: 'reads',    past: 'read',      ppart: 'read',      ing: 'reading' },
    'ride':    { third: 'rides',    past: 'rode',      ppart: 'ridden',    ing: 'riding' },
    'ring':    { third: 'rings',    past: 'rang',      ppart: 'rung',      ing: 'ringing' },
    'rise':    { third: 'rises',    past: 'rose',      ppart: 'risen',     ing: 'rising' },
    'run':     { third: 'runs',     past: 'ran',       ppart: 'run',       ing: 'running' },
    'say':     { third: 'says',     past: 'said',      ppart: 'said',      ing: 'saying' },
    'see':     { third: 'sees',     past: 'saw',       ppart: 'seen',      ing: 'seeing' },
    'seek':    { third: 'seeks',    past: 'sought',    ppart: 'sought',    ing: 'seeking' },
    'sell':    { third: 'sells',    past: 'sold',      ppart: 'sold',      ing: 'selling' },
    'send':    { third: 'sends',    past: 'sent',      ppart: 'sent',      ing: 'sending' },
    'set':     { third: 'sets',     past: 'set',       ppart: 'set',       ing: 'setting' },
    'shake':   { third: 'shakes',   past: 'shook',     ppart: 'shaken',    ing: 'shaking' },
    'shed':    { third: 'sheds',    past: 'shed',      ppart: 'shed',      ing: 'shedding' },
    'shine':   { third: 'shines',   past: 'shone',     ppart: 'shone',     ing: 'shining' },
    'shoot':   { third: 'shoots',   past: 'shot',      ppart: 'shot',      ing: 'shooting' },
    'show':    { third: 'shows',    past: 'showed',    ppart: 'shown',     ing: 'showing' },
    'shrink':  { third: 'shrinks',  past: 'shrank',    ppart: 'shrunk',    ing: 'shrinking' },
    'shut':    { third: 'shuts',    past: 'shut',      ppart: 'shut',      ing: 'shutting' },
    'sing':    { third: 'sings',    past: 'sang',      ppart: 'sung',      ing: 'singing' },
    'sink':    { third: 'sinks',    past: 'sank',      ppart: 'sunk',      ing: 'sinking' },
    'sit':     { third: 'sits',     past: 'sat',       ppart: 'sat',       ing: 'sitting' },
    'sleep':   { third: 'sleeps',   past: 'slept',     ppart: 'slept',     ing: 'sleeping' },
    'slide':   { third: 'slides',   past: 'slid',      ppart: 'slid',      ing: 'sliding' },
    'smell':   { third: 'smells',   past: 'smelt',     ppart: 'smelt',     ing: 'smelling' },
    'speak':   { third: 'speaks',   past: 'spoke',     ppart: 'spoken',    ing: 'speaking' },
    'spend':   { third: 'spends',   past: 'spent',     ppart: 'spent',     ing: 'spending' },
    'spin':    { third: 'spins',    past: 'span',      ppart: 'spun',      ing: 'spinning' },
    'spread':  { third: 'spreads',  past: 'spread',    ppart: 'spread',    ing: 'spreading' },
    'stand':   { third: 'stands',   past: 'stood',     ppart: 'stood',     ing: 'standing' },
    'steal':   { third: 'steals',   past: 'stole',     ppart: 'stolen',    ing: 'stealing' },
    'stick':   { third: 'sticks',   past: 'stuck',     ppart: 'stuck',     ing: 'sticking' },
    'strike':  { third: 'strikes',  past: 'struck',    ppart: 'struck',    ing: 'striking' },
    'swear':   { third: 'swears',   past: 'swore',     ppart: 'sworn',     ing: 'swearing' },
    'sweep':   { third: 'sweeps',   past: 'swept',     ppart: 'swept',     ing: 'sweeping' },
    'swim':    { third: 'swims',    past: 'swam',      ppart: 'swum',      ing: 'swimming' },
    'swing':   { third: 'swings',   past: 'swung',     ppart: 'swung',     ing: 'swinging' },
    'take':    { third: 'takes',    past: 'took',      ppart: 'taken',     ing: 'taking' },
    'teach':   { third: 'teaches',  past: 'taught',    ppart: 'taught',    ing: 'teaching' },
    'tear':    { third: 'tears',    past: 'tore',      ppart: 'torn',      ing: 'tearing' },
    'tell':    { third: 'tells',    past: 'told',      ppart: 'told',      ing: 'telling' },
    'think':   { third: 'thinks',   past: 'thought',   ppart: 'thought',   ing: 'thinking' },
    'throw':   { third: 'throws',   past: 'threw',     ppart: 'thrown',    ing: 'throwing' },
    'understand': { third: 'understands', past: 'understood', ppart: 'understood', ing: 'understanding' },
    'wake':    { third: 'wakes',    past: 'woke',      ppart: 'woken',     ing: 'waking' },
    'wear':    { third: 'wears',    past: 'wore',      ppart: 'worn',      ing: 'wearing' },
    'weave':   { third: 'weaves',   past: 'wove',     ppart: 'woven',     ing: 'weaving' },
    'weep':    { third: 'weeps',    past: 'wept',      ppart: 'wept',      ing: 'weeping' },
    'win':     { third: 'wins',     past: 'won',       ppart: 'won',       ing: 'winning' },
    'wind':    { third: 'winds',    past: 'wound',     ppart: 'wound',     ing: 'winding' },
    'write':   { third: 'writes',   past: 'wrote',     ppart: 'written',    ing: 'writing' }
  },

  // === 不规则形容词比较级/最高级 ===
  adjectives: {
    'bad':      { comp: 'worse',     super: 'worst' },
    'far':      { comp: 'farther/further', super: 'farthest/furthest' },
    'good':     { comp: 'better',    super: 'best' },
    'ill':      { comp: 'worse',     super: 'worst' },
    'little':   { comp: 'less',      super: 'least' },
    'many':     { comp: 'more',      super: 'most' },
    'much':     { comp: 'more',      super: 'most' },
    'old':      { comp: 'older/elder', super: 'oldest/eldest' },
    'well':     { comp: 'better',    super: 'best' }
  },

  // === 不规则复数名词 ===
  nouns: {
    'child':    { plural: 'children' },
    'foot':     { plural: 'feet' },
    'goose':    { plural: 'geese' },
    'man':      { plural: 'men' },
    'mouse':    { plural: 'mice' },
    'ox':       { plural: 'oxen' },
    'person':   { plural: 'people' },
    'tooth':    { plural: 'teeth' },
    'woman':    { plural: 'women' },
    'sheep':    { plural: 'sheep' },
    'deer':     { plural: 'deer' },
    'fish':     { plural: 'fish/fishes' },
    'species':  { plural: 'species' },
    'means':    { plural: 'means' },
    'data':     { plural: 'data' },
    'analysis': { plural: 'analyses' },
    'basis':    { plural: 'bases' },
    'crisis':   { plural: 'crises' },
    'criterion':{ plural: 'criteria' },
    'phenomenon': { plural: 'phenomena' },
    'leaf':     { plural: 'leaves' },
    'life':     { plural: 'lives' },
    'knife':    { plural: 'knives' },
    'wife':     { plural: 'wives' },
    'half':     { plural: 'halves' },
    'self':     { plural: 'selves' },
    'loaf':     { plural: 'loaves' },
    'thief':    { plural: 'thieves' },
    'wolf':     { plural: 'wolves' }
  },

  // === 派生词（常见词根的词形变换） ===
  // 格式: word => { noun, verb, adjective, adverb, other }
  derivations: {
    'act':       { noun: 'action', adjective: 'active', adverb: 'actively' },
    'beauty':    { verb: 'beautify', adjective: 'beautiful', adverb: 'beautifully' },
    'care':      { noun: 'careful', adjective: 'careful', adverb: 'carefully' },
    'create':    { noun: 'creation', adjective: 'creative', adverb: 'creatively' },
    'danger':    { adjective: 'dangerous', adverb: 'dangerously' },
    'decide':    { noun: 'decision', adjective: 'decisive', adverb: 'decisively' },
    'differ':    { noun: 'difference', adjective: 'different', adverb: 'differently' },
    'educate':   { noun: 'education', adjective: 'educational', adverb: 'educationally' },
    'excite':    { noun: 'excitement', adjective: 'exciting/excited', adverb: 'excitedly' },
    'expand':    { noun: 'expansion', adjective: 'expansive' },
    'expect':    { noun: 'expectation', adjective: 'expectant' },
    'explain':   { noun: 'explanation' },
    'explore':   { noun: 'exploration', adjective: 'exploratory' },
    'fail':      { noun: 'failure', adjective: 'failing' },
    'fame':      { verb: 'famous', adjective: 'famous', adverb: 'famously' },
    'fortune':   { verb: 'fortune', adjective: 'fortunate', adverb: 'fortunately' },
    'glory':     { verb: 'glorify', adjective: 'glorious', adverb: 'gloriously' },
    'happy':     { noun: 'happiness', verb: 'happen', adverb: 'happily' },
    'harm':      { adjective: 'harmful', adverb: 'harmfully' },
    'honest':    { noun: 'honesty', adverb: 'honestly' },
    'hope':      { noun: 'hope', adjective: 'hopeful', adverb: 'hopefully' },
    'imagine':   { noun: 'imagination', adjective: 'imaginative', adverb: 'imaginatively' },
    'improve':   { noun: 'improvement' },
    'include':   { noun: 'inclusion', adjective: 'inclusive' },
    'introduce': { noun: 'introduction', adjective: 'introductory' },
    'invite':    { noun: 'invitation' },
    'know':      { noun: 'knowledge', adjective: 'known' },
    'legal':     { noun: 'legality', adverb: 'legally' },
    'liberty':   { noun: 'liberation', adjective: 'liberal', adverb: 'liberally' },
    'likely':    { adverb: 'likely' },
    'manage':    { noun: 'management', adjective: 'manageable' },
    'move':      { noun: 'movement', adjective: 'movable' },
    'necessary': { noun: 'necessity', adverb: 'necessarily' },
    'organize':  { noun: 'organization', adjective: 'organic', adverb: 'organically' },
    'please':    { noun: 'pleasure', adjective: 'pleasant', adverb: 'pleasantly' },
    'possess':   { noun: 'possession', adjective: 'possessive' },
    'produce':   { noun: 'production', adjective: 'productive', adverb: 'productively' },
    'protect':   { noun: 'protection', adjective: 'protective' },
    'puzzle':    { adjective: 'puzzling/puzzled' },
    'qualify':   { noun: 'qualification', adjective: 'qualified' },
    'react':     { noun: 'reaction', adjective: 'reactive' },
    'real':      { noun: 'reality', adverb: 'really' },
    'reduce':    { noun: 'reduction' },
    'regard':    { noun: 'regard', adjective: 'regarding' },
    'relax':     { noun: 'relaxation', adjective: 'relaxing/relaxed' },
    'satisfy':   { noun: 'satisfaction', adjective: 'satisfactory', adverb: 'satisfactorily' },
    'science':   { verb: 'scientific', adjective: 'scientific', adverb: 'scientifically' },
    'separate':  { noun: 'separation', adjective: 'separate', adverb: 'separately' },
    'serious':   { noun: 'seriousness', adverb: 'seriously' },
    'simplify':  { noun: 'simplicity', adjective: 'simple', adverb: 'simply' },
    'solve':     { noun: 'solution', adjective: 'soluble' },
    'succeed':   { noun: 'success', adjective: 'successful', adverb: 'successfully' },
    'suit':      { noun: 'suit', adjective: 'suitable', adverb: 'suitably' },
    'suspect':   { noun: 'suspicion', adjective: 'suspicious' },
    'system':    { verb: 'systematize', adjective: 'systematic', adverb: 'systematically' },
    'thirst':    { adjective: 'thirsty' },
    'think':     { noun: 'thought', adjective: 'thoughtful', adverb: 'thoughtfully' },
    'use':       { noun: 'usage', adjective: 'useful', adverb: 'usefully' },
    'vary':      { noun: 'variety', adjective: 'various', adverb: 'variously' },
    'weak':      { noun: 'weakness', verb: 'weaken', adverb: 'weakly' },
    'wise':      { noun: 'wisdom', adverb: 'wisely' },
    'wonder':    { adjective: 'wonderful', adverb: 'wonderfully' },
    'worry':     { adjective: 'worried/worrying', adverb: 'worriedly' }
  }
};

/**
 * 词形变换工具类
 */
const WordFormsUtil = {
  // 获取动词的各种形式
  getVerbForms(word) {
    const lower = word.toLowerCase();
    const irr = IRREGULAR_FORMS.verbs[lower];
    if (irr) {
      return {
        base: word,
        thirdPerson: irr.third,
        pastTense: irr.past,
        pastParticiple: irr.ppart,
        presentParticiple: irr.ing
      };
    }
    // 规则变化
    return {
      base: word,
      thirdPerson: this._addS(word),
      pastTense: this._addEd(word),
      pastParticiple: this._addEd(word),
      presentParticiple: this._addIng(word)
    };
  },

  // 获取形容词比较级/最高级
  getAdjForms(word) {
    const lower = word.toLowerCase();
    const irr = IRREGULAR_FORMS.adjectives[lower];
    if (irr) {
      return { base: word, comparative: irr.comp, superlative: irr.super };
    }
    // 规则变化
    return {
      base: word,
      comparative: this._addEr(word),
      superlative: this._addEst(word)
    };
  },

  // 获取名词复数
  getNounPlural(word) {
    const lower = word.toLowerCase();
    const irr = IRREGULAR_FORMS.nouns[lower];
    if (irr) return irr.plural;
    return this._addPluralS(word);
  },

  // 获取派生词
  getDerivations(word) {
    const lower = word.toLowerCase();
    return IRREGULAR_FORMS.derivations[lower] || this._guessDerivations(word);
  },

  // === 内部规则方法 ===
  _addS(word) {
    if (word.endsWith('s') || word.endsWith('ss') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
      return word + 'es';
    }
    if (word.endsWith('y') && word.length > 1 && !/[aeiou]y$/.test(word)) {
      return word.slice(0, -1) + 'ies';
    }
    return word + 's';
  },

  _addEd(word) {
    if (word.endsWith('e')) return word + 'd';
    if (word.endsWith('y') && word.length > 1 && !/[aeiou]y$/.test(word)) {
      return word.slice(0, -1) + 'ied';
    }
    if (word.length >= 3) {
      const last3 = word.slice(-3);
      const last1 = word.slice(-1);
      const vowels = 'aeiou';
      if (vowels.includes(last1) === false && vowels.includes(word.slice(-2, -1))) {
        if (/[bcdfghjklmnpqrstvwxz][aeiou][bcdfghjklmnpqrstvwxz]$/.test(word)) {
          return word + word.slice(-1) + 'ed';
        }
      }
    }
    return word + 'ed';
  },

  _addIng(word) {
    if (word.endsWith('ie')) return word.slice(0, -2) + 'ying';
    if (word.endsWith('e') && !word.endsWith('ee')) return word.slice(0, -1) + 'ing';
    if (word.length >= 3) {
      if (/[bcdfghjklmnpqrstvwxz][aeiou][bcdfghjklmnpqrstvwxz]$/.test(word)) {
        return word + word.slice(-1) + 'ing';
      }
    }
    return word + 'ing';
  },

  _addEr(word) {
    if (word.endsWith('e')) return word + 'r';
    if (word.endsWith('y') && word.length > 1 && !/[aeiou]y$/.test(word)) {
      return word.slice(0, -1) + 'ier';
    }
    if (word.length >= 3 && /[bcdfghjklmnpqrstvwxz][aeiou][bcdfghjklmnpqrstvwxz]$/.test(word)) {
      return word + word.slice(-1) + 'er';
    }
    if (word.length <= 4) return word + 'er';
    return 'more ' + word;
  },

  _addEst(word) {
    if (word.endsWith('e')) return word + 'st';
    if (word.endsWith('y') && word.length > 1 && !/[aeiou]y$/.test(word)) {
      return word.slice(0, -1) + 'iest';
    }
    if (word.length >= 3 && /[bcdfghjklmnpqrstvwxz][aeiou][bcdfghjklmnpqrstvwxz]$/.test(word)) {
      return word + word.slice(-1) + 'est';
    }
    if (word.length <= 4) return word + 'est';
    return 'most ' + word;
  },

  _addPluralS(word) {
    if (word.endsWith('s') || word.endsWith('ss') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x')) {
      return word + 'es';
    }
    if (word.endsWith('y') && word.length > 1 && !/[aeiou]y$/.test(word)) {
      return word.slice(0, -1) + 'ies';
    }
    if (word.endsWith('f') || word.endsWith('fe')) {
      return word.replace(/fe?$/, 'ves');
    }
    if (word.endsWith('is')) {
      return word.slice(0, -2) + 'es';
    }
    if (word.endsWith('on')) {
      return word.slice(0, -2) + 'a';
    }
    if (word.endsWith('um')) {
      return word.slice(0, -2) + 'a';
    }
    return word + 's';
  },

  _guessDerivations(word) {
    const result = {};
    const lower = word.toLowerCase();

    if (lower.endsWith('tion') || lower.endsWith('sion')) {
      const root = lower.replace(/(tion|sion)$/, 't');
      result.verb = root.endsWith('t') ? root + 'e' : root;
    } else if (lower.endsWith('ment')) {
      result.noun = word;
      result.verb = lower.replace(/ment$/, '');
    } else if (lower.endsWith('ness')) {
      result.adjective = lower.replace(/ness$/, '');
    } else if (lower.endsWith('ful')) {
      result.adjective = word;
      result.noun = lower.replace(/ful$/, '');
    } else if (lower.endsWith('less')) {
      result.adjective = word;
      result.noun = lower.replace(/less$/, '');
    } else if (lower.endsWith('ly')) {
      result.adverb = word;
      result.adjective = lower.replace(/ly$/, '');
    } else if (lower.endsWith('ive')) {
      result.adjective = word;
      result.noun = lower.replace(/ive$/, 'ion');
    } else if (lower.endsWith('able') || lower.endsWith('ible')) {
      result.adjective = word;
      result.verb = lower.replace(/(able|ible)$/, 'e');
    } else if (lower.endsWith('ous')) {
      result.adjective = word;
      result.noun = lower.replace(/ous$/, '');
    } else if (lower.endsWith('al') && lower.length > 4) {
      result.adjective = word;
      result.noun = lower.replace(/al$/, '');
    } else if (lower.endsWith('er') && lower.length > 4) {
      result.noun = word;
      result.verb = lower.replace(/er$/, '');
    } else if (lower.endsWith('ed') && lower.length > 4) {
      result.adjective = word;
      result.verb = lower.replace(/d$/, '');
    } else if (lower.endsWith('ing') && lower.length > 5) {
      result.adjective = word;
      result.verb = lower.replace(/ing$/, '');
    }

    if (!result.noun && !result.verb && !result.adjective && !result.adverb) {
      if (lower.length > 3) {
        const root = lower.endsWith('e') ? lower : lower + 'e';
        result.noun = root.replace(/e$/, 'ion');
        result.adjective = root.replace(/e$/, 'ive');
        result.adverb = root.replace(/e$/, 'ively');
      }
    }

    return result;
  }
};
