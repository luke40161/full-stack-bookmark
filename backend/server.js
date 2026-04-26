const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const Bookmark = require('./models/bookmark.model');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookmarks_db';

app.use(cors());
app.use(express.json());

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get(
  '/api/bookmarks',
  asyncHandler(async (req, res) => {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    res.json(bookmarks);
  }),
);

app.post(
  '/api/bookmarks',
  asyncHandler(async (req, res) => {
    const { title, link, description = '' } = req.body;

    if (!title || !link) {
      return res.status(400).json({
        message: 'Title and link are required.',
      });
    }

    if (!isValidUrl(link)) {
      return res.status(400).json({
        message: 'Please provide a valid URL.',
      });
    }

    Bookmark.create({
      title,
      link,
      description,
    });

    return res.status(201).json({ title, link, description });
  }),
);

app.put(
  '/api/bookmarks/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, link, description = '' } = req.body;

    if (!title || !link) {
      return res.status(400).json({
        message: 'Title and link are required.',
      });
    }

    if (!isValidUrl(link)) {
      return res.status(400).json({
        message: 'Please provide a valid URL.',
      });
    }

    const bookmark = await Bookmark.findByIdAndUpdate(
      id,
      { title, link, description },
      { new: true, runValidators: true },
    );

    if (!bookmark) {
      return res.status(404).json({
        message: 'Bookmark not found.',
      });
    }

    return res.json(bookmark);
  }),
);

app.delete(
  '/api/bookmarks/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const bookmark = await Bookmark.findByIdAndDelete(id);

    if (!bookmark) {
      return res.status(404).json({
        message: 'Bookmark not found.',
      });
    }

    return res.json({ message: 'Bookmark deleted successfully' });
  }),
);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message || 'Server error' });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
