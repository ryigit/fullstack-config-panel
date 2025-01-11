// Mock the firebase-admin module with complete credential structure
jest.mock('firebase-admin', () => {
    // Create mock functions that maintain chainability
    const mockDoc = jest.fn();
    const mockCollection = jest.fn(() => ({
        doc: mockDoc
    }));

    const mockFirestore = jest.fn(() => ({
        collection: mockCollection
    }));

    return {
        initializeApp: jest.fn(),
        credential: {
            cert: jest.fn()
        },
        firestore: mockFirestore
    };
});

// Mock the service account import
jest.mock('../../firebase-service-account.json', () => ({
    type: 'service_account',
    project_id: 'mock-project',
    private_key_id: 'mock-key-id'
}));

const admin = require('firebase-admin');

// Import the service after mocking firebase-admin
const { getConfigurations, updateConfigurations } = require('../../src/services/configService');

describe('Configuration Service', () => {
    let mockDocRef;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a mock document reference with get and set methods
        mockDocRef = {
            get: jest.fn(),
            set: jest.fn()
        };

        // Setup the document mock to return our mockDocRef
        admin.firestore().collection().doc.mockReturnValue(mockDocRef);
    });

    describe('getConfigurations', () => {
        it('should return configuration data when document exists', async () => {
            const mockConfigData = {
                setting1: 'value1',
                setting2: 'value2',
            };

            // Mock the get() response with proper document snapshot structure
            mockDocRef.get.mockResolvedValueOnce({
                exists: true,
                data: () => mockConfigData,
            });

            const result = await getConfigurations();

            expect(result).toEqual(mockConfigData);
            expect(admin.firestore().collection).toHaveBeenCalledWith('configurations');
            expect(admin.firestore().collection().doc).toHaveBeenCalledWith('appConfig');
        });

        it('should throw error when configuration document does not exist', async () => {
            mockDocRef.get.mockResolvedValueOnce({
                exists: false,
                data: () => null,
            });

            await expect(getConfigurations()).rejects.toThrow('Configuration not found');
        });

        it('should propagate firestore errors', async () => {
            mockDocRef.get.mockRejectedValueOnce(new Error('Firestore error'));

            await expect(getConfigurations()).rejects.toThrow('Firestore error');
        });
    });

    describe('updateConfigurations', () => {
        it('should successfully update configurations with valid parameters', async () => {
            const mockParams = {
                setting1: 'new value1',
                setting2: 'new value2',
            };

            mockDocRef.set.mockResolvedValueOnce();

            await updateConfigurations(mockParams);

            expect(admin.firestore().collection).toHaveBeenCalledWith('configurations');
            expect(admin.firestore().collection().doc).toHaveBeenCalledWith('appConfig');
            expect(mockDocRef.set).toHaveBeenCalledWith(mockParams, { merge: true });
        });

        it('should throw error when parameters are null', async () => {
            await expect(updateConfigurations(null)).rejects.toThrow('Invalid parameters');
        });

        it('should throw error when parameters are not an object', async () => {
            await expect(updateConfigurations('string')).rejects.toThrow('Invalid parameters');
        });

        it('should propagate firestore errors during update', async () => {
            mockDocRef.set.mockRejectedValueOnce(new Error('Firestore update error'));

            await expect(updateConfigurations({ test: 'value' })).rejects.toThrow('Firestore update error');
        });
    });
});