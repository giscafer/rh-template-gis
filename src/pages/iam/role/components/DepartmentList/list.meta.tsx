import { RhTableMeta } from 'packages/rh-components/src/RhTable/types';

const tableMeta: RhTableMeta = {
  api: '/api/v1/companies',
  searchPlacement: 'title',
  columns: [
    {
      title: '名称',
      localeId: 'user.userName',
      dataIndex: 'userName',
      searchType: 'query',
      fieldProps: {
        placeholder: '请输入部门搜索',
      },
    },
  ],
  // 行操作列按钮
  optionActions: [
    // Button
    // { name: '启用', action: '', isMore: true },
    // { name: '禁用', action: '', isMore: true },
    { name: '移除', action: 'delete', danger: true },
  ],
  optionWidth: 100,
  toolbar: {
    actions: [
      {
        name: '添加',
        action: 'diagAdd',
        type: 'primary',
        ghost: true,
      },
    ],
  },
};
export default tableMeta;
