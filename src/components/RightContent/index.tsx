import { Divider, Space } from 'antd';
import React from 'react';
import NoticeCenter from '../NoticeCenter';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  // const { initialState } = useModel('@@initialState');

  let className = styles.right;

  return (
    <Space className={className}>
      {/*  <span
        className={styles.action}
        onClick={() => {
          history.push('/user/login');
        }}
      >
        登录测试
      </span> */}
      <NoticeCenter />
      <Divider type="vertical" className={styles.divider} />
      <Avatar showMenu={false} />
    </Space>
  );
};
export default GlobalHeaderRight;
