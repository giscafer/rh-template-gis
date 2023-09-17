import usePermissionMenu from '@/auth/usePermissionMenu';
import { appVersion } from '@/config/constant';
import { useTranslation } from '@/locales/localeExports';
import { RhSidebar } from '@roothub/components';
import { RhMenuData } from '@roothub/components/RhSidebar/types';
import { useMount } from 'ahooks';
import { Layout } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import styles from './styles.less';

const contentSelector = '#root > div.ant-design-pro > section.ant-layout > div.ant-pro-layout-container';
function SideBar({ menuData, pathName = '/welcome' }: Record<string, any>) {
  const [isSideCollapsed, setIsSideCollapsed] = useState<boolean>(false);
  const { t, locale } = useTranslation();
  // 根据权限过滤菜单
  const newMenuData = usePermissionMenu(menuData) as RhMenuData;

  useMount(() => {
    const contentEl: any = document.querySelector(contentSelector);
    if (!contentEl) return;
    contentEl.className = `ant-pro-layout-container sidebar-expand`;
  });
  // 动态改content左边margin
  const leftDistanceFn = useCallback((collapse: any) => {
    const contentEl: any = document.querySelector(contentSelector);
    if (!contentEl) return;
    if (collapse) {
      contentEl.className = `ant-pro-layout-container sidebar-collapse`;
    } else {
      contentEl.className = `ant-pro-layout-container sidebar-expand`;
    }
    console.log(contentEl, collapse);
  }, []);

  const toggleSideCollapsed = useCallback(
    (collapsed: boolean | ((prevState: boolean) => boolean)) => {
      setIsSideCollapsed(collapsed);
      leftDistanceFn(collapsed);
    },
    [menuData],
  );

  // 国际化
  const finalMenuData = useMemo(() => {
    if (newMenuData?.menuHeaderTitle) {
      newMenuData.menuHeaderTitle = t('app.name', { defaultMessage: newMenuData?.menuHeaderTitle });
    }
    return newMenuData;
  }, [newMenuData]);

  return (
    <Layout.Sider
      theme="light"
      className={styles.sideBar}
      collapsible
      collapsed={isSideCollapsed}
      onCollapse={toggleSideCollapsed}
      collapsedWidth={56}
      width={224}
    >
      <RhSidebar
        menuOptions={{
          mode: 'inline',
          style: { borderRight: 0 },
        }}
        menuData={finalMenuData}
        collapsible={isSideCollapsed}
        pathName={pathName}
        className={locale !== 'zh-CN' ? 'english' : ''}
      />
      {!isSideCollapsed && (
        <div className={styles.appVersion}>
          <>
            <span>软件版本 {appVersion}</span>
          </>
        </div>
      )}
    </Layout.Sider>
  );
}

export default SideBar;
