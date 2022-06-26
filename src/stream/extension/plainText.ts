import { Stream } from "../stream";
import { EOF } from '../eof'

export class PlainText extends EOF {
   dataSize: number;
  constructor(stream: Stream) {
    super();
    this.dataSize = stream.readUint8();
    while (this.dataSize) {
      stream.readUint8();
      this.dataSize --;
    }
    this.emitEOF(stream);
  }
}