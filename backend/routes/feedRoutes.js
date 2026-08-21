const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getFeed, createFeedPost } = require('../controllers/feedController');

// GET /api/v1/feed - Fetch feed posts
// Using verifyToken to ensure only authenticated users can see the feed (optional, remove if public)
router.get('/', verifyToken, getFeed);

// POST /api/v1/feed - Create a new feed post
router.post('/', verifyToken, createFeedPost);

module.exports = router;
