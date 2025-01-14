<template>
  <div class="space-y-4">
    <div
      v-for="config in configurations"
      :key="config.id"
      class="flex items-center justify-between border p-4 rounded"
    >
      <div class="flex-1 space-y-1">
        <div><strong>Key:</strong> {{ config.key }}</div>
        <div><strong>Value:</strong> {{ config.value }}</div>
        <div><strong>Description:</strong> {{ config.description }}</div>
      </div>
      <div class="flex space-x-2">
        <button
          @click="editConfig(config)"
          class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          @click="deleteConfig(config.id)"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>

    <EditConfigModal
      v-if="selectedConfig"
      :config="selectedConfig"
      @save="saveConfig"
      @close="selectedConfig = null"
    />
  </div>
</template>

<script>
import EditConfigModal from './EditConfigModal.vue';

export default {
  name: 'ConfigList',
  components: { EditConfigModal },
  props: {
    configurations: Array,
  },
  data() {
    return {
      selectedConfig: null,
    };
  },
  methods: {
    editConfig(config) {
      this.selectedConfig = { ...config };
    },
    saveConfig(updatedConfig) {
      this.$emit('update', updatedConfig);
      this.selectedConfig = null;
    },
    deleteConfig(id) {
      this.$emit('delete', id);
    },
  },
};
</script>
