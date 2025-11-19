import api from '@/api/api'; // your axios instance
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWorkoutStore = defineStore('workout', () => {
  const workouts = ref([])

  // Fetch workouts from backend
  const fetchWorkouts = async () => {
    try {
      const response = await api.get('/workouts/getMyWorkouts')
      workouts.value = response.data.workouts // adjust based on your API response
      return Promise.resolve(workouts.value)
    } catch (error) {
      console.error('Error fetching workouts:', error)
      return Promise.reject(error)
    }
  }

  // Add workout
  const addWorkout = async (newWorkout) => {
    try {
      const response = await api.post('/workouts/addWorkout', newWorkout)
      const savedWorkout = response.data || { id: Date.now(), ...newWorkout } // fallback
      workouts.value.push(savedWorkout)
      return Promise.resolve({ ...savedWorkout, success: true });
    } catch (error) {
      console.error('Error adding workout:', error)
      return Promise.reject(error)
    }
  }

  // Update workout
  const updateWorkout = async (id, updatedWorkout) => {
    try {
      const response = await api.patch(`/workouts/updateWorkout/${id}`, updatedWorkout)
      const savedWorkout = response.data.updateWorkout || updatedWorkout // fallback

      const index = workouts.value.findIndex(w => w._id === id)
      if (index !== -1) {
        workouts.value[index] = { ...workouts.value[index], ...savedWorkout }
      }

      return Promise.resolve(workouts.value[index])
    } catch (error) {
      console.error('Error updating workout:', error)
      return Promise.reject(error)
    }
  }

  // Delete workout
  const deleteWorkout = async (id) => {
    try {
      await api.delete(`/workouts/deleteWorkout/${id}`)
      workouts.value = workouts.value.filter(w => w._id !== id)
      return Promise.resolve({ success: true })
    } catch (error) {
      console.error('Error deleting workout:', error)
      return Promise.reject(error)
    }
  }

  // Mark workout as complete
  const completeWorkout = async (id) => {
    try {
      const response = await api.patch(`/workouts/completeWorkoutStatus/${id}`)
      const updatedWorkout = response.data.updatedWorkout

      // Update local state
      const index = workouts.value.findIndex(w => w._id === id)
      if (index !== -1) {
        workouts.value[index] = { ...workouts.value[index], ...updatedWorkout }
      }

      return Promise.resolve({ ...updatedWorkout, success: true })
    } catch (error) {
      console.error('Error completing workout:', error)
      return Promise.reject(error)
    }
  }

  return { workouts, fetchWorkouts, addWorkout, updateWorkout, deleteWorkout, completeWorkout }
})
