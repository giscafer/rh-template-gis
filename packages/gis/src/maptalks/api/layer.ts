/*
 * @Description: 图层控制api方法库
 */
import { swipeLayer } from '../init';
import { utils, layerControl } from '../tools';

class Layer {
  currentGroupShow = ''; // 当前显示组
  beforeSwipeGroupShow = ''; // 在卷帘之前显示的组
  allBaseGroupName: string[] = []; // 所有图层组名
  renderer: any = null; // 渲染器
  swipeScaleValue = 0; // 卷帘比例值

  /**
   * @name: allBaseGroup
   * @description: 获取所有底图组名称
   * @param null
   * @return {array}
   */
  allBaseGroup() {
    return this.allBaseGroupName.length
      ? this.allBaseGroupName
      : (() => {
          this.allBaseGroupName = layerControl.getAllBaseGroupName();

          return this.allBaseGroupName;
        })();
  }

  /**
   * @name: showLayerByGroupName
   * @description: 显示指定底图组
   * @param {string} groupName
   * @return null
   */
  showLayerByGroupName(groupName = this.currentGroupShow) {
    this.currentGroupShow = groupName;
    utils.dispatchState('CURRENTGROUPSHOW', { currentGroupShow: this.currentGroupShow });
    layerControl.showLayerByGroupName(groupName);
  }

  /**
   * @name: getSwipeRenderer
   * @description: 获取卷帘图层渲染器
   */
  getSwipeRenderer() {
    if (swipeLayer) {
      this.renderer = this.renderer ? this.renderer : swipeLayer.getRenderer();
    }
  }

  /**
   * @name: swipe
   * @description: 地图卷帘
   * @param {boolean} state
   * @return null
   */
  swipe(state: boolean) {
    if (state) {
      layerControl.hideAllBasicLayer();
      this.beforeSwipeGroupShow = this.currentGroupShow;
      this.currentGroupShow = '影像图';
      utils.dispatchState('CURRENTGROUPSHOW', { currentGroupShow: this.currentGroupShow });

      // 显示指定图层
      layerControl.showOrHideLayerByLayerId(['天地图影像图', '天地图地形图', '天地图标注'], true);

      this.getSwipeRenderer();

      const _this = this;
      const canvasGetter = this.renderer.getCanvasImage;
      const dpr = utils.devicePixelRatio();

      // 覆写渲染器的默认的获取canvas图像的方法
      this.renderer.getCanvasImage = function () {
        const layerImage = canvasGetter.call(_this.renderer);
        if (!layerImage || !layerImage.image) {
          return layerImage;
        }

        const ctx = _this.renderer.context;
        const width = _this.renderer.canvas.width * (_this.swipeScaleValue / 100);
        const height = ctx.canvas.height;

        const drawnRect = document.createElement('canvas');
        drawnRect.width = width;
        drawnRect.height = ctx.canvas.height;
        drawnRect.getContext('2d')?.drawImage?.(layerImage.image, 0, 0);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.rect(0, 0, width / dpr, height / dpr);
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.drawImage(drawnRect, 0, 0, width / dpr, height / dpr);
        layerImage.image = ctx.canvas;

        return layerImage;
      };
    } else {
      this.currentGroupShow = this.beforeSwipeGroupShow;
      utils.dispatchState('CURRENTGROUPSHOW', { currentGroupShow: this.currentGroupShow });
      layerControl.showLayerByGroupName(this.currentGroupShow);

      const tdtDxtLayer = layerControl.getBaseLayerObjById('天地图地形图');
      if (tdtDxtLayer) swipeLayer._initRenderer = tdtDxtLayer.getRenderer();
      this.renderer = swipeLayer.getRenderer();

      this.swipeScaleValue = 100;
      this.renderer.setToRedraw();
    }
  }

  /**
   * @name: swipeScaleChange
   * @description: 当卷帘图层的比例改变
   * @param {number} value 比例
   * @param {boolean} flag 是否重绘
   * @return null
   */
  swipeScaleChange(value: number, flag: boolean) {
    this.swipeScaleValue = value;
    flag && this.renderer.setToRedraw();
  }
}

export default new Layer();
