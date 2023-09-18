/*
 * @Description: map初始化配置文件
 */
const mapConfig = {
  Map: {
    //Map 初始化参数
    center: [120.1753355094545, 30.250438114340312], //地图中心点
    zoom: 14, //初始化缩放级别
    maxZoom: 25, //最大缩放比例
    minZoom: 4, //最小缩放比例
    pitch: 53.6, //俯仰角
    bearing: 0, //方位
    fog: true, //是否开启雾化
    spatialReference: 'EPSG:3857', //空间参考(EPSG) 默认为'EPSG:3857'， 投影坐标系配置为：identity
    resolutions: getResolutions(),
  },
};

function getResolutions(res: number[] = []) {
  const d = 2 * 6378137 * Math.PI;
  for (var i = 0; i < 25; i++) {
    res.push(d / (256 * Math.pow(2, i)));
  }
  return res;
}

export default mapConfig;
