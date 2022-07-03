export class GlobalColorTable {
  tableCode: Array<Array<number>>;
  
  constructor(stream, tableSize: number) {
    this.tableCode = [];
    this.setTableCode(stream, tableSize)
  }

  setTableCode(stream, tableSize: number) {
    while (tableSize) {
      const rgb = [stream.readUint8(), stream.readUint8(), stream.readUint8()];
      this.tableCode.push(rgb);
      tableSize -= 3;
    }
  }
}