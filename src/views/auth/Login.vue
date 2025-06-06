<template>
  <div class="login-bg">
    <div class="login-card">
      <h1 class="login-title">로그인</h1>
      <p class="login-desc">TrustTrade에 오신 것을 환영합니다</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">이메일</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            class="form-control"
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            class="form-control"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
        <div class="signup-link">
          계정이 없으신가요? <router-link to="/auth/signup">회원가입</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');
    
    const handleLogin = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        await store.dispatch('auth/login', {
          email: email.value,
          password: password.value
        });

        // 홈 페이지로 이동
        router.push('/');
      } catch (err: any) {
        console.error('Login error:', err);
        error.value = err.response?.data?.message || err.message || '로그인에 실패했습니다.';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      email,
      password,
      loading,
      error,
      handleLogin
    };
  }
});
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--main-bg-gradient);
}

.login-card {
  background: var(--main-white);
  border-radius: 24px;
  box-shadow: var(--main-shadow);
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-title {
  color: var(--main-purple);
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
}

.login-desc {
  color: var(--main-purple-light);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  text-align: center;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group label {
  color: var(--main-purple-dark);
  font-weight: 500;
  margin-bottom: 0.3rem;
  display: block;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--main-border);
  font-size: 1rem;
  background: var(--main-gray);
  color: #222;
  margin-top: 0.2rem;
}

.form-control:focus {
  outline: none;
  border-color: var(--main-purple);
  box-shadow: 0 0 0 2px var(--main-purple-light);
}

.login-btn {
  width: 100%;
  background: var(--main-btn);
  color: var(--main-white);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.9rem 0;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.login-btn:disabled {
  background: #b7a6e7;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  background: #fdf0ed;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 0.95rem;
}

.signup-link {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--main-purple-dark);
  font-size: 1rem;
}
.signup-link a {
  color: var(--main-purple);
  font-weight: 600;
  text-decoration: none;
}
.signup-link a:hover {
  text-decoration: underline;
}
</style> 