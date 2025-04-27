<template>
  <aside class="sidebar">
    <nav class="nav-menu">
      <router-link to="/" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">홈</span>
      </router-link>
      
      <router-link to="/products/list" class="nav-item">
        <span class="nav-icon">🛍️</span>
        <span class="nav-text">상품 목록</span>
      </router-link>
      
      <div class="nav-section">
        <h3 class="section-title">내 계정</h3>
        <router-link to="/account/selling" class="nav-item">
          <span class="nav-icon">📦</span>
          <span class="nav-text">판매 목록</span>
        </router-link>
        <router-link to="/account/buying" class="nav-item">
          <span class="nav-icon">🛒</span>
          <span class="nav-text">구매 목록</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sidebar'
});
</script>

<style scoped>
.sidebar {
  background-color: white;
  border-right: 1px solid #eee;
  height: 100%;
  padding: 20px 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-section {
  margin-top: 20px;
}

.section-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #7f8c8d;
  padding: 0 20px;
  margin-bottom: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #f8f9fa;
}

.nav-item.router-link-active {
  background-color: #e3f2fd;
  color: #3498db;
  font-weight: 500;
}

.nav-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.nav-text {
  font-size: 0.95rem;
}
</style> 