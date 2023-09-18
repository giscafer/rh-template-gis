/*
 * @Description: 地图相关api方法库
 */
import { map } from '../init';
import { utils } from '../tools';
import mapConfig from '../config/map.config';

const { zoom, center, pitch, bearing } = mapConfig.Map;

export default {
  /**
   * @name: mapInitAnimation
   * @description: 地图初始化进入时的旋转特效
   */
  mapInitAnimation() {
    setTimeout(() => {
      map.animateTo(
        {
          zoom: zoom + 2,
          center: center,
          pitch: pitch,
          bearing: bearing,
        },
        {
          duration: 5000,
        },
      );
    }, 2000);
  },

  /**
   * @name: mapFullExtent
   * @description: 地图全幅 => 参数来自于默认设置mapConfig
   */
  mapFullExtent() {
    map.animateTo(
      {
        zoom: zoom,
        center: center,
        pitch: pitch,
        bearing: bearing,
      },
      {
        duration: 2000,
      },
    );
  },

  /**
   * @name: mapTo2Dview
   * @description: 2D视角
   */
  mapTo2Dview() {
    const { x, y } = map.getCenter();

    map.animateTo(
      {
        zoom: map.getZoom(),
        center: [x, y],
        pitch: 1,
        bearing: bearing,
      },
      {
        duration: 2000,
      },
    );
    map.options.dragPitch = false;
  },

  /**
   * @name: mapTo3Dview
   * @description: 3D视角
   */
  mapTo3Dview() {
    const { x, y } = map.getCenter();

    map.animateTo(
      {
        zoom: map.getZoom(),
        center: [x, y],
        pitch: pitch,
        bearing: bearing,
      },
      {
        duration: 2000,
      },
    );
    map.options.dragPitch = true;
  },

  /**
   * @name: zoomIn
   * @description: 放大
   */
  zoomIn() {
    map.animateTo(
      {
        zoom: map.getZoom() + 1,
      },
      {
        duration: 1000,
      },
    );
  },

  /**
   * @name: zoomOut
   * @description: 缩小
   */
  zoomOut() {
    map.animateTo(
      {
        zoom: map.getZoom() - 1,
      },
      {
        duration: 1000,
      },
    );
  },

  /**
   * @name: mapToCoordinate
   * @description: 地图定位到给定坐标 + 动画效果
   * @param {float} x
   * @param {float} y
   * @return null
   */
  mapToCoordinate(x: number, y: number) {
    map.animateTo(
      {
        zoom: map.getZoom() + (map.getZoom() > 17 ? 0 : 1),
        center: [x, y],
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      },
      {
        duration: 1000,
      },
    );
  },

  /**
   * @name: mapFullScreen
   * @description: 使某个元素进入全屏状态 返回当前是否是全屏状态
   * @param {element} el
   * @return {boolean}
   */
  mapFullScreen(el: Element) {
    // 地图全屏事件
    return utils.enterFullScreen(el);
  },
};
