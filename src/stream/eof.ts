import { Stream } from "./stream";

interface IEOF {
  emitEOF(stream: Stream): void;
}

export class EOF implements IEOF {
  emitEOF(stream: Stream) {
    let code = stream.readUint8();
    if (code !== 0) {
      throw new Error('EOF 解析出错！！！')
    }
  }
}