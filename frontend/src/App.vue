<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-blue-600 text-white">
      <div class="flex justify-between items-center px-6 py-4">
        <h1 class="text-xl font-medium">Configuration Manager</h1>
        <nav class="flex gap-8">
          <router-link to="/" class="text-green-300 hover:text-green-200">
            Home
          </router-link>
          <router-link to="/about" class="text-green-300 hover:text-green-200">
            About
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="min-h-[calc(100vh-4rem)]">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: rgb(17, 24, 39); /* bg-gray-900 */
}
</style>
