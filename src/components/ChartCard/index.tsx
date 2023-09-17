import { Card } from 'antd';
import type { CardProps } from 'antd/es/card';
import classNames from 'classnames';
import { omit } from 'lodash';
import React from 'react';
import styles from './index.less';

type totalType = () => React.ReactNode;

const renderTotal = (total?: number | totalType | React.ReactNode, totalStyle: React.CSSProperties = {}) => {
  if (!total && total !== 0) {
    return null;
  }
  let totalDom;
  switch (typeof total) {
    case 'undefined':
      totalDom = null;
      break;
    case 'function':
      totalDom = (
        <div className={styles.total} style={totalStyle}>
          {total()}
        </div>
      );
      break;
    default:
      totalDom = (
        <div className={styles.total} style={totalStyle}>
          {total}
        </div>
      );
  }
  return totalDom;
};

export type ChartCardProps = {
  title: React.ReactNode;
  titleStyle?: React.CSSProperties;
  action?: React.ReactNode;
  totalStyle?: React.CSSProperties;
  total?: React.ReactNode | number | (() => React.ReactNode | number);
  footer?: React.ReactNode;
  contentHeight?: number;
  avatar?: React.ReactNode;
  style?: React.CSSProperties;
} & CardProps;

class ChartCard extends React.Component<ChartCardProps> {
  renderContent = () => {
    const { contentHeight, avatar, total, totalStyle = {}, footer, children, loading } = this.props;
    if (loading) {
      return false;
    }
    return (
      <div className={styles.chartCard}>
        <div
          className={classNames(styles.chartTop, {
            [styles.chartTopMargin]: !children && !footer,
          })}
        >
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.metaWrap} style={totalStyle}>
            {/*  <div className={styles.meta}>
              <span className={styles.title}>{title}</span>
              <span className={styles.action}>{action}</span>
            </div> */}
            {renderTotal(total, totalStyle)}
          </div>
        </div>
        {children && (
          <div className={styles.content} style={{ height: contentHeight || 'auto' }}>
            <div className={contentHeight && styles.contentFixed}>{children}</div>
          </div>
        )}
        {footer && (
          <div
            className={classNames(styles.footer, {
              [styles.footerMargin]: !children,
            })}
          >
            {footer}
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      loading = false,
      /*   contentHeight,
      title,
      avatar,
      action,
      total,
      footer,
      children, */
      ...rest
    } = this.props;
    return (
      <Card loading={loading} bodyStyle={{ padding: '20px 24px 8px 24px' }} {...omit(rest, 'contentHeight')}>
        {this.renderContent()}
      </Card>
    );
  }
}

export default ChartCard;
