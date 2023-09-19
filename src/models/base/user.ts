import { loginStatus, mockUser } from '@/config/config';
import { signOut } from '@roothub/helper/auth/auth';
import { httpGet, httpPost } from '@roothub/helper/http';
import { useCallback, useState } from 'react';

export default () => {
  const [userInfo, setUserInfo] = useState({});

  const getUserInfo = useCallback(async (params: any) => {
    if (!loginStatus) {
      setUserInfo(mockUser);
      return Promise.resolve(mockUser);
    }
    return httpGet('/api/base/auth/getUserInfo', params)
      .then((res) => {
        const d = res.data ?? {};
        setUserInfo(d);
        return d;
      })
      .catch(() => {
        setUserInfo({});
      });
  }, []);

  const userLogin = useCallback((params: any) => {
    if (!loginStatus) {
      setUserInfo(mockUser);
      return Promise.resolve(mockUser);
    }
    return httpPost('/api/base/auth/login', params)
      .then((res) => {
        const d = res.data ?? {};
        return { accessToken: `Bearer ${d.token}`, expireTime: d.expireTime };
        // return d.token;
      })
      .catch(() => {
        signOut();
        return { accessToken: undefined };
      });
  }, []);

  const userLogout = useCallback(() => {
    if (!loginStatus) {
      setUserInfo({});
      return Promise.resolve(true);
    }
    return httpGet('/api/base/auth/logout')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return false;
      });
  }, []);

  return { userInfo, getUserInfo, userLogin, userLogout };
};
