import { GridContent } from '@ant-design/pro-layout';
import { Col, Row } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type moment from 'moment';
import type { FC } from 'react';
import { Suspense, useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import type { TimeType } from './components/DateQueryCard';
import DateQueryCard from './components/DateQueryCard';
import IntroduceRow from './components/IntroduceRow';
import TodoList from './components/TodoList';
import type { AnalysisData } from './data.d';
import styles from './style.less';
import { getTimeDistance } from './utils/utils';

type RangePickerValue = RangePickerProps<moment.Moment>['value'];

type AnalysisProps = {
  BLOCK_NAME_CAMEL_CASE: AnalysisData;
  loading: boolean;
};

const Analysis: FC<AnalysisProps> = () => {
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(getTimeDistance('year'));
  const { loading, info, getInfo } = useModel('home');
  const { noticeList } = useModel('notice');

  useEffect(() => {
    const searchTime: any[] = [
      rangePickerValue?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      rangePickerValue?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    ];
    getInfo({ searchTime });
  }, [rangePickerValue]);

  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };

  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };

  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as moment.Moment, 'day') &&
      rangePickerValue[1].isSame(value[1] as moment.Moment, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  const dropdownGroup = (
    <span
      className="primary-color pointer"
      onClick={() => {
        history.push('/alarm/alarm-list');
      }}
    >
      更多
    </span>
  );

  return (
    <GridContent style={{}}>
      <>
        <Suspense fallback={null}>
          <DateQueryCard
            rangePickerValue={rangePickerValue}
            isActive={isActive}
            handleRangePickerChange={handleRangePickerChange}
            loading={loading}
            selectDate={selectDate}
          >
            <IntroduceRow loading={loading} data={info || {}} />
          </DateQueryCard>
        </Suspense>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TodoList loading={loading} data={noticeList ?? []} dropdownGroup={dropdownGroup} />
            </Suspense>
          </Col>
        </Row>
      </>
    </GridContent>
  );
};

export default Analysis;
