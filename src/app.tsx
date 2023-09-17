// 运行时配置
import LayoutSideBar from '@/components/LayoutSideBar';
import RightContent from '@/components/RightContent';
import menuData from '@/config/menus';
import { RhConfigProvider } from '@roothub/components';
import { ConfigProvider } from 'antd';
import { useAccess } from 'umi';
import { getPermissions, hasIam, IAM_DISABLE_KEY } from './auth/usePermissionMenu';
import initLocales from './locales';
import { IntlProvider } from './locales/localeExports';

(window as any).BASE_URL = BASE_URL;

const { antd: antdLocale, locale, messages } = initLocales();

RhConfigProvider.config({
  locale: 'zh-CN',
  localeMessages: {},
  iconScriptUrl: '//at.alicdn.com/t/c/font_4217061_7q65lr2j4de.js',
  accessFactory: useAccess,
  tableRequest: {
    pageInfoConfig: {
      totalField: 'total',
      dataField: 'data',
      pageSizeField: 'pageSize',
      currentField: 'page',
    },
  },
});

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<Record<string, any>> {
  const iamDisable = !hasIam();
  const userPermission = await getPermissions();

  return { name: 'GIS&MIS 管理后台', [IAM_DISABLE_KEY]: iamDisable, userPermission };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: any = ({ initialState }: any) => {
  return {
    layout: 'mix',
    className: 'roothub',
    fixedHeader: true,
    backgroundColor: '#fff',
    logo: './logo.svg',
    rightContentRender: () => <RightContent />,
    /*  waterMarkProps: {
      content: initialState?.currentUser?.name,
    }, */
    menuRender: (menuProps: any) => {
      const { location } = menuProps;
      const { pathname } = location;
      return <LayoutSideBar collapsible={false} menuData={menuData} pathName={pathname} />;
    },
    // 默认布局调整
    // menuHeaderRender: undefined,
    ...initialState?.settings,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
  };
};

// 自定义 rootContainer，解决之前使用数据流库（比如 unstated、redux）麻烦的问题
export function rootContainer(container: any) {
  const React = require('react');
  const rhElement = React.createElement(RhConfigProvider, null, container);
  const antdElement = React.createElement(ConfigProvider, { locale: antdLocale }, rhElement);
  return React.createElement(IntlProvider, { messages, locale }, antdElement);
}
