export const MapParam: IMapParam = {
  theme: 'roothub',
  apiType: 'AMap',
  drawVehicleTrackLineTime: 100,
  trackLineMaxPointCount: 100,
  trackingVehicleZoom: -1,
  addressApi: 'BaiduMapJs',
  isOpenVehicleCluser: true,
  isOpenFlagCluser: true,
  vehicleCluserMaxZoom: 15,
  vehicleClusterMinSize: 5,
  isShowTrafficControl: true,
  isShowClusterControl: false,
  isShowLayerControl: false,
  isShowVehicleRealTrack: false,
  isOpenMapInnerIPMode: false,
  vehicleRealTrackCount: 3,
  enableCluserRightClick: false,
  currentLayer: 'AMap',
  currentLayerName: '高德地图',
  vehicleIconConfig: null,
  isShowAllTrackPoint: false,
  isShowTrackDirection: false,
  vehicleBgClass: '',
  flagBgClass: '',
  poiBgClass: '',
  tkey: '',
  careLandKey: '',
  serverConfigUrl: '',
  iconRotate: true,
  mapCopyRight: 'HuoMu',
  siteRoot: window.document.location.pathname.substring(
    0,
    window.document.location.pathname.substr(1).indexOf('/') + 1,
  ),
  initMapParam() {
    const ua = navigator.userAgent.toLowerCase();
    const browser: Record<string, boolean> = {};
    browser.isIE = ua.match(/msie/) != null || ua.match(/trident/) != null;
    browser.isIE8 = browser.isIE && ua.indexOf('trident/4.0') > -1;
    browser.isWinXP = ua.indexOf('windows nt 5.1') > -1 || ua.indexOf('windows xp') > -1;
    browser.isWin2003 = ua.indexOf('windows nt 5.2') > -1 || ua.indexOf('windows 2003') > -1;
    if (browser.isIE && (browser.isIE8 || browser.isWinXP || browser.isWin2003)) {
      this.isOpenVehicleCluser = false;
      this.isOpenFlagCluser = false;
    }
  },
};
