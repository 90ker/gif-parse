interface IStream {
  readUint8(): number;
  readUint16(): number;
}

export class Stream implements IStream {
  private dataview: DataView;
  private offset: number;
  private endianess: boolean; // 位读取顺序，gif为true: 低位到高位，与人类阅读顺序相反
  constructor(dataView: DataView, endianess: boolean) {
    this.dataview = dataView;
    this.offset = 0;
    this.endianess = endianess;
  }

  readUint8() {
    const byte = this.dataview.getUint8(this.offset);
    this.offset ++;
    return byte;
  }
  readUint16() {
    const byte2 = this.dataview.getUint16(this.offset, this.endianess);
    this.offset +=2;
    return byte2;
  }
}