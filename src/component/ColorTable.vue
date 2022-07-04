<template>
  <canvas id="globalColorTable"></canvas>
</template>
<script setup>
import { onMounted } from 'vue';
const props = defineProps({
  colorTable: {
    type: Array
  }
})

function renderColorTable(colorTable) {
  const canvas = document.querySelector('#globalColorTable');
  canvas.width = 35;
  canvas.height = 35;
  const content = canvas.getContext('2d');
  colorTable.forEach(([r, g, b], i) => {
    debugger
    content.fillStyle = `rgb(${r}, ${g}, ${b})`;
    content.fillRect(10 + i * (10 + 15), 10, 15, 15);
  });
}

onMounted(() => {
  renderColorTable(props.colorTable);
})
</script>
<style lang="">
  
</style>