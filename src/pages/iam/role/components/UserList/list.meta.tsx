import { RhTableMeta } from 'packages/rh-components/src/RhTable/types';

const tableMeta: RhTableMeta = {
  api: '/api/v1/companies',
  searchPlacement: 'title',
  columns: [
    {
      title: '姓名',
      localeId: 'user.displayName',
      dataIndex: 'displayName',
      width: 150,
      fieldProps: {
        placeholder: '请输入姓名搜索',
      },
    },
    {
      title: '用户名',
      localeId: 'user.userName',
      dataIndex: 'userName',
      searchType: 'query',
      fieldProps: {
        placeholder: '请输入用户名搜索',
      },
    },
    {
      title: '邮箱',
      localeId: 'user.email',
      dataIndex: 'email',
      fieldProps: {
        placeholder: '请输入邮箱搜索',
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
