import { confirmModal } from '@roothub/components';
import { RhObservableType, SubjectActionType } from '@roothub/components/lib/RhTable/hooks/useTable';
import { httpPost } from '@roothub/helper/http';
import { message } from 'antd';

export default (tableAction$: RhObservableType<SubjectActionType>) => {
  const handleVisible = (payload: any) => tableAction$.put({ type: '$assign', payload });
  const refreshTable = () => tableAction$.next({ type: '$table/fetch' });

  tableAction$.take('delete', async (action: SubjectActionType) => {
    const isOk = await confirmModal({
      title: '删除确认',
      content: `是否确认删除角色「${action.payload?.roleName}」?`,
      isDanger: true,
    });
    if (isOk) {
      const url = `/api/base/role/deleteById`;
      httpPost(url, { ids: [action.payload?.id] }).then((res) => {
        if (res?.data) {
          message.success('删除成功！');
          refreshTable();
        }
      });
    }
  });

  tableAction$.take('add', () => {
    handleVisible({ addModalVisible: true });
  });

  return { handleVisible, refreshTable };
};
