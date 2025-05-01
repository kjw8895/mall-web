import { Module } from 'vuex';
import { authApi, LoginRequest, SignupRequest, AuthResponse } from '@/api/auth';

interface AuthState {
  token: string | null;
  user: {
    email: string;
    name: string;
    userId: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const auth: Module<AuthState, any> = {
  namespaced: true,
  
  state: () => ({
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    loading: false,
    error: null,
  }),

  mutations: {
    SET_TOKEN(state, token: string) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    SET_USER(state, user: { email: string; nickName: string; userId: number; }) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_ERROR(state, error: string | null) {
      state.error = error;
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },

  actions: {
    async login({ commit }, credentials: LoginRequest) {
      try {
        console.log('Login attempt with credentials:', credentials);
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const response = await authApi.login(credentials);
        const token = response.data.data.accessToken;

        if (!token) {
          throw new Error('No token received from server');
        }

        commit('SET_TOKEN', token);
        
        // 사용자 정보는 토큰에서 추출하거나 별도 API로 가져올 수 있습니다
        // 여기서는 간단히 이메일만 저장합니다
        const email = credentials.email;
        commit('SET_USER', { email: email, nickName: response.data.data.nickName, userId:response.data.data.userId });
        
        return response.data;
      } catch (error: any) {
        console.error('Login error:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Login failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async signup({ commit }, userData: SignupRequest) {
      try {
        console.log('Signup attempt with data:', userData);
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const response = await authApi.signup(userData);

        return response.data;
      } catch (error: any) {
        console.error('Signup error:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Signup failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    logout({ commit }) {
      commit('CLEAR_AUTH');
    },
  },

  getters: {
    isAuthenticated: (state) => {
      const isAuth = !!state.token;
      return isAuth;
    },
    currentUser: (state) => state.user,
    authError: (state) => state.error,
    isLoading: (state) => state.loading,
  },
};

export default auth; 