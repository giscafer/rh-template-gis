/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-18 18:15:06
 * @modifier giscafer
 * @modified 2023-09-16 14:23:05
 * @description 日期查询卡片
 */

import { Card, DatePicker, Tabs } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type moment from 'moment';

import styles from './style.less';

type RangePickerValue = RangePickerProps<moment.Moment>['value'];
export type TimeType = 'today' | 'week' | 'month' | 'quarter' | 'year';

const { RangePicker } = DatePicker;

const DateQueryCard = ({
  title,
  rangePickerValue,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
  tabBarExtraLeftContent = null,
  children,
}: {
  rangePickerValue: RangePickerValue;
  isActive: (key: TimeType) => string;
  loading?: boolean;
  handleRangePickerChange: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  selectDate: (key: TimeType) => void;
  title?: string | React.ReactNode;
  tabBarExtraLeftContent?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }} title={title}>
    <div className={styles.dateQueryCard}>
      <Tabs
        tabBarExtraContent={{
          left: tabBarExtraLeftContent,
          right: (
            <div className={styles.cardExtraWrap}>
              <div className={styles.cardExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  今日
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  本周
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  本月
                </a>
                <a className={isActive('quarter')} onClick={() => selectDate('quarter')}>
                  本季度
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  本年
                </a>
              </div>
              <RangePicker value={rangePickerValue} onChange={handleRangePickerChange} style={{ width: 256 }} />
            </div>
          ),
        }}
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      ></Tabs>
      {children}
    </div>
  </Card>
);

export default DateQueryCard;
