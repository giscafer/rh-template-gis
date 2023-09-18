import { httpGet } from '@roothub/helper/http';
import { useCallback, useState } from 'react';

export default () => {
  const [noticeList, setNoticeList] = useState<Record<string, any>[]>([]);
  const getNotices = useCallback(async () => {
    try {
      const res = await httpGet('/api/base/home/commission');
      setNoticeList(res?.data ?? []);
      return res?.data;
    } catch (err) {
      setNoticeList([]);
    }

    return [];
  }, []);

  return { getNotices, noticeList };
};
