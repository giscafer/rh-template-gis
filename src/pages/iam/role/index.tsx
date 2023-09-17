/* eslint-disable @typescript-eslint/no-unused-vars */
import { PageContainer } from '@ant-design/pro-components';
import { RhTable, useTable, RhTitle } from '@roothub/components';
import { useTranslation } from '@/locales/localeExports';
import cls from 'classnames';
import { useModel } from 'umi';
import listMeta from './list.meta';
import RoleModal from './components/RoleModal';
import workflow from './workflow';
import { useEffect } from 'react';
import { Layout2Column } from '@/components/ReflexLayout/ReflexElement';
import { ContainerWrapper } from '@/components/ReflexLayout/ContainerWrapper';
import LeftPane from '../user/LeftPane';
import styles from '../user/index.module.less';

function RoleManagementPage() {
  const { t } = useTranslation();
  const { userInfo } = useModel('base.user');
  const { departmentList, getDepartmentsList } = useModel('iam.department');
  const { tableState$, tableAction$, handleVisible, refreshTable } = useTable(workflow);

  useEffect(() => {
    getDepartmentsList().then((d: any) => {
      if (d.length) {
        tableAction$.put({ type: '$assign', payload: { tenantId: d[0].tenantId } });
      }
    });
  }, []);

  const afterSubmit = async () => {
    tableAction$.next({ type: '$table/fetch' });
    handleVisible({ addModalVisible: false });
    refreshTable();
  };
  // console.log('tableState$.tenantId=', tableState$.tenantId);
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
              breadcrumbName: '角色管理',
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
          list={departmentList}
          tableAction$={tableAction$}
        />
        <ContainerWrapper className={cls(styles['content-wrapper'])}>
          <RhTable
            meta={listMeta}
            tableAction$={tableAction$}
            params={{
              tenantId: tableState$.tenantId || userInfo?.tenantId,
            }}
            sticky={true}
            scroll={{ x: 1000 }}
          />
          <RoleModal
            afterSubmit={afterSubmit}
            visible={tableState$.addModalVisible}
            initialValues={{ tenantId: tableState$.tenantId || userInfo?.tenantId }}
            onClose={() => {
              handleVisible({ addModalVisible: false });
            }}
          />
        </ContainerWrapper>
      </Layout2Column>
    </PageContainer>
  );
}

export default RoleManagementPage;
