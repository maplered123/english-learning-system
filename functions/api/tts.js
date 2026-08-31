export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const word = url.searchParams.get('word') || '';
  const type = url.searchParams.get('type') || '2';

  if (!word) {
    return new Response('Missing word parameter', { status: 400 });
  }

  try {
    const youdaoUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`;
    const resp = await fetch(youdaoUrl);

    if (!resp.ok) {
      return new Response('TTS fetch failed', { status: 502 });
    }

    const audioData = await resp.arrayBuffer();

    return new Response(audioData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (e) {
    return new Response('TTS error: ' + e.message, { status: 500 });
  }
}
