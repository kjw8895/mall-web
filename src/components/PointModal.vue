<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>포인트 충전</h3>
      <input type="number" v-model.number="point" placeholder="포인트 입력" />
      <div v-if="error" class="error">{{ error }}</div>
      <div class="modal-actions">
        <button @click="chargePoint" :disabled="loading">충전</button>
        <button @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import tossPayments from '@/store/useToassPayments';
import axios from '@/api/axios';
import store from '@/store';
import { v4 as uuidv4 } from 'uuid';


const point = ref<number | null>(null);
const loading = ref(false);
const error = ref('');
const payments = tossPayments;
const currentUser = computed(() => store.getters['auth/currentUser']);

const emit = defineEmits(['close', 'success']);


async function chargePoint() {
  if (!point.value || point.value <= 0) {
    error.value = '유효한 포인트를 입력하세요.';
    return;
  }
  const orderId = uuidv4();
  const customerName = currentUser.value?.email;
  loading.value = true;
  error.value = '';
  try {
    payments.requestPayment('CARD', {
    amount: point.value,
    orderId,
    orderName: '포인트 충전',
    customerName,
    successUrl: `${import.meta.env.VITE_FRONT_BASE_URL}/payment/success`,
    failUrl: `${import.meta.env.VITE_FRONT_BASE_URL}/payment/fail`,
  })

    // await axios.post('/point', { point: point.value });
    // emit('success');
    // emit('close');
    // alert('포인트가 충전되었습니다!');
  } catch (err: any) {
    console.log(err);
    error.value = err.response?.data?.message || '포인트 충전에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  min-width: 300px; text-align: center;
}
input[type='number'] {
  width: 100%; padding: 0.7rem 1rem; border-radius: 8px; border: 1px solid #eee; font-size: 1rem; margin-bottom: 1rem;
}
.modal-actions { margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; }
.error { color: #e74c3c; margin-bottom: 0.5rem; }
</style> 