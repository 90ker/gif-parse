import { Stream } from './stream/stream'
import { Header } from './stream/structure/header'
import { LogicScreen } from './stream/structure/logicScreen'
import { GlobalColorTable } from './stream/structure/globalColor'
import { LocalColorTable } from './stream/structure/localColor'
import { PlainText } from './stream/extension/plainText'
import { GraphControl } from './stream/extension/graphControl'
import { Application } from './stream/extension/application'
import { Comment } from './stream/extension/comment'
import { Graph } from './stream/structure/graph'
import { DecodeData } from './stream/imgData/decodeData'

export class ParseData {
  stream: Stream;
  header: Header;
  logicScreen: LogicScreen;
  globalColorTable: GlobalColorTable | [];
  graph: Graph;
  localColorTable: LocalColorTable | [];
  plainTexts: Array<PlainText>;
  graphControls: Array<GraphControl>;
  comments: Array<Comment>;
  applications: Array<Application>;
  decodeData: object;

  constructor(dataView) {
    this.stream = new Stream(dataView, true);
    this.header = new Header(this.stream);
    this.logicScreen = new LogicScreen(this.stream);
    this.plainTexts = [];
    this.graphControls = [];
    this.comments = [];
    this.applications = [];
    if (this.logicScreen.packageField.globalColorTableFlag) {
      this.globalColorTable = new GlobalColorTable(this.stream, (2 << this.logicScreen.packageField.globalColorTableSize) * 3);
    } else {
      this.globalColorTable = [];
    }

    // 以下是循环
    while (this.stream.offset < this.stream.dataView.byteLength) {
      let flagByte = this.stream.readUint8();
      if (flagByte === 33) { // 扩展
        let type = this.stream.readUint8();
        switch (type) {
          case 1: //纯文本
            this.plainTexts.push(new PlainText(this.stream));
            break;
          case 249: // 图像控制
            this.graphControls.push(new GraphControl(this.stream));
            break;
          case 254: // 评论
            this.comments.push(new Comment(this.stream));
            break;
          case 255: //应用
            this.applications.push(new Application(this.stream));
            break;
        }
      } else if (flagByte === 44) {
        this.graph = new Graph(this.stream);
        if (this.graph.packageField.localColorTableFlag) {
          this.localColorTable = new LocalColorTable(this.stream, (2 << this.graph.packageField.localColorTableSize) * 3);
        }
        this.decodeData = new DecodeData(this.stream);
      }
    }
  }
}