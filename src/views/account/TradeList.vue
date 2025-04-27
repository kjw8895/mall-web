<template>
  <div class="trade-list-container">
    <div class="trade-tabs">
      <button :class="['trade-tab', {active: currentTab === 'selling'}]" @click="currentTab = 'selling'">판매 목록</button>
      <button :class="['trade-tab', {active: currentTab === 'buying'}]" @click="currentTab = 'buying'">구매 목록</button>
    </div>
    <div class="trade-content">
      <div v-if="currentTab === 'selling'">
        <SellingList ref="sellingListRef" :showAddButton="true" @add-product="showProductModal = true" />
      </div>
      <div v-else>
        <BuyingList />
      </div>
    </div>
    <div v-if="showProductModal" class="modal">
      <div class="modal-content">
        <ProductCreate @close="showProductModal = false" @registered="refreshSellingList" />
        <button class="modal-close" @click="showProductModal = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SellingList from './SellingList.vue';
import BuyingList from './BuyingList.vue';
import ProductCreate from '@/views/products/ProductCreate.vue';

const currentTab = ref<'selling' | 'buying'>('selling');
const showProductModal = ref(false);
const sellingListRef = ref();

function refreshSellingList() {
  showProductModal.value = false;
  sellingListRef.value?.fetchProducts();
}
</script>

<style scoped>
.trade-list-container {
  max-width: 900px;
  margin: 0 auto;
  background: var(--main-white);
  border-radius: 16px;
  box-shadow: var(--main-shadow);
  padding: 2.5rem 2rem 2rem 2rem;
}
.trade-tabs {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
}
.trade-tab {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--main-purple-dark);
  padding: 0.7rem 2.5rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.trade-tab.active {
  background: var(--main-purple);
  color: var(--main-white);
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: var(--main-white);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  min-width: 350px;
  max-width: 95vw;
  box-shadow: var(--main-shadow);
  position: relative;
}
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #eee;
  color: #333;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
}
</style> 