import { confirmModal } from '@roothub/components';
import { RhObservableType, SubjectActionType } from '@roothub/components/lib/RhTable/hooks/useTable';
import { httpDelete } from '@roothub/helper/http';
import { message } from 'antd';

export default (tableAction$: RhObservableType<SubjectActionType>) => {
  const handleVisible = (payload: any) => tableAction$.put({ type: '$assign', payload });
  const resetHandleImport = (payload: any) => tableAction$.put({ type: '$assign', payload });
  const refreshTable = () => tableAction$.next({ type: '$table/fetch' });

  tableAction$.take('delete', async (action: any) => {
    const { payload } = action;
    const result = await confirmModal({
      title: `您确定移除用户${payload.name}?`,
      content: '',
    });
    if (!result) {
      return;
    }
    await httpDelete(`/api/v1/node/${payload.id}`);
    message.success('删除成功');
    refreshTable();
    console.log('delete====', payload);
  });

  tableAction$.take('diagAdd', () => {
    handleVisible({ addModalVisible: true });
  });

  tableAction$.take('handleImport', () => {
    resetHandleImport({ importModalVisible: true });
  });

  return { handleVisible, refreshTable, resetHandleImport };
};
