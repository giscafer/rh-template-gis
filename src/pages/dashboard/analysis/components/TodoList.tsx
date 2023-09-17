import { Card, Table } from 'antd';
import React from 'react';
import type { DataItem } from '../data';
import styles from '../style.less';

const columns = [
  {
    title: '退款人',
    dataIndex: 'refundUser',
    key: 'refundUser',
  },
  {
    title: '退款金额',
    dataIndex: 'refundMoneyNum',
    key: 'refundMoneyNum',
    render: (text: React.ReactNode) => <a href="/">{text}</a>,
  },
  {
    title: '退款申请时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
    className: styles.alignRight,
  },
];

const TodoList = ({ loading, data = [], dropdownGroup }: { loading: boolean; visitData2?: DataItem[]; data?: DataItem[]; dropdownGroup: React.ReactNode }) => (
  <Card
    loading={loading}
    bordered={false}
    title="待办事项"
    extra={dropdownGroup}
    style={{
      height: '100%',
    }}
  >
    <Table<any>
      rowKey="index"
      size="small"
      columns={columns}
      dataSource={data}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 5,
      }}
    />
  </Card>
);

export default TodoList;
