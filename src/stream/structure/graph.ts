import { Stream } from '../stream';
import { byte2bitStr } from '../util'

interface IGraphPackageField {
  localColorTableFlag: number;
  interlaceFlag: number;
  sortFlag: number;
  unUse: number;
  localColorTableSize: number;
}

export class Graph {
  private left: number;
  private right: number;
  private width: number;
  private height: number;
  private packageField: IGraphPackageField;

  constructor(stream: Stream) {
    this.left = stream.readUint16();
    this.right = stream.readUint16();
    this.width = stream.readUint16();
    this.height = stream.readUint16();
    let packageFieldBits = byte2bitStr(stream.readUint8());
    this.packageField = {
      localColorTableFlag: parseInt(packageFieldBits[0], 2),
      interlaceFlag: parseInt(packageFieldBits[1], 2),
      sortFlag: parseInt(packageFieldBits[2], 2),
      unUse: parseInt(packageFieldBits.slice(3, 5), 2),
      localColorTableSize: parseInt(packageFieldBits.slice(5, 8), 2)
    }
  }
}