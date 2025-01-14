const admin = require('../utils/firebaseAdmin');
//const ConfigError = require('../errors/configError');
const firestore = admin.firestore();

/**
 * Fetch all configurations as an array.
 */
const getConfigurations = async () => {
    const configCollection = await firestore.collection('configurations').get();
    if (configCollection.empty) {
        throw new Error('Configuration not found');
    }

    return configCollection.docs.map(doc => ({
        id: doc.id, // Include document ID for updating/deleting.
        ...doc.data(),
    }));
};

/**
 * Add a new configuration.
 * @param {Object} config - The configuration to add.
 */
const addConfiguration = async (config) => {
    if (!config || typeof config !== 'object' || !config.key || !config.value) {
        throw new Error('Configuration must include a key and value');
    }

    // Remove any unexpected fields
    const sanitizedConfig = {
        key: config.key,
        value: config.value,
        description: config.description || '',
    };

    const configRef = firestore.collection('configurations').doc();
    await configRef.set(sanitizedConfig);
    return { id: configRef.id, ...config };
};

/**
 * Update an existing configuration by ID.
 * @param {string} id - The ID of the configuration to update.
 * @param {Object} updates - The updates to apply.
 */
const updateConfiguration = async (id, updates) => {
    if (!id || !updates || typeof updates !== 'object') {
        throw new Error('Invalid update parameters');
    }

    const configRef = firestore.collection('configurations').doc(id);
    const configDoc = await configRef.get();
    if (!configDoc.exists) {
        throw new Error('Configuration not found');
    }

    await configRef.update(updates);
    return { id, ...updates };
};

/**
 * Delete a configuration by ID.
 * @param {string} id - The ID of the configuration to delete.
 */
const deleteConfiguration = async (id) => {
    if (!id) {
        throw new Error('Invalid ID');
    }

    const configRef = firestore.collection('configurations').doc(id);
    const configDoc = await configRef.get();
    if (!configDoc.exists) {
        throw new Error('Configuration not found');
    }

    await configRef.delete();
    return { id };
};

module.exports = { getConfigurations, addConfiguration, updateConfiguration, deleteConfiguration };
