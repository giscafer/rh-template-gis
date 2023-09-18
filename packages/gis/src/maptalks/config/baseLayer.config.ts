/*
 * @Description: map图层配置文件
 */
import * as maptalks from 'maptalks';
// import { ArcGISTileLayer } from "maptalks.arcgistilelayer";
import { WMTSTileLayer } from 'maptalks.wmts';

const tdtKey = '334754f5c01e3e2b827ead5dc861195b';

// 图层配置
const baseLayerConfig = {
  tdt_YXT_Layer: {
    index: 0,
    groupName: '影像图',
    layers: [
      new maptalks.TileLayer('天地图影像图', {
        visible: false,
        minZoom: 0,
        maxZoom: 18,
        urlTemplate: `https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tdtKey}`,
        subdomains: ['0', '1', '2', '3', '4', '5'],
        opacity: 1,
      }),
      new maptalks.TileLayer('影像图标注', {
        visible: false,
        minZoom: 0,
        maxZoom: 18,
        urlTemplate: `https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${tdtKey}`,
        subdomains: ['1', '2', '3', '4', '5'],
        opacity: 1,
      }),
    ],
  },
  tdt_DXT_Layer: {
    index: 1,
    groupName: '地形图',
    layers: [
      new maptalks.TileLayer('天地图地形图', {
        visible: false,
        minZoom: 0,
        maxZoom: 18,
        //urlTemplate:https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=14&TILEROW=6747&TILECOL=13662&tk=
        urlTemplate: `https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tdtKey}`,
        subdomains: ['0', '1', '2', '3', '4', '5'],
      }),
      new maptalks.TileLayer('天地图标注', {
        visible: false,
        minZoom: 0,
        maxZoom: 18,
        urlTemplate: `https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${tdtKey}`,
        subdomains: ['1', '2', '3', '4', '5'],
        opacity: 1,
      }),
    ],
  },
  dark_Layer: {
    index: 2,
    groupName: '暗黑图',
    layers: [
      new WMTSTileLayer('暗黑蓝调地图', {
        //全国天地图
        opacity: 0.8,
        visible: false,
        minZoom: 0,
        maxZoom: 18,
        urlTemplate: `https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tdtKey}`,
        subdomains: ['0', '1', '2', '3', '4', '5'],
        cssFilter: 'sepia(60%) invert(90%)',
      }),
      new WMTSTileLayer('暗黑蓝调地图标注', {
        //全国天地图标注
        opacity: 0.8,
        visible: false,
        minZoom: 0,
        maxZoom: 18,
        urlTemplate: `https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${tdtKey}`,
        subdomains: ['1', '2', '3', '4', '5'],
        cssFilter: 'sepia(60%) invert(90%)',
      }),
    ],
  },
};

export { baseLayerConfig };
