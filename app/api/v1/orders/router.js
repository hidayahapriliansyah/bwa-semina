const express = require('express');
const { index } = require('./controller');
const { authenticateUser, authorizeRoles } = require('../../../middleware/auth');

const router = express.Router();

router.get('/orders', authenticateUser, authorizeRoles('organizer', 'admin', 'owner'), index);

module.exports = router;
