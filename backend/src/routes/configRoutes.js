const express = require('express');
const router = express.Router();
const {
    fetchConfigurations,
    createConfiguration,
    updateConfigurationById,
    deleteConfigurationById,
} = require('../controllers/configController'); // Adjust the path as needed

// Route to fetch all configurations
router.get('/', fetchConfigurations);

// Route to add a new configuration
router.post('/', createConfiguration);

// Route to update an existing configuration by ID
router.put('/:id', updateConfigurationById);

// Route to delete a configuration by ID
router.delete('/:id', deleteConfigurationById);

module.exports = router;