<template>
  <div class="buying-list">
    <h1>내 구매 목록</h1>
    <div class="products-table">
      <table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>입찰가</th>
            <th>입찰일</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="purchase in purchases" :key="purchase.id">
            <td>
              <span class="product-link" @click="goToProduct(purchase.productId)">
                {{ purchase.productName || purchase.productId }}
              </span>
            </td>
            <td>{{ formatPrice(purchase.price) }}원</td>
            <td>{{ formatDate(purchase.createdDatetime) }}</td>
            <td>
              <span :class="['status-badge', purchase.status]">
                {{ purchase.status }}
              </span>
            </td>
            <td class="action-cell">
              <button class="action-btn view" @click="goToProduct(purchase.productId)">상세보기</button>
              <button class="action-btn cancel" @click="cancelBid(purchase.id)" :disabled="cancelLoadingId === purchase.id">입찰 취소</button>
            </td>
          </tr>
          <tr v-if="purchases.length === 0">
            <td colspan="5" class="empty-message">구매(입찰) 내역이 없습니다.</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="totalPages > 0">
        <button class="page-btn" :disabled="currentPage === 0" @click="changePage(currentPage - 1)">이전</button>
        <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages - 1" @click="changePage(currentPage + 1)">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '@/api/axios'
import { useRouter } from 'vue-router';

const purchases = ref<any[]>([]);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(20);
const loading = ref(false);
const cancelLoadingId = ref<number | null>(null);
const router = useRouter();

async function fetchPurchases() {
  try {
    loading.value = true;
    const response = await axios.get('/product/my-purchase', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    });
    const { content, totalPages: total } = response.data.data;
    purchases.value = content;
    totalPages.value = total;
  } catch (error) {
    console.error('내 구매 목록을 불러오는데 실패했습니다:', error);
  } finally {
    loading.value = false;
  }
}

function formatPrice(price: number) {
  return price?.toLocaleString();
}
function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function goToProduct(productId: number) {
  router.push(`/products/${productId}`);
}
function changePage(page: number) {
  currentPage.value = page;
  fetchPurchases();
}
async function cancelBid(purchaseId: number) {
  if (!confirm('정말로 이 입찰을 취소하시겠습니까?')) return;
  cancelLoadingId.value = purchaseId;
  try {
    await axios.delete(`/product/purchase/${purchaseId}`);
    fetchPurchases();
  } catch (err) {
    alert('입찰 취소에 실패했습니다.');
  } finally {
    cancelLoadingId.value = null;
  }
}

onMounted(fetchPurchases);
</script>

<style scoped>
.buying-list {
  padding: 32px 24px 24px 24px;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 2rem;
}
.products-table {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(44,0,80,0.06);
  overflow: hidden;
  margin-top: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 16px 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
}
th {
  background-color: #f8f9fa;
  font-weight: 700;
  color: #2c3e50;
}
.action-cell {
  display: flex;
  gap: 8px;
}
.action-btn {
  padding: 8px 18px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s;
}
.action-btn.view {
  background-color: #5b7cfa;
  color: white;
}
.action-btn.view:hover {
  background-color: #3b5ed6;
}
.action-btn.cancel {
  background-color: #e74c3c;
  color: white;
}
.action-btn.cancel:hover {
  background-color: #c0392b;
}
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
}
.status-badge.OPEN {
  background-color: #e1f7e1;
  color: #2ecc71;
}
.status-badge.DONE {
  background-color: #f8f9fa;
  color: #7f8c8d;
}
.status-badge.RESERVED {
  background-color: #fff3e0;
  color: #f39c12;
}
.empty-message {
  text-align: center;
  color: #7f8c8d;
  padding: 30px;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 24px;
}
.page-btn {
  padding: 8px 18px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1rem;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-info {
  font-size: 1rem;
  color: #7f8c8d;
}
.product-link {
  color: #5b7cfa;
  cursor: pointer;
  text-decoration: underline;
}
.product-link:hover {
  color: #2d014d;
}
</style> 