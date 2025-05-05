<template>
  <div class="product-detail-container" v-if="product">
    <button class="back-list-btn" @click="goToList">목록으로</button>
    <div class="product-detail-card">
      <img v-if="product.imageUrl" :src="product.imageUrl" class="product-detail-img" :alt="product.name" />
      <div class="product-detail-info">
        <h1 class="product-detail-title">
          {{ product.name }}
          <span class="status-badge">{{ product.status.text }}</span>
        </h1>
        <div class="product-detail-meta">
          <span class="product-detail-price">{{ formatPrice(product.price) }}원</span>
          <span class="product-detail-date">등록일: {{ formatDate(product.createdDatetime) }}</span>
        </div>
        <div class="product-detail-seller">
          판매자: {{ product.user?.nickName || product.user?.email || '-' }}
        </div>
        <button v-if="!isMyProduct && product.status.code === 'WAITING'" class="bid-btn" @click="showBidModal = true">구매하기</button>
        <button
          v-if="isMyProduct && product.status.code === 'PAID'"
          class="complete-btn"
          @click="completeDeal"
        >
          거래 완료
        </button>
      </div>
    </div>
    <div v-if="showBidModal" class="modal-overlay">
      <div class="modal">
        <h3>구매하시겠습니까?</h3>
        <button @click="payForProduct">구매 확정</button>
        <button @click="showBidModal = false">취소</button>
      </div>
    </div>
  </div>
  <div v-else class="product-detail-loading">로딩 중...</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from '@/api/axios'

const route = useRoute();
const router = useRouter();
const store = useStore();
const product = ref<any>(null);
const bidList = ref<any[]>([]);

const showBidModal = ref(false);
const bidPrice = ref<number | null>(null);
const bidLoading = ref(false);
const bidError = ref('');

const currentUser = computed(() => store.getters['auth/currentUser']);
const isMyProduct = computed(() => {
  return product.value && currentUser && product.value.user?.id === currentUser.value?.userId;
});

const point = ref(0);
async function fetchPoint() {
  try {
    const res = await axios.get('/point/total');
    point.value = res.data.data ?? 0;
  } catch {
    point.value = 0;
  }
}

function goToList() {
  router.push('/products/list');
}

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

async function fetchBidList() {
  try {
    const res = await axios.get(`/product/${route.params.id}/purchase`);
    bidList.value = res.data.data || [];
  } catch {
    bidList.value = [];
  }
}

function closeBidModal() {
  showBidModal.value = false;
  bidPrice.value = null;
  bidError.value = '';
}

async function submitBid() {
  if (!bidPrice.value || bidPrice.value <= 0) {
    bidError.value = '유효한 입찰가를 입력하세요.';
    return;
  }
  if (bidPrice.value > point.value) {
    bidError.value = '보유 포인트보다 높은 금액은 입찰할 수 없습니다.';
    return;
  }
  bidLoading.value = true;
  bidError.value = '';
  try {
    await axios.post(`/product/${route.params.id}/purchase`, { price: bidPrice.value });
    closeBidModal();
    fetchBidList();
    fetchPoint();
  } catch (err: any) {
    bidError.value = err.response?.data?.message || '입찰에 실패했습니다.';
  } finally {
    bidLoading.value = false;
  }
}

const productId = route.params.id;
const payForProduct = async () => {
  try {
    await axios.put(`/product/${productId}/pay`);
    alert('구매가 완료되었습니다!');
    showBidModal.value = false;
    // 필요하다면 페이지 이동 또는 새로고침
    window.location.reload();
  } catch (e: any) {
    alert(e.response?.data?.message || '구매에 실패했습니다.');
  }
};

const completeDeal = async () => {
  try {
    await axios.put(`/product/${productId}/complete`);
    alert('거래가 완료되었습니다!');
    window.location.reload();
  } catch (e: any) {
    alert(e.response?.data?.message || '거래 완료 처리에 실패했습니다.');
  }
};

onMounted(() => {
  fetchProduct();
  fetchBidList();
  fetchPoint();
});
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
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.product-detail-status {
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
.bid-btn {
  margin-top: 1.5rem;
  background: #5b7cfa;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.7rem 2.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.bid-btn:hover {
  background: #2d014d;
}
.bid-list-section {
  margin-top: 2.5rem;
}
.bid-list-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}
.bid-list-table {
  width: 100%;
  border-collapse: collapse;
  background: #fafaff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(44,0,80,0.04);
}
.bid-list-table th, .bid-list-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
  font-size: 1rem;
}
.bid-list-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}
.empty-message {
  text-align: center;
  color: #7f8c8d;
  padding: 20px;
}
.modal-overlay {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 300px; text-align: center;
}
.modal button { margin: 0 0.5rem; }
.my-point {
  margin-bottom: 0.7rem;
  color: #5b7cfa;
  font-size: 1rem;
  text-align: left;
  width: 100%;
}
.back-list-btn {
  margin-bottom: 1.2rem;
  background: #eee;
  color: #5b7cfa;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.back-list-btn:hover {
  background: #5b7cfa;
  color: #fff;
}
.status-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  background: #f3f3fa;
  color: #5b7cfa;
  margin-left: 0.5rem;
  border: 1px solid #e0e0f7;
}
.status-badge.paid {
  background-color: #e1f7e1;
  color: #2ecc71;
}
.complete-btn {
  margin-top: 1.5rem;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.7rem 2.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.complete-btn:hover {
  background: #219150;
}
</style> 