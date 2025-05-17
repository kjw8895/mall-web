<template>
  <div class="product-list-card">
    <h1 class="product-list-title">상품 목록</h1>
    
    <div class="filters">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="상품 검색..." 
          class="search-input"
          @keyup.enter="fetchProducts"
        />
        <button class="search-btn" @click="fetchProducts">검색</button>
      </div>
    </div>
    
    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.imageUrl" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3 class="product-name product-link" @click="viewProduct(product.id)">{{ product.name }}</h3>
          <p class="product-price">{{ formatPrice(product.price) }}원</p>
          <p class="product-seller">판매자: {{ product.user?.nickName || '-' }}</p>
          <div class="product-actions">
            <button class="view-btn" @click="viewProduct(product.id)">상세보기</button>
          </div>
        </div>
      </div>
      <div v-if="products.length === 0" class="empty-message">
        {{ loading ? '로딩 중...' : '상품이 없습니다.' }}
      </div>
    </div>
    
    <div class="pagination" v-if="totalPages > 0">
      <button 
        class="page-btn" 
        :disabled="currentPage === 0" 
        @click="changePage(currentPage - 1)"
      >
        이전
      </button>
      <span class="page-info">{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages - 1" 
        @click="changePage(currentPage + 1)"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/api/axios'

interface User {
  id: number;
  email: string;
  name: string | null;
  nickName: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  user: User;
  image?: string;
}

export default defineComponent({
  name: 'ProductList',
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const products = ref<Product[]>([]);
    const currentPage = ref(0);
    const totalPages = ref(0);
    const pageSize = ref(20);
    const loading = ref(false);

    const fetchProducts = async () => {
      try {
        loading.value = true;
        const response = await axios.get('/product/page', {
          params: {
            type: 'NORMAL',
            productName: searchQuery.value || undefined,
            page: currentPage.value,
            size: pageSize.value
          }
        });

        const { content, totalPages: total } = response.data.data;
        products.value = content;
        totalPages.value = total;
      } catch (error) {
        console.error('상품 목록을 불러오는데 실패했습니다:', error);
      } finally {
        loading.value = false;
      }
    };

    const changePage = (page: number) => {
      currentPage.value = page;
      fetchProducts();
    };

    const formatPrice = (price: number) => {
      return price.toLocaleString();
    };

    const viewProduct = (productId: number) => {
      router.push(`/products/${productId}`);
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      searchQuery,
      products,
      currentPage,
      totalPages,
      loading,
      formatPrice,
      fetchProducts,
      changePage,
      viewProduct
    };
  }
});
</script>

<style scoped>
.product-list-card {
  max-width: 900px;
  margin: 40px auto;
  background: var(--main-white);
  border-radius: 16px;
  box-shadow: var(--main-shadow);
  padding: 2.5rem 2rem 2rem 2rem;
}
.product-list-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 2rem;
}

.filters {
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  gap: 10px;
  max-width: 600px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-btn {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.search-btn:hover {
  background-color: #2980b9;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.product-price {
  color: #e74c3c;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.product-seller {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0 0 15px 0;
}

.product-actions {
  display: flex;
  justify-content: space-between;
}

.view-btn {
  width: 100%;
  padding: 8px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-btn:hover {
  background-color: #2980b9;
}

.empty-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
}

.page-btn {
  background: var(--main-purple, #6c47ff);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.page-btn:disabled {
  background: #e0e0e0;
  color: #b0b0b0;
  cursor: not-allowed;
  border: none;
}

.page-info {
  font-size: 0.9rem;
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