<script setup>
import { ref, watch } from 'vue'
import { ParseData } from './parse';



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
    })
}, { immediate: true })
</script>

<template>
  <img :src="inputVal" alt="">
  <div></div>
  <input type="text" v-model="inputVal" />
  <div>{{ parseData.header }}</div>
  <div>{{ parseData.logicScreen }}</div>

  <div v-for="(rgb, key) in parseData.globalColorTable.tableCode" :key="key"
    :style="{ backgroundColor: `rgb(${rgb.join(',')})` }" style="display: inline-block; width: 30px; height: 30px;">
  </div>

  <div v-for="(img, key) in parseData.imgs">
    <h1>{{key}}</h1>
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
  </div>
</template>

<style>
</style>
