/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2023-03-11 13:16:22
 * @modifier giscafer
 * @modified 2023-09-07 23:05:28
 * @description 分账
 */

import { httpGet, httpPut } from '@roothub/helper/http';
import { useCallback, useState } from 'react';

export default () => {
  const [loading, setLoading] = useState(false);
  const [appletInfo, setAppletInfo] = useState<Record<string, any>>({});

  // 小程序详情
  const getAppletInfo = useCallback(async (id: string) => {
    return httpGet(`/operate/applet/${id}`).then((res) => {
      setAppletInfo(res.data);
      return res.data;
    });
  }, []);

  // 授权幼儿园
  const authWeixinApplet = useCallback(
    async (params: { weixinAppletId: string; kindergartenIdList: string[] | number[] }) => {
      setLoading(true);
      return httpPut(`/operate/applet/authWeixinApplet`, params)
        .then((res) => {
          setLoading(false);
          return res?.data;
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [],
  );

  return { loading, appletInfo, getAppletInfo, authWeixinApplet };
};
