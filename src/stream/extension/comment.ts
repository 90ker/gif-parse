import { Stream } from "../stream";
import { EOF } from '../eof'

export class Comment extends EOF {
   dataSize: number;
   content: string;
  constructor(stream: Stream) {
    super();
    this.dataSize = stream.readUint8();
    this.content = '';
    while (this.dataSize) {
      this.content += String.fromCharCode(stream.readUint8());
      this.dataSize --;
    }
    this.emitEOF(stream);
  }
}