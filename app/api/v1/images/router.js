const express = require('express');
const router = express.Router();
const { create } = require('./controller');

router.post('/categories', create);

module.exports = router;
