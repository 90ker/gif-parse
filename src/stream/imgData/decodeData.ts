import { Stream } from "../stream";
import { BitReader } from "./bitReader";
import { LZWDecoder } from "./lzwDecoder";
import { EOF } from "../eof";

export class DecodeData extends EOF {
   minCodeSizeLZW: number;
   data: Array<number>;
  constructor(stream: Stream) {
    super();
    debugger
    this.minCodeSizeLZW = stream.readUint8();
    let subBlockSize = stream.readUint8();
    let blocks: Array<Uint8Array> = [];
    while (subBlockSize) {
      blocks.concat(stream.slice(stream.offset, subBlockSize));
      subBlockSize = stream.readUint8();
    }
    const bitReader = new BitReader(); // bytes -> codeStream
    const lzwDecoder = new LZWDecoder(); // codeStream -> colorIndex
    let codeStream: Array<number> = [];
    let codeTable: Array<Array<number>> = [];
    const indexStream: Array<number> = [];
    const EOICode = (1 << this.minCodeSizeLZW) + 1;
    const clearCode = (1 << this.minCodeSizeLZW) + 2;
    let size = this.minCodeSizeLZW + 1;
    // 单张图片的解析
    blocks.forEach(block => { // 本来可以通过将block都set到一个Unit8Array里去，但是会占用更多内存
      debugger
      bitReader.setBytes(block);
      let maxCode = (1 << size) - 1;
      while(bitReader.hasBits(size)) {
        let code = bitReader.readBits(size);
        if (code === maxCode) {
          size ++;
        } else if (code === EOICode) { // 每张图片一个，但不太明白和EOF的区别
          codeStream.push(code);
          break;
        } else if (code === clearCode) { // 一般在每个subBlock的开头，用来初始化
          codeStream = [];
          codeTable = [];
        } else { // 处理code
          let prevCode = codeStream[codeStream.length - 1];
          let y = 0;
          if (code <= codeTable.length - 1) { // 如果当前的code小于codeTable长度，直接取
            indexStream.push(...codeTable[code]);
            y = codeTable[code][0];
          } else { 
            /*
             * 由lzw压缩可知，indexStream 生成 -> codeTable -> codeStream ，但是解压是 codeStream -> indexStream -> codeTable
             * 这就导致了一个时差，所以codeStream只能生成上一次的codeTable
             * 压缩时有一种极限的情况，即本次使用的code就是上次生成的codeTable
             * 所以在解压时，这种情况不好处理     【indexStream】 xbc y - > xbcy
             * 但天无绝人之路，我们发现在这种情况中                 \        ^
             *                                                \      |
             * 设x、y为未知数，他们的数量关系是==，上图推导出          [xbcy]
             * 
            */ 
            y = codeTable[prevCode][0];
            indexStream.push(...codeTable[prevCode], y);
          }
          if(codeTable.length - 1 < 0xfff) { // codeTable的index就是codeStream的值
            // 每回合最后生成一个新的字典kv, 这里的y含义就是当前 code 对应IndexStream的第一个
            codeTable.push([...codeTable[prevCode], y]);
          }
          
          codeStream.push(code);

        }
        
      }

    })
    this.emitEOF(stream);
  }
}