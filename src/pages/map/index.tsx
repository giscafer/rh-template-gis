import RhMap from '@roothub/gis/map/Map';
import { useEffect, useRef } from 'react';
import './index.less';

let mapInstance: any;
const HomePage = () => {
  const mapRef = useRef();

  useEffect(() => {
    // 初始化
    const rhMap = new RhMap();
    if (!mapInstance) {
      mapInstance = rhMap.init('map', 113.29969, 23.12548, 13);
    }
    return () => {
      mapInstance.remove();
      mapInstance = null;
    };
  }, []);

  return (
    <main className="page-content">
      <div id="map" ref={mapRef as any}></div>;
    </main>
  );
};

export default HomePage;
