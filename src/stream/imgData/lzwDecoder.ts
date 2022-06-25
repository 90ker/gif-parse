// import { Stream } from "../stream";

// export class LZWDecoder {

//   constructor() {
//     let blocks = [];
//     let clear = 1 << minCodeSizeLZW;
//     let eoi = clear + 1;
//     let tmp = [];
//     let size = minCodeSizeLZW + 1;
//     while (subBlockSize) {
//       while (subBlockSize--) {
//         let theByte = dataView.getUint8();
//         let bitIdx = 0;

//         for (let i = 7; i >= 0; i--) {
//           xx.unshift((bt & 1 << i) >> i);
//         }
//         tmp = tmp.concat(xx);
//       }
//       let sbuidx = 0;
//       let code = parseInt(tmp.slice(sbuidx, sbuidx + size).join(''), 2);
//       let codeStream = [];

//       while (sbuidx < tmp.length) {
//         while (code < (1 << size) - 1) {
//           code = parseInt(tmp.slice(sbuidx, sbuidx + size).join(''), 2);
//           codeStream.push(code);
//           sbuidx += size;
//         }
//         size++;
//       }
//       console.log(codeStream);

//       let codeTable = [];
//       blocks.push(tmp);
//       subBlockSize = dataView.getUint8();
//     }
//   }
//   decode(codeStream) {

//   }
// }