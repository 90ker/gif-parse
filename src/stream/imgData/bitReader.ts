interface IBitReader {
  readBits(len: number): number; //在byte之间获取bit
}


export class bitReader implements IBitReader {
  private bitOffset: number;
  private byteOffset: number;
  private bytes: Array<number>;
  constructor(bytes: Array<number>) {
    this.bitOffset = 0;
    this.byteOffset = 0;
    this.bytes = bytes;
  }

  readBits(len: number): number { // 这里的逻辑是以byte为界限
    let result = 0;
    let gotBits = 0; //累计获得了多少bit
    /*
     * 因为有时len的长度>byte 所以我们不能直接在byte里取len，而是另设一个变量x
     * 经过多次循环，跨byte去满足x >= len
     */ 
    while (gotBits < len) { 
      const perBits = Math.min(8 - this.bitOffset, len - gotBits); // 单次获取多少个bit，受限于剩余bit数
      const mask = 0xff >> (8 - perBits) << this.bitOffset; // 通过mask取到对应的位置
      result += mask & this.bytes[this.byteOffset] << gotBits; // 在下一个byte里补齐位数
      gotBits += perBits;
      this.bitOffset += perBits;
      if (this.bitOffset === 8) {
        this.bitOffset = 0;
        this.byteOffset++;
      }
    }
    return result;
  }
}