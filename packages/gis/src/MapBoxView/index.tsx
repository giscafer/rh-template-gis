import { useEffect } from 'react';
import MapBoxService from '../service/MapBoxService';
import { MapBoxInstanceOptions } from '../type/MapBoxType';
import '../map.module.less';

let map: any;

const initMap = async (containerId: string) => {
  const options: MapBoxInstanceOptions = {
    id: containerId,
  };
  const service: MapBoxService = new MapBoxService(options);
  const map: any = await service.initMapInstance(
    'MAPBOX',
    {
      ...options,
    },
    true,
  );

  return map;
};

const MapBoxView = (props: any) => {
  useEffect(() => {
    console.log('MapBoxView');
    map = initMap('rh-map-root');
    return () => {
      map = null;
    };
  }, []);
  return <div id="rh-map-root"></div>;
};

export default MapBoxView;
