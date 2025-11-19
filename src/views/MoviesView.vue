<template>
  <div>
    <MoviesAdmin v-if="user.isAdmin" />
    <MoviesUser v-else />
  </div>
</template>


<script setup>
import MoviesAdmin from '@/components/MoviesAdmin.vue';
import MoviesUser from '@/components/MoviesUser.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { user } = userStore;
</script>
