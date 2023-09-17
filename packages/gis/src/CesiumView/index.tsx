import CesiumService from '@/shared/map/service/CesiumService';
import { CesiumInstanceOptions } from '@/shared/map/type/CesiumType';
import { ChangeLayerImageConfig } from '@/shared/map/type/CommonType';
import React, { useEffect } from 'react';
import '../map.module.less';
import 'cesium/Build/Cesium/Widgets/widgets.css';

let map: any;

(window as any).CESIUM_BASE_URL = '../';

const initMap = async (containerId: string) => {
  const cesiumProps: CesiumInstanceOptions = {
    id: containerId,
  };
  const service = new CesiumService(cesiumProps);
  const map: any = await service.initMapInstance(
    'CESIUM',
    {
      ...cesiumProps,
    },
    true,
  );

  const baiduOptions: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
  service.changeLayer('BAIDU', baiduOptions, map);
  return map;
};

const CesiumView = (props: any) => {
  useEffect(() => {
    console.log('CesiumView');
    map = initMap('rh-map-root');
    return () => {
      map = null;
    };
  }, []);
  return <div id="rh-map-root"></div>;
};

export default CesiumView;
