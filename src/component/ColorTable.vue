<template>
  <canvas id="globalColorTable" style="background-color: #eee;"></canvas>
</template>
<script setup>
import { onMounted } from 'vue';
const props = defineProps({
  colorTable: {
    type: Array
  },
  canvasWidth: {
    type: Number
  },
  canvasHeight: {
    type: Number
  }
})

function renderColorTable() {
  const canvas = document.querySelector('#globalColorTable');
  canvas.width = props.canvasWidth;
  canvas.height = 200;
  const content = canvas.getContext('2d');
  props.colorTable.forEach(([r, g, b], i) => {
    content.fillStyle = `rgb(${r}, ${g}, ${b})`;
    content.fillRect(10 + i * (10 + 15), 10, 15, 15);
  });
}

onMounted(() => {
  renderColorTable();
})
</script>
<style lang="">
  
</style>