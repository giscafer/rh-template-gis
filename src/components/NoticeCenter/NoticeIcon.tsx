import { Badge, Spin } from 'antd';
import classNames from 'classnames';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import IconFont from '../IconFont';
import styles from './index.less';
import type { NoticeIconTabProps } from './NoticeList';
import NoticeList from './NoticeList';
import { NoticeIconItem } from './types';

export type NoticeIconProps = {
  list: NoticeIconItem[];
  count?: number;
  bell?: React.ReactNode;
  className?: string;
  loading?: boolean;
  popupVisible?: boolean;
  clearText?: string;
  readAllText?: string;
  title?: string;
  viewMoreText?: string;
  showClear?: boolean;
  clearClose?: boolean;
  emptyImage?: string;
  children?: React.ReactElement<NoticeIconTabProps>[];
  style?: React.CSSProperties;
  onClear?: () => void;
  onItemClick?: (item: NoticeIconItem) => void;
  onViewMore?: (e: MouseEvent) => void;
  onPopupVisibleChange?: (visible: boolean) => void;
};

const NoticeIcon = (props: Record<string, any>, ref: any) => {
  const { className, count, bell } = props;

  const [visible, setVisible] = useState<boolean>(props.popupVisible ?? false);

  const getNotificationBox = (): React.ReactNode => {
    const {
      list,
      showClear,
      loading,
      onClear,
      onItemClick,
      onViewMore,
      clearText,
      viewMoreText,
      title = '消息通知',
      readAllText = '消息列表',
    } = props;

    return (
      <div className={styles.noticeOverlay}>
        <div className="noticeHeader">
          {title}
          <span className="readAll" onClick={onViewMore}>
            {readAllText}
          </span>
        </div>

        <Spin spinning={loading} delay={300}>
          <NoticeList
            clearText={clearText}
            viewMoreText={viewMoreText}
            list={list}
            onClear={(): void => onClear?.()}
            onClick={(item): void => onItemClick && onItemClick(item)}
            onViewMore={(event): void => onViewMore && onViewMore(event)}
            onClose={() => setVisible(false)}
            showClear={showClear}
            showViewMore={true}
          />
        </Spin>
      </div>
    );
  };

  const noticeButtonClass = classNames(className, styles.noticeButton);
  const notificationBox = getNotificationBox();
  const NoticeBellIcon = bell || <IconFont type="rh-icon-notice" className={styles.icon} />;

  useEffect(() => {
    props.onPopupVisibleChange?.(visible);
  }, [visible, props.onPopupVisibleChange]);

  useImperativeHandle(ref, () => {
    return {
      hide: () => setVisible(false),
    };
  });

  const trigger = (
    <span className={classNames(noticeButtonClass, { opened: visible })}>
      <Badge count={count} style={{ boxShadow: 'none' }} className={styles.badge}>
        {NoticeBellIcon}
      </Badge>
    </span>
  );
  if (!notificationBox) {
    return trigger;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
    >
      {trigger}
    </HeaderDropdown>
  );
};

export default forwardRef(NoticeIcon);
