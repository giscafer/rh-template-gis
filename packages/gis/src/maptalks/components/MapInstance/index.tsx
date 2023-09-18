import React, { useEffect, useRef } from 'react';
import { initMapVisual, initPlugins } from '../../init';
import { utils } from '../../tools';
import './index.less';

let mapRef = null;
function MapVisual() {
  mapRef = useRef();

  useEffect(() => {
    // 初始化
    const map = initMapVisual();
    initPlugins();

    // 保存到redux
    utils.dispatchState('MAP', { map: map });
  });

  return <div id="map" ref={mapRef as any}></div>;
}

export { MapVisual, mapRef };
