import { Outlet, Redirect, useAccess } from 'umi';
import { hasIam } from './usePermissionMenu';

/**
 * 路由配置了 access的话，umi会自动赋值此路由，可以根据路由的 unaccessible 属性判断是否有权限
 * @see https://umijs.org/zh-CN/docs/routing#wrappers
 */
export default ({ route }: Record<string, any>) => {
  // 不开启iam或者没有配置access权限时，默认有权限
  if (!hasIam() || !route?.access) {
    return <Outlet />;
  }

  const permissionMap = useAccess();

  if (process.env.NODE_ENV === 'development') {
    console.log(route);
  }
  // 判断当前菜单是否有权限
  let accessArray = [];
  // 支持多个权限控制的路由菜单场景
  if (Array.isArray(route?.access)) {
    accessArray = route?.access;
  } else if (route?.access?.indexOf('||') > -1) {
    accessArray = route?.access.split('||');
  } else {
    accessArray.push(route?.access);
  }
  let access = false;
  for (let i = 0; i < accessArray.length; i += 1) {
    const item = accessArray[i];
    const routeAccessItem = item.trim();
    if (permissionMap[routeAccessItem]) {
      access = true;
      break;
    }
  }
  if (access) {
    return <Outlet />;
  } else {
    return <Redirect to="/403" />;
  }
};
