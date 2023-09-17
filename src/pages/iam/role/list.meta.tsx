const tableMeta: any = {
  api: '/api/base/role/pageByTenantId',
  apiMethod: 'POST',
  searchPlacement: 'title',
  columns: [
    {
      title: '角色名称',
      localeId: 'role.name',
      dataIndex: 'roleName',
      width: 230,
      searchType: 'query',
      fieldProps: {
        placeholder: '请输入角色名称搜索',
      },
    },
    {
      title: '角色Code',
      width: 230,
      dataIndex: 'roleCode',
    },
    {
      title: '描述',
      localeId: 'role.describe',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 190,
    },
    // {
    //   title: '创建时间',
    //   localeId: 'role.createTime',
    //   dataIndex: 'createAt',
    //   renderProps: {
    //     widget: 'time',
    //   },
    // },
  ],
  // 行操作列按钮
  optionActions: [
    // Button
    {
      name: '查看',
      action: 'detail',
      localeId: 'role.view',
      link: '/iam/role/detail/${id}?type=view',
      accessible: 'auth-role-info',
    },
    {
      name: '编辑',
      action: 'edit',
      localeId: 'role.edit',
      link: '/iam/role/detail/${id}?type=edit',
      accessible: 'auth-role-update',
    },
    {
      name: '删除',
      action: 'delete',
      isMore: true,
      danger: true,
      accessible: 'auth-role-delete',
    },
  ],
  optionWidth: 110,
  toolbar: {
    actions: [
      {
        name: '新增',
        action: 'add',
        icon: 'add',
        accessible: 'auth-role-add',
      },
    ],
  },
};
export default tableMeta;
