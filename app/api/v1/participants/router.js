const express = require('express');
const {
  signup,
  signin,
  activeParticipant,
  getAllLandingPage,
  getDashboard,
  getDetailLandingPage,
} = require('./controller');

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.put('/active', activeParticipant);
router.get('/events', getAllLandingPage);
router.get('/events/:id', getDetailLandingPage);

module.exports = router;
