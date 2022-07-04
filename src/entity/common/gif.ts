import { Stream } from './stream'
import { Header } from '../global/header'
import { LogicScreen } from '../global/logicScreen'
import { GlobalColorTable } from '../global/globalColor'
import { PlainText } from '../local/extension/plainText'
import { GraphControl } from '../local/extension/graphControl'
import { Application } from '../local/extension/application'
import { Comment } from '../local/extension/comment'
import { LocalColorTable } from '../local/img/localColor'
import { ImgScreen } from '../local/img/imgScreen'
import { ImgData } from '../local/img/ImgData'


export class Gif {
  stream: Stream;
  header: Header;
  logicScreen: LogicScreen;
  globalColorTable: GlobalColorTable | [];
  localColorTable: LocalColorTable | [];
  plainTexts: Array<PlainText>;
  graphControls: Array<GraphControl>;
  comments: Array<Comment>;
  applications: Array<Application>;
  decodeData: object;
  imgs: Array<object>;

  constructor(dataView) {
    this.setStream(dataView);
    this.setGlobal(this.stream);

    this.plainTexts = [];
    this.graphControls = [];
    this.comments = [];
    this.applications = [];
    this.imgs = [];
    
    this.setLocal(this.stream);
    
  }

  setStream(dataView) {
    this.stream = new Stream(dataView, true);
  }

  setGlobal(stream) {
    this.header = new Header(stream);
    this.logicScreen = new LogicScreen(stream);
    if (this.logicScreen.packageField.globalColorTableFlag) {
      this.globalColorTable = new GlobalColorTable(stream, (2 << this.logicScreen.packageField.globalColorTableSize) * 3);
    } else {
      this.globalColorTable = [];
    }
  }

  setLocal(stream) {
    // 以下是循环
    while (stream.offset < stream.dataView.byteLength) {
      let flagByte = stream.readUint8();
      if (flagByte === 33) { // 扩展
        this.setExtension(stream);
      } else if (flagByte === 44) {
        this.setImg(stream);
      }
    }
  }

  setExtension(stream) {
    let type = stream.readUint8();
    switch (type) {
      case 1: //纯文本
        this.plainTexts.push(new PlainText(stream));
        break;
      case 249: // 图像控制
        this.graphControls.push(new GraphControl(stream));
        break;
      case 254: // 评论
        this.comments.push(new Comment(stream));
        break;
      case 255: //应用
        this.applications.push(new Application(stream));
        break;
    }
  }

  setImg(stream) {
    const img = {};
    img.imgScreen = new ImgScreen(stream);
    if (img.imgScreen.packageField.localColorTableFlag) {
      img.localColorTable = new LocalColorTable(stream, (2 << img.imgScreen.packageField.localColorTableSize) * 3);
    }
    img.imgData = new ImgData(this.stream);
    this.imgs.push(img);
  }
}