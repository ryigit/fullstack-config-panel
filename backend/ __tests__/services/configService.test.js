// Mock firebase-admin
jest.mock('../../src/utils/firebaseAdmin', () => {
    const mockGet = jest.fn();
    const mockSet = jest.fn();
    const mockUpdate = jest.fn();
    const mockDelete = jest.fn();

    const mockDoc = jest.fn(() => ({
        get: mockGet,
        set: mockSet,
        update: mockUpdate,
        delete: mockDelete,
        id: 'mock-id'
    }));

    const mockCollection = jest.fn(() => ({
        doc: mockDoc,
        get: mockGet
    }));

    return {
        firestore: jest.fn(() => ({
            collection: mockCollection
        }))
    };
});

const {
    getConfigurations,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration
} = require('../../src/services/configService');

describe('Configuration Service', () => {
    let mockFirestore;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFirestore = require('../../src/utils/firebaseAdmin').firestore();
    });

    describe('getConfigurations', () => {
        it('should return all configurations when documents exist', async () => {
            const mockDocs = [
                {
                    id: 'config1',
                    data: () => ({ key: 'setting1', value: 'value1' })
                },
                {
                    id: 'config2',
                    data: () => ({ key: 'setting2', value: 'value2' })
                }
            ];

            mockFirestore.collection().get.mockResolvedValue({
                empty: false,
                docs: mockDocs
            });

            const result = await getConfigurations();

            expect(result).toEqual([
                { id: 'config1', key: 'setting1', value: 'value1' },
                { id: 'config2', key: 'setting2', value: 'value2' }
            ]);
            expect(mockFirestore.collection).toHaveBeenCalledWith('configurations');
        });

        it('should throw ConfigError when no configurations exist', async () => {
            mockFirestore.collection().get.mockResolvedValue({ empty: true });

            // Or if you want to be more specific:
            await expect(getConfigurations())
                .rejects
                .toThrow('Configuration not found');
        });
    });

    describe('addConfiguration', () => {
        it('should add new configuration with valid data', async () => {
            const newConfig = { key: 'newKey', value: 'newValue' };

            const result = await addConfiguration(newConfig);

            expect(result).toEqual({
                id: 'mock-id',
                ...newConfig
            });
            expect(mockFirestore.collection).toHaveBeenCalledWith('configurations');
        });

        it('should throw error when config is invalid', async () => {
            const invalidConfigs = [
                null,
                {},
                { key: 'only-key' },
                { value: 'only-value' },
                'not-an-object'
            ];

            for (const config of invalidConfigs) {
                await expect(addConfiguration(config))
                    .rejects
                    .toThrow('Configuration must include a key and value');
            }
        });
    });

    describe('updateConfiguration', () => {
        it('should update existing configuration', async () => {
            const updates = { value: 'updatedValue' };

            mockFirestore.collection().doc().get.mockResolvedValue({
                exists: true
            });

            const result = await updateConfiguration('config1', updates);

            expect(result).toEqual({
                id: 'config1',
                ...updates
            });
            expect(mockFirestore.collection).toHaveBeenCalledWith('configurations');
            expect(mockFirestore.collection().doc).toHaveBeenCalledWith('config1');
        });

        it('should throw error when configuration does not exist', async () => {
            mockFirestore.collection().doc().get.mockResolvedValue({
                exists: false
            });

            await expect(updateConfiguration('non-existent', { value: 'test' }))
                .rejects
                .toThrow('Configuration not found');
        });

        it('should throw error with invalid parameters', async () => {
            const invalidCases = [
                [null, { value: 'test' }],
                ['id', null],
                ['id', 'not-an-object']
            ];

            for (const [id, updates] of invalidCases) {
                await expect(updateConfiguration(id, updates))
                    .rejects
                    .toThrow('Invalid update parameters');
            }
        });
    });

    describe('deleteConfiguration', () => {
        it('should delete existing configuration', async () => {
            mockFirestore.collection().doc().get.mockResolvedValue({
                exists: true
            });

            const result = await deleteConfiguration('config1');

            expect(result).toEqual({ id: 'config1' });
            expect(mockFirestore.collection).toHaveBeenCalledWith('configurations');
            expect(mockFirestore.collection().doc).toHaveBeenCalledWith('config1');
        });

        it('should throw error when configuration does not exist', async () => {
            mockFirestore.collection().doc().get.mockResolvedValue({
                exists: false
            });

            await expect(deleteConfiguration('non-existent'))
                .rejects
                .toThrow('Configuration not found');
        });

        it('should throw error with invalid id', async () => {
            await expect(deleteConfiguration(null))
                .rejects
                .toThrow('Invalid ID');
        });
    });
});