import { confirmModal } from '@roothub/components';
import { RhObservableType, SubjectActionType } from '@roothub/components/lib/RhTable/hooks/useTable';
import { httpPost } from '@roothub/helper/http';
import { message } from 'antd';

export default function workflow(tableAction$: RhObservableType<SubjectActionType>) {
  const handleVisible = (payload = {}) => tableAction$.put({ type: '$merge', payload });
  const refreshTable = () => tableAction$.next({ type: '$table/fetch' });

  // 新增
  tableAction$.take('view', (action: any) => {
    handleVisible({ drawerVisible: true, record: action.payload, isView: true });
  });

  // 禁用
  tableAction$.take('ban', async (action: SubjectActionType) => {
    const text = action.payload?.status === 'ACTIVE' ? '禁用' : '启用';
    const isOk = await confirmModal({
      title: text + '确认',
      content: `是否确认${text}用户「${action.payload?.phone}」?`,
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
  // 导出
  tableAction$.take(['exportSelected', 'exportAll'], (action: SubjectActionType) => {
    let tableQueryParams = action.payload?.tableQueryParams || {};
    if (action.type === 'exportAll') {
      tableQueryParams = {};
    }
    httpPost(`/api/base/user/app/exportData`, tableQueryParams, {
      format: 'blob',
    });
  });

  return {
    refreshTable,
    handleVisible,
  };
}
