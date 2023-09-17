import { httpGet, httpPost } from '@roothub/helper/http';
import { useCallback, useState } from 'react';

export default () => {
  const [loading, setLoading] = useState(false);
  const [detailInfo, setDetailInfo] = useState<Record<string, any>>({});

  /**
   * 接车人详情
   */
  const getDriverInfo = useCallback(async (id: string) => {
    setLoading(true);
    return httpGet('/api/station/driver/getById', { id })
      .then((res) => {
        setDetailInfo(res.data);
        setLoading(false);
        return res.data as Record<string, any>;
      })
      .catch(() => {
        setLoading(false);
        setDetailInfo({});
      });
  }, []);
  /**
   * 接车人审核
   */
  const auditDriver = useCallback(async (params: Record<string, any>) => {
    return httpPost('/api/station/driver/audit', params).then((res) => {
      setDetailInfo(res.data);
      return res.data as Record<string, any>;
    });
  }, []);

  return {
    loading,
    detailInfo,
    getDriverInfo,
    auditDriver,
  };
};
