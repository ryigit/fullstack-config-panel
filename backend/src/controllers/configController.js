const {
    getConfigurations,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
} = require('../services/configService'); // Adjust the path as needed

/**
 * Controller to fetch all configurations.
 */
const fetchConfigurations = async (req, res) => {
    try {
        const configurations = await getConfigurations();
        res.status(200).json({ success: true, data: configurations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Controller to add a new configuration.
 */
const createConfiguration = async (req, res) => {
    try {
        const { key, value, description } = req.body;

        if (!key || !value) {
            return res.status(400).json({
                success: false,
                message: 'Key and value are required.',
            });
        }

        const newConfig = await addConfiguration({
            key,
            value,
            description: description || '', // Optional description
            createdAt: new Date(),
        });

        res.status(201).json({ success: true, data: newConfig });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Controller to update an existing configuration.
 */
const updateConfigurationById = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id || !updates) {
            return res.status(400).json({
                success: false,
                message: 'ID and updates are required.',
            });
        }

        const updatedConfig = await updateConfiguration(id, updates);

        res.status(200).json({ success: true, data: updatedConfig });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Controller to delete a configuration.
 */
const deleteConfigurationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID is required.',
            });
        }

        const deletedConfig = await deleteConfiguration(id);

        res.status(200).json({ success: true, data: deletedConfig });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    fetchConfigurations,
    createConfiguration,
    updateConfigurationById,
    deleteConfigurationById,
};