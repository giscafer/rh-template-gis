interface IMapApi {
  mapApi: any;
  name: string;
  mapId: string;
  onLoadComplete?: () => void;
  getMapList(): any[];
  initBMap(): void;
  init(): void;
}

// 瓦片地图参数
interface ITileLayerConfig {
  url: string;
  zIndex: number;
}

interface TileLayerConfigType {
  AMap?: ITileLayerConfig;
  AMap_Sate?: ITileLayerConfig[];
  AMap_Google?: ITileLayerConfig;
  AMap_GoogleSate?: ITileLayerConfig[];
  AMap_icttic?: ITileLayerConfig;
}

interface IMapParam {
  theme: string;
  apiType: string;
  siteRoot: string;
  drawVehicleTrackLineTime: number;
  trackLineMaxPointCount: number;
  trackingVehicleZoom: number;
  addressApi: string;
  isOpenVehicleCluser: boolean;
  isOpenFlagCluser: boolean;
  vehicleCluserMaxZoom: number;
  vehicleClusterMinSize: number;
  isShowTrafficControl: boolean;
  isShowClusterControl: boolean;
  isShowLayerControl: boolean;
  isShowVehicleRealTrack: boolean;
  isOpenMapInnerIPMode: boolean;
  vehicleRealTrackCount: number;
  enableCluserRightClick: boolean;
  currentLayer: string;
  currentLayerName: string;
  vehicleIconConfig: any;
  isShowAllTrackPoint: boolean;
  isShowTrackDirection: boolean;
  vehicleBgClass: string;
  flagBgClass: string;
  poiBgClass: string;
  tkey: string;
  careLandKey: string;
  serverConfigUrl: string;
  iconRotate: boolean;
  mapCopyRight?: string;
  initMapParam(): void;
  //   setVehicleIconConfig(config: any): void;
  //   setServerConfigUrl(config: any): void;
  //   initVehicleIconConfig(): void;
}
