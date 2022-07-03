<script setup>
import { ref, watch } from 'vue'
import { ParseData } from './parse';
import Frame from './component/Frame.vue';


let inputVal = ref('http://cloudstorage.ihubin.com/blog/audio-video/blog-17/rainbow.gif');
let parseData = ref(
  {
    stream: null,
    header: null,
    logicScreen: null,
    globalColorTable: [],
    graph: null,
    localColorTable: null,
    plainTexts: [],
    graphControls: [],
    comments: [],
    applications: [],
    decodeData: null,
  }
);


//https://segmentfault.com/a/1190000022866045
watch(inputVal, async (newVal, oldVal) => {
  fetch(newVal)
    .then(res => res.arrayBuffer())
    .then(buffer => new DataView(buffer))
    .then(dataView => {
      parseData.value = new ParseData(dataView);
      console.log(parseData.logicScreen);
    })
}, { immediate: true })
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <img :src="inputVal" alt="" style="transform: scale(0.5);">
    <div></div>
    <input type="text" v-model="inputVal" />
    <div>{{ parseData.header }}</div>
    <div>{{ parseData.logicScreen }}</div>

    <div v-for="(rgb, key) in parseData.globalColorTable.tableCode" :key="key"
      :style="{ backgroundColor: `rgb(${rgb.join(',')})` }" style="display: inline-block; width: 30px; height: 30px;">
    </div>

    <div v-for="(img, key) in parseData.imgs">
      <h1>{{ key }}</h1>
      <div v-if="img.plainTexts.length">
        <h2>plainText</h2>
        <p v-for="(p, key) in img.plainTexts" :key="key">{{ p }}</p>
      </div>
      <div v-if="img.graphControls.length">
        <h2>graphControl</h2>
        <p v-for="(g, key) in img.graphControls" :key="key">{{ g }}</p>
      </div>
      <div v-if="img.comments.length">
        <h2>comment</h2>
        <p v-for="(c, key) in img.comments" :key="key">{{ c }}</p>
      </div>
      <div v-if="img.applications.length">
        <h2>application</h2>
        <p v-for="(a, key) in img.applications" :key="key">{{ a }}</p>
      </div>
      <div v-if="Object.keys(img.frame || {}).length">
        <Frame style="transform: scale(0.5);" :index="key" :imgData="img.frame" :width="parseData.logicScreen.canvasWidth" :height="parseData.logicScreen.canvasHeight" />
      </div>

    </div>
  </div>
</template>

<style>
</style>
