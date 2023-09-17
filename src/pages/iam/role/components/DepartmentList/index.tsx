/* eslint-disable @typescript-eslint/no-unused-vars */
import { RhTable, useTable } from '@roothub/components';
import { useTranslation } from '@/locales/localeExports';
import listMeta from './list.meta';
import workflow from './workflow';

function UserManagementPage() {
  const { t } = useTranslation();
  const { tableState$, tableAction$, handleVisible } = useTable(workflow);

  const afterSubmit = async () => {
    tableAction$.next({ type: '$table/fetch' });
    handleVisible({ addModalVisible: false });
  };

  return (
    <div style={{ padding: '16px 24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '5px' }}>已选择角色</div>
        <div style={{ display: 'inline-block', padding: '1px 8px', backgroundColor: '#eaedf3ff' }}>22222</div>
      </div>
      <div>
        <div style={{ fontWeight: 500, fontSize: '14px' }}>已分配部门</div>
        <RhTable meta={listMeta} scroll={{ x: 800 }} tableAction$={tableAction$} />
      </div>
    </div>
  );
}

export default UserManagementPage;
