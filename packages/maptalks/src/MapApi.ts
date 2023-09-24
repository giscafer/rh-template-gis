import { guid } from './utils';

export default class MapApi implements IMapApi {
  mapApi: any;
  name: string;
  mapId: string;
  _opt: Record<string, any>;

  constructor(name: string, option: any) {
    this.mapApi = null;
    this.name = name;
    this._opt = {
      onLoadComplete: null,
      style: '',
      tool: '',
      isShowWeatherAlarm: 'off',
      copyright: '',
      sign: '',
      ...option,
    };

    this.mapId = guid();

    // 省略其余的构造函数代码...
  }
  onLoadComplete?: (() => void) | undefined;
  getMapList(): any[] {
    throw new Error('Method not implemented.');
  }

  initBMap(): void {
    const frame = document.createElement('iframe');
    frame.id = this.mapId;
    frame.setAttribute('frameborder', '0');
    frame.style.width = '100%';
    frame.style.height = '100%';
    frame.src =
      '/MapApi/?mapType=b' +
      (this._opt.style ? '&style=' + this._opt.style : '') +
      (this._opt.tool ? '&tool=' + this._opt.tool : '') +
      (this._opt.copyright ? '&copyright=' + this._opt.copyright : '') +
      (this._opt.sign ? '&sign=' + encodeURIComponent(this._opt.sign) : '');

    // 替换iframe
    const targetElement = document.getElementById(this.name);
    if (targetElement) {
      if (targetElement.firstChild) {
        targetElement.replaceChild(frame, targetElement.firstChild);
      } else {
        targetElement.appendChild(frame);
      }
    }

    // 定时检测地图是否完成加载
    this._checkMapLoaded();
  }

  private _mapInit(): void {
    const frame: HTMLIFrameElement = document.getElementById(this.mapId) as HTMLIFrameElement;
    if (frame != null && frame.contentWindow != null) this.mapApi = (frame.contentWindow as any).mapApi;

    if (this._opt.onLoadComplete) this._opt.onLoadComplete();
  }

  private _checkMapLoaded(): void {
    const frame = document.getElementById(this.mapId) as HTMLIFrameElement;
    if ((frame.contentWindow as any)?.mapApi?.initCompleted) {
      this._mapInit();
      return;
    }

    setTimeout(() => this._checkMapLoaded(), 50);
  }

  init(): void {
    const frame = document.createElement('iframe');
    frame.id = this.mapId;
    frame.setAttribute('frameborder', '0');
    frame.style.width = '100%';
    frame.style.height = '100%';
    frame.src =
      '/MapApi/WebApi?v=1.0' +
      (this._opt.style ? '&style=' + this._opt.style : '') +
      (this._opt.tool ? '&tool=' + this._opt.tool : '') +
      (this._opt.copyright ? '&copyright=' + this._opt.copyright : '') +
      (this._opt.isShowWeatherAlarm ? '&isShowWeatherAlarm=' + this._opt.isShowWeatherAlarm : 'off') +
      (this._opt.sign ? '&sign=' + encodeURIComponent(this._opt.sign) : '');

    const targetElement = document.getElementById(this.name);
    if (targetElement) {
      if (targetElement.firstChild) {
        targetElement.replaceChild(frame, targetElement.firstChild);
      } else {
        targetElement.appendChild(frame);
      }
    }

    // 定时检测地图是否完成加载
    this._checkMapLoaded();
  }
}
