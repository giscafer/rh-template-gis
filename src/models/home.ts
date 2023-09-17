import { httpPost } from '@roothub/helper/http';
import { useCallback, useState } from 'react';

export default () => {
  const [info, setInfo] = useState({});

  const getInfo = useCallback(async (params: any) => {
    return httpPost('/api/base/home/data', params)
      .then((res) => {
        setInfo(res.data);
        return res.data;
      })
      .catch(() => {
        setInfo({});
      });
  }, []);

  return { info, getInfo };
};
