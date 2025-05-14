<template>
  <div class="login-bg">
    <div class="login-card">
      <h1 class="login-title">회원가입</h1>
      <p class="login-desc">TrustTrade에 오신 것을 환영합니다</p>
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="nickName">닉네임</label>
          <div class="nickname-input-group">
            <input
              type="text"
              id="nickName"
              v-model="nickName"
              required
              class="form-control"
              placeholder="닉네임을 입력하세요"
              :class="{ 'is-invalid': nicknameError }"
            />
            <button 
              type="button" 
              class="check-btn" 
              @click="checkNickname"
              :disabled="!nickName || isCheckingNickname"
            >
              {{ isCheckingNickname ? '확인 중...' : '중복확인' }}
            </button>
          </div>
          <div class="validation-message" v-if="nicknameError">
            {{ nicknameError }}
          </div>
          <div class="validation-message success" v-if="nicknameSuccess">
            {{ nicknameSuccess }}
          </div>
        </div>
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
        <button type="submit" class="login-btn" :disabled="loading || !isNicknameValidated">
          {{ loading ? '가입 중...' : '회원가입' }}
        </button>
        <div class="signup-link">
          이미 계정이 있으신가요? <router-link to="/auth/login">로그인</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from '@/api/axios';

export default defineComponent({
  name: 'Signup',
  setup() {
    const store = useStore();
    const router = useRouter();
    const nickName = ref('');
    const email = ref('');
    const password = ref('');
    const isCheckingNickname = ref(false);
    const nicknameError = ref('');
    const nicknameSuccess = ref('');
    const isNicknameValidated = ref(false);

    const loading = computed(() => store.getters['auth/isLoading']);
    const error = computed(() => store.getters['auth/authError']);

    const checkNickname = async () => {
      if (!nickName.value) return;
      
      try {
        isCheckingNickname.value = true;
        nicknameError.value = '';
        nicknameSuccess.value = '';
        
        const response = await axios.get(`/auth/nickName/validation?nickName=${nickName.value}`);
        
        if (response.data.data) {
          nicknameError.value = '이미 사용 중인 닉네임입니다.';
          isNicknameValidated.value = false;
        } else {
          nicknameSuccess.value = '사용 가능한 닉네임입니다.';
          isNicknameValidated.value = true;
        }
      } catch (err: any) {
        nicknameError.value = '닉네임 중복 확인 중 오류가 발생했습니다.';
        isNicknameValidated.value = false;
      } finally {
        isCheckingNickname.value = false;
      }
    };

    const handleSubmit = async () => {
      if (!isNicknameValidated.value) {
        nicknameError.value = '닉네임 중복 확인이 필요합니다.';
        return;
      }

      try {
        await store.dispatch('auth/signup', {
          nickName: nickName.value,
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
      nickName,
      password,
      loading,
      error,
      handleSubmit,
      checkNickname,
      isCheckingNickname,
      nicknameError,
      nicknameSuccess,
      isNicknameValidated
    };
  },
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

.nickname-input-group {
  display: flex;
  gap: 0.5rem;
}

.nickname-input-group .form-control {
  flex: 1;
}

.check-btn {
  padding: 0.75rem 1rem;
  background: var(--main-purple);
  color: var(--main-white);
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.check-btn:hover {
  background: var(--main-purple-dark);
}

.check-btn:disabled {
  background: #b7a6e7;
  cursor: not-allowed;
}

.validation-message {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #e74c3c;
}

.validation-message.success {
  color: #2ecc71;
}

.form-control.is-invalid {
  border-color: #e74c3c;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}
</style> 