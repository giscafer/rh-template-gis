import { RhEmpty } from '@roothub/components';
import { List, Typography } from 'antd';
import { useNavigate } from 'umi';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import styles from './NoticeList.less';
import { NoticeIconItem, noticeTypeLabelMapCh } from './types';

const { Paragraph } = Typography;

export type NoticeIconTabProps = {
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: NoticeIconItem[];
  onClick?: (item: NoticeIconItem) => void;
  onRead?: (item: NoticeIconItem) => void;
  onClear?: () => void;
  onClose?: () => void;
  onViewMore?: (e: any) => void;
};

const NoticeList: React.FC<NoticeIconTabProps> = ({
  list = [],
  onClick,
  onViewMore,
  emptyText,
  viewMoreText,
  showViewMore = false,
  onClose,
  // title,
  // showClear = true,
  // clearText,
}) => {
  const navigate = useNavigate();

  const genTitleNode = useCallback((type: string, title: string) => {
    if (!title) {
      return '';
    }
    const typeLabel = noticeTypeLabelMapCh[type] ?? '';

    if (title?.length >= 39) {
      return (
        <Paragraph ellipsis={{ rows: 2, expandable: false }}>
          <span className="type">{typeLabel ? `【${typeLabel}】` : ''}</span>
          {title}
        </Paragraph>
      );
    }
    return (
      <div className={styles.title}>
        <span className="type">{typeLabel ? `【${typeLabel}】` : ''}</span>
        {title}
      </div>
    );
  }, []);

  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <RhEmpty description={emptyText} />
      </div>
    );
  }

  return (
    <div>
      <List<NoticeIconItem>
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          const leftIcon = item?.status === 'UNREAD' ? <div className="dot"></div> : <div className="dot white"></div>;

          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => {
                onClick?.(item);
              }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={genTitleNode(item.type as string, item.title)}
                description={
                  <div>
                    <div className={styles.description}>{item.description}</div>
                    <div className={styles.time}>
                      {item.createTime}
                      <div className={styles.extra}>{item.extra}</div>
                      {item.applyType === '1' && (
                        <div
                          className={styles.readBtn}
                          onClick={() => {
                            navigate(`/order/detail/${item.id}?orderType=${item.orderType}`);
                            onClose?.();
                          }}
                        >
                          详情
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className={styles.bottomBar}>
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
        {/*  {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default NoticeList;
