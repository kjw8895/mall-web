<template>
  <div class="home">
    <h1>Welcome to Mall Web</h1>
    <div v-if="currentUser" class="user-info">
      <p>Welcome back, {{ currentUser.name }}!</p>
      <p>Your email: {{ currentUser.email }}</p>
    </div>
    <div v-else>
      <p>Please <router-link to="/auth/login">login</router-link> to continue.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Home',
  setup() {
    const store = useStore();
    const currentUser = computed(() => store.getters['auth/currentUser']);

    return {
      currentUser,
    };
  },
});
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.user-info {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: inline-block;
}

.user-info p {
  margin: 0.5rem 0;
}
</style> 