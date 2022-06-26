import { Stream } from "../stream";
import { EOF } from './index'

export class PlainText extends EOF {
   dataSize: number;
  constructor(stream: Stream) {
    super();
    this.dataSize = stream.readUint8();
    while (this.dataSize) {
      stream.readUint8();
      this.dataSize --;
    }
  }
}