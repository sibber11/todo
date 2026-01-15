<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <h2 class="text-3xl font-bold text-center text-slate-800 mb-8">
        Register
      </h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700"
            >Username</label
          >
          <input
            v-model="username"
            type="text"
            required
            class="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform active:scale-95"
        >
          Sign Up
        </button>
      </form>
      <p class="mt-6 text-center text-slate-600">
        Already have an account?
        <router-link to="/login" class="text-indigo-600 hover:underline"
          >Login</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    await auth.register(username.value, password.value);
    alert("Registration successful! Please login.");
    router.push("/login");
  } catch (err) {
    alert("Username already exists");
  }
};
</script>
