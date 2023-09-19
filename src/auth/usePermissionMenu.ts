import { loginStatus } from '@/config/config';
import { useTranslation } from '@/locales/localeExports';
import { RhMenuData, RhMenuItem } from '@roothub/components/lib/RhSidebar/types';
import { httpGet } from '@roothub/helper/http';
import storage, { sessionStore } from '@roothub/helper/storage';
import { useEffect, useState } from 'react';
import { useAccess } from 'umi';

export const USER_PERMISSION = '_permission_map';
export const IAM_DISABLE_KEY = '_rh_iam_disable';

export const hasIam = () => {
  if (!loginStatus) {
    // 关闭登陆就不开启
    return false;
  }
  const iam = sessionStore.get(IAM_DISABLE_KEY) || storage.get(IAM_DISABLE_KEY);
  return !iam;
};

/**
 * 过滤菜单
 * @description: 通过IAM服务返回的权限进行过滤
 * @param {any} menuItems config/routes 配置的路由信息
 * @param {any} permissionMap IAM服务返回的功能权限集合
 * @param {Function} t 翻译函数
 */
const filterMenuByPermission = (menuItems: RhMenuItem[], permissionMap: Record<string, any>, t: any) => {
  const newMenuItems: any = [];
  menuItems.forEach((menuItem: RhMenuItem & { access?: string | string[]; wrappers?: any; localeId?: string }) => {
    if (menuItem.localeId && t) {
      menuItem.name = t(menuItem.localeId, { defaultMessage: menuItem.name });
    }

    // 不需要权限控制的菜单，不加 wrappers 和 access
    if (!menuItem.access && !menuItem.wrappers) {
      newMenuItems.push(menuItem);
      if (menuItem?.routes?.length) {
        menuItem.routes = filterMenuByPermission(menuItem.routes, permissionMap, t);
      }
    } else if (menuItem.access) {
      // 需要权限控制台的菜单
      if (Array.isArray(menuItem.access)) {
        // access是数组，只要有一个权限满足即可
        const hasPermission = menuItem.access.some((access: string) => permissionMap[access]);
        if (hasPermission) {
          newMenuItems.push(menuItem);
          if (menuItem?.routes?.length) {
            menuItem.routes = filterMenuByPermission(menuItem.routes, permissionMap, t);
          }
        }
      } else if (permissionMap[menuItem.access]) {
        newMenuItems.push(menuItem);
        if (menuItem?.routes?.length) {
          menuItem.routes = filterMenuByPermission(menuItem.routes, permissionMap, t);
        }
      }
    }
  });
  return newMenuItems;
};

const usePermissionMenu = (menuData: RhMenuData) => {
  const [newMenuData, setNewMenuData] = useState<RhMenuData>();
  const { t } = useTranslation();
  const permissionMap = useAccess();

  /*  if (process.env.NODE_ENV === 'development') {
    console.log('permissionMap=', permissionMap);
  }
   */
  // 菜单和IAM的权限集合发生改变时，刷新菜单的路由信息
  useEffect(() => {
    menuData.menuItems = filterMenuByPermission(menuData.menuItems, permissionMap, t);
    setNewMenuData({ ...menuData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuData, JSON.stringify(permissionMap)]);
  return newMenuData;
};

export default usePermissionMenu;

export function getResourceIdList(list: any[] = []) {
  const webMenuList = list.filter((d: any) => d.component.indexOf('web-') === 0);

  const permissionMap = webMenuList.reduce?.((obj: Record<string, any>, { component = '' }) => {
    const id = component.replace('web-', '');
    obj[id] = true;
    return obj;
  }, {});
  sessionStore.set(USER_PERMISSION, permissionMap);
  sessionStore.set(IAM_DISABLE_KEY, false);
  return permissionMap;
}

// 获取权限并设置缓存
export function getPermissions() {
  if (!loginStatus) {
    return Promise.resolve({});
  }
  return new Promise<any>((resolve) => {
    httpGet('/api/base/auth/getUserInfo', {}, { silent: true })
      .then((res) => {
        const data = res?.data?.permissions || [];
        const permissionMap = getResourceIdList(data);
        resolve(permissionMap);
      })
      .catch(() => {
        resolve({});
      });
  });
}
