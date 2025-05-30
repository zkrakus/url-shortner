const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());

const store = {}; // key: shortId, value: { longUrl, createdAt, hits }

function generateShortId(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Cleanup expired entries every hour
setInterval(() => {
  const now = Date.now();
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  for (const key in store) {
    if (now - store[key].createdAt > oneYear) {
      delete store[key];
    }
  }
}, 1000 * 60 * 60);

// POST /shorten → returns short URL
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  let shortId;
  do {
    shortId = generateShortId();
  } while (store[shortId]);

  store[shortId] = {
    longUrl: url,
    createdAt: Date.now(),
    hits: 0,
  };

  res.json({ shortUrl: `http://localhost:${PORT}/${shortId}` });
});

// GET /:shortId → redirects if exists and not expired
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const entry = store[shortId];

  if (!entry || Date.now() - entry.createdAt > 365 * 24 * 60 * 60 * 1000) {
    return res.status(404).send('Not found or expired');
  }

  entry.hits++;
  res.redirect(301, entry.longUrl);
});

// Optional: GET /stats/:shortId → return usage info
app.get('/stats/:shortId', (req, res) => {
  const { shortId } = req.params;
  const entry = store[shortId];

  if (!entry) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json({
    longUrl: entry.longUrl,
    createdAt: new Date(entry.createdAt).toISOString(),
    hits: entry.hits,
  });
});

app.listen(PORT, () => {
  console.log(`Express URL shortener running on http://localhost:${PORT}`);
});