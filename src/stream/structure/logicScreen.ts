import { Stream } from '../stream';
import { byte2bitStr } from '../util'

interface ILogicSreenPackageField {
  globalColorTableFlag: number;
  colorResolution: number;
  sortFlag: number;
  globalColorTableSize: number;
}

export class LogicScreen {
   canvasWidth: number;
   canvasHeight: number;
   packageField: ILogicSreenPackageField;
   bgColorIndex: number;
   pxAspectRadio: number;

  constructor(stream: Stream) {
    this.canvasWidth = stream.readUint16();
    this.canvasHeight = stream.readUint16();
    const packageFieldByte = stream.readUint8();
    let packageFieldBits = byte2bitStr(packageFieldByte);
    this.packageField = {
      globalColorTableFlag: parseInt(packageFieldBits[0], 2),
      colorResolution: parseInt(packageFieldBits.slice(1, 4), 2),
      sortFlag: parseInt(packageFieldBits[4], 2),
      globalColorTableSize: parseInt(packageFieldBits.slice(5, 8), 2)
    }
    this.bgColorIndex = stream.readUint8();
    this.pxAspectRadio = stream.readUint8();
  }
}