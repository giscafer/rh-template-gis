import { httpGet, httpPost } from '@roothub/helper/http';
import { useCallback, useState } from 'react';

export default () => {
  const [loading, setLoading] = useState(false);
  const [detailInfo, setDetailInfo] = useState<Record<string, any>>({});

  /**
   * 幼儿园详情
   */
  const getSiteInfo = useCallback(async (id: string) => {
    return httpGet(`/api/base/tenant/getById?id=${id}`).then((res) => {
      setDetailInfo(res.data);
      return res.data as Record<string, any>;
    });
  }, []);

  /**
   * 时间设置
   */
  const timeBooking = useCallback(async (params: Record<string, any>) => {
    setLoading(true);
    return httpPost('/api/base/tenant/set/booking', params)
      .then((res) => {
        setLoading(false);
        return res.data;
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return {
    loading,
    detailInfo,
    getSiteInfo,
    timeBooking,
  };
};
