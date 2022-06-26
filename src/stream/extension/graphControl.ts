import { Stream } from "../stream";
import { byte2bitStr } from "../util";
import { EOF } from '../eof'

interface IGraphControlPackageField {
  unUse: number;
  disposalMethod: number;
  userInputFlag: number;
  transparentColorFlag: number;
}

export class GraphControl extends EOF {
   dataSize: number;
   packageField: IGraphControlPackageField;
   delayTime: number;
   transparentColorIndex: number;

  
  constructor(stream: Stream) {
    super();
    this.dataSize = stream.readUint8();
    const packageFieldByte = stream.readUint8();
    const packageFieldBits = byte2bitStr(packageFieldByte);
    this.packageField = {
      unUse: parseInt(packageFieldBits.slice(0, 3), 2),
      disposalMethod: parseInt(packageFieldBits.slice(3, 6), 2),
      userInputFlag: parseInt(packageFieldBits[6], 2),
      transparentColorFlag: parseInt(packageFieldBits[7], 2)
    }
    this.delayTime = stream.readUint16();
    this.transparentColorIndex = stream.readUint8();
    this.emitEOF(stream);
  }
}