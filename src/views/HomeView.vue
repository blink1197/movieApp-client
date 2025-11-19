<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goToMovies = () => {
  router.push('/movies');
};
</script>

<template>
  <main class="d-flex flex-column justify-content-center align-items-center text-center px-3 vh-100">
    <!-- Logo -->
    <img src="/logo.png" alt="Logo" class="mb-4" style="width: 300px; height: auto;" />

    <!-- Title -->
    <h1 class="mb-2">Movie Catalog</h1>

    <!-- Subtitle -->
    <p class="mb-4 text-muted">Browse movies and leave comments</p>

    <!-- Button -->
    <button class="btn btn-danger btn-lg" @click="goToMovies">
      Get Started
    </button>
  </main>
</template>

<style scoped>
main {
  max-width: 500px;
  margin: 0 auto;
}
</style>
