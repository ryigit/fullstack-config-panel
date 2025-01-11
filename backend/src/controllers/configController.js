const configService = require('../services/configService');

const getConfigurations = async (req, res) => {
    try {
        const configurations = await configService.getConfigurations();
        res.json(configurations);
    } catch (error) {
        console.error('Error fetching configurations:', error);
        res.status(500).json({ message: 'Error fetching configurations', error: error.message });
    }
};

const updateConfigurations = async (req, res) => {
    try {
        const { parameters } = req.body;
        await configService.updateConfigurations(parameters);
        res.status(200).json({ message: 'Configuration updated successfully' });
    } catch (error) {
        console.error('Error updating configurations:', error);
        res.status(500).json({ message: 'Error updating configurations', error: error.message });
    }
};

module.exports = { getConfigurations, updateConfigurations };
