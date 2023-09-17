const tableMeta: any = {
  api: '/api/base/user/web/pageByParam',
  apiMethod: 'POST',
  searchPlacement: 'title',
  columns: [
    {
      title: '姓名/用户名/手机号',
      dataIndex: 'searchKey',
      searchType: 'query',
      hideInTable: true,
    },
    {
      title: '姓名',
      localeId: 'user.displayName',
      dataIndex: 'realName',
      width: 150,
    },
    {
      title: '用户名',
      localeId: 'user.userName',
      dataIndex: 'username',
    },
    {
      title: '性别',
      localeId: 'user.sex',
      dataIndex: 'sexDesc',
    },
    {
      title: '手机号',
      localeId: 'user.phoneNumber',
      dataIndex: 'phone',
    },
    // {
    //   title: '邮箱',
    //   localeId: 'user.email',
    //   dataIndex: 'email',
    //   width: 150,
    // },
    {
      title: '角色',
      dataIndex: 'roleName',
    },
    {
      title: '状态',
      localeId: 'user.status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        UN_ACTIVE: { text: '未激活', status: 'Error' },
        ACTIVE: { text: '已激活', status: 'Success' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 190,
    },
  ],
  optionWidth: 150,
  // 行操作列按钮
  optionActions: [
    {
      name: '查看',
      action: 'view',
      accessible: 'auth-user-info',
    },
    {
      name: '编辑',
      action: 'edit',
      accessible: 'auth-user-update',
    },
    {
      name: '启用',
      action: 'ban',
      style: { color: 'red' },
      accessible: 'auth-user-forbidden',
      visibleOn: "${status==='UN_ACTIVE'}",
    },
    {
      name: '禁用',
      action: 'ban',
      style: { color: 'red' },
      accessible: 'auth-user-forbidden',
      visibleOn: "${status==='ACTIVE'}",
    },
  ],
  toolbar: {
    actions: [
      // {
      //   name: '导入',
      //   action: 'handleImport',
      //   type: 'primary',
      //   ghost: true,
      //   localeId: 'action.import',
      //   accessible: 'iam.UserManagementImport',
      // },
      {
        name: '新增',
        action: 'add',
        icon: 'add',
        accessible: 'auth-user-add',
      },
    ],
  },
};
export default tableMeta;
