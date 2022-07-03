
import { Stream } from "../../stream";
import { EOF } from '../../global/EOF'
import { byte2bitStr } from "../../../utils/util";

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
    this.dataSize = 0;
    this.setDataSize(stream)
    this.setPackageField(stream);
    this.setDelayTime(stream);
    this.setTransparentColorIndex(stream);
    this.emitEOF(stream);
  }

  setDataSize(stream: Stream) {
    this.dataSize = stream.readUint8();
  }

  setPackageField(stream: Stream) {
    const packageFieldByte = stream.readUint8();
    const packageFieldBits = byte2bitStr(packageFieldByte);
    this.packageField = {
      unUse: parseInt(packageFieldBits.slice(0, 3), 2),
      disposalMethod: parseInt(packageFieldBits.slice(3, 6), 2),
      userInputFlag: parseInt(packageFieldBits[6], 2),
      transparentColorFlag: parseInt(packageFieldBits[7], 2)
    }
  }
  setDelayTime(stream: Stream) {
    this.delayTime = stream.readUint16();
  }
  setTransparentColorIndex(stream: Stream) {
    this.transparentColorIndex = stream.readUint8();
  }

}