<template>
  <div>
    <h2>graphControl</h2>
    <p :style="{whiteSpace: 'pre-wrap' }">{{ JSON.stringify(props.graphControl, null, '\t') }}</p>
  </div>
  <canvas :id="`frame${index}`" style="margin: 10px;"></canvas>
</template>
<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  graphControl: {
    type: Object
  },
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

function setCanvas() {
  debugger
  const { left, right } = props.imgScreen;

  const canvas = document.querySelector(`#frame${props.index}`);
  canvas.width = props.canvasWidth;
  canvas.height = props.canvasHeight;
  const content = canvas.getContext('2d');

  content.putImageData(handleImg(props.colorStream, props.colorTable), left, right);
}

 function handleImg() {
  const { colorTable, colorStream, imgScreen } = props;
  const { width, height } = imgScreen;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const content = canvas.getContext('2d');
  const imgData = content?.createImageData(width, height);
  const pixels = imgData?.data;

  for (let i = 0; i < colorStream.length; i++) {
    pixels[i * 4 + 0] = colorTable[colorStream[i]][0];
    pixels[i * 4 + 1] = colorTable[colorStream[i]][1];
    pixels[i * 4 + 2] = colorTable[colorStream[i]][2];
    pixels[i * 4 + 3] = 255;
  }
  return imgData;
}

onMounted(() => {
  setCanvas();
})

</script>
<style lang="scss">
</style>