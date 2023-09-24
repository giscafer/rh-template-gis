import * as maptalks from 'maptalks';
import LayerUtil from '../layer/LayerUtil';
import GpsConvert from '../tools/gps-convert';
import HashTable from '../utils/hashtable';
import { MapParam } from './params';

export default class RhMap {
  apiName = 'RhMap';
  mapObj: any = null;
  initCompleted = false;
  placeSearch = null;
  //点覆盖物组 二位数组 [type,HashTable]， HashTable[key,marker]
  //type: vehicle、flag、poi
  _markerType: string[] = ['vehicle', 'flag', 'poi'];
  _vLayers = {
    vehicle: {
      id: 'vehicle',
      name: '车辆',
      order: 10,
      zIndex: 100,
      layer: null,
      clusterLayer: null,
      cluster: true,
      maxClusterZoom: 15,
    },
    flag: {
      id: 'flag',
      name: '标注',
      order: 20,
      zIndex: 100,
      layer: null,
      clusterLayer: null,
      cluster: true,
      maxClusterZoom: 16,
    },
    poi: { id: 'poi', name: 'POI', order: 30, zIndex: 100, layer: null, clusterLayer: null, cluster: false },
    polyline: { id: 'polyline', name: '路线', order: 40, zIndex: 90, layer: null, clusterLayer: null, cluster: false },
    polygon: { id: 'polygon', name: '区域', order: 50, zIndex: 90, layer: null, clusterLayer: null, cluster: false },
    temp: { id: 'temp', name: '临时', order: 60, zIndex: 100, layer: null, clusterLayer: null, cluster: false },
  };

  markerArray: any = {};

  _trackList: any = {}; //vehicleId为key
  //气泡框
  _infoWindow: any = null;
  _infoWindowObjId = '';
  //车辆点聚合
  _clusterList = {};

  //marker更新变量缓存
  _drawingMarkers: any = {};
  _updatingMarkers: any = {};
  _removingMarkers: any = {};

  mouseTool: any;
  distanceTool: any;
  _handleMarkersTimeout = null;

  mouseCurrCursor = 'default'; //当前鼠标tool

  _container: any;
  //事件
  _clickCallback = null;
  _rightClickCallback = null;

  _defaultMapOpt = {
    style: 'normal', //地图样式 参考地址：https://lbs.amap.com/api/javascript-api/guide/map/map-style/
    tool: 'normal', //tool目前支持normal、none
  };
  _mapOpt: any;

  //当前投影类型Code, 外部投影坐标
  _currentPrjCode = 'EPSG:3857';
  _outPrjCode = 'EPSG:4326';
  _gcjPrjCode = 'EPSG:3857';

  //zoomControl 控件
  zoomControl: any = null;

  //地图工具状态
  mapToolStatus = {
    //traffic: "off",
    cluster: 'off',
    //weatherAlarm: "off",
    layer: {
      vehicle: true,
      flag: true,
      poi: true,
      polyline: true,
      polygon: true,
      traffic: false,
      weatherAlarm: false,
    },
    mapCopyRight: MapParam.mapCopyRight,
  };

  //获取地图对象
  getMapObj() {
    return this.mapObj;
  }

  //#region 地图初始化
  //地图初始化
  init(container: any, lon: any, lat: any, zoom: any, mapOpt: { style?: string; tool?: string } = {}) {
    //opt处理
    // eslint-disable-next-line no-param-reassign
    this._mapOpt = mapOpt = this._initMapOpt(mapOpt);

    let opt = {
      center: [lon, lat],
      zoom: zoom,
      //centerCross:true,
      minZoom: 4,
      maxZoom: 18,
      dragRotate: false,
      dragPitch: false,
      seamlessZoom: false, //关闭小数层级
      zoomAnimation: false, //关闭这个  不然放大缩小 有bug
      panAnimation: false, //关闭地图移动动画（修复bug B2022051900162）
      //scrollWheelZoom:false,
      //zoomControl: (mapOpt.tool == 'none' || mapOpt.tool=="simple") ? false : {
      //    'position': 'top-left',
      //    'slider': true,
      //    'zoomLevel': true
      //},   //缩放控件
      scaleControl: mapOpt.tool != 'none', //比例尺
      overviewControl: mapOpt.tool == 'none' ? false : { maximize: false }, //鹰眼
      attribution: false, //版权-审图号
      baseLayer: this._initDefaultLayersAndProjection(mapOpt.style), //基础地图
      spatialReference: {
        projection: this._currentPrjCode,
      },
    };

    this.mapObj = new maptalks.Map(container, opt);
    this._container = container;
    ////初始化参数
    for (const type of this._markerType) {
      this.markerArray[type] = new HashTable();
      this._drawingMarkers[type] = new HashTable();
      this._updatingMarkers[type] = new HashTable();
      this._removingMarkers[type] = new HashTable();
    }

    //地图信息窗
    this._infoWindow = new maptalks.ui.InfoWindow({
      autoPan: true, //set it to false if you don't want the map to do panning animation to fit the opened window.
      autoOpenOn: false,
      autoCloseOn: 'click', //点击地图自动关闭信息窗
      animation: false,
      animationDuration: 0,
      //eventsPropagation:true, //设置 信息窗体中的事件会失效 whether stop ALL events' propagation.
      eventsToStop: 'mousewheel wheel', //信息窗体  鼠标滚轮事件不冒泡   火狐 wheel   其他mousewheel
      width: 'auto',
      autoPanDuration: -1, //取消移动动画
      dx: 4, //横向x偏移
      dy: -40, //纵向y偏移 -20
    }).addTo(this.mapObj);

    //绘图工具，支持 Point, LineString, Polygon, Circle, Ellipse, Rectangle, ArcCurve, QuadBezierCurve, CubicBezierCurve
    this.mouseTool = new maptalks.DrawTool({
      mode: 'Point',
      once: false,
      blockGeometryEvents: true,
    })
      .addTo(this.mapObj)
      .disable();

    // this.mouseTool.on('drawend', _mouseToolDrawComplete);

    // this.mapObj.on('spatialreferencechange', this._onSpatialReferenceChange);

    if (MapParam.isShowVehicleRealTrack) {
      //小尾巴监听缩放级别改变事件
      this.mapObj.on('zoomend', this._zoomChangeEvent);
    }

    this._initMapEvent();

    this.initCompleted = true;

    //window.addEventListener('resize', () => {
    //    //重新加载地图尺寸
    //    console.log("map resize")
    //    this.mapObj.checkSize();
    //})
    return this.mapObj;
  }

  //初始化opt
  _initMapOpt(mapOpt: { style?: string; tool?: string } = {}) {
    const newMapOpt = Object.assign({}, this._defaultMapOpt, mapOpt);
    if (newMapOpt.style == '') newMapOpt.style = 'normal';
    if (newMapOpt.tool == '') newMapOpt.tool = 'normal';
    return newMapOpt;
  }

  _initMapEvent(this: any) {
    // 选择需要观察变动的节点
    const targetNode = document.getElementById('map');
    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, subtree: true }; // childList: true, subtree: true
    // 当观察到变动时执行的回调函数
    const callback = (mutationsList: any, observer: any) => {
      // Use traditional 'for loops' for IE 11
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          if (mutation.target.outerHTML.indexOf('<canvas') == 0 && mutation.attributeName == 'style') {
            if (this._infoWindow && this._infoWindow.isVisible()) {
              let lnglat = this._infoWindow._coordinate;
              let p = this._coordConvert(lnglat.y, lnglat.x, this._currentPrjCode, this._gcjPrjCode);
              this._getAddressFromServer(p.lon, p.lat, (result: any) => {
                try {
                  if (this._infoWindow.content) {
                    //获取id
                    this._infoWindow.content = this._infoWindow.content.replace('正在解析地理位置......', result);
                    this._infoWindow.show(this._lnglat);
                  }
                } catch (e) {}
              });
            }
          }
        }
      }
    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    if (targetNode) {
      observer.observe(targetNode, config);
    }

    //点击事件
    //聚合点点击事件 和聚合点右键事件存在问题 需要重写
    this.mapObj.on('click', (e: any) => {
      let coord = e.coordinate;
      let opt = { onlyCluster: true };
      let cluster;
      let zoom = this.mapObj.getZoom();
      //var fired = false;
      for (let key in this._clusterList) {
        if (zoom > this._clusterList[key].options['maxClusterZoom'] || !this._clusterList[key].isVisible()) continue;
        cluster = this._clusterList[key].identify(coord, opt);
        if (cluster != null && cluster.center) {
          //当鼠标是漫游的时候  才可以点击聚合点放大
          if (this.mouseCurrCursor == 'default' || this.mouseCurrCursor == 'pan') {
            this.mapObj.setCenterAndZoom(cluster.center, zoom + 2);
            // fired = true;
            break;
          }
        }
      }
      //if (_clickCallback) {
      //    var lonlat = _coordConvertOut(e.coordinate.y, e.coordinate.x);
      //    _clickCallback([e.containerPoint.x, e.containerPoint.y], [lonlat.lon, lonlat.lat], 'click');
      //}
    });

    //右键事件
    this.mapObj.on('contextmenu', (e: any) => {
      let coord = e.coordinate;
      let fired = false;

      if (!fired && this._rightClickCallback) {
        let lonlat = this._coordConvertOut(e.coordinate.y, e.coordinate.x);

        //获取周围60px 像素距离的顶点
        let zoom = this.mapObj.getZoom();
        let pixel = this.mapObj.coordinateToContainerPoint(e.coordinate, zoom);
        //东北点坐标
        let nePixel = new maptalks.Point(pixel.x + 60, pixel.y - 60);
        let nelnglat = this.mapObj.containerPointToCoordinate(nePixel);
        //西南坐标
        let swPixel = new maptalks.Point(pixel.x - 60, pixel.y + 60);
        let swlnglat = this.mapObj.containerPointToCoordinate(swPixel);

        let minPoint = this._coordConvertOut(swlnglat.y, swlnglat.x); //左下角的点
        let maxPoint = this._coordConvertOut(nelnglat.y, nelnglat.x); //右上角的点

        this._rightClickCallback(
          [e.containerPoint.x, e.containerPoint.y],
          [lonlat.lon, lonlat.lat],
          [
            [minPoint.lon, minPoint.lat],
            [maxPoint.lon, maxPoint.lat],
          ],
          'rightclick',
        );
      }
    });

    //mouseup事件 当地图点击事件
    this.mapObj.on('mouseup', (e: any) => {
      if (this._clickCallback) {
        let lonlat = this._coordConvertOut(e.coordinate.y, e.coordinate.x);
        this._clickCallback([e.containerPoint.x, e.containerPoint.y], [lonlat.lon, lonlat.lat], 'click');
      }
    });
  }

  //缩放级别改变事件
  _zoomChangeEvent(this: any) {
    if (!MapParam.isShowVehicleRealTrack) return;
    let currZoom = this.mapObj.getZoom();
    if (currZoom <= MapParam.vehicleCluserMaxZoom) {
      //需要隐藏所有小尾巴
      const tmpArray = this._vlineList.getHashTable();
      for (const i in tmpArray) {
        if (tmpArray[i].getLayer() != null) tmpArray[i].remove();
      }
    } else {
      //显示所有小尾巴
      const tmpArray = this._vlineList.getHashTable();
      for (const i in tmpArray) {
        if (tmpArray[i].getLayer() == null) tmpArray[i].addTo(this._vLayers['polyline'].layer);
      }
    }
  }

  /**
   * 地图点击事件
   * @param {any} callback 回调函数，参数([x,y],[lon,lat],'click')
   */
  onClick(callback: any) {
    if (callback != null) {
      this._clickCallback = callback;
    }
    return;
  }
  /**
   * 地图右键点击事件
   * @param {any} callback 回调函数，参数([x,y],[lon,lat],'rightclick')
   */
  onRightClick(callback: any) {
    if (callback != null) {
      this._rightClickCallback = callback;
    }
  }

  /**
   * 获取地图默认显示图层
   * @param {any} mapStyle 样式 normal-正常，其他-深蓝
   */
  _initDefaultLayersAndProjection(mapStyle?: string) {
    let defaultLayers = {};
    let tileParam = LayerUtil.tileLayerParam[MapParam.currentLayer];
    let filter = mapStyle == 'normal' ? {} : { cssFilter: 'sepia(100%) invert(90%)' };
    let baseLayers = [];
    if (!(tileParam instanceof Array)) {
      tileParam = [tileParam];
    }
    let layerType = MapParam.currentLayer;

    // eslint-disable-next-line guard-for-in
    for (let j in tileParam) {
      //添加天地图key
      if (
        layerType == 'Tianditu' ||
        layerType == 'Tianditu_Sate' ||
        layerType == 'JiuGang' ||
        layerType == 'JiuGang_Sate'
      ) {
        if (typeof tileParam[j].urlTemplate == 'string') {
          if (tileParam[j].urlTemplate.indexOf('&tk=') == -1) {
            tileParam[j].urlTemplate = tileParam[j].urlTemplate + '&tk=' + MapParam.tkey;
          }
        }
      }
      baseLayers.push(new maptalks.TileLayer('base' + j.toString(), Object.assign(tileParam[j], filter)));
    }

    this._currentPrjCode =
      tileParam[0].spatialReference && tileParam[0].spatialReference.projection
        ? tileParam[0].spatialReference.projection
        : this._gcjPrjCode;
    if (baseLayers.length > 1) {
      return new maptalks.GroupTileLayer('base', baseLayers);
    } else {
      return baseLayers[0];
    }
  }
  /**
   * 切换图层
   * @param {any} layerType 图层Id
   * @param {any} layerName 图层名称
   */
  changeBaseLayer(layerType: string, layerName: string) {
    console.log(layerType, layerName);
    if (layerType == MapParam.currentLayer || LayerUtil.tileLayerParam[layerType] == undefined) return;

    let filter = this._mapOpt.style == 'normal' ? {} : { cssFilter: 'sepia(100%) invert(90%)' };
    //var needDelLayers = this.mapObj.getLayers(function (layer) {//不包含baseLayer
    //    return (layer instanceof maptalks.TileLayer);
    //});
    //if (needDelLayers.length > 0)
    //    this.mapObj.removeLayer(needDelLayers);

    let tileParam = LayerUtil.tileLayerParam[layerType];
    let baseLayers = [];
    if (tileParam instanceof Array) {
      // eslint-disable-next-line guard-for-in
      for (const j in tileParam) {
        //添加天地图key
        if (
          layerType == 'Tianditu' ||
          layerType == 'Tianditu_Sate' ||
          layerType == 'JiuGang' ||
          layerType == 'JiuGang_Sate'
        ) {
          if (typeof tileParam[j].urlTemplate == 'string') {
            if (tileParam[j].urlTemplate.indexOf('&tk=') == -1) {
              tileParam[j].urlTemplate = tileParam[j].urlTemplate + '&tk=' + MapParam.tkey;
            }
          }
        }
        baseLayers.push(new maptalks.TileLayer('base' + j.toString(), Object.assign(tileParam[j], filter)));
      }
    }

    if (baseLayers.length > 1) {
      this.mapObj.setBaseLayer(new maptalks.GroupTileLayer('base', baseLayers));
    } else {
      this.mapObj.setBaseLayer(baseLayers[0]);
    }

    let firstParam = tileParam instanceof Array ? tileParam[0] : tileParam;
    this.mapObj.config({
      minZoom: firstParam.minZoom > 0 ? firstParam.minZoom : 4,
      maxZoom: firstParam.maxZoom > 0 ? firstParam.maxZoom : 18,
      spatialReference:
        firstParam.spatialReference != undefined ? firstParam.spatialReference : { projection: this._gcjPrjCode },
    });
    let currentZoom = this.mapObj.getZoom();
    if (currentZoom > firstParam.maxZoom) this.mapObj.setZoom(firstParam.maxZoom);
    else if (currentZoom < firstParam.minZoom) this.mapObj.setZoom(firstParam.minZoom);

    MapParam.currentLayer = layerType;
    MapParam.currentLayerName = layerName;
    //高德、高德卫星、四维地图显示马良专版（宁波港）地图
    if (!(layerType === 'AMap' || layerType === 'AMap_Sate' || layerType === 'AMap_icttic')) {
      //关闭图层
      // _ningbogangLayerOff();
    }
  }

  //#region 地图中心、级别 设置和获取、地图偏移
  //获取当前地图中心、级别、地图名称
  getMapView() {
    let center = this.mapObj.getCenter();
    let lonlat = this._coordConvertOut(center.y, center.x);
    return (
      lonlat.lon +
      ',' +
      lonlat.lat +
      ',' +
      this.getZoom() +
      ',' +
      MapParam.currentLayer +
      ',' +
      MapParam.currentLayerName
    );
  }
  //设置当前地图中心、级别、地图名称
  setMap(mapExtent: string) {
    if (mapExtent) {
      let args = mapExtent.split(',');
      if (args.length >= 3) {
        this.setZoomAndCenter(args[2], args[0], args[1]);
      }
      if (args.length >= 5) {
        this.changeBaseLayer(args[3], args[4]);
      }
    }
  }
  //设置中心点,设置级别
  setZoomAndCenter(level: any, lon: any, lat: any) {
    if (level && lon && lat) {
      let point = this._coordConvertIn(lat, lon);
      this.mapObj.setCenterAndZoom([point.lon, point.lat], level);
    }
  }
  zoomToBound(swX: any, swY: any, neX: any, neY: any) {
    let swPoint = this._coordConvertIn(swY, swX);
    let nePoint = this._coordConvertIn(neY, neX);
    let sw = new maptalks.Coordinate(swPoint.lon, swPoint.lat);
    let ne = new maptalks.Coordinate(nePoint.lon, nePoint.lat);
    let extent = new maptalks.Extent(sw, ne);
    //var extent = new maptalks.Extent([swPoint.lon, swPoint.lat], [nePoint.lon, nePoint.lat]);
    this.mapObj.fitExtent(extent, 0);
  }
  getZoom() {
    return this.mapObj.getZoom();
  }
  setZoom(level: any) {
    this.mapObj.setZoom(level);
  }
  //设置中心点
  setCenter(lon: any, lat: any) {
    let point = this._coordConvertIn(lat, lon);
    this.mapObj.setCenter([point.lon, point.lat]);
  }
  //增加panBy接口，以像素为单位，沿x方向和y方向移动地图，x向右为正，y向下为正
  panBy(x: any, y: any) {
    this.mapObj.panBy([x, y]);
  }

  //#region 导出/打印地图
  //保存地图
  saveMap(callback: any) {
    try {
      let dataUrl = this.mapObj.toDataURL({
        mimeType: 'image/png', // or 'image/png'
        save: true, // to pop a save dialog
        fileName: 'map', // file name
      });
    } catch (e) {
      if (typeof callback != 'function') {
        let r = {
          result: -1,
          url: '',
        };
        callback(r);
      }
    }
  }

  printMap() {
    window.focus();
    window.print();
  }

  //#region 坐标转换
  //外部坐标转换为地图当前坐标系坐标
  _coordConvertIn(y: any, x: any, noFormat?: string) {
    return this._coordConvert(y, x, this._outPrjCode, this._currentPrjCode, noFormat);
  }

  //当前坐标转换为外部坐标
  _coordConvertOut(y: any, x: any, noFormat?: string) {
    return this._coordConvert(y, x, this._currentPrjCode, this._outPrjCode, noFormat);
  }

  _coordConvert(y: number, x: number, fromCode: string, toCode: string, noFormat?: string) {
    if (fromCode == toCode) return { lat: y, lon: x };

    let fun = fromCode.replace(':', '') + '_' + toCode.replace(':', '');
    return GpsConvert[fun](y, x, noFormat);
  }

  destroy() {
    this.mapObj.remove();

    //清除定时器
    if (this._handleMarkersTimeout) {
      clearTimeout(this._handleMarkersTimeout);
    }
    for (const i in this._trackList) {
      if (Object.prototype.hasOwnProperty.call(this._trackList, i)) {
        this._trackList[i]?.timeOut && clearTimeout(this._trackList[i].timeOut);
      }
    }
  }

  /**
   * @param content  弹出框内容html
   * @param x
   * @param y
   * @param showLocation 是否显示地理位置
   * @param addressText 地理位置信息
   */
  showInfoWindow(content: string, x: any, y: any, showLocation: boolean, addressText: string) {
    let position = this._coordConvertIn(y, x);
    // this._showInfoWindow(
    //   content,
    //   new maptalks.Coordinate(position.lon, position.lat),
    //   showLocation,
    //   addressText,
    // );
  }

  getInfoWindowOpenState() {
    if (!this._infoWindow) {
      return false;
    }
    return this._infoWindow?.isVisible?.();
  }

  closeInfoWindow() {
    if (this._infoWindow != null) {
      this._infoWindow.hide();
    }
  }
}
