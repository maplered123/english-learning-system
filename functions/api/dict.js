export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const word = (url.searchParams.get('word') || '').trim().toLowerCase();

  if (!word) {
    return jsonResponse({ error: 'Missing word parameter' }, 400);
  }

  try {
    const result = await fetchYoudaoDict(word);
    return jsonResponse(result, 200);
  } catch (e) {
    return jsonResponse({ error: 'Dict lookup failed: ' + e.message }, 500);
  }
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

async function fetchYoudaoDict(word) {
  const apiUrl = `https://dict.youdao.com/jsonresult?q=${encodeURIComponent(word)}&type=1&jsoncallback=`;
  const resp = await fetch(apiUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });

  if (!resp.ok) {
    throw new Error('Youdao API returned ' + resp.status);
  }

  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      data = JSON.parse(match[0]);
    } else {
      throw new Error('Invalid JSON from Youdao');
    }
  }

  const result = {
    word: word,
    translation: [],
    phonetic: '',
    pos: '',
    explains: [],
    examples: [],
    synonyms: []
  };

  if (data.translation && Array.isArray(data.translation)) {
    result.translation = data.translation;
  }

  if (data.basic) {
    if (data.basic.phonetic) result.phonetic = data.basic.phonetic;
    if (data.basic.explains && Array.isArray(data.basic.explains)) {
      result.explains = data.basic.explains;
      const firstExplain = data.basic.explains[0] || '';
      const posMatch = firstExplain.match(/^([a-z]+\.)\s/);
      if (posMatch) result.pos = posMatch[1];
    }
  }

  if (data.web && Array.isArray(data.web)) {
    const synEntry = data.web.find(w => w.key && w.key.toLowerCase() === word);
    if (synEntry && synEntry.value) {
      result.synonyms = synEntry.value.slice(0, 8);
    }
    const phrasalEntry = data.web.find(w => w.key && w.key.toLowerCase().includes('同义词'));
    if (phrasalEntry && phrasalEntry.value) {
      result.synonyms = result.synonyms.concat(phrasalEntry.value.slice(0, 5));
    }
  }

  if (data.sentence && Array.isArray(data.sentence)) {
    result.examples = data.sentence.slice(0, 5).map(s => ({
      en: s.englishSentence || s.sentence || '',
      zh: s.chineseSentence || s.translation || ''
    })).filter(e => e.en);
  }

  return result;
}
