const express = require('express');
const { signup, signin, activeParticipant } = require('./controller');

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.post('/active', activeParticipant);

module.exports = router;
