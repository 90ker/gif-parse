<script setup>
import { ref, watch } from 'vue'
import { Gif } from './entity/common/gif';
import Frame from './component/Frame.vue';
import ColorTable from './component/ColorTable.vue';


let inputVal = ref('http://cloudstorage.ihubin.com/blog/audio-video/blog-17/rainbow.gif');
let gif = ref(
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
      gif.value = new Gif(dataView);
      console.log(gif);
    })
}, { immediate: true })
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <img :src="inputVal" alt="" style="transform: scale(0.5);">
    <div></div>
    <input type="text" v-model="inputVal" />
    <div>{{ gif.header }}</div>
    <div>{{ gif.logicScreen }}</div>


    <div v-for="(rgb, key) in gif.globalColorTable.tableCode" :key="key"
      :style="{ backgroundColor: `rgb(${rgb.join(',')})` }" style="display: inline-block; width: 30px; height: 30px;">
    </div>
    <ColorTable :colorTable="gif.globalColorTable"></ColorTable>

    <div>
      <h2>Comment</h2>
      <p v-for="comment in gif.comments">{{ comment }}</p>
    </div>

    <div v-if="gif.plainTexts.length">
      <h2>plainText</h2>
      <p v-for="(p, key) in gif.plainTexts" :key="key">{{ p }}</p>
    </div>
    <div v-if="gif.graphControls.length">
      <h2>graphControl</h2>
      <p v-for="(g, key) in gif.graphControls" :key="key">{{ g }}</p>
    </div>
    <div v-if="gif.applications.length">
      <h2>application</h2>
      <p v-for="(a, key) in gif.applications" :key="key">{{ a }}</p>
    </div>

    <div  v-for="(img, key) in gif.imgs">
      <Frame 
        :index="key" 
        :colorStream="img.imgData.data" 
        :canvasWidth="gif.logicScreen.canvasWidth"
        :canvasHeight="gif.logicScreen.canvasHeight" 
        :imgScreen="img.imgScreen"
        :colorTable="gif.globalColorTable || gif.localColorTable" />
    </div>
  </div>
</template>

<style>
</style>
