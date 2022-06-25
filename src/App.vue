<script setup>
import { ref, watch } from 'vue'
import { Stream } from './stream/stream'
import { Header } from './stream/structure/header'
import { LogicScreen } from './stream/structure/logicScreen'
import { GlobalColorTable } from './stream/structure/globalColor'
import { PlainText } from './stream/extension/plainText'
import { GraphControl } from './stream/extension/graphControl'
import { Application } from './stream/extension/application'
import { Comment } from './stream/extension/comment'


let inputVal = ref('http://cloudstorage.ihubin.com/blog/audio-video/blog-17/rainbow.gif');
let header = ref('');
let logicScreen = ref({});
let globalColorTable = ref(null);
let graph = ref({});
let localColorTable = ref(null);
let decodeData = ref([]);


//https://segmentfault.com/a/1190000022866045
watch(inputVal, async (newVal, oldVal) => {
  fetch(newVal)
    .then(res => res.arrayBuffer())
    .then(buffer => new DataView(buffer))
    .then(dataView => {
      const stream = new Stream(dataView, true);
      header = new Header(stream);
      logicScreen = new LogicScreen(stream);

      if (logicScreen.packageField.globalColorTableFlag) {
        globalColorTable = new GlobalColorTable(stream, (2 << logicScreen.packageField.globalColorTableSize) * 3);
      }

      // 以下是循环
      while (stream.getOffset() < stream.getStreamLen()) {
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
          graph = new Graph(stream);
          if (graph.packageField.localColorTableFlag) {
            localColorTable = new GlobalColorTable(stream, (2 << graph.packageField.localColorTableSize) * 3);
          }
          new LZWDecoder(stream);
        }
      }
    })
}, { immediate: true })
</script>

<template>
  <img :src="inputVal" alt="">
  <div></div>
  <input type="text" v-model="inputVal" />
  <div>{{ header }}</div>
  <div>{{ logicScreen }}</div>

  <div v-for="(rgb, key) in globalColorTable" :style="{ backgroundColor: rgb.join(',') }"
    style="width: 30px; height: 30px;"></div>
</template>

<style>
</style>
