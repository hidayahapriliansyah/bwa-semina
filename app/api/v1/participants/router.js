const express = require('express');
const {
  signup,
  signin,
  activeParticipant,
  getAllLandingPage,
  getDashboard,
  getDetailLandingPage,
  checkout,
} = require('./controller');
const { authenticateParticipant } = require('../../../middleware/auth');

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.put('/active', activeParticipant);
router.get('/events', getAllLandingPage);
router.get('/events/:id', getDetailLandingPage);
router.get('/orders', authenticateParticipant, getDashboard);
router.post('/checkout', authenticateParticipant, checkout);

module.exports = router;
