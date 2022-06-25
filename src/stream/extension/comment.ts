import { Stream } from "../stream";
import { EOF } from './index'

export class Comment extends EOF {
  private dataSize: number;
  private content: string;
  constructor(stream: Stream) {
    super();
    this.dataSize = stream.readUint8();
    while (this.dataSize) {
      this.content += String.fromCharCode(stream.readUint8());
      this.dataSize --;
    }
    this.emitEOF(stream);
  }
}