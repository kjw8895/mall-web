<template>
  <div class="product-detail-container" v-if="product">
    <div class="product-detail-header">
      <button class="back-list-btn" @click="goToList">목록으로</button>
      <div class="header-actions">
        <span class="status-badge" :class="`status-${product.status.code.toLowerCase()}`">
          {{ product.status.text }}
        </span>
        <button
          v-if="!isMyProduct && product.status.code !== 'COMPLETE'"
          class="chat-btn-inline"
          @click="goToChat()"
        >
          채팅하기
        </button>
      </div>
    </div>
    <div class="product-detail-card">
      <div class="product-media-group">
        <img v-if="product.imageUrl" :src="product.imageUrl" class="product-detail-img" :alt="product.name" />
        <video
          v-if="product.videoUrl"
          :src="product.videoUrl"
          class="product-detail-video"
          controls
        >
          브라우저가 video 태그를 지원하지 않습니다.
        </video>
      </div>
      <div class="product-detail-info">
        <h1 class="product-detail-title">
          {{ product.name }}
        </h1>
        <div class="product-detail-meta">
          <span class="product-detail-price">{{ formatPrice(product.price) }}원</span>
          <span class="product-detail-date">등록일: {{ formatDate(product.createdDatetime) }}</span>
        </div>
        <div class="product-detail-seller">
          판매자: {{ product.user?.nickName || product.user?.email || '-' }}
        </div>
        <div class="product-detail-description">
          <h3>상품 설명</h3>
          <p>{{ product.description || '상품 설명이 없습니다.' }}</p>
        </div>
        <button v-if="!isMyProduct && product.status.code !== 'COMPLETE'" class="bid-btn" @click="showBidModal = true">입찰하기</button>
      </div>
    </div>
    <div class="bid-list-section">
      <h2 class="bid-list-title">입찰 목록</h2>
      <table class="bid-list-table">
        <thead>
          <tr>
            <th>입찰자</th>
            <th>입찰가</th>
            <th>입찰일</th>
            <th>상태</th>
            <th v-if="isMyProduct">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bid in bidList" :key="bid.id">
            <td>{{ bid.user?.nickName || bid.user?.name || bid.user?.email || '-' }}</td>
            <td>{{ formatPrice(bid.price) }}원</td>
            <td>{{ formatDate(bid.createdDatetime) }}</td>
            <td>{{ bid.status.text }}</td>
            <td v-if="isMyProduct">
              <button class="bid-success-btn" @click="awardBid(bid.id)" :disabled="bid.status.code === 'SUCCESS' || product.status.code === 'COMPLETE'">
                낙찰
              </button>
            </td>
          </tr>
          <tr v-if="bidList.length === 0">
            <td :colspan="isMyProduct ? 5 : 4" class="empty-message">입찰 내역이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showBidModal" class="modal">
      <div class="modal-content">
        <h3>입찰가 입력</h3>
        <div class="my-point">보유 포인트: <b>{{ formatPrice(point) }}P</b></div>
        <input type="number" v-model.number="bidPrice" placeholder="입찰가를 입력하세요" class="bid-input" />
        <div v-if="bidError" class="bid-error">{{ bidError }}</div>
        <div class="modal-actions">
          <button class="modal-btn" @click="submitBid" :disabled="bidLoading">입찰</button>
          <button class="modal-btn cancel" @click="closeBidModal">취소</button>
        </div>
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
  return product.value && currentUser.value && product.value.user?.id === currentUser.value.userId;
});

const point = ref(0);
async function fetchPoint() {
  try {
    const res = await axios.get('/point/total');
    point.value = res.data.data ?? 0;
  } catch (error) {
    point.value = 0;
  }
}

function goToList() {
  router.push('/auction/list');
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

async function closeBidModal() {
  showBidModal.value = false;
  bidPrice.value = null;
  bidError.value = '';
}

async function submitBid() {
  if (!bidPrice.value || bidPrice.value <= 0) {
    bidError.value = '유효한 입찰가를 입력하세요.';
    return;
  }
  if (bidPrice.value < product.value.price) {
    bidError.value = `입찰가는 상품 가격(${formatPrice(product.value.price)}원) 이상이어야 합니다.`;
    return;
  }
  const maxBid = bidList.value.length > 0
    ? Math.max(...bidList.value.map(bid => bid.price))
    : 0;
  if (bidPrice.value <= maxBid) {
    bidError.value = `입찰가는 현재 최고 입찰가(${formatPrice(maxBid)}원)보다 높아야 합니다.`;
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
    await closeBidModal();
    await fetchBidList();
    await fetchPoint();
    window.location.reload();
  } catch (err: any) {
    bidError.value = err.response?.data?.message || '입찰에 실패했습니다.';
  } finally {
    bidLoading.value = false;
  }
}

async function goToChat() {
  const productId = product.value.id;
  const sellerId = product.value.user.id;
  const buyerId = currentUser.value.userId;
  try {
    const res = await axios.post('/chat/room', { productId, sellerId, buyerId });
    const roomId = res.data.data.id || res.data.data.roomId || res.data.data; // 백엔드 응답 포맷에 따라
    router.push(`/chat/room/${roomId}`);
  } catch (e) {
    alert('채팅방 생성에 실패했습니다.');
  }
}

async function awardBid(bidId: number) {
  if (!confirm('이 입찰자를 낙찰자로 선정하시겠습니까?')) return;
  try {
    await axios.put(`/product/${product.value.id}/purchase/${bidId}`);
    alert('낙찰 처리되었습니다!');
    await Promise.all([
      fetchBidList(),
      fetchProduct(),
      fetchPoint()
    ]);
    window.location.reload();
  } catch (e: any) {
    alert(e.response?.data?.message || '낙찰 처리에 실패했습니다.');
  }
}

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
.product-media-group {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
  min-width: 220px;
}
.product-detail-img,
.product-detail-video {
  width: 220px;
  max-width: 100%;
  border-radius: 12px;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(44,0,80,0.06);
  display: block;
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
  min-width: 320px;
  max-width: 95vw;
  box-shadow: var(--main-shadow);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bid-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--main-border);
  font-size: 1rem;
  background: var(--main-gray);
  color: #222;
  margin-bottom: 1rem;
}
.bid-error {
  color: #e74c3c;
  background: #fdf0ed;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}
.modal-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: #5b7cfa;
  color: #fff;
  transition: background 0.2s;
}
.modal-btn.cancel {
  background: #eee;
  color: #333;
}
.modal-btn:hover:not(.cancel) {
  background: #2d014d;
}
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
.chat-btn-inline {
  background: #5b7cfa;
  color: #fff;
  border: none;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-block;
  min-width: 72px;
  height: 2.1rem;
  line-height: 2.1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 999px;
  text-align: center;
  box-sizing: border-box;
  vertical-align: middle;
  padding: 0 14px;
}
.chat-btn-inline:hover {
  background: #2d014d;
}
.status-badge {
  margin-left: 0.5rem;
  border: 1px solid #e0e0f7;
  background: #f3f3fa;
  color: #5b7cfa;
  display: inline-block;
  min-width: 72px;
  height: 2.1rem;
  line-height: 2.1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 999px;
  text-align: center;
  box-sizing: border-box;
  vertical-align: middle;
  padding: 0 14px;
}
.status-badge.status-waiting {
  background: #f3f3fa;
  color: #5b7cfa;
  border: 1px solid #e0e0f7;
}
.status-badge.status-paid {
  background: #e1f7e1;
  color: #2ecc71;
  border: 1px solid #b6e6c9;
}
.status-badge.status-complete {
  background: #f8f9fa;
  color: #7f8c8d;
  border: 1px solid #e0e0e0;
}
.bid-success-btn {
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.bid-success-btn:disabled {
  background: #ccc;
  color: #fff;
  cursor: not-allowed;
}
.bid-success-btn:hover:not(:disabled) {
  background: #219150;
}
.product-detail-description {
  margin: 1.5rem 0;
  padding: 1rem;
  background: var(--main-gray);
  border-radius: 8px;
}
.product-detail-description h3 {
  color: var(--main-purple-dark);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.product-detail-description p {
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
}
.point-info {
  margin: 1rem 0;
  padding: 0.8rem;
  background: var(--main-gray);
  border-radius: 8px;
  color: var(--main-purple-dark);
  font-size: 1rem;
}
.point-info b {
  color: var(--main-purple);
  font-weight: 600;
}
.product-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
</style> 