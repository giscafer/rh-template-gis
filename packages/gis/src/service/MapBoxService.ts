import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CommonStore from '../common/CommonStore';
import MapService from '../common/MapService';
import defaultSettings from '../defaultSettings';
import { MapTypeEnum } from '../type/CommonType';
import { MapBoxInstanceOptions } from '../type/MapBoxType';

export default class MapBoxService extends MapService {
  constructor(props: MapBoxInstanceOptions) {
    super();
    return this;
  }

  private layerUrl: string = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

  private accessToken: string =
    'sk.eyJ1IjoiY2FueXVlZ29uZ3ppIiwiYSI6ImNrcG1zenlzbzF0aXcydm84NWgwaHplZ2EifQ.4PgYDtWQe54iRN3EU2REcQ';

  /**
   * 初始化地图实例
   * @param type
   * @param props
   * @param refresh // 重新创建地图渲染
   * @protected
   */
  public async initMapInstance(type: MapTypeEnum, props: MapBoxInstanceOptions, refresh = false) {
    const mapInstanceCache: any = await CommonStore.getInstance('MAPBOX');
    if (mapInstanceCache && !refresh) {
      return mapInstanceCache;
    }
    const map: Map = new Map({
      container: props.id,
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: defaultSettings.mapCenterPoint as any,
      maxZoom: 18,
      minZoom: 5,
      zoom: 9,
      accessToken: 'pk.eyJ1IjoiY2FueXVlZ29uZ3ppIiwiYSI6ImNrcG1zd2FnMTA0bjkydnQ4NjZmb25kMmkifQ.sdE-Rg4oWkO7UcduatFsmQ',
    });
    CommonStore.setInstance(type, map);
    return map;
  }
}
