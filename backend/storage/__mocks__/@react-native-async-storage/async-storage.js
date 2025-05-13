// backend/storage/__mocks__/@react-native-async-storage/async-storage.js
const mockAsyncStorage = (() => {
  let storage = {};

  return {
    setItem: async (key, value) => {
      storage[key] = value;
    },
    getItem: async (key) => {
      return storage[key] || null;
    },
    removeItem: async (key) => {
      delete storage[key];
    },
    clear: async () => {
      storage = {};
    },
    getAllKeys: async () => {
      return Object.keys(storage);
    },
  };
})();

export default mockAsyncStorage;