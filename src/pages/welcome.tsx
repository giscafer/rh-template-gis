import LoadingPage from '@/loading';
import { useEffect } from 'react';
import { history, useAccess } from 'umi';
import routes from '../config/routes';

const blackList = ['/', '/welcome', '/login', '/403', '/404', '/demo'];

const routeList: any[] = [];
routes.forEach((r: any) => {
  if (blackList.includes(r.path)) return;
  if (r.routes) {
    routeList.push(...r.routes);
  } else {
    routeList.push(r);
  }
});
const accessKeyRouteList = routeList.filter((r: any) => r.access || !r.access);

const getHomeUrl = (accessMap: Record<string, any>) => {
  const firstRoute: any = accessKeyRouteList.find((r: any) => (accessMap[r.access] || !r.access) && !r.routes?.length);

  return firstRoute?.path;
};

export default function WelcomePage() {
  const accessMap = useAccess();
  // const { getUserInfo } = useModel('base.user');
  // const { initialState } = useModel('@@initialState');
  useEffect(() => {
    const homeUrl = getHomeUrl(accessMap);
    // console.log(1111, homeUrl, accessMap);
    history.replace(homeUrl ?? '/home');
  }, [JSON.stringify(accessMap)]);

  return (
    <div
      style={{
        minWidth: 1000,
        width: '100vw',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LoadingPage />
    </div>
  );
}
