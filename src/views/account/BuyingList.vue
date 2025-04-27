<template>
  <div class="buying-list">
    <h1>내 구매 목록</h1>
    
    <div class="status-tabs">
      <button 
        v-for="status in statusOptions" 
        :key="status.value"
        :class="['status-tab', { active: currentStatus === status.value }]"
        @click="currentStatus = status.value"
      >
        {{ status.label }}
      </button>
    </div>
    
    <div class="products-table">
      <table>
        <thead>
          <tr>
            <th>상품 이미지</th>
            <th>상품명</th>
            <th>가격</th>
            <th>구매일</th>
            <th>상태</th>
            <th>판매자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td class="product-image-cell">
              <img :src="product.image" :alt="product.name" class="product-thumbnail" />
            </td>
            <td>{{ product.name }}</td>
            <td>{{ formatPrice(product.price) }}원</td>
            <td>{{ formatDate(product.purchasedAt) }}</td>
            <td>
              <span :class="['status-badge', product.status]">
                {{ getStatusLabel(product.status) }}
              </span>
            </td>
            <td>{{ product.seller }}</td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="6" class="empty-message">
              구매한 상품이 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'BuyingList',
  setup() {
    const currentStatus = ref('all');
    
    const statusOptions = [
      { value: 'all', label: '전체' },
      { value: 'completed', label: '구매완료' },
      { value: 'shipping', label: '배송중' },
      { value: 'delivered', label: '배송완료' }
    ];
    
    // 샘플 상품 데이터
    const products = ref([
      {
        id: 1,
        name: '아이폰 12 Pro',
        price: 800000,
        image: 'https://via.placeholder.com/50',
        purchasedAt: '2023-04-15',
        status: 'completed',
        seller: 'user123'
      },
      {
        id: 2,
        name: '나이키 운동화',
        price: 120000,
        image: 'https://via.placeholder.com/50',
        purchasedAt: '2023-04-10',
        status: 'shipping',
        seller: 'seller456'
      },
      {
        id: 3,
        name: '해리포터 시리즈',
        price: 50000,
        image: 'https://via.placeholder.com/50',
        purchasedAt: '2023-04-05',
        status: 'delivered',
        seller: 'bookstore789'
      }
    ]);
    
    // 현재 상태에 따라 상품 필터링
    const filteredProducts = computed(() => {
      if (currentStatus.value === 'all') {
        return products.value;
      }
      return products.value.filter(product => product.status === currentStatus.value);
    });
    
    // 가격 포맷팅 함수
    const formatPrice = (price: number) => {
      return price.toLocaleString();
    };
    
    // 날짜 포맷팅 함수
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    // 상태 레이블 가져오기
    const getStatusLabel = (status: string) => {
      const option = statusOptions.find(opt => opt.value === status);
      return option ? option.label : status;
    };
    
    return {
      currentStatus,
      statusOptions,
      products,
      filteredProducts,
      formatPrice,
      formatDate,
      getStatusLabel
    };
  }
});
</script>

<style scoped>
.buying-list {
  padding: 20px;
}

.status-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.status-tab {
  padding: 10px 15px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #7f8c8d;
  position: relative;
}

.status-tab.active {
  color: #3498db;
  font-weight: 500;
}

.status-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3498db;
}

.products-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.product-image-cell {
  width: 80px;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.completed {
  background-color: #e1f7e1;
  color: #2ecc71;
}

.status-badge.shipping {
  background-color: #fff3e0;
  color: #f39c12;
}

.status-badge.delivered {
  background-color: #f8f9fa;
  color: #7f8c8d;
}

.empty-message {
  text-align: center;
  color: #7f8c8d;
  padding: 30px;
}
</style> 