<template>
  <canvas :id="`frame${index}`"></canvas>
</template>
<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  index: {
    type: Number,
    default: 0
  },
  imgData: {
    type: Object,
    default: () => ({})
  },
})

onMounted(() => {
    createImg(width, height, colorTable) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const content = canvas.getContext('2d');
    const imgData = content?.createImageData(width, height);
    const pixels = imgData?.data;
    for(let i = 0; i < this.data.length; i ++) {
      pixels[i * 4 + 0] = colorTable.tableCode[this.data[i]][0];
      pixels[i * 4 + 1] = colorTable.tableCode[this.data[i]][1];
      pixels[i * 4 + 2] = colorTable.tableCode[this.data[i]][2];
      pixels[i * 4 + 3] = 255;
    }
    return imgData;
  }
  const canvas = document.querySelector(`#frame${props.index}`);
  canvas.width = props.width;
  canvas.height = props.height;
  const content = canvas.getContext('2d');
  console.log(props.width);
  content.putImageData(props.imgData, 0, 0);
})

</script>
<style lang="scss">
</style>