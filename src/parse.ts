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

interface Img {
  graph: Graph;
  localColorTable: LocalColorTable | [];
  plainTexts: Array<PlainText>;
  graphControls: Array<GraphControl>;
  comments: Array<Comment>;
  applications: Array<Application>;
  decodeData: object;
}

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
  imgs: Array<object>;

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

    this.imgs = [];
    // 以下是循环
    while (this.stream.offset < this.stream.dataView.byteLength) {
      let img: Img = {
        graph: {},
        localColorTable: {},
        plainTexts: [],
        graphControls: [],
        comments: [],
        applications: [],
        decodeData: {}
      };
      let flagByte = this.stream.readUint8();
      if (flagByte === 33) { // 扩展
        let type = this.stream.readUint8();
        switch (type) {
          case 1: //纯文本
            img.plainTexts.push(new PlainText(this.stream));
            break;
          case 249: // 图像控制
            img.graphControls.push(new GraphControl(this.stream));
            break;
          case 254: // 评论
            img.comments.push(new Comment(this.stream));
            break;
          case 255: //应用
            img.applications.push(new Application(this.stream));
            break;
        }
      } else if (flagByte === 44) {
        img.graph = new Graph(this.stream);
        if (img.graph.packageField.localColorTableFlag) {
          img.localColorTable = new LocalColorTable(this.stream, (2 << img.graph.packageField.localColorTableSize) * 3);
        }
        img.decodeData = new DecodeData(this.stream);

      }
      this.imgs.push(img);
    }
  }
}

function dataToColor(data) {
  
}