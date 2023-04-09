const express = require('express');
const router = express.Router();
const { createCMSOrganizer, createCMSUser } = require('./controller');
const { authenticateUser, authorizeRoles } = require('../../../middleware/auth');

router.post('/organizers', authenticateUser, authorizeRoles('owner'), createCMSOrganizer);
router.post('/users', authenticateUser, authorizeRoles('organizer'), createCMSUser);

module.exports = router;
