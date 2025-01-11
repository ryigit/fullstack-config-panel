const admin = require('../utils/firebaseAdmin');
const firestore = admin.firestore();

const getConfigurations = async () => {
    const configDoc = await firestore.collection('configurations').doc('appConfig').get();
    if (!configDoc.exists) {
        throw new Error('Configuration not found');
    }
    return configDoc.data();
};

const updateConfigurations = async (parameters) => {
    if (!parameters || typeof parameters !== 'object') {
        throw new Error('Invalid parameters');
    }
    await firestore.collection('configurations').doc('appConfig').set(parameters, { merge: true });
};

module.exports = { getConfigurations, updateConfigurations };
