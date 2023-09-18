import { useState } from 'react';
import { useSelector } from 'react-redux';
import './index.less';

function InfoBar() {
  const [infoTxt, setInfoTxt] = useState('0');
  const map = useSelector((state: any) => state?.map);

  if (map) {
    map.on('mousemove', function (param: any) {
      // 添加鼠标移动监听事件
      const { x, y } = param.coordinate;

      setInfoTxt(
        `${x.toFixed(8)},${y.toFixed(8)}  ${map.getPitch().toFixed(1)} ${map.getBearing().toFixed(1)} ${map
          .getZoom()
          .toFixed(1)}`,
      );
    });

    return <div className="map-visual-info-bar">{infoTxt}</div>;
  } else {
    return null;
  }
}

export { InfoBar };
