<script setup>
import api from "@/api/api";
import { Modal } from "bootstrap";
import { Notyf } from "notyf";
import { computed, ref } from "vue";


const notyf = new Notyf();
const modalElement = ref(null);
let modalInstance = null;
const isLoading = ref(false);
const movieToUpdate = ref(null);
const movieIndex = ref(null);

const form = ref({
  title: "",
  description: "",
  year: 0,
  director: "",
  genre: "",
  imageUrl: "",
});

const isFormValid = computed(() => {
  return (
    form.value.title.trim() !== "" &&
    form.value.description.trim() !== "" &&
    form.value.year > 0
  );
});

const emit = defineEmits(["update"]);

function openModal(movie, index) {
  form.value = { ...movie };
  movieToUpdate.value = { ...movie };
  movieIndex.value = index;

  modalInstance = new Modal(modalElement.value);
  modalInstance.show();
}

function closeModal() {
  modalInstance?.hide();
}

async function handleSubmit() {
  if (!isFormValid.value) {
    notyf.error("Please fill out all fields before submitting.");
    return;
  }

  isLoading.value = true;
  try {
    await api.patch(`/movies/updateMovie/${movieToUpdate.value._id}`, { ...form.value });
    notyf.success('Movie successfully updated.');

    emit("update", { ...form.value, index: movieIndex.value });

    closeModal();

    // Reset form
    form.value = {
      title: "",
      description: "",
      year: 0,
      director: "",
      genre: "",
      imageUrl: "",
    };

  } catch (error) {
    console.error('Error updating movie:', error);
    notyf.error('Failed to update movie.');
  } finally {
    isLoading.value = false;
  }
}

defineExpose({ openModal, closeModal });
</script>

<template>
  <div class="modal fade" ref="modalElement" id="addMovieModal" tabindex="-1" aria-labelledby="addMovieModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title" id="addMovieModalLabel">Update Movie</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="mb-3">
              <label for="title" class="form-label">Movie title</label>
              <input v-model="form.title" type="text" class="form-control" id="title" placeholder="Enter movie title"
                required />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea v-model="form.description" class="form-control" id="description" rows="3"
                placeholder="Enter movie description" required></textarea>
            </div>

            <div class="mb-3">
              <label for="year" class="form-label">Year</label>
              <input v-model.number="form.year" type="number" class="form-control" id="year" placeholder="Enter year"
                min="0" required />
            </div>

            <div class="mb-3">
              <label for="genre" class="form-label">Movie genre</label>
              <input v-model="form.genre" type="text" class="form-control" id="genre" placeholder="Enter movie genre"
                required />
            </div>

            <div class="mb-3">
              <label for="director" class="form-label">Movie director</label>
              <input v-model="form.director" type="text" class="form-control" id="director"
                placeholder="Enter movie director" required />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading || !isFormValid">
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
