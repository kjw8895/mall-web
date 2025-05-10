<template>
  <div class="payment-success">
    <h2>결제 성공!</h2>
    <p>포인트 충전이 완료됩니다...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/api/axios';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const { paymentKey, orderId, amount } = route.query;
  try {
    await axios.post('/point', { paymentKey, orderId, point: amount });
    alert('포인트 충전이 완료되었습니다!');
    router.replace('/');
  } catch (e: any) {
    alert(e.response?.data?.message || '포인트 충전에 실패했습니다.');
    router.replace('/');
  }
});
</script> 