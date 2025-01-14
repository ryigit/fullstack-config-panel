<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Edit Configuration</h2>
      <form @submit.prevent="saveChanges">
        <div class="mb-4">
          <label class="block font-medium text-gray-700 mb-1">Key</label>
          <input
            v-model="editedConfig.key"
            type="text"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            readonly
          />
        </div>
        <div class="mb-4">
          <label class="block font-medium text-gray-700 mb-1">Value</label>
          <input
            v-model="editedConfig.value"
            type="text"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>
        <div class="mb-4">
          <label class="block font-medium text-gray-700 mb-1">Description</label>
          <input
            v-model="editedConfig.description"
            type="text"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditConfigModal',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editedConfig: { ...this.config }, // Create a copy to avoid directly mutating the prop
    };
  },
  methods: {
    saveChanges() {
      this.$emit('save', this.editedConfig);
    },
  },
};
</script>
