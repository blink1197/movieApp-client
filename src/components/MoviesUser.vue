<script setup>
import api from '@/api/api';
import { onMounted, reactive } from 'vue';
import MovieCard from './MovieCard.vue';

const movies = reactive({ data: [] });
const loading = reactive({ state: true });

async function fetchAllMovies() {
  try {
    const { data } = await api.get('/movies/getMovies');
    movies.data = data.movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
  } finally {
    loading.state = false;
  }
}

onMounted(fetchAllMovies);
</script>

<template>
  <div class="container position-relative pt-5">
    <!-- Header -->
    <div class="row">
      <div class="col my-5 text-center">
        <h1 class="text-primary py-1 movies-title">Movies to watch</h1>
        <p class="tagline">Browse and leave comments!</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading.state" class="row g-4 mt-3">
      <div v-for="n in 6" :key="n" class="col-12 col-md-4">
        <div class="card shadow-sm p-3 border-0 placeholder-card">
          <div class="placeholder-img mb-3"></div>
          <div class="placeholder-line w-75 mb-2"></div>
          <div class="placeholder-line w-50"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="!loading.state && movies.data.length === 0" class="text-center py-5">
        <img src="/empty-box.png" alt="No Movies" width="120" class="mb-3" />
        <h5 class="text-muted">No movies available at the moment.</h5>
      </div>

      <!-- Movies Grid -->
      <TransitionGroup v-else name="fade-slide" tag="div" class="row g-4 mt-3">
        <MovieCard v-for="movie in movies.data" :key="movie._id" :movieData="movie" />
      </TransitionGroup>
    </Transition>

  </div>
</template>

<style scoped>
.text-primary {
  color: var(--color-primary) !important;
}

.movies-title {
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 2.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.tagline {
  font-size: 1.4rem;
  color: #555;
  margin-top: 0.5rem;
}

input.form-control {
  border-radius: 2rem;
  padding: 0.75rem 1.25rem;
}

/* Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Loading placeholders */
.placeholder-card {
  height: 100%;
  background: #fff;
  border-radius: 1rem;
}

.placeholder-img {
  width: 100%;
  height: 180px;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

.placeholder-line {
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

.btn-outline-primary {
  --bs-btn-color: var(--color-primary);
  --bs-btn-border-color: var(--color-primary);
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: var(--color-primary);
  --bs-btn-hover-border-color: var(--color-primary);
  --bs-btn-focus-shadow-rgb: 13, 110, 253;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: var(--color-primary);
  --bs-btn-active-border-color: var(--color-primary);
  --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  --bs-btn-disabled-color: var(--color-primary);
  --bs-btn-disabled-bg: transparent;
  --bs-btn-disabled-border-color: var(--color-primary);
  --bs-gradient: none;
  border-radius: 2rem !important;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
