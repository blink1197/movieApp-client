<script setup>
import api from '@/api/api';
import { Notyf } from 'notyf';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import AddMovieModal from './AddMovieModal.vue';
import UpdateMovieModal from './UpdateMovieModal.vue';


const notyf = new Notyf();
const movies = reactive({ data: [] });
const loading = reactive({ state: true });
const isDeleting = ref(false);
const searchQuery = ref('');

const addModal = ref(null);
const updateModal = ref(null);


function openAddModal() {
  addModal.value.openModal();
}

function onUpdateMovie(movie, index) {
  updateModal.value.openModal(movie, index);
}

function addMovie(newMovie) {
  movies.data.push(newMovie);
}

function updateMovie(updatedData) {
  const index = updatedData.index;

  movies.data[index] = {
    ...movies.data[index],
    ...updatedData
  };
}


async function onDelete(updatedData) {
  isDeleting.value = true;
  try {
    await api.delete(`movies/deleteMovie/${movies.data[updatedData.index]._id}`);
    notyf.success('Movie successfully deleted.');
    movies.data.splice(updatedData.index, 1);
  } catch (error) {
    console.error('Error delete movie:', error);
    notyf.error('Failed to delete movie.');
  } finally {
    isDeleting.value = false;
  }
}



onBeforeMount(async () => {
  try {
    const { data } = await api.get('/movies/getMovies');
    movies.data = data.movies;
  } catch (error) {
    console.error('Error fetching movies:', error);
  } finally {
    loading.state = false;
  }
});

// Computed filtered list
const filteredMovies = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return movies.data;
  return movies.data.filter((p) => p.title?.toLowerCase().includes(query));
});

</script>

<template>
  <div class="container py-5 mt-5">
    <div class="d-flex justify-content-between flex-wrap mb-4 flex-column flex-sm-row align-items-start">
      <h1 class="h4 fw-bold text-dark mb-2">Movie Management</h1>
      <button class="btn btn-danger mb-2 mt-2 mt-md-0" @click="openAddModal">
        <i class="bi bi-plus-lg me-1"></i> Add Movie
      </button>
    </div>

    <!-- Search Input -->
    <div class="mb-3">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="Search movies by name..." />
    </div>

    <!-- Loading -->
    <div v-if="loading.state" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading movies...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!filteredMovies.length" class="text-center py-5">
      <img src="/empty-box.png" alt="No products" width="120" class="mb-3 opacity-75" />
      <p class="text-muted fs-5">No movies found</p>
    </div>

    <!-- Table layout for large screens -->
    <div v-else class="d-none d-md-block">
      <div class="card shadow-sm border-0">
        <div class="card-header bg-white fw-semibold fs-6">Movie List</div>

        <div class="table-responsive card-body">
          <table class="table align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Poster</th>
                <th>Name</th>
                <th>Description</th>
                <th>Year</th>
                <th>Director</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(movie, index) in filteredMovies" :key="movie._id" class="align-middle">
                <td>{{ index + 1 }}</td>
                <td>
                  <img :src="movie.posterUrl || 'https://placehold.co/50x50?text=No+Image'" alt="thumbnail"
                    class="rounded" style="width: 50px; height: 50px; object-fit: cover;" />
                </td>
                <td class="fw-semibold">
                  <router-link :to="{ path: `/movies/${movie._id}` }" target="_blank">
                    <i class="bi bi-box-arrow-up-right" title="View movie"></i>
                  </router-link>
                  {{ movie.title }}
                </td>
                <td class="text-muted text-truncate" style="max-width: 180px;">
                  {{ movie.description }}
                </td>
                <td class="fw-semibold">{{ movie.year }}</td>
                <td class="fw-semibold">{{ movie.director }}</td>
                <td class="text-center">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="onUpdateMovie(movie, index)" title="Update">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="onDelete({ index })" title="Disable">
                      <i class="bi bi-archive"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Card layout for mobile -->
    <div v-if="!loading.state && filteredMovies.length" class="row row-cols-1 row-cols-sm-2 g-3 d-md-none">
      <div v-for="(movie, index) in filteredMovies" :key="movie._id" class="col">
        <div class="card border-0 shadow-sm h-100">
          <img :src="movie.imageUrl || 'https://placehold.co/50x50?text=No+Image'" class="card-img-top"
            alt="movie Image" style="height: 160px; object-fit: cover;" />
          <div class="card-body">
            <h6 class="fw-bold mb-1">
              <router-link :to="{ path: `/movies/${movie._id}` }" target="_blank">
                <i class="bi bi-box-arrow-up-right" title="View movie"></i>
              </router-link>
              {{ movie.title }}
            </h6>
            <p class="text-muted small mb-2">{{ movie.description }}</p>
            <p class="fw-semibold text-success mb-2">{{ movie.year }}</p>
            <p class="fw-semibold text-success mb-2">{{ movie.director }}</p>
          </div>
          <div class="card-footer bg-transparent border-0 pt-0">
            <div class="d-flex justify-content-between">
              <button class="btn btn-sm btn-outline-primary w-100 me-1" @click="onUpdateMovie(movie, index)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger w-100 ms-1" @click="onDelete({ index })">
                <i class="bi bi-archive"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddMovieModal ref="addModal" @add="addMovie" />
    <UpdateMovieModal ref="updateModal" @update="updateMovie" />

  </div>
</template>

<style scoped>
.status-data {
  max-width: 60px !important;
}

.text-muted {
  color: #6c757d !important;
}

.opacity-75 {
  opacity: 0.75;
}
</style>
