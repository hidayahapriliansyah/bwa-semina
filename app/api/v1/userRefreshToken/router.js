const express = require('express');
const { index } = require('./controller');

const router = express.Router();

router.get('/refresh-token/:refreshToken/:email', index);

module.exports = router;
