const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json());
app.use(cors());

app.get('/youtube-metadata', async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing video id" });

    try {
        const response = await fetch(`https://api.supadata.ai/v1/youtube/video?id=${id}`, {
            method: 'GET',
            headers: {
                'x-api-key': 'sd_be4080c12e19bd9d6663b684c880626e'
            }
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { error: "Invalid JSON from Supadata", raw: text };
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/youtube-transcript', async (req, res) => {
    const { url, videoId } = req.query;
    if (!url && !videoId) return res.status(400).json({ error: "Missing video URL or ID" });

    const queryParam = url ? `url=${encodeURIComponent(url)}` : `videoId=${videoId}`;

    try {
        const response = await fetch(`https://api.supadata.ai/v1/youtube/transcript?${queryParam}&text=true`, {
            method: 'GET',
            headers: {
                'x-api-key': 'sd_be4080c12e19bd9d6663b684c880626e'
            }
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { error: "Invalid JSON from Supadata", raw: text };
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
