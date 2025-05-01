<template>
  <div class="default-layout">
    <header class="main-header">
      <div class="header-inner">
        <div class="logo">
          <router-link to="/">TrustTrade</router-link>
        </div>
        <nav class="main-nav">
          <router-link to="/products/list">중고거래</router-link>
          <router-link to="/auction/list">중고경매</router-link>
          <router-link to="/account/trade">판매/구매 목록</router-link>
          <router-link v-if="!isAuthenticated" to="/auth/login" class="nav-btn">로그인</router-link>
        </nav>
        <div class="header-user" v-if="isAuthenticated">
          <span class="user-name">
            {{ userName }}
            <span class="user-point">{{ point }}P</span>
            <button class="logout-btn-small" @click="handleLogout">로그아웃</button>
          </span>
        </div>
      </div>
    </header>
    <div class="main-container">
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from '@/api/axios'

export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const user = computed(() => store.getters['auth/currentUser']);
    const userName = computed(() => user.value?.nickName || user.value?.name || user.value?.email || '');
    const point = ref(0);

    const fetchPoint = async () => {
      try {
        const res = await axios.get('/point/total');
        point.value = res.data.data ?? 0;
      } catch {
        point.value = 0;
      }
    };

    onMounted(() => {
      if (isAuthenticated.value) fetchPoint();
    });

    const handleLogout = () => {
      store.dispatch('auth/logout');
      router.push('/auth/login');
    };

    return { isAuthenticated, userName, point, handleLogout };
  },
});
</script>

<style scoped>
.main-header {
  width: 100%;
  background: var(--main-white);
  box-shadow: 0 2px 8px 0 rgba(44,0,80,0.04);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 2rem;
}
.logo a {
  font-size: 2rem;
  font-weight: bold;
  color: var(--main-purple);
  letter-spacing: -1px;
}
.main-nav {
  display: flex;
  gap: 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  align-items: center;
}
.main-nav a {
  color: #222;
  padding: 0.5rem 0.7rem;
  border-radius: 8px;
  transition: background 0.2s;
}
.main-nav a.router-link-active {
  background: var(--main-purple-light);
  color: var(--main-white);
}
.nav-btn {
  background: var(--main-btn);
  color: var(--main-white);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 0.5rem;
}
.nav-btn:hover {
  background: var(--main-btn-hover);
}
.header-user {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--main-purple-dark);
}
.user-name {
  color: var(--main-purple);
  position: relative;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.user-point {
  color: #222;
  background: #f3eaff;
  border-radius: 999px;
  padding: 0.1rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 0.5rem;
  vertical-align: middle;
}
.logout-btn-small {
  background: #eee;
  color: #7f8c8d;
  border: none;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.1rem 0.9rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.logout-btn-small:hover {
  background: #e74c3c;
  color: #fff;
}

.main-container {
  display: flex;
  flex: 1;
}
.main-content {
  flex: 1;
  padding: 2rem;
  background: transparent;
  overflow-y: auto;
}
</style> 