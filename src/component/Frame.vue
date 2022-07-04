<template>
  <canvas :id="`frame${index}`"></canvas>
</template>
<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  canvasWidth: {
    type: Number,
    default: 0
  },
  canvasHeight: {
    type: Number,
    default: 0
  },
  index: {
    type: Number,
    default: 0
  },
  colorStream: {
    type: Number
  },
  colorTable: {
    type: Number
  },
  imgScreen: {
    type: Number
  },
})

 function handleImg(colorStream, colorTable) {
  const canvas = document.createElement('canvas');
  canvas.width = props.canvasWidth;
  canvas.height = props.canvasHeight;
  const content = canvas.getContext('2d');
  const imgData = content?.createImageData(props.imgScreen.width, props.imgScreen.height);
  const pixels = imgData?.data;
  for (let i = 0; i < colorStream.length; i++) {
    pixels[i * 4 + 0] = colorTable.tableCode[colorStream[i]][0];
    pixels[i * 4 + 1] = colorTable.tableCode[colorStream[i]][1];
    pixels[i * 4 + 2] = colorTable.tableCode[colorStream[i]][2];
    pixels[i * 4 + 3] = 255;
  }
  return imgData;
}

function setCanvas() {
  const canvas = document.querySelector(`#frame${props.index}`);
  canvas.width = props.canvasWidth;
  canvas.height = props.canvasHeight;
  const content = canvas.getContext('2d');
  content.putImageData(handleImg(props.colorStream, props.colorTable), 0, 0);
}

onMounted(() => {
  setCanvas();
})

</script>
<style lang="scss">
</style>