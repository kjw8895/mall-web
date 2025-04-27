<template>
  <div class="home-hero-text">
    <h1 class="hero-title">TrustTrade</h1>
    <p class="hero-desc">
      중고 거래부터 동네 정보까지, 이웃과 함께해요.<br />
      가깝고 따뜻한 당신의 근처를 만들어요.
    </p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
};
</script>

<style scoped>
.home-hero-text {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.hero-title {
  color: #f7b6e6;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
}
.hero-desc {
  color: #f7b6e6;
  font-size: 1.2rem;
  line-height: 1.7;
}
</style> 