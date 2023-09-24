/**
 * maptalks 扩展
 */

/**
 * 几何图形/map/layer等设置extData
 * @param {any} geometry 几何图形/map/layer等对象
 * @param {any} extData 扩展对象
 */
function _setExtData(geometry: { config: ((arg0: { extData: any }) => void) | undefined }, extData: any) {
  if (geometry.config != undefined) geometry.config({ extData: extData });
}

/**
 * 几何图形/map/layer等获取extData
 * @param {any} geometry 几何图形/map/layer等对象
 */
function _getExtData(geometry: { config: (() => { (): any; new (): any; extData: any }) | undefined }) {
  if (geometry.config != undefined) return geometry.config().extData;
  return null;
}

/**
 * 几何图形/map/layer等设置某个属性
 * @param {any} geometry 几何图形/map/layer等对象
 * @param {any} key 属性key
 * @param {any} value 要设置的值
 */
function _setConfig(geometry: { config: ((arg0: { key: any }) => void) | undefined }, key: any, value: any) {
  if (geometry.config != undefined) geometry.config({ key: value });
}

/**
 * 几何图形/map/layer等获取某个属性
 * @param {any} geometry 几何图形/map/layer等对象
 * @param {any} key 属性key
 * @param {any} value 要设置的值
 */
function _getConfig(
  geometry: { config: (() => { (): any; new (): any; [x: string]: any }) | undefined },
  key: string | number,
) {
  if (geometry.config != undefined) return geometry.config()[key];
  return null;
}
