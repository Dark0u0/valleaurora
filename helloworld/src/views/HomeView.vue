<script setup>
import WeatherCard from '../components/WeatherCard.vue'

</script>
<template>
  <section class="home">
    <h1>WeatherScope</h1>
    <p class="subtitle">Clima en tiempo real</p>
    <WeatherCard />
  </section>
</template>
<style scoped>
.home{
    padding: 40px; font-family: Arial, Helvetica, sans-serif;
}
h1{
    color: #1e3a5f; font-size: 2rem; margin-bottom: 8px;
}
.subtitle{
    color: #64748b;
    margin-bottom: 32px;
}
</style>