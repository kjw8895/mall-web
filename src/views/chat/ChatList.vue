<template>
  <div class="chat-list-container">
    <h2>채팅 목록</h2>
    <table class="chat-list-table">
      <thead>
        <tr>
          <th>이미지</th>
          <th>상품명</th>
          <th>판매자</th>
          <th>구매자</th>
          <th>입장</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in chatRooms" :key="room.roomId">
          <td>
            <img :src="room.imageUrl" alt="상품 이미지" class="chat-list-img" />
          </td>
          <td>{{ room.productName }}</td>
          <td>{{ room.sellerName }}</td>
          <td>{{ room.buyerName }}</td>
          <td>
            <router-link :to="`/chat/room/${room.roomId}`">입장</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '@/api/axios';

const chatRooms = ref<any[]>([]);

onMounted(async () => {
  const res = await axios.get('/chat/room');
  chatRooms.value = res.data.data;
});
</script>

<style scoped>
.chat-list-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 2rem;
}
.chat-list-table {
  width: 100%;
  border-collapse: collapse;
}
.chat-list-table th, .chat-list-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.chat-list-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
}
</style> 