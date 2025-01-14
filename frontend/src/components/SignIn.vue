<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-4">Sign In</h1>
      <form @submit.prevent="handleSignIn">
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded mb-3"
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          class="w-full px-4 py-2 border rounded mb-3"
        />
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { login } from '../store/auth';

export default {
  name: 'SignIn',
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async handleSignIn() {
      try {
        console.log('Signing in...');
        this.error = null;
        await login(this.email, this.password)
        this.$router.push('/home'); // Redirect to homepage on success
      } catch (err) {
        this.error = err;
      }
    },
  },
};
</script>
