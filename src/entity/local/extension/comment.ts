import { Stream } from "../../common/stream";
import { EOF } from '../../global/EOF'

export class Comment extends EOF {
   dataSize: number;
   content: string;
  constructor(stream: Stream) {
    super();
    this.content = '';
    this.dataSize = 0;
    this.setDataSize(stream);
    this.setContent(stream);

    this.emitEOF(stream);
  }
  setDataSize(stream: Stream) {
    this.dataSize = stream.readUint8();
  }

  setContent(stream: Stream) {
    while (this.dataSize) {
      this.content += String.fromCharCode(stream.readUint8());
      this.dataSize --;
    }
  }
}