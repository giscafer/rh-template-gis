import { httpGet, httpPost } from '@roothub/helper/http';
import { useCallback, useState } from 'react';

export default () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [refundDetail, setRefundDetail] = useState<Record<string, any>>({});
  const [detailInfo, setDetailInfo] = useState<Record<string, any>>({});

  /**
   * 退款详情
   */
  const getRefundDetail = useCallback(async (id: string) => {
    return httpGet(`/api/order/refund/getById?id=${id}`)
      .then((res) => {
        setRefundDetail(res.data);
        return res.data;
      })
      .catch(() => {
        setRefundDetail({});
      });
  }, []);
  /**
   * 退款审核
   */
  const auditRefund = useCallback(async (params: Record<string, any>) => {
    return httpPost(`/api/order/refund/auditRefund`, params)
      .then((res) => {
        return res.data;
      })
      .catch(() => {});
  }, []);
  /**
   * 退款
   */
  const refund = useCallback(async (params: Record<string, any>) => {
    setSaveLoading(true);
    return httpPost(`/api/order/info/refund`, params)
      .then((res) => {
        setSaveLoading(false);
        return res.data;
      })
      .catch(() => {
        setSaveLoading(false);
      });
  }, []);
  /**
   * 修改订单信息
   */
  const updateOrder = useCallback(async (params: Record<string, any>) => {
    setSaveLoading(true);
    return httpPost(`/api/order/info/updateById`, params)
      .then((res) => {
        setSaveLoading(false);
        return res.data;
      })
      .catch(() => {
        setSaveLoading(false);
      });
  }, []);
  /**
   * 订单详情
   */
  const getOrderDetail = useCallback(async (id: string) => {
    setDetailInfo({});
    return httpGet(`/api/order/info/getById?id=${id}`)
      .then((res) => {
        setDetailInfo(res?.data);
        return res.data;
      })
      .catch(() => {
        setDetailInfo({});
      });
  }, []);

  return {
    saveLoading,
    detailInfo,
    refundDetail,
    getOrderDetail,
    refund,
    auditRefund,
    updateOrder,
    getRefundDetail,
  };
};
