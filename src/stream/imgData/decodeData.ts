import { Stream } from "../stream";
import { BitReader } from "./bitReader";
import { LZWDecoder } from "./lzwDecoder";

export class DecodeData {
   minCodeSizeLZW: number;
   data: Array<number>;
  constructor(stream: Stream) {
    this.minCodeSizeLZW = stream.readUint8();
    let subBlockSize = stream.readUint8();
    let blocks: Array<Uint8Array> = [];
    let codeStreams = [];
    while (subBlockSize) {
      blocks.push(stream.slice(stream.offset, subBlockSize));
      subBlockSize = stream.readUint8();
    }
    const bitReader = new BitReader(); // bytes -> codeStream
    const lzwDecoder = new LZWDecoder(); // codeStream -> colorIndex
    let size = this.minCodeSizeLZW + 1; // 
    blocks.forEach(block => {
      const codeStream = [];
      let len = block.byteLength;
      bitReader.setBytes(block);
      let code = bitReader.readBits(size);
      if (code === (1 << size) - 1) {
        size ++;
      };

    })
  }
}