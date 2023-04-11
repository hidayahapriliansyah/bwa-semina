const express = require('express');
const { signup, activeParticipant } = require('./controller');

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/active', activeParticipant);

module.exports = router;