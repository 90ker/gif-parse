import { Stream } from "../stream";
import { EOF } from '../eof'

export class Application extends EOF {
   dataSize: number;
   content: string;
  constructor(stream: Stream) {
    super();
    this.dataSize = stream.readUint8();
    while(this.dataSize) {
      this.content += String.fromCharCode(stream.readUint8());
      this.dataSize--;
    }

    let noUseCode = stream.readUint8();
    while (noUseCode) {
      stream.readUint8();
      noUseCode --;
    }
    this.emitEOF(stream);
  }
}