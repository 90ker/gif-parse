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

  <div v-for="(rgb, key) in parseData.globalColorTable.tableCode" :key="key" :style="{ backgroundColor: `rgb(${rgb.join(',')})` }"
    style="display: inline-block; width: 30px; height: 30px;">
  </div>

  <div v-for="(p, key) in parseData.plainTexts" :key="key">{{ p }}</div>
  <div v-for="(g, key) in parseData.graphControls" :key="key">{{ g }}</div>
  <div v-for="(c, key) in parseData.comments" :key="key">{{ c }}</div>
  <div v-for="(a, key) in parseData.applications" :key="key">{{ a }}</div>
</template>

<style>
</style>
