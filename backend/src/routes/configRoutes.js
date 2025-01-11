const express = require('express');
const configController = require('../controllers/configController');
const authenticateWithApiKey = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes
router.get('/', configController.getConfigurations); // For mobile clients
router.post('/update', authenticateWithApiKey, configController.updateConfigurations);

module.exports = router;
