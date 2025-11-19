<script setup>
import api from '@/api/api';
import { useUserStore } from '@/stores/user';
import { onBeforeMount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';


const { isLoggedIn } = useUserStore();
const route = useRoute();
const newComment = ref("");
const isLoading = ref(false);

async function submitComment() {

  try {
    isLoading.value = true
    const { data } = await api.patch(`/movies/addComment/${route.params.id}`, {
      comment: newComment.value
    })
    movie.data = data.updatedMovie;
    newComment.value = "";
  } catch (error) {
    console.error('Error fetching movie:', error)
    movie.error = true
  } finally {
    isLoading.value = false
  }
}

const movie = reactive({
  data: null,
  loading: true,
  error: false
})


function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}


onBeforeMount(async () => {
  try {
    const { data } = await api.get(`/movies/getMovie/${route.params.id}`)
    if (!data || Object.keys(data).length === 0) {
      movie.error = true
    } else {
      movie.data = data
    }
  } catch (err) {
    console.error('Error fetching movie:', err)
    movie.error = true
  } finally {
    movie.loading = false
  }
})
</script>

<template>
  <div class="container mt-5 py-5">
    <nav class="my-3" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/movies">Movies</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ movie.data ? movie.data.title : '...' }}
        </li>
      </ol>
    </nav>

    <!-- Loading State -->
    <div v-if="movie.loading" class="row mx-auto my-3 gap-4 gap-md-0">
      <!-- Image Skeleton -->
      <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <div class="skeleton skeleton-img w-100 rounded"></div>
      </div>

      <!-- Details Skeleton -->
      <div class="col-12 col-md-6">
        <div class="skeleton skeleton-title mb-3"></div>
        <div class="skeleton skeleton-text mb-2"></div>
        <div class="skeleton skeleton-text mb-2 w-75"></div>
        <div class="skeleton skeleton-price my-4 w-25"></div>
        <div class="skeleton skeleton-btn w-50"></div>
      </div>
    </div>

    <!-- Empty / Not Found State -->
    <div v-else-if="movie.error" class="text-center my-5">
      <img src="/empty-box.png" alt="Not found" width="120" class="mb-3 opacity-75" />
      <h5 class="text-muted mb-3">Movie not found or no longer available.</h5>
      <router-link to="/Movies" class="btn btn-outline-danger">
        Back to Movies
      </router-link>
    </div>

    <!-- Movie Details -->
    <div class="row mx-auto my-3 gap-4 gap-md-0" v-else>
      <!-- Product Image -->
      <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
        <img class="img-fluid rounded"
          :src="movie.data.posterUrl || `https://placehold.co/600x400/DC3545/ffffff?font=raleway&text=${encodeURIComponent(movie.data.title)}`"
          :alt="movie.data.title" />
      </div>

      <!-- Movie Details -->
      <div class="col-12 col-md-6">
        <div class="d-flex gap-2 text-danger">
          <h1 class="bi bi-camera-reels-fill"></h1>
          <h1 class="mb-3">{{ movie.data.title }}</h1>
        </div>
        <h6>Description:</h6>
        <p class="text-muted">{{ movie.data.description }}</p>
        <p>Year: {{ movie.data.year }}</p>
        <p>Genre: {{ movie.data.genre }}</p>
        <p>Director: {{ movie.data.director }}</p>
      </div>

      <!-- Movie Comments -->
      <div class="mt-3 mx-md-3">
        <h3 class="mb-3">Comments</h3>

        <!-- No Comments -->
        <div v-if="!movie.data.comments || movie.data.comments.length === 0" class="text-muted">
          No comments yet.
        </div>

        <!-- Comments List -->
        <div v-else class="list-group mb-4 comments">
          <div v-for="comment in movie.data.comments" :key="comment._id" class="list-group-item p-3">
            <div class="d-flex justify-content-between align-items-center fw-semibold">
              <div>
                <i class="bi bi-person-circle"></i>
                user#{{ comment.userId.slice(-6) }}
              </div>
              <small class="text-muted">{{ timeAgo(comment.createdAt) }}</small>
            </div>

            <div class="text-muted">
              {{ comment.comment }}
            </div>
          </div>
        </div>

        <!-- Login Prompt -->
        <router-link to="/login" class="btn btn-outline-danger mt-3" type="button" v-if="!isLoggedIn">
          Login to comment
        </router-link>

        <!-- Comment Box for Logged-In Users -->
        <div v-else class="mt-4 comments">
          <textarea class="form-control mb-2" rows="3" placeholder="Write a comment..." v-model="newComment"></textarea>

          <button class="btn btn-danger" :disabled="isLoading || !newComment.trim()" @click="submitComment">
            {{ isLoading ? 'Posting...' : 'Add Comment' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments {
  max-width: 800px;
}
</style>
