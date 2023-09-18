import { useEffect } from 'react';
import LeafletService from '../service/LeafletService';
import { ChangeLayerImageConfig } from '../type/CommonType';
import { LeafletInstanceOptions } from '../type/LeafletType';
import '../map.module.less';

let map: any;

const initMap = async (containerId: string) => {
  const options: LeafletInstanceOptions = {
    id: containerId,
  };
  const service = new LeafletService(options);
  const map: any = await service.initMapInstance(
    'LEAFLET',
    {
      ...options,
    },
    true,
  );

  const layerCfg: ChangeLayerImageConfig = { style: 'vec', crs: 'BD09' };
  service.changeLayer('天地图', layerCfg, map);
  return map;
};

const LeafletView = (props: any) => {
  useEffect(() => {
    console.log('LeafletView');
    map = initMap('rh-map-root');
    return () => {
      map = null;
    };
  }, []);
  return <div id="rh-map-root"></div>;
};

export default LeafletView;
