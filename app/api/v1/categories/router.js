const express = require('express');
const router = express.Router();
const { create, index, find, update, destroy } = require('./controller');
const { authenticateUser, authorizeRoles } = require('../../../middleware/auth');

router.get('/categories', authenticateUser, index);
router.get('/categories/:id', find);
router.post('/categories', authenticateUser, create);
router.put('/categories/:id', update);
router.delete('/categories/:id', destroy);

module.exports = router;
