<script setup>
import { ref, watch } from 'vue'
let inputVal = ref('https://i0.wp.com/www.printmag.com/wp-content/uploads/2021/02/4cbe8d_f1ed2800a49649848102c68fc5a66e53mv2.gif?fit=476%2C280&ssl=1');

watch(inputVal, async (newVal, oldVal) => {
  fetch(newVal)
    .then(res => res.arrayBuffer())
    .then(buffer => new DataView(buffer))
    .then(dataView => {
      let idx = 0; // 表示当前指针所在字节位置
      // 头 6byte
      let header = '';
      while (idx < 6) {
        header += String.fromCharCode(dataView.getUint8(idx++));
      }

      // 逻辑屏幕 7byte
      let lsd = {};
      lsd.canvasWidth = dataView.getUint16(idx);
      idx += 2;
      lsd.canvasHeight = dataView.getUint16(idx);
      idx += 2;
      lsd.packageField = dataView.getUint8(idx++);
      // 感觉比较笨的方法 byte -> 8bit
      let tmp = '';
      for (let i = 8; i > 0; i--) {
        tmp += (lsd.packageField & 1 << i) >> i;
      }
      lsd.packageField = {
        globalColorTableFlag: parseInt(tmp[0], 2),
        colorResolution:  parseInt(tmp.slice(1, 4), 2),
        sortFlag: parseInt(tmp[4], 2),
        globalColorTableSize: parseInt(tmp.slice(5, 8), 2)
      }
      lsd.bgColorIndex = dataView.getUint8(idx++);
      lsd.pxAspectRadio = dataView.getUint8(idx++);
      console.log(lsd);
      
      if (lsd.packageField.globalColorTableFlag) {
        // 加载全局色表
        idx += lsd.packageField.globalColorTableSize;
      }

      let isExtend = dataView.getUint8(idx++); // 扩展

    })
}, { immediate: true })
</script>

<template>
  <img :src="inputVal" alt="">
  <div></div>
  <input type="text" v-model="inputVal" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
