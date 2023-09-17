import { httpGet, httpPost } from '@roothub/helper/http';
import { useState } from 'react';

export default function useRoleManagementService() {
  const [loading, setLoading] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});
  const [menuList, setMenuList] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  /**
   * 获取角色列表
   */
  const getRoleList = async (params?: any) => {
    const body = {
      name: params?.name || '',
      pageSize: params?.pageSize || 10,
      page: params?.page || 1,
    };
    const res: any = await httpPost('/api/base/role/list', body);
    return {
      data: res.data,
      success: true,
      total: Number(res.data.total),
    };
  };
  /**
   * 角色更新
   */
  const updateRoleById = async (params: any) => {
    const res: any = await httpPost('/api/base/role/updateById', params);
    return res.data;
  };
  /**
   * 角色详情
   */
  const getRoleInfo = async (id: string) => {
    const res: any = await httpGet('/api/base/role/getById', { id });
    const data = res.data;
    setDetailInfo(data);
    return data;
  };
  /**
   * 根据角色查询权限菜单
   */
  const getMenuListByRoleId = async (id: string) => {
    const res: any = await httpPost('/api/base/role/get/menu', { id });
    const data = res.data;
    setPermissionList(data);
    return data;
  };
  /**
   * 权限树
   */
  const getMenuList = async (id: string) => {
    const res: any = await httpPost('/api/base/menu/list', { id });
    const data = res.data;
    setMenuList(data);
    return data;
  };

  return {
    loading,
    detailInfo,
    getRoleInfo,
    permissionList,
    menuList,
    updateRoleById,
    getMenuList,
    getRoleList,
    getMenuListByRoleId,
  };
}
