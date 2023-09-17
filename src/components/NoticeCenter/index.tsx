// import { message } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';
import NoticeIcon from './NoticeIcon';
import { NoticeIconItem } from './types';
import numberFormat from '@roothub/helper/utils/number-format';
import { toFixed } from '@roothub/helper/utils/number';
import { toYuan } from '@/utils';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const getNoticeData = (noticeList: NoticeIconItem[]): any[] => {
  if (!noticeList || noticeList.length === 0 || !Array.isArray(noticeList)) {
    return [];
  }

  // console.log('noticeList=', noticeList);

  return noticeList.map((item: any) => {
    const amount = toYuan(item.refundMoneyNum);
    return {
      id: item.id,
      refundUser: item.refundUser,
      refundMoneyNum: amount,
      time: item.createTime,
      title: `${item.refundUser} 退款金额：${amount}，时间：${item.createTime}`,
    };
  });
};

const getUnreadData = (noticeData: NoticeIconItem[]) => {
  let unreadMsg: NoticeIconItem[] = [];
  if (Array.isArray(noticeData)) {
    unreadMsg = noticeData.filter((item) => !item.read);
  }
  return unreadMsg;
};

const NoticeIconView = () => {
  const ref = useRef<any>();
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};

  const { noticeList, getNotices } = useModel('notice');

  useEffect(() => {
    getNotices().then(() => {});
  }, []);

  const noticeData = getNoticeData(noticeList);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unreadMsg = getUnreadData(noticeData || []);

  const onViewMore = useCallback(() => {
    history.push('/alarm/alarm-list');
    // 关闭消息弹窗
    ref.current?.hide?.();
  }, []);

  return (
    <NoticeIcon
      ref={ref}
      className={styles.action}
      count={noticeData?.length ?? 0}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onItemClick={(item: any) => {
        // changeReadState(item.id!);
      }}
      // onClear={() => clearReadState()}
      loading={false}
      clearText="清空"
      viewMoreText="查看更多"
      onViewMore={onViewMore}
      clearClose
      list={noticeData}
    ></NoticeIcon>
  );
};

export default NoticeIconView;
