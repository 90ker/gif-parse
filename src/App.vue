<script setup>
import { ref, watch } from 'vue'
import { Stream } from './stream'
import { Header } from './structure/header'
import { LogicScreen } from './structure/logicScreen'
import { PlainText } from './extension/plainText'
import { GraphControl } from './extension/graphControl'
import { Comment } from './extension/comment'


let inputVal = ref('http://cloudstorage.ihubin.com/blog/audio-video/blog-17/rainbow.gif');
//https://segmentfault.com/a/1190000022866045
watch(inputVal, async (newVal, oldVal) => {
  fetch(newVal)
    .then(res => res.arrayBuffer())
    .then(buffer => new DataView(buffer))
    .then(dataView => {
      const stream = new Stream(dataView, true);
      const header = new Header(stream);
      const logicScreen = new LogicScreen(stream);
      
      let globalColorTable = null;
      if (logicScreen.packageField.globalColorTableFlag) {
        let tableByte = (2 << logicScreen.packageField.globalColorTableSize) * 3;
        globalColorTable = new GlobalColorTable(stream, tableByte);
      }

      // 以下是循环
      while (idx < len) {
        let flagByte = stream.readUint8();
        if (flagByte === 33) { // 扩展
          let type = stream.readUint8();
          switch (type) {
            case 1: //纯文本
              const plainText = new PlainText(stream);
              break;
            case 249: // 图像控制
              const graphControl = new GraphControl(stream);
              break;
            case 254: // 评论
              const comment = new Comment(stream);
              break;
            case 255: //应用
              const application = new Application(stream);
              break;
          }
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
            let tableByte = (2 << id.packageField.localColorTableSize) * 3;
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
          let tmp = [];
          let size = minCodeSizeLZW + 1;
          while (subBlockSize) {
            while (subBlockSize--) {
              let theByte = dataView.getUint8(idx++);
              let bitIdx = 0;

              for (let i = 7; i >= 0; i--) {
                xx.unshift((bt & 1 << i) >> i);
              }
              tmp = tmp.concat(xx); 
            }
            let sbuidx = 0;
            let code = parseInt(tmp.slice(sbuidx, sbuidx + size).join(''), 2);
            let codeStream = [];
            
            while (sbuidx < tmp.length) {
              while (code < (1 << size) - 1) {
                code = parseInt(tmp.slice(sbuidx, sbuidx + size).join(''), 2);
                codeStream.push(code);
                sbuidx += size;
              }
              size++;
            }
            console.log(codeStream);
            
            let codeTable = [];
            blocks.push(tmp);
            subBlockSize = dataView.getUint8(idx++);
          }
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
