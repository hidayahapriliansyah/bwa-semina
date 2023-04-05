const express = require('express');
const router = express.Router();
const { create, index, find, update } = require('./controller');

router.get('/categories', index);
router.get('/categories/:id', find);
router.post('/categories', create);
router.put('/categories/:id', update);

module.exports = router;
