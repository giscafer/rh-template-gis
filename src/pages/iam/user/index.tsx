/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContainerWrapper } from '@/components/ReflexLayout/ContainerWrapper';
import { Layout2Column } from '@/components/ReflexLayout/ReflexElement';
import { useTranslation } from '@/locales/localeExports';
import { PageContainer } from '@ant-design/pro-components';
import { RhTable, RhTitle, useTable } from '@roothub/components';
import cls from 'classnames';
import { useEffect } from 'react';
import { useModel } from 'umi';
import LeftPane from './LeftPane';
import UserForm from './components/UserForm';
import styles from './index.module.less';
import listMeta from './list.meta';
import workflow from './workflow';

function UserManagementPage() {
  const { t } = useTranslation();
  const { tableState$, tableAction$, handleVisible, refreshTable } = useTable(workflow);
  const { departmentList, getDepartmentsList } = useModel('iam.department');

  useEffect(() => {
    getDepartmentsList().then((d: any) => {
      if (d.length) {
        tableAction$.put({ type: '$assign', payload: { tenantId: d[0].tenantId } });
      }
    });
  }, []);

  const afterSubmit = async () => {
    tableAction$.next({ type: '$table/fetch' });
    handleVisible({ modalVisible: false });
    refreshTable();
  };

  return (
    <PageContainer
      fixedHeader
      className={cls('onlyBreadcrumb noMargin', styles['container'])}
      header={{
        title: '',
        breadcrumb: {
          routes: [
            {
              path: '/',
              breadcrumbName: '权限管理',
            },
            {
              path: '',
              breadcrumbName: '用户管理',
            },
          ],
        },
        extra: [],
      }}
    >
      <Layout2Column>
        <LeftPane
          options={{
            size: 224,
            minSize: 224,
            maxSize: 420,
          }}
          tableAction$={tableAction$}
          list={departmentList}
        />
        <ContainerWrapper className={cls(styles['content-wrapper'])}>
          <RhTable
            meta={listMeta}
            scroll={{ x: 800, y: `calc(100vh - 252px)` }}
            sticky={true}
            tableAction$={tableAction$}
            params={{
              tenantId: tableState$.tenantId,
            }}
          />
          <UserForm
            visible={tableState$.modalVisible}
            isView={tableState$.isView}
            initialValues={{ ...(tableState$.record ?? {}), tenantId: tableState$.tenantId }}
            departmentList={departmentList}
            afterSubmit={afterSubmit}
            onClose={() => {
              handleVisible({ modalVisible: false });
            }}
          />
        </ContainerWrapper>
      </Layout2Column>
    </PageContainer>
  );
}

export default UserManagementPage;
