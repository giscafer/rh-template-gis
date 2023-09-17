import { confirmModal } from '@roothub/components';
import { RhObservableType, SubjectActionType } from '@roothub/components/lib/RhTable/hooks/useTable';
import { httpPost, httpPut } from '@roothub/helper/http';
import { message } from 'antd';

export default (tableAction$: RhObservableType<SubjectActionType>) => {
  const handleVisible = (payload: any) => tableAction$.put({ type: '$assign', payload });
  const resetHandleImport = (payload: any) => tableAction$.put({ type: '$assign', payload });
  const refreshTable = () => tableAction$.next({ type: '$table/fetch' });
  /* 
  // 用户删除操作
  tableAction$.take('delete', async (action: any) => {
    const { payload } = action;
    const result = await confirmModal({
      title: `您确定删除用户${payload.fullName || payload.username || '--'}吗?`,
      content: '删除后不可恢复，用户的所有关联信息都将被删除，请谨慎操作',
    });
    if (!result) {
      return;
    }
    await httpPost(`/api/base/role/del/user`, { id: 0, userIdList: [] });
    message.success('删除成功');
    refreshTable();
  }); */

  tableAction$.take('add', (action: any) => {
    handleVisible({ modalVisible: true, record: {} });
  });
  tableAction$.take('edit', (action: any) => {
    handleVisible({ modalVisible: true, record: action.payload });
  });

  tableAction$.take('view', async (action: any) => {
    const { payload } = action;
    handleVisible({ modalVisible: true, record: payload, isView: true });
  });

  // 禁用
  tableAction$.take('ban', async (action: SubjectActionType) => {
    const text = action.payload?.status === 'ACTIVE' ? '禁用' : '启用';
    const isOk = await confirmModal({
      title: text + '确认',
      content: `是否确认${text}用户「${action.payload?.realName}」?`,
      isDanger: true,
    });
    if (isOk) {
      const url = `/api/base/user/forbidden`;
      httpPost(url, { id: action.payload?.id }).then((res) => {
        if (res?.data) {
          message.success(text + '成功！');
          refreshTable();
        }
      });
    }
  });

  // tableAction$.take('handleImport', () => {
  //   resetHandleImport({ importModalVisible: true });
  // });

  return { handleVisible, refreshTable, resetHandleImport };
};
