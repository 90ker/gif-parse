<script setup>
import { ref, watch } from 'vue'
import GifInstance from 'gif-decoder';
import Frame from './component/Frame.vue';
import ColorTable from './component/ColorTable.vue';


let inputVal = ref('http://cloudstorage.ihubin.com/blog/audio-video/blog-17/rainbow.gif');
let gif = ref(
  {
    applications: ['NETSCAPE2.0', 'ImageMagick', 'ImageMagick', 'ImageMagick'],
    comments: ['Created with ezgif.com GIF maker'],
    globalColor: [
      [255, 0, 0],
      [0, 255, 0],
      [255, 165, 0],
      [255, 255, 0],
      [0, 0, 255],
      [0, 127, 255],
      [139, 0, 255],
      [0, 0, 0],
    ],
    graphControls: [
      {
        dataSize: 4,
        delayTime: 50,
        packageField: {
          unUse: 0,
          disposalMethod: 0,
          userInputFlag: 0,
          transparentColorFlag: 0
        },
        transparentColorIndex: 255
      }
    ],
    header: "GIF89a",
    imgs: [
      {
        data: [],
        imgScreen: {
          left: 0,
          right: 0,
          width: 700, 
          height: 700,
          packageField: {
            localColorTableFlag: 0,
            interlaceFlag: 0,
            sortFlag: 0, 
            unUse: 0, 
            localColorTableSize: 0
          }
        },
        localColor: []
      }
    ],
    logicScreen: {
      canvasWidth: 700,
      canvasHeight: 700,
      packageField: {
        globalColorTableFlag: 0,
        colorResolution: 0,
        sortFlag: 0,
        globalColorTableSize: 2
      },
      bgColorIndex: 0,
      pxAspectRadio: 0},
    plainTexts: [],
    stream: {
      dataView: [],
      offset: 0,
      endianess: true
    }
  }
);


//https://segmentfault.com/a/1190000022866045
watch(inputVal, async (newVal, oldVal) => {
  fetch(newVal)
    .then(res => res.arrayBuffer())
    .then(buffer => new DataView(buffer))
    .then(dataView => {
      gif.value = new GifInstance(dataView);
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

    <div :style="{ width: `${gif.logicScreen.canvasWidth}px`, height: `${gif.logicScreen.canvasHeight}px`, border: '1px solid black' }">
      <div style="white-space: pre-line;">{{ JSON.stringify(gif.logicScreen, null, '\t') }}</div>
      <ColorTable :canvasWidth="gif.logicScreen.canvasWidth" :canvasHeight="gif.logicScreen.canvasHeight" :colorTable="gif.globalColor"></ColorTable>
    </div>



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

    <div v-for="(img, key) in gif.imgs">
      <Frame 
        :index="key" 
        :colorStream="img.data"
        :imgScreen="img.imgScreen"
        :colorTable="gif.globalColorTable || gif.localColorTable" 
      />
    </div>
  </div>
</template>

<style>
</style>
