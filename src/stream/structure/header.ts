import { Stream } from "../stream";

export class Header {
  private title: string;

  constructor(stream: Stream) {
    for (let i = 0; i < 6; i++) {
      this.title +=  String.fromCharCode(stream.readUint8());
    }
  }
}