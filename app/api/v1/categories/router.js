const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
  res.status(200).json({
    message: 'Halaman categories',
  })
});

module.exports = router;