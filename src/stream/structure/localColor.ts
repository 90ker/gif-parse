export class LocalColorTable {
  private tableCode: Array<Array<number>>;
  constructor(stream, tableSize: number) {
    this.tableCode = [];
    while (tableSize) {
      const rgb = [stream.readUint8(), stream.readUint8(), stream.readUint8()];
      this.tableCode.push(rgb);
      tableSize -= 3;
    }
  }
}