<template>
  <div class="product-detail-container" v-if="product">
    <div class="product-detail-card">
      <img v-if="product.imageUrl" :src="product.imageUrl" class="product-detail-img" :alt="product.name" />
      <div class="product-detail-info">
        <h1 class="product-detail-title">{{ product.name }}</h1>
        <div class="product-detail-meta">
          <span class="product-detail-price">{{ formatPrice(product.price) }}원</span>
          <span class="product-detail-date">등록일: {{ formatDate(product.createdDatetime) }}</span>
        </div>
        <div class="product-detail-seller">
          판매자: {{ product.user?.nickName || product.user?.email || '-' }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="product-detail-loading">로딩 중...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/plugins/axios';

const route = useRoute();
const product = ref<any>(null);

function formatPrice(price: number) {
  return price?.toLocaleString();
}
function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

async function fetchProduct() {
  try {
    const res = await axios.get(`/product/${route.params.id}`);
    product.value = res.data.data;
  } catch {
    product.value = null;
  }
}

onMounted(fetchProduct);
</script>

<style scoped>
.product-detail-container {
  max-width: 600px;
  margin: 40px auto;
  background: var(--main-white);
  border-radius: 16px;
  box-shadow: var(--main-shadow);
  padding: 2.5rem 2rem 2rem 2rem;
}
.product-detail-card {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}
.product-detail-img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(44,0,80,0.06);
}
.product-detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.product-detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.product-detail-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 1.1rem;
  color: #7f8c8d;
}
.product-detail-price {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.3rem;
}
.product-detail-seller {
  margin-top: 1.2rem;
  color: #5b7cfa;
  font-weight: 600;
}
.product-detail-loading {
  text-align: center;
  color: #7f8c8d;
  padding: 60px 0;
  font-size: 1.2rem;
}
</style> 