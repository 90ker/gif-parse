import { Stream } from "../stream";

export class Header {
   title: string;

  constructor(stream: Stream) {
    this.title = '';
    this.setTitle(stream)
  }

  setTitle(stream: Stream) {
    for (let i = 0; i < 6; i++) {
      this.title += String.fromCharCode(stream.readUint8());
    }
  }
}