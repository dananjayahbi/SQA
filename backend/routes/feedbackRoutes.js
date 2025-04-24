const express = require('express');
const router = express.Router();
const { createFeedback } = require('../controllers/feedbackController');

router.post('/create', createFeedback);

module.exports = router;