const tableMeta: any = {
  headerTitle: '人员管理',
  api: '/api/base/user/app/pageByParam',
  apiMethod: 'POST',
  searchPlacement: 'title',
  columns: [
    // {
    //   title: '姓名或编号/车牌',
    //   dataIndex: 'searchKey',
    //   hideInTable: true,
    //   searchType: 'query',
    // },
    {
      title: '姓名',
      dataIndex: 'realName',
      ellipsis: true,
    },
    // {
    //   title: '用户名',
    //   dataIndex: 'username',
    //   ellipsis: true,
    // },
    {
      title: '手机号',
      dataIndex: 'phone',
      searchType: 'query',
    },
    {
      title: '性别',
      dataIndex: 'sexDesc',
      width: 120,
    },
    {
      title: '是否绑定车辆',
      dataIndex: 'bindCar',
      width: 130,
      renderProps: {
        props: {
          conditions: [
            {
              expression: 'bindCar===true',
              value: '是',
            },
            {
              expression: 'bindCar===false',
              value: '否',
            },
          ],
        },
      },
    },
    {
      title: '绑定车辆数',
      dataIndex: 'bindCarNum',
      width: 130,
    },
    {
      title: '预约次数',
      dataIndex: 'orderNum',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      filter: true,
      valueType: 'select',
      filters: {
        UN_ACTIVE: '未激活',
        ACTIVE: '已激活',
      },
      valueEnum: {
        UN_ACTIVE: { text: '未激活', status: 'Error' },
        ACTIVE: { text: '已激活', status: 'Success' },
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      searchType: 'query',
      width: 190,
      fieldProps: {
        placeholder: ['注册开始时间', '注册结束时间'],
      },
      renderProps: {
        widget: 'time',
      },
    },
  ],
  toolbar: {
    settings: undefined,
    actions: [
      {
        name: '导出',
        action: 'batch',
        type: 'primary',
        ghost: true,
        accessible: 'auth-c-export',
        children: [
          { name: '部分导出', action: 'exportSelected' },
          { name: '全部导出', action: 'exportAll' },
        ],
      },
    ],
  },
  optionWidth: 120,
  optionActions: [
    {
      name: '查看',
      action: 'view',
      accessible: 'auth-c-info',
    },
    // {
    //   name: '编辑',
    //   action: 'edit',
    // },
    {
      name: '启用',
      action: 'ban',
      style: { color: 'red' },
      visibleOn: "${status==='UN_ACTIVE'}",
      accessible: 'auth-c-forbidden',
    },
    {
      name: '禁用',
      action: 'ban',
      style: { color: 'red' },
      visibleOn: "${status==='ACTIVE'}",
      accessible: 'auth-c-forbidden',
    },
  ],
  rowKey: 'id',
};

export default tableMeta;
