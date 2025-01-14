<template>
  <div class="w-full px-6 py-4">
    <!-- Logo and user section -->
    <div class="flex justify-between items-center mb-6">
      <div class="text-pink-500 text-2xl">▲</div>
      <div class="text-gray-400">
        <span class="cursor-pointer">👤</span>
      </div>
    </div>

    <!-- Parameters section -->
    <div class="bg-gray-800/50 rounded-lg p-6">
      <!-- Headers - Hide on mobile -->
      <div class="hidden md:grid md:grid-cols-[2fr_1fr_2fr_1fr_auto] md:gap-4 mb-4 text-gray-400">
        <div>Parameter Key</div>
        <div>Value</div>
        <div>Description</div>
        <div>Create Date</div>
        <div></div>
      </div>

      <div v-if="loading" class="text-gray-400 py-4">Loading...</div>

      <div v-else class="space-y-4">
        <!-- Mobile: Stack layout -->
        <div v-for="config in configurations" :key="config.id"
             class="bg-gray-700/30 rounded-lg p-4 md:p-0 md:bg-transparent
                    md:grid md:grid-cols-[2fr_1fr_2fr_1fr_auto] md:gap-4 md:items-center">
          <!-- Mobile: Card layout -->
          <div class="space-y-2 md:space-y-0">
            <div class="md:hidden text-sm text-gray-400">Parameter Key</div>
            <div class="text-gray-300">{{ config.key }}</div>
          </div>

          <div class="space-y-2 md:space-y-0 mt-2 md:mt-0">
            <div class="md:hidden text-sm text-gray-400">Value</div>
            <div class="text-gray-300">{{ config.value }}</div>
          </div>

          <div class="space-y-2 md:space-y-0 mt-2 md:mt-0">
            <div class="md:hidden text-sm text-gray-400">Description</div>
            <div class="text-gray-400">{{ config.description }}</div>
          </div>

          <div class="space-y-2 md:space-y-0 mt-2 md:mt-0">
            <div class="md:hidden text-sm text-gray-400">Create Date</div>
            <div class="text-gray-400">{{ formatTimestamp(config.createdAt) }}</div>
          </div>

          <div class="flex gap-2 mt-4 md:mt-0">
            <button @click="handleEdit(config)"
                    class="flex-1 md:flex-initial px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              Edit
            </button>
            <button @click="handleDelete(config.id)"
                    class="flex-1 md:flex-initial px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Add new parameter form -->
      <div class="mt-6 space-y-4 md:space-y-0 md:grid md:grid-cols-[2fr_1fr_2fr_auto] md:gap-4">
        <input
          v-model="newConfig.key"
          type="text"
          placeholder="New Parameter"
          class="w-full bg-gray-700/50 rounded px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          v-model="newConfig.value"
          type="text"
          placeholder="Value"
          class="w-full bg-gray-700/50 rounded px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <input
          v-model="newConfig.description"
          type="text"
          placeholder="New Description"
          class="w-full bg-gray-700/50 rounded px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          @click="handleAdd"
          class="w-full md:w-auto px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
        >
          ADD
        </button>
      </div>
    </div>
    <EditConfigModal
      v-if="selectedConfig"
      :config="selectedConfig"
      @save="updateConfig"
      @close="selectedConfig = null"
    />
  </div>
</template>

<script>
import EditConfigModal from './EditConfigModal.vue';

export default {
  name: 'ConfigurationManager',
  components: { EditConfigModal },
  data() {
    return {
      configurations: [],
      loading: true,
      error: null,
      selectedConfig: null,
      newConfig: {
        key: '',
        value: '',
        description: ''
      }
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      if (!timestamp) return 'Invalid Date'
      const date = new Date(timestamp._seconds * 1000)
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '')
    },
    async fetchConfigurations() {
      try {
        this.loading = true
        const response = await fetch('http://localhost:3000/api/config', {
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY
          }
        })
        if (!response.ok) throw new Error('Failed to fetch configurations')
        const result = await response.json()
        this.configurations = result.data // Access the data array from the response
      } catch (error) {
        console.error('Error fetching configurations:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async handleAdd() {
      if (!this.newConfig.key || !this.newConfig.value) return

      try {
        const response = await fetch('http://localhost:3000/api/config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify(this.newConfig)
        })

        if (!response.ok) throw new Error('Failed to add configuration')

        const result = await response.json()
        if (result.success && result.data) {
          // Add the new configuration to the list
          this.configurations.push(result.data)
          // Reset form fields
          this.newConfig = {
            key: '',
            value: '',
            description: ''
          }
        }
      } catch (error) {
        console.error('Error adding configuration:', error)
        alert(error.message)
      }
    },
    async handleEdit(config) {
      this.selectedConfig = { ...config };
    },
    async updateConfig(updatedConfig) {
      try {
        const response = await fetch(`http://localhost:3000/api/config/${updatedConfig.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify(updatedConfig)
        })

        if (!response.ok) throw new Error('Failed to update configuration')

        const result = await response.json()
        if (result.success && result.data) {
          const index = this.configurations.findIndex(config => config.id === updatedConfig.id)
          this.configurations.splice(index, 1, result.data)
          this.selectedConfig = null
        }
      } catch (error) {
        console.error('Error updating configuration:', error)
        alert(error.message)
      }
    },
    async handleDelete(id) {
      if (!confirm('Are you sure you want to delete this configuration?')) return

      try {
        const response = await fetch(`http://localhost:3000/api/config/${id}`, {
          method: 'DELETE',
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY
          }
        })

        if (!response.ok) throw new Error('Failed to delete configuration')

        this.configurations = this.configurations.filter(config => config.id !== id)
      } catch (error) {
        console.error(error)
        alert(error.message)
      }
    }
  },
  async created() {
    await this.fetchConfigurations()
  }
}
</script>
