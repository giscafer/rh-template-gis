/**
 * 天地图
 */
import { UrlTemplateImageryProvider, WebMercatorTilingScheme } from 'cesium';

const MAP_URL = 'https://t{s}.tianditu.gov.cn/DataServer?T={style}_w&x={x}&y={y}&l={z}&tk={key}';

class TdtImageryProvider extends UrlTemplateImageryProvider {
  constructor(options: any = {}) {
    super({
      url: MAP_URL.replace(/\{style\}/g, options.style || 'vec').replace(/\{key\}/g, options.key || ''),
      subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
      tilingScheme: new WebMercatorTilingScheme(),
      maximumLevel: 18,
    });
  }
}

export default TdtImageryProvider;
