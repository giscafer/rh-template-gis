import { MapParam } from '../map/params';

const scale: Record<string, any> = {
  2: '6.760654286410619e-9',
  3: '1.3521308572821239e-8',
  4: '2.7042617145642478e-8',
  5: '5.4085234291284955e-8',
  6: '1.0817046858256991e-7',
  7: '2.1634093716513982e-7',
  8: '4.3268187433027964e-7',
  9: '8.653637486605593e-7',
  10: '0.0000017307274973211186',
  11: '0.000003461454994642237',
  12: '0.000006922909989284474',
  13: '0.000013845819978568949',
  14: '0.000027691639957137897',
  15: '0.000055383279914275794',
  16: '0.00011076655982855159',
  17: '0.00022153311965710318',
  18: '0.00044306623931420635',
};

//瓦片地图参数 底图默认1，文字透明图层默认99
export const TileLayerConfig: TileLayerConfigType = {
  AMap: {
    url: 'https://webrd0{1,2,3,4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=[x]&y=[y]&z=[z]',
    zIndex: 1,
  },
  AMap_Sate: [
    {
      url: 'https://webst0{1,2,3,4}.is.autonavi.com/appmaptile?style=6&x=[x]&y=[y]&z=[z]',
      zIndex: 1,
    },
    {
      url: 'https://webst0{1,2,3,4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=[x]&y=[y]&z=[z]',
      zIndex: 2,
    },
  ],
  AMap_Google: {
    url: 'https://mt{1,2,3,0}.google.cn/vt/lyrs=m@225000000&hl=zh-CN&gl=cn&src=app&x=[x]&y=[y]&z=[z]&s=Galile',
    zIndex: 1,
  },
  AMap_GoogleSate: [
    {
      url: 'https://mt{1,2,3,0}.google.cn/vt/lyrs=s%40804&hl=zh-CN&gl=cn&src=app&x=[x]&y=[y]&z=[z]&s=Galile',
      zIndex: 1,
    },
    {
      url: 'https://mt{1,2,3,0}.google.cn/vt/imgtp=png32&lyrs=h@225000000&hl=zh-CN&gl=cn&src=app&x=[x]&y=[y]&z=[z]&s=Galile',
      zIndex: 2,
    },
  ],
  AMap_icttic: {
    url: 'http://{a,b,c}.qqearth.com:81/engine?st=GetImage&box=[x],[y]&lev=[z]&type=vect&uid=scdxbd',
    zIndex: 1,
  },
};

export default class LayerUtil {
  static tileLayerParam: any = {
    AMap: {
      urlTemplate: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      subdomains: ['1', '2', '3', '4'],
      minZoom: 4,
      maxZoom: 18,
      zIndex: 1,
      tileRetryCount: 3,
      crossOrigin: 'anonymous',
      renderer: 'canvas', //多车轨迹回放 使用webgl 渲染多个地图会卡顿，改为canvas
      forceRenderOnZooming: true,
    },
    AMap_Sate: [
      {
        urlTemplate: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        zIndex: 1,
        tileRetryCount: 3,
        renderer: 'canvas',
      },
      {
        urlTemplate: 'https://webst0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        zIndex: 2,
        tileRetryCount: 3,
        renderer: 'canvas',
      },
    ],
    AMap_Google: {
      urlTemplate: 'https://mt{s}.google.cn/vt/lyrs=m@225000000&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&s=Galile',
      subdomains: ['1', '2', '3', '0'],
      minZoom: 4,
      maxZoom: 19,
      zIndex: 1,
      tileRetryCount: 3,
      renderer: 'canvas',
    },
    AMap_GoogleSate: [
      {
        urlTemplate: 'https://mt{s}.google.cn/vt/lyrs=s%40804&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&s=Galile',
        subdomains: ['1', '2', '3', '0'],
        minZoom: 4,
        maxZoom: 19,
        zIndex: 1,
        tileRetryCount: 3,
        renderer: 'canvas',
      },
      {
        urlTemplate:
          'https://mt{s}.google.cn/vt/imgtp=png32&lyrs=h@225000000&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&s=Galile',
        subdomains: ['1', '2', '3', '0'],
        minZoom: 4,
        maxZoom: 19,
        zIndex: 2,
        tileRetryCount: 3,
        renderer: 'canvas',
      },
    ],
    AMap_icttic: {
      urlTemplate: 'http://{s}.qqearth.com:81/engine?st=GetImage&box={x},{y}&lev={z}&type=vect&uid=scdxbd',
      subdomains: ['a', 'b', 'c'],
      zIndex: 1,
      tileRetryCount: 3,
    },
    Tianditu: [
      {
        tileSystem: [1, -1, -180, 90],
        //urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
        urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}',
        subdomains: ['1', '2', '3', '4', '5'],
        zIndex: 1,
        spatialReference: {
          projection: 'EPSG:4326',
        },
        tileRetryCount: 3,
        crossOrigin: 'anonymous',
        renderer: 'canvas',
      },
      {
        tileSystem: [1, -1, -180, 90],
        //urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
        urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}',
        subdomains: ['1', '2', '3', '4', '5'],
        zIndex: 3,
        spatialReference: {
          projection: 'EPSG:4326',
        },
        tileRetryCount: 3,
        crossOrigin: 'anonymous',
        renderer: 'canvas',
      },
    ],
    Tianditu_Sate: [
      {
        tileSystem: [1, -1, -180, 90],
        //urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&l={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
        urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&l={z}',
        subdomains: ['1', '2', '3', '4', '5'],
        zIndex: 1,
        spatialReference: {
          projection: 'EPSG:4326',
        },
        tileRetryCount: 3,
        renderer: 'canvas',
      },
      {
        tileSystem: [1, -1, -180, 90],
        //urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=cia_c&x={x}&y={y}&l={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
        urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=cia_c&x={x}&y={y}&l={z}',
        subdomains: ['1', '2', '3', '4', '5'],
        zIndex: 2,
        spatialReference: {
          projection: 'EPSG:4326',
        },
        tileRetryCount: 3,
        renderer: 'canvas',
      },
    ],
    BMap: {
      //urlTemplate: 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl',
      urlTemplate: 'https://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&from=jsapi2_0',
      subdomains: [0, 1, 2, 3],
      zIndex: 1,
      minZoom: 4,
      maxZoom: 19,
      spatialReference: {
        projection: 'BAIDU',
      },
      tileRetryCount: 3,
      crossOrigin: 'anonymous',
      renderer: 'canvas',
    },
    BMap_Sate: [
      {
        urlTemplate:
          'https://maponline{s}.bdimg.com/starpic/?qt=satepc&u=x={x};y={y};z={z};v=009;type=sate&fm=46&v=009',
        subdomains: [0, 1, 2, 3],
        zIndex: 1,
        minZoom: 4,
        maxZoom: 19,
        spatialReference: {
          projection: 'BAIDU',
        },
        tileRetryCount: 3,
        renderer: 'canvas',
      },
      {
        //'urlTemplate': 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl',
        urlTemplate: 'https://maponline{s}.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&scaler=1&from=jsapi2_0',
        subdomains: [0, 1, 2, 3],
        zIndex: 2,
        minZoom: 4,
        maxZoom: 19,
        spatialReference: {
          projection: 'BAIDU',
        },
        tileRetryCount: 3,
        renderer: 'canvas',
      },
    ],
    JiuGang: [
      {
        tileSystem: [1, -1, -180, 90],
        //urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
        urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=vec_c&x={x}&y={y}&l={z}',
        subdomains: ['1', '2', '3', '4', '5'],
        zIndex: 1,
        spatialReference: {
          projection: 'EPSG:4326',
        },
        tileRetryCount: 3,
        renderer: 'canvas',
      },
      {
        tileSystem: [1, -1, -180, 90],
        //urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
        urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=cva_c&x={x}&y={y}&l={z}',
        subdomains: ['1', '2', '3', '4', '5'],
        zIndex: 2,
        spatialReference: {
          projection: 'EPSG:4326',
        },
        tileRetryCount: 3,
        renderer: 'canvas',
      },
    ],
    JiuGang_Sate: [
      {
        tileSystem: [1, -1, -180, 90],
        //urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&l={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
        urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&l={z}',
        subdomains: ['1', '2', '3', '4', '5'],
        zIndex: 1,
        spatialReference: {
          projection: 'EPSG:4326',
        },
        tileRetryCount: 3,
      },
      {
        tileSystem: [1, -1, -180, 90],
        //urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=cia_c&x={x}&y={y}&l={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
        urlTemplate: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_c&x={x}&y={y}&l={z}',
        subdomains: ['1', '2', '3', '4', '5'],
        zIndex: 2,
        spatialReference: {
          projection: 'EPSG:4326',
        },
        tileRetryCount: 3,
        renderer: 'canvas',
      },
    ],
    Ningbogang: [
      {
        urlTemplate: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        minZoom: 4,
        maxZoom: 18,
        zIndex: 1,
        tileRetryCount: 3,
        crossOrigin: 'anonymous',
        renderer: 'canvas',
      },
      {
        urlTemplate:
          'http://47.98.185.125:6080/arcgis/rest/services/%E5%AE%81%E6%B3%A2%E6%B8%AF/MapServer/tile/{z}/{y}/{x}',
        minZoom: 11,
        maxZoom: 18,
        tileRetryCount: 3,
        crossOrigin: 'anonymous',
        renderer: 'canvas',
        spatialReference: {
          projection: 'EPSG:3857',
          //坐标转换规则
          //console.log(map.getProjection().project(new maptalks.Coordinate(121.537975, 29.766565)));
          fullExtent: {
            top: 3509761,
            bottom: 3473579,
            right: 13594524,
            left: 13529545,
          },
        },
      },
    ],
  };

  static trafficLayerParam = {
    AMap_Traffic: {
      urlTemplate: function (x: string, y: string, z: string) {
        return (
          MapParam.siteRoot + '/tile/gdtraffic?x=' + x + '&y=' + y + '&z=' + z + '&t=' + new Date().getTime().toString()
        );
      },
      zIndex: 5,
      maxZoom: 17,
      minZoom: 6,
      background: false,
    },
    BMap_Traffic: {
      //'urlTemplate': 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl',
      urlTemplate: function (x: string, y: string, z: string) {
        return (
          'https://its.map.baidu.com/traffic/TrafficTileService?label=web2D&v=081&smallflow=1&time=' +
          new Date().getTime().toString() +
          '&x=' +
          x +
          '&y=' +
          y +
          '&level=' +
          z
        );
      },
      //zoomOffset: 1,
      zIndex: 5,
      maxZoom: 18,
      minZoom: 6,
      background: false,
      spatialReference: {
        projection: 'BAIDU',
      },
    },
  };

  static scale = scale;

  static getOffset = function (iconSize: { width: number; height: any }, aMapOffset: { x: number; y: any }) {
    return {
      x: aMapOffset.x + iconSize.width / 2,
      y: aMapOffset.y + iconSize.height,
    };
  };

  static hasTraffic = function (prjCode: string) {
    return prjCode == 'BAIDU' || prjCode == 'EPSG:3857';
  };

  //获取路况图层信息
  static getTrafficParam = function (prjCode: string, style: string) {
    let filter = style == 'normal' ? {} : { cssFilter: 'sepia(100%) invert(90%)' };

    if (prjCode == 'BAIDU') {
      return Object.assign(LayerUtil.trafficLayerParam['BMap_Traffic'], filter);
    } else if (prjCode == 'EPSG:3857') {
      return Object.assign(LayerUtil.trafficLayerParam['AMap_Traffic'], filter);
    }

    return null;
  };

  /**
   * 根据地图类型获取
   * @param {any} prjCode
   */
  static getPositionType = function (prjCode: any) {
    let pType;
    switch (prjCode) {
      case 'EPSG:3857':
        pType = 'GCJ02';
        break;
      case 'BAIDU':
        pType = 'BD09';
        break;
      default:
        pType = 'WGS84';
        break;
    }
    return pType;
  };
  /**
   * 计算文字高宽（大致）
   * @param {any} str 文字
   * @param {any} wrapChar 换行符
   * @param {any} fontSize 文字大小
   */
  static getTextSize = function (str: string, wrapChar: any, fontSize: number) {
    let textSize = { width: 0, height: 0 };
    let lines = str.split(wrapChar);
    let tmpWidth = 0;
    // eslint-disable-next-line guard-for-in
    for (const i in lines) {
      //数字宽度不同
      let numLength = lines[i].replace(/\D/g, '').length;

      tmpWidth = (lines[i].length - numLength) * fontSize + numLength * 8;
      // tmpWidth = lines[i].length * fontSize; //文字大概宽度
      if (textSize.width < tmpWidth) {
        textSize.width = tmpWidth;
      }
    }
    if (lines[lines.length - 1] == '') {
      textSize.height = (fontSize + 2) * (lines.length - 1);
    } else {
      textSize.height = (fontSize + 2) * lines.length;
    }
    return textSize;
  };
  static initTileLang = function (lang: any) {
    switch (lang) {
      case 'en':
      case 'ar':
      case 'es':
      case 'ru':
        //url
        LayerUtil.tileLayerParam.AMap.urlTemplate = LayerUtil.tileLayerParam.AMap.urlTemplate.replace(
          'lang=zh_cn',
          'lang=en',
        );
        LayerUtil.tileLayerParam.AMap_Sate[1].urlTemplate = LayerUtil.tileLayerParam.AMap_Sate[1].urlTemplate.replace(
          'lang=zh_cn',
          'lang=en',
        );
        LayerUtil.tileLayerParam.AMap_Google.urlTemplate = LayerUtil.tileLayerParam.AMap_Google.urlTemplate.replace(
          '&hl=zh-CN&gl=cn',
          '&hl=en-US&gl=us',
        );
        LayerUtil.tileLayerParam.AMap_GoogleSate[0].urlTemplate =
          LayerUtil.tileLayerParam.AMap_GoogleSate[0].urlTemplate.replace('&hl=zh-CN&gl=cn', '&hl=en-US&gl=us');
        LayerUtil.tileLayerParam.AMap_GoogleSate[1].urlTemplate =
          LayerUtil.tileLayerParam.AMap_GoogleSate[1].urlTemplate.replace('&hl=zh-CN&gl=cn', '&hl=en-US&gl=us');
        break;
      default:
        break;
    }
  };
  /**
   * 设置图标的文字背景色
   * @param {object} markerOption
   * @param {object} userConfig
   * @param {int} fontSize
   * 文字颜色优先级 markerLabelBgCssClass == 'markerlabel-redfont'> markerOption.textColor > userConfig.textConfig
   */
  static getSymbol = function (
    markerOption: {
      icon: { iconSize: { width: any; height: any }; offset: any; path: any };
      type: any;
      labeltxt: any;
      angle: string;
      textColor: string;
    },
    userConfig: { vehicle: any; flag: any; poi: any },
    fontSize: any,
  ) {
    let newOffset = LayerUtil.getOffset(markerOption.icon.iconSize, markerOption.icon.offset);
    //图标类型
    let markerType = markerOption.type;
    let _userConfig;
    //webconfig 中的设置的图标文字背景
    let markerLabelBgCssClass = '';
    if (markerType == 'vehicle') {
      markerLabelBgCssClass = MapParam.vehicleBgClass;
      _userConfig = userConfig && userConfig.vehicle ? userConfig.vehicle : { textColor: '#000', isShowBorder: false };
    } else if (markerType == 'flag') {
      markerLabelBgCssClass = MapParam.flagBgClass;
      _userConfig = userConfig && userConfig.flag ? userConfig.flag : { textColor: '#000', isShowBorder: false };
    } else if (markerType == 'poi') {
      markerLabelBgCssClass = MapParam.poiBgClass;
      _userConfig = userConfig && userConfig.poi ? userConfig.poi : { textColor: '#000', isShowBorder: false };
    }
    let symbol = null;
    if (markerLabelBgCssClass == '') {
      const textSize = LayerUtil.getTextSize(markerOption.labeltxt, '<br>', fontSize);
      symbol = [
        {
          markerFile: markerOption.icon.path,
          markerRotation: MapParam['iconRotate'] ? -parseInt(markerOption.angle) : 0, //图标旋转
          markerWidth: markerOption.icon.iconSize.width,
          markerHeight: markerOption.icon.iconSize.height,
          markerDx: newOffset.x,
          markerDy: newOffset.y,
        },
        {
          // box's symbol
          markerType: 'square', //矩形
          markerFill: '#f3f3f3', //填充色
          markerFillOpacity: _userConfig.isShowBorder == false ? 0 : 1, //透明度
          markerLineColor: '#ccc', //边框颜色
          markerLineWidth: _userConfig.isShowBorder == false ? 0 : 1,
          markerWidth: textSize.width, //根据文字获取动态宽度
          markerHeight: textSize.height, //根据文字获取动态高度
          markerDx: newOffset.x,
          markerDy: newOffset.y,
          markerVerticalAlignment: 'bottom',
        },
        {
          textName: markerOption.labeltxt,
          textWrapCharacter: '<br>',
          textSize: fontSize, //字体大小
          textFaceName: 'microsoft yahei',
          textFill: markerOption.textColor == '' ? _userConfig.textColor : markerOption.textColor,
          textWeight: 'bold',
          textHaloFill: '#fff',
          textHaloRadius: 1,
          textDy: newOffset.y + 2,
          textVerticalAlignment: 'bottom',
        },
      ];
    } else if (markerLabelBgCssClass == 'markerlabel-writebg') {
      const textSize = LayerUtil.getTextSize(markerOption.labeltxt, '<br>', fontSize);
      symbol = [
        {
          markerFile: markerOption.icon.path,
          //'markerType': 'path',
          //'markerPathWidth': 800,
          //'markerPathHeight': 800,
          //'markerPath': {
          //    "path":"M184 818.1h657c19.2 0 37.1-6.9 50.5-19.4 13.6-12.6 21.1-29.6 21.1-47.8V626.7c0-36.4-32.8-67.2-71.6-67.2H656.4l-19.2-112.3c64.1-36.4 103.7-103.2 103.7-175.5 0-27.6-6-54.6-17.8-80.1-11.4-24.6-27.6-46.8-48.2-65.9-42.6-39.4-98.6-61.1-157.9-61.1-60.2 0-116.8 21.5-159.4 60.4-42.7 39.1-66.3 91.2-66.3 146.7 0 72.3 39.6 139 103.7 175.5l-19.2 112.3H184c-19.2 0-37.1 6.9-50.5 19.4-13.6 12.6-21.1 29.6-21.1 47.8v124.2c0 36.4 32.8 67.2 71.6 67.2z m7.9-180.1h192.2c35 0 65.5-26.7 69.7-60.8l24.7-123.9 0.1-0.4c4-27.7-9.8-53.5-35.9-67.4-42.9-22.8-68.5-64.7-68.5-112.1 0-72.9 64-132.1 142.7-132.1 78.7 0 142.7 58.5 142.7 130.4 0 47.4-25.6 89.3-68.5 112.1-25.5 13.6-40 41.3-35.9 69.1v0.2L580 577.2c4.2 34.1 34.8 60.8 69.8 60.8h183.4v103.4H191.9V638zM887.7 875.9H137.3c-22.1 0-40.2 18.1-40.2 40.2s18.1 40.2 40.2 40.2h750.4c22.1 0 40.2-18.1 40.2-40.2s-18-40.2-40.2-40.2z",
          //     'fill': '#DE3333',
          //    'stroke': '#000'
          //},
          markerRotation: MapParam['iconRotate'] ? -parseInt(markerOption.angle) : 0, //图标旋转
          markerWidth: markerOption.icon.iconSize.width,
          markerHeight: markerOption.icon.iconSize.height,
          markerDx: newOffset.x,
          markerDy: newOffset.y,
        },
        {
          // box's symbol
          markerType: 'square', //矩形
          markerFill: '#f3f3f3', //填充色
          markerFillOpacity: 1, //透明度
          markerLineColor: '#ccc', //边框颜色
          markerLineWidth: 1,
          markerWidth: textSize.width, //根据文字获取动态宽度
          markerHeight: textSize.height, //根据文字获取动态高度
          markerDx: newOffset.x,
          markerDy: newOffset.y,
          markerVerticalAlignment: 'bottom',
        },
        {
          textName: markerOption.labeltxt,
          textWrapCharacter: '<br>',
          textSize: fontSize,
          textFaceName: 'microsoft yahei',
          textFill: markerOption.textColor == '' ? _userConfig.textColor : markerOption.textColor,
          textWeight: 'bold',
          textHaloFill: '#fff',
          textHaloRadius: 1,
          textDy: newOffset.y + 2,
          textVerticalAlignment: 'bottom',
        },
      ];
    } else if (markerLabelBgCssClass == 'markerlabel-redfont') {
      symbol = [
        {
          markerFile: markerOption.icon.path,
          markerRotation: MapParam['iconRotate'] ? -parseInt(markerOption.angle) : 0, //图标旋转
          markerWidth: markerOption.icon.iconSize.width,
          markerHeight: markerOption.icon.iconSize.height,
          markerDx: newOffset.x,
          markerDy: newOffset.y,
        },
        {
          textName: markerOption.labeltxt,
          textWrapCharacter: '<br>',
          textSize: fontSize, //字体大小fontSize == "" ? 12 : fontSize
          textFaceName: 'microsoft yahei',
          textFill: 'red',
          textWeight: 'bold',
          textHaloFill: '#fff',
          textHaloRadius: 1,
          textDy: newOffset.y + 2,
          textVerticalAlignment: 'bottom',
        },
      ];
    }

    return symbol;
  };
}
