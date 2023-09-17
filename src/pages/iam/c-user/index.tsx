/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2023-08-20 12:13:01
 * @description C人员管理
 */

import { PageContainer } from '@ant-design/pro-layout';
import { RhDynamicDrawerForm, RhTable, useTable } from '@roothub/components';
import tableMeta from './list.meta';
import workflow from './workflow';
import formSchema from './form/form.json';

export default () => {
  // 通过提供的 useTable 接收 workflow 控制状态和副作用
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tableState$, tableAction$, handleVisible, refreshTable } = useTable(workflow);

  return (
    <PageContainer
      fixedHeader
      className="onlyBreadcrumb"
      header={{
        title: '',
        breadcrumb: {
          routes: [
            {
              path: '/',
              breadcrumbName: '用户管理',
            },
            {
              path: '/',
              breadcrumbName: 'C端用户',
            },
          ],
        },
        extra: [],
      }}
    >
      <RhTable meta={tableMeta} tableAction$={tableAction$} />
      <RhDynamicDrawerForm
        schema={formSchema}
        cancelText="关闭"
        visible={tableState$.drawerVisible}
        isView={tableState$.isView}
        initialValues={tableState$.record}
        onClose={() => {
          handleVisible({ drawerVisible: false, record: {}, isView: false });
        }}
        afterSubmit={() => {
          refreshTable();
          handleVisible({ drawerVisible: false, isView: false, record: {} });
        }}
      />
    </PageContainer>
  );
};
