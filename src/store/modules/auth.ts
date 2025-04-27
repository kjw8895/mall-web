interface AuthState {
  token: string | null;
  user: any | null;
}

const state: AuthState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null')
};

const getters = {
  isAuthenticated: (state: AuthState) => !!state.token,
  token: (state: AuthState) => state.token,
  currentUser: (state: AuthState) => state.user
};

const mutations = {
  SET_TOKEN(state: AuthState, token: string | null) {
    state.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  SET_USER(state: AuthState, user: any | null) {
    state.user = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
};

const actions = {
  login({ commit }: any, { token, user }: { token: string; user: any }) {
    commit('SET_TOKEN', token);
    commit('SET_USER', user);
  },
  logout({ commit }: any) {
    commit('SET_TOKEN', null);
    commit('SET_USER', null);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 