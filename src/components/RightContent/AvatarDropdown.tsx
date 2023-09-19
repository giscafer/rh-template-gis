import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { signOut } from '@/auth/auth';
import { queryStringToObject } from '@roothub/helper/utils/queryString';
import { Avatar, Menu, Spin } from 'antd';
import { stringify } from 'querystring';
import React, { useCallback, useEffect, useMemo } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  showMenu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const redirectToLogin = () => {
  const { pathname } = history.location;
  const { redirect } = queryStringToObject(window.location.href as string);
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    location.href =
      '/user/login?' +
      stringify({
        redirect: pathname,
      });
    /* history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    }); */
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ showMenu = false }) => {
  const { userInfo, getUserInfo, userLogout } = useModel('base.user');
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    getUserInfo();
    return () => {};
  }, []);

  useEffect(() => {
    setInitialState((state: any) => ({
      ...state,
      currentUser: userInfo,
    }));
  }, [userInfo]);

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        setInitialState({ ...initialState, currentUser: undefined });
        userLogout().then((success: boolean) => {
          if (success) {
            signOut();
            redirectToLogin();
          }
        });
        return;
      }
      history.push(`/account/${key}`);
    },
    [initialState, setInitialState],
  );

  const { currentUser = {} } = initialState;

  const name = useMemo(() => {
    return currentUser?.realName ?? currentUser?.nickName ?? currentUser?.userName ?? currentUser?.username;
  }, [currentUser]);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  // if (!userInfo?.userId) {
  //   return loading;
  // }
  // console.log('initialState=', initialState);
  if (!initialState) {
    return loading;
  }

  if (!currentUser.userId && !currentUser.id) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick as any}>
      {showMenu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {showMenu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {showMenu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={currentUser.avatarUrl || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}
          alt="avatar"
        />
        <span>{name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
