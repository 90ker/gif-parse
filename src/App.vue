<script setup>
import { ref, watch } from 'vue'
let inputVal = ref('http://cloudstorage.ihubin.com/blog/audio-video/blog-17/rainbow.gif');
//https://segmentfault.com/a/1190000022866045
watch(inputVal, async (newVal, oldVal) => {
  fetch(newVal)
    .then(res => res.arrayBuffer())
    .then(buffer => new DataView(buffer))
    .then(dataView => {
      let idx = 0; // 表示当前指针所在字节位置
      const len = dataView.byteLength;

      // 头 6byte
      let header = '';
      while (idx < 6) {
        header += String.fromCharCode(dataView.getUint8(idx++));
      }

      // 逻辑屏幕 7byte
      let lsd = {};
      lsd.canvasWidth = dataView.getUint16(idx, true);
      idx += 2;
      lsd.canvasHeight = dataView.getUint16(idx, true);
      idx += 2;
      lsd.packageField = dataView.getUint8(idx++);
      // 感觉比较笨的方法 byte -> 8bit
      let tmp = '';
      for (let i = 7; i >= 0; i--) {
        tmp += (lsd.packageField & 1 << i) >> i;
      }
      lsd.packageField = {
        globalColorTableFlag: parseInt(tmp[0], 2),
        colorResolution: parseInt(tmp.slice(1, 4), 2),
        sortFlag: parseInt(tmp[4], 2),
        globalColorTableSize: parseInt(tmp.slice(5, 8), 2)
      }
      lsd.bgColorIndex = dataView.getUint8(idx++);
      lsd.pxAspectRadio = dataView.getUint8(idx++);
      let tableArr = [];
      if (lsd.packageField.globalColorTableFlag) {
        // 加载全局色表
        let tableByte = (2 << lsd.packageField.globalColorTableSize) * 3;
        while (tableByte) {
          let r = dataView.getUint8(idx++);
          let g = dataView.getUint8(idx++);
          let b = dataView.getUint8(idx++);
          tableArr.push([r, g, b]);
          tableByte -= 3;
        }
      }

      // 以下是循环
      while (idx < len) {
        let flagByte = dataView.getUint8(idx++);
        if (flagByte === 33) { // 扩展
          let type = dataView.getUint8(idx++);
          switch (type) {
            case 1: //纯文本
              let textSize = dataView.getUint8(idx++);
              idx += textSize;
              break;
            case 249: // 图像控制
              let gce = {};
              gce.byteSize = dataView.getUint8(idx++);
              gce.packageField = dataView.getUint8(idx++);
              let tmp = '';
              for (let i = 7; i >= 0; i--) {
                tmp += (gce.packageField & 1 << i) >> i;
              }
              gce.packageField = {
                unUse: parseInt(tmp.slice(0, 3), 2),
                disposalMethod: parseInt(tmp.slice(3, 6), 2),
                userInputFlag: parseInt(tmp[6], 2),
                transparentColorFlag: parseInt(tmp[7], 2)
              }
              gce.delayTime = dataView.getUint16(idx, true);
              idx += 2;
              gce.transparentColorIndex = dataView.getUint8(idx++);
              break;
            case 254: // 评论
              let commentSize = dataView.getUint8(idx++);
              let str = '';
              while (commentSize--) {
                str += String.fromCharCode(dataView.getUint8(idx++))
              }
              break;
            case 255: //应用
              let appSize = dataView.getUint8(idx++);
              let flag = '';
              while (appSize-- > 3) {
                flag += String.fromCharCode(dataView.getUint8(idx++));
              }
              let captcha = '';
              while (appSize-- > -1) {
                captcha += String.fromCharCode(dataView.getUint8(idx++));
              }
              let len = dataView.getUint8(idx++);
              idx += len;
              break;
          }
          let EOF = dataView.getUint8(idx++);
        } else if (flagByte === 44) {
          let id = {}; // 图像描述
          id.left = dataView.getUint16(idx, true);
          idx += 2;
          id.right = dataView.getUint16(idx, true);
          idx += 2;
          id.width = dataView.getUint16(idx, true);
          idx += 2;
          id.height = dataView.getUint16(idx, true);
          idx += 2;
          id.packageField = dataView.getUint8(idx++);
          // 感觉比较笨的方法 byte -> 8bit
          let tmp2 = '';
          for (let i = 7; i >= 0; i--) {
            tmp2 += (id.packageField & 1 << i) >> i;
          }
          id.packageField = {
            localColorTableFlag: parseInt(tmp2[0], 2),
            interlaceFlag: parseInt(tmp2[1], 2),
            sortFlag: parseInt(tmp2[2], 2),
            unUse: parseInt(tmp2.slice(3, 5), 2),
            localColorTableSize: parseInt(tmp2.slice(5, 8), 2)
          }
          if (id.packageField.localColorTableFlag) {
            // 加载局部色表
            let tableByte = 2 << id.packageField.localColorTableSize * 3;
            let tableArr = [];
            while (tableByte) {
              let r = dataView.getUint8(idx++);
              let g = dataView.getUint8(idx++);
              let b = dataView.getUint8(idx++);
              tableArr.concat([r, g, b]);
              tableByte -= 3;
            }
          }
          // 加载数据
          let minCodeSizeLZW = dataView.getUint8(idx++);
          let subBlockSize = dataView.getUint8(idx++);
          let blocks = [];
          let clear = 1 << minCodeSizeLZW;
          let eoi = clear + 1;
          let tmp = '';
          let size = minCodeSizeLZW + 1;
          while (subBlockSize) {
            let bx = []
            while (subBlockSize--) {
              let bt = dataView.getUint8(idx++);
              bx.push(bt);
              for (let i = 7; i >= 0; i--) {
                tmp += (bt & 1 << i) >> i;
              }
            }
            console.log(bx);
            console.log(tmp);
            let sbuidx = 0;
            let code = parseInt(tmp.slice(sbuidx, sbuidx + size), 2);
            let codeTable = [];
            while (sbuidx < tmp.length) {
              while (code < (1 << size) - 1) {
                code = parseInt(tmp.slice(sbuidx, sbuidx + size), 2);
                codeTable.push(code);
                debugger
                sbuidx += size;
              }
              size++;
            }

            
            let codeStream = [];
            blocks.push(tmp);
            subBlockSize = dataView.getUint8(idx++);
          }
          console.log(blocks);
        }
      }

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
