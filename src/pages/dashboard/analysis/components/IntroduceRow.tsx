// import numberFormat from '@roothub/helper/utils/number-format';
import { toFixed } from '@roothub/helper/utils/number';
import { Col, Row } from 'antd';
import { yuan } from '../utils/utils';
import ChartCard from '@/components/ChartCard';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, data = {} }: { loading: boolean; data: Record<string, any> }) => (
  <Row gutter={24} className="pl3 pr3">
    <Col {...topColResponsiveProps}>
      <ChartCard
        // bordered={false}
        title="平台总订单数"
        loading={loading}
        total={data?.totalOrderNum || 0}
        contentHeight={46}
      ></ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        // bordered={false}
        loading={loading}
        title="平台总金额"
        total={yuan(toFixed(data?.totalMoneyNum / 100, 0, 2))}
        contentHeight={46}
      ></ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        // bordered={false}
        loading={loading}
        title="订单量"
        total={data?.orderNum || 0}
        contentHeight={46}
      ></ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        // bordered={false}
        title="订单金额"
        total={yuan(toFixed(data?.moneyNum / 100, 0, 2))}
        contentHeight={46}
      ></ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        // bordered={false}
        title="分账金额"
        total={yuan(toFixed(data?.divideMoneyNum / 100, 0, 2))}
        contentHeight={46}
      ></ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        // bordered={false}
        title="分账订单数"
        total={data?.divideOrderNum || 0}
        contentHeight={46}
      ></ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        // bordered={false}
        title="退款订单数量"
        total={data?.refundOrderNum || 0}
        contentHeight={46}
      ></ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        // bordered={false}
        title="退款订单金额"
        total={yuan(toFixed(data?.refundMoneyNum / 100, 0, 2))}
        contentHeight={46}
      ></ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
