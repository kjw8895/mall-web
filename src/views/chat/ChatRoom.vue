<template>
  <div class="chat-room">
    <div class="chat-header">
      <button class="exit-btn" @click="goBack">나가기</button>
    </div>
    <div class="chat-messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['chat-bubble', msg.senderId === currentUser.userId ? 'my-message' : 'other-message']"
      >
        <div class="chat-meta">
          <span class="chat-name">
            {{ msg.senderId === currentUser.userId ? '나' : getOpponentName(msg) }}
          </span>
          <span class="chat-time">{{ formatDateTime(msg.createDatetime) }}</span>
        </div>
        <div class="chat-text">{{ msg.message }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="input" @keyup.enter="sendMessage" placeholder="메시지 입력" />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useStore } from 'vuex';
import axios from '@/api/axios';

const route = useRoute();
const router = useRouter();
const store = useStore();
const roomId = route.params.roomId;
const currentUser = computed(() => store.getters['auth/currentUser']);
const token = localStorage.getItem('token');

const messages = ref<any[]>([]);
const input = ref('');
let stompClient: any = null;

const backendUrl = 'http://3.35.48.10:8081';

function connectStomp() {
  const socket = new SockJS(`${backendUrl}/ws-chat`);
  stompClient = Stomp.over(socket);
  

  stompClient.connect(
    { Authorization: `Bearer ${token}` },
    () => {
      stompClient.subscribe(`/topic/chat.${roomId}`, (message: any) => {
        messages.value.push(JSON.parse(message.body));
      });
    }
  );
}

function formatDateTime(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
}

async function fetchChatHistory() {
  try {
    const res = await axios.get(`/chat/room/${roomId}/messages`);
    messages.value = res.data.data; // 히스토리 초기화
  } catch (error) {
    console.error('채팅 히스토리 로드 실패:', error);
  }
}

function sendMessage() {
  if (input.value.trim() && stompClient && stompClient.connected) {
    stompClient.send(
      '/app/chat.sendMessage',
      {},
      JSON.stringify({
        roomId: roomId,
        senderId: currentUser.value.userId,
        message: input.value,
      })
    );
    input.value = '';
  }
}

function getOpponentName(msg: any) {
  if (!currentUser.value) return '';
  if (currentUser.value.userId === msg.sellerId) {
    return msg.buyerName;
  } else if (currentUser.value.userId === msg.buyerId) {
    return msg.sellerName;
  }
  return msg.sellerName || msg.buyerName;
}

function goBack() {
  router.back(); // 또는 router.push('/chat/list')로 변경 가능
}

onMounted(() => {
  fetchChatHistory().then(() => {
    connectStomp(); // 히스토리 로드 후 WebSocket 연결
  });
});
onUnmounted(() => {
  if (stompClient) stompClient.disconnect();
});
</script>

<style scoped>
.chat-room {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  height: 70vh;
}
.chat-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}
.exit-btn {
  background: #eee;
  color: #7c4dff;
  border: none;
  border-radius: 8px;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.exit-btn:hover {
  background: #7c4dff;
  color: #fff;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1rem 0;
}
.chat-bubble {
  max-width: 65%;
  padding: 0.7rem 1.1rem;
  border-radius: 18px;
  word-break: break-all;
  position: relative;
  display: flex;
  flex-direction: column;
}
.my-message {
  align-self: flex-end;
  background: #7c4dff;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.other-message {
  align-self: flex-start;
  background: #f1f0f0;
  color: #222;
  border-bottom-left-radius: 4px;
}
.chat-meta {
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
  display: flex;
  justify-content: space-between;
  opacity: 0.7;
}
.chat-name {
  font-weight: 600;
}
.chat-time {
  margin-left: 0.5rem;
}
.chat-text {
  font-size: 1.08rem;
  word-break: break-all;
}
.chat-input {
  display: flex;
  gap: 0.5rem;
}
.chat-input input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.chat-input button {
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  background: #7c4dff;
  color: #fff;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
</style> 