/*
 * @Description: 图层控制方法库
 */
import { baseLayerConfig } from '../config/baseLayer.config';
import { map } from '../init';

export default {
  allBaseLayerId: [], // 所有图层id

  /**
   * @name: getAllBaseGroupName
   * @description: 获取baseLayerConfig所有图层组名
   * @param null
   * @return {array}
   */
  getAllBaseGroupName() {
    return Object.values(baseLayerConfig)
      .sort((a, b) => a.index - b.index)
      .map((item) => item.groupName);
  },

  /**
   * @name: getAllBaseLayerId
   * @description: 获取baseLayerConfig所有图层的id
   * @param null
   * @return {array}
   */
  getAllBaseLayerId() {
    return this.allBaseLayerId.length
      ? this.allBaseLayerId
      : (() => {
          this.allBaseLayerId = Object.values(baseLayerConfig).reduce((prev, item) => {
            return [...prev, ...item.layers.map((layer) => layer._id)];
          }, []);

          return this.allBaseLayerId;
        })();
  },

  /**
   * @name: getBaseLayerIdByGroupName
   * @description: 获取baseLayerConfig指定组下的所有图层id
   * @param {string} groupName
   * @return {array}
   */
  getBaseLayerIdByGroupName(groupName) {
    const group = Object.values(baseLayerConfig).find((item) => item.groupName === groupName);
    return group ? group.layers.map((item) => item._id) : [];
  },

  /**
   * @name: hideAllBasicLayer
   * @description: 隐藏所有baseLayer
   * @param null
   * @return null
   */
  hideAllBasicLayer() {
    const allBaseLayerId = this.getAllBaseLayerId();

    allBaseLayerId.forEach((item) => {
      map.getLayer(item).options.visible = false;
    });
  },

  /**
   * @name: showLayerByGroupName
   * @description: 显示指定底图
   * @param {string} groupName
   * @return null
   */
  showLayerByGroupName(groupName) {
    this.hideAllBasicLayer();

    this.getBaseLayerIdByGroupName(groupName).forEach((item) => {
      map.getLayer(item).options.visible = true;
    });
  },

  /**
   * @name: showOrHideLayerByLayerId
   * @description: 显示或隐藏指定id的底图
   * @param {string | array} id
   * @param {boolean} show
   * @return null
   */
  showOrHideLayerByLayerId(id, show) {
    if (typeof id === 'string') {
      map.getLayer(id).options.visible = show;
    } else if (Array.isArray(id)) {
      id.forEach((item) => {
        map.getLayer(item).options.visible = show;
      });
    }
  },

  /**
   * @name: getBaseLayerObjById
   * @description: 获取指定id的底图对象
   * @param {string} id
   * @return {object | undefined}
   */
  getBaseLayerObjById(id) {
    const layer = Object.values(baseLayerConfig)
      .reduce((prev, item) => [...prev, ...item.layers], [])
      .find((item) => item._id === id);

    return layer;
  },
};
