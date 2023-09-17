import { RhObservableType, SubjectActionType } from '@roothub/components/lib/RhTable/hooks/useTable';

export default function commonWorkflow(tableAction$: RhObservableType<SubjectActionType>) {
  const handleVisible = (payload = {}) => tableAction$.put({ type: '$merge', payload });
  const refreshTable = () => tableAction$.put({ type: '$table/fetch' });

  // 处理
  tableAction$.take('deal', (action) => {
    handleVisible({ drawerVisible: true, record: action.payload });
  });
  // 处理
  tableAction$.take('view', (action) => {
    handleVisible({ drawerVisible: true, record: action.payload });
  });

  // 类似hooks的方式返回
  return {
    refreshTable,
    handleVisible,
  };
}
