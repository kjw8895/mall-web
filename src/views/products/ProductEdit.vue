<template>
  <div class="product-edit-container">
    <h2>상품 수정</h2>
    <form @submit.prevent="handleSubmit" class="product-form">
      <div class="form-group">
        <label>상품명</label>
        <input v-model="name" required placeholder="상품명을 입력하세요" />
      </div>
      <div class="form-group">
        <label>상품 설명</label>
        <textarea 
          v-model="description" 
          required 
          placeholder="상품에 대한 설명을 입력하세요"
          rows="4"
        ></textarea>
      </div>
      <div class="form-group">
        <label>가격</label>
        <input v-model.number="price" type="number" required placeholder="가격을 입력하세요" />
      </div>
      <div class="form-group">
        <label>상품 이미지 (선택)</label>
        <input type="file" @change="onImageChange" accept="image/*" />
      </div>
      <div class="form-group">
        <label>상품 비디오 (선택)</label>
        <input type="file" @change="onVideoChange" accept="video/*" />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit" :disabled="loading">수정하기</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import axios from '@/api/axios'

const props = defineProps<{ product: any }>();
const emit = defineEmits(['close', 'success']);

const name = ref('');
const description = ref('');
const price = ref<number | null>(null);
const imageFile = ref<File | null>(null);
const videoFile = ref<File | null>(null);
const loading = ref(false);
const error = ref('');

watch(() => props.product, (val) => {
  if (val) {
    name.value = val.name;
    description.value = val.description;
    price.value = val.price;
    imageFile.value = null;
    videoFile.value = null;
  }
}, { immediate: true });

function onImageChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) imageFile.value = files[0];
}

function onVideoChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) videoFile.value = files[0];
}

async function handleSubmit() {
  if (!name.value || !price.value || !description.value) return;
  loading.value = true;
  error.value = '';
  try {
    const formData = new FormData();
    const dto = { name: name.value, price: price.value, description: description.value };
    formData.append('request', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }
    if (videoFile.value) {
      formData.append('video', videoFile.value);
    }
    await axios.put(`/product/${props.product.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    emit('success');
  } catch (err: any) {
    error.value = err.response?.data?.message || '상품 수정에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.product-edit-container {
  max-width: 400px;
  margin: 0 auto;
  background: var(--main-white);
  border-radius: 16px;
  box-shadow: var(--main-shadow);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
}
.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group label {
  font-weight: 600;
  color: var(--main-purple-dark);
  margin-bottom: 0.5rem;
  display: block;
}
input[type="text"], input[type="number"], input[type="file"] {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--main-border);
  font-size: 1rem;
  background: var(--main-gray);
  color: #222;
}
button[type="submit"] {
  width: 100%;
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0.9rem 0;
}
.error {
  color: #e74c3c;
  background: #fdf0ed;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 0.95rem;
}
</style> 