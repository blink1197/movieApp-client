<template>
  <div class="col-12 col-md-6 col-lg-4 my-3">
    <div class="card p-2 cardHighlights shadow-sm" style="min-height: 100%">

      <img class="card-img-top movie-image"
        :src="props.movieData.posterUrl || `https://placehold.co/600x400/DC3545/ffffff?font=raleway&text=${encodeURIComponent(props.movieData.title)}`"
        :alt="props.movieData.title">

      <div class="card-body d-flex flex-column justify-content-between">

        <div>
          <h4 class="card-title fw-bold mb-2">{{ props.movieData.title }}</h4>

          <p class="card-text text-muted mb-2">
            {{ props.movieData.description?.slice(0, 100) }}{{ props.movieData.description?.length > 100 ? "..." : "" }}
          </p>

          <p class="mb-1">
            <span class="fw-semibold">Year:</span> {{ props.movieData.year }}
          </p>

          <p class="mb-1">
            <span class="fw-semibold">Director:</span> {{ props.movieData.director }}
          </p>

          <p class="mb-1">
            <span class="fw-semibold">Genre:</span> {{ props.movieData.genre }}
          </p>
        </div>

        <router-link class="btn btn-outline-primary d-block mt-3" :to="`/movies/${props.movieData._id}`">
          View Movie
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movieData: Object,
});
</script>


<style scoped>
.movie-image {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  border-radius: 0.25rem;
  display: block;
}
</style>
