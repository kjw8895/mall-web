<script setup lang="ts">
import { ref, computed, onMounted, defineExpose } from 'vue';
import axios from '@/plugins/axios';
import ProductEdit from '@/views/products/ProductEdit.vue';

const props = defineProps({
  showAddButton: { type: Boolean, default: false }
});
const emit = defineEmits(['add-product']);

const showEditModal = ref(false);
const editProductData = ref<any>(null);

const products = ref<any[]>([]);
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = ref(20);
const loading = ref(false);

async function fetchProducts() {
  try {
    loading.value = true;
    const response = await axios.get('/product/my-selling', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    });
    const { content, totalPages: total } = response.data.data;
    products.value = content;
    totalPages.value = total;
  } catch (error) {
    console.error('내 판매 목록을 불러오는데 실패했습니다:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchProducts);
defineExpose({ fetchProducts });

const filteredProducts = computed(() => products.value);

function formatPrice(price: number) {
  return price.toLocaleString();
}
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function editProduct(product: any) {
  editProductData.value = { ...product };
  showEditModal.value = true;
}
async function deleteProduct(product: any) {
  if (confirm(`'${product.name}' 상품을 삭제하시겠습니까?`)) {
    try {
      await axios.delete(`/product/${product.id}`);
      fetchProducts();
    } catch (error) {
      alert('상품 삭제에 실패했습니다.');
    }
  }
}
function handleAddProduct() {
  emit('add-product');
}
function changePage(page: number) {
  currentPage.value = page;
  fetchProducts();
}
function handleEditClose() {
  showEditModal.value = false;
  editProductData.value = null;
}
function handleEditSuccess() {
  showEditModal.value = false;
  editProductData.value = null;
  fetchProducts();
}
</script>

<template>
  <div class="selling-list">
    <h1>내 판매 목록</h1>
    <div class="list-actions" v-if="props.showAddButton">
      <button class="add-product-btn-green" @click="handleAddProduct">상품 등록하기</button>
    </div>
    <div class="products-table">
      <table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>등록일</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ formatPrice(product.price) }}원</td>
            <td>{{ formatDate(product.createdDatetime) }}</td>
            <td>
              <span :class="['status-badge', product.status]">
                {{ product.status }}
              </span>
            </td>
            <td class="action-cell">
              <button class="action-btn edit" @click="editProduct(product)">수정</button>
              <button class="action-btn delete" @click="deleteProduct(product)">삭제</button>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="5" class="empty-message">
              판매 중인 상품이 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="totalPages > 0">
        <button class="page-btn" :disabled="currentPage === 0" @click="changePage(currentPage - 1)">이전</button>
        <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages - 1" @click="changePage(currentPage + 1)">다음</button>
      </div>
    </div>
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <ProductEdit :product="editProductData" @close="handleEditClose" @success="handleEditSuccess" />
        <button class="modal-close" @click="handleEditClose">닫기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selling-list {
  padding: 32px 24px 24px 24px;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 2rem;
}

.list-actions {
  margin-bottom: 18px;
  display: flex;
  justify-content: flex-end;
}

.add-product-btn-green {
  padding: 10px 24px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(44,0,80,0.06);
  transition: background 0.2s;
}
.add-product-btn-green:hover {
  background-color: #27ae60;
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
.action-btn.edit {
  background-color: #5b7cfa;
  color: white;
}
.action-btn.delete {
  background-color: #e74c3c;
  color: white;
}
.action-btn.edit:hover {
  background-color: #3b5ed6;
}
.action-btn.delete:hover {
  background-color: #c0392b;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
}
.status-badge.active {
  background-color: #e1f7e1;
  color: #2ecc71;
}
.status-badge.sold {
  background-color: #f8f9fa;
  color: #7f8c8d;
}
.status-badge.reserved {
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 50%;
  max-width: 600px;
}

.modal-close {
  padding: 10px 24px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;
}

.modal-close:hover {
  background-color: #c0392b;
}
</style> 