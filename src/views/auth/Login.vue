<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="form-control"
        />
      </div>
      <div class="error" v-if="error">{{ error }}</div>
      <button type="submit" class="btn" :disabled="loading">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
      <p class="signup-link">
        Don't have an account?
        <router-link to="/auth/signup">Sign up</router-link>
      </p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const loading = computed(() => store.getters['auth/isLoading']);
    const error = computed(() => store.getters['auth/authError']);

    const handleSubmit = async () => {
      try {
        await store.dispatch('auth/login', {
          email: email.value,
          password: password.value,
        });
        router.push('/');
      } catch (err) {
        // Error is handled by the store
      }
    };

    return {
      email,
      password,
      loading,
      error,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
.login {
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.form-control {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  font-size: 0.875rem;
}

.signup-link {
  margin-top: 1rem;
  font-size: 0.875rem;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style> 