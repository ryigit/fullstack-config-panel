<template>
  <form @submit.prevent="addConfig" class="mt-6 space-y-4">
    <input
      v-model="newConfig.key"
      type="text"
      placeholder="Key"
      class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
    />
    <input
      v-model="newConfig.value"
      type="text"
      placeholder="Value"
      class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
    />
    <input
      v-model="newConfig.description"
      type="text"
      placeholder="Description"
      class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
    />
    <button
      type="submit"
      class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
    >
      Add Configuration
    </button>
  </form>
</template>

<script>
export default {
  name: 'AddConfigForm',
  data() {
    return {
      newConfig: {
        key: '',
        value: '',
        description: '',
      },
    };
  },
  methods: {
    addConfig() {
      this.$emit('add', this.newConfig);
      this.newConfig = { key: '', value: '', description: '' };
    },
  },
};
</script>
