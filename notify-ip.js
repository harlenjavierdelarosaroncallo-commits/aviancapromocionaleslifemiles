export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // Obtener IP con cabecera proxy/CDN
  const xfwd = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(xfwd) ? xfwd[0] : (xfwd || '')).split(',')[0].trim() || req.socket?.remoteAddress || 'desconocida';

  const token = process.env.TELEGRAM_TOKEN;
  const chat  = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return res.status(500).send('Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID');

  const message = `Espejo ECUADOR\nIP: ${ip}`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: message })
    });
    return res.status(204).end();
  } catch (e) {
    console.error('Telegram error:', e);
    return res.status(502).send('Telegram error');
  }
}
