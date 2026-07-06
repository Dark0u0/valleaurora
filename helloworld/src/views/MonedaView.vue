<script setup>
import MonedaCard from '../components/MonedaCard.vue'
</script>
 
<template>
  <section class="moneda">
    <h1>Tipo de Cambio</h1>
    <p class="subtitle">Cotización en tiempo real</p>
    <MonedaCard />
  </section>
</template>
 
<style scoped>
.moneda {
  padding: 40px;
  font-family: Arial, Helvetica, sans-serif;
}
h1 {
  color: #1e3a5f;
  font-size: 2rem;
  margin-bottom: 8px;
}
.subtitle {
  color: #64748b;
  margin-bottom: 32px;
}
</style>