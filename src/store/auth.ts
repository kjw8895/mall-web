import { Module } from 'vuex';
import { authApi, LoginRequest, SignupRequest, AuthResponse } from '@/api/auth';

interface AuthState {
  token: string | null;
  user: {
    email: string;
    name: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const auth: Module<AuthState, any> = {
  namespaced: true,
  
  state: () => ({
    token: localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null,
  }),

  mutations: {
    SET_TOKEN(state, token: string) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    SET_USER(state, user: { email: string; name: string }) {
      state.user = user;
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
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const response = await authApi.login(credentials);
        const token = response.data.data.accessToken;
        commit('SET_TOKEN', token);
        
        // 사용자 정보는 토큰에서 추출하거나 별도 API로 가져올 수 있습니다
        // 여기서는 간단히 이메일만 저장합니다
        const email = credentials.email;
        commit('SET_USER', { email, name: email.split('@')[0] });
        
        return response.data;
      } catch (error: any) {
        commit('SET_ERROR', error.response?.data?.message || 'Login failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async signup({ commit }, userData: SignupRequest) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const response = await authApi.signup(userData);
        const token = response.data.data.accessToken;
        commit('SET_TOKEN', token);
        commit('SET_USER', { email: userData.email, name: userData.name });
        return response.data;
      } catch (error: any) {
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
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    authError: (state) => state.error,
    isLoading: (state) => state.loading,
  },
};

export default auth; 