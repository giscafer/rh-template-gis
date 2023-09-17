import { httpGet } from '@roothub/helper/http';
import { useLatest } from 'ahooks';
import { useEffect, useRef, useState } from 'react';

export default function useUserService() {
  const [selectedDepartmentNode, setSelectedDepartmentNode] = useState<Record<string, any>>({}); //选中的部门节点
  const [departmentList, setDepartmentList] = useState<any[]>([]); //部门列表
  const [departmentListForAdd, setDepartmentListForAdd] = useState<any[]>([]);
  const [userList, setUserList] = useState([]); //部门用户列表
  const departmentTreeRef = useRef<any>(null);
  const selectedDepartmentNodeRef = useLatest(selectedDepartmentNode);
  const [initialSelectedKeys, setInitialSelectedKeys] = useState([]); // 部门初始值
  const [userAddFormDefaultValues, setUserAddFormDefaultValues] = useState({});

  /**
   * 获取部门用户列表
   */
  const getDepartmentsList = async (params?: any) => {
    return httpGet('/api/base/dept/list', params).then(async (res) => {
      const newData = res.data.map((item: any) => {
        return {
          ...item,
          parentId: item.parentId === '0' ? undefined : item.parentId,
        };
      });
      setDepartmentList(newData);
      return newData;
    });
  };
  /**
   * 获取部门用户列表
   */
  const getUserList = async (params?: any) => {
    const paramsObj = {
      fullName: params?.fullName || '',
      username: params?.username || '',
      // mobile: params?.mobile || '',
      email: params?.email || '',
      pageSize: params?.pageSize || 10,
      pageIndex: params?.pageIndex || 1,
    };
    const res: any = await httpGet(`/api/v1/users/departments/${selectedDepartmentNodeRef?.current?.id}`, paramsObj);
    return {
      data: res.data,
      success: true,
      total: Number(res.data.total),
    };
  };

  useEffect(() => {
    setTimeout(() => {
      setUserAddFormDefaultValues({
        departmentId: selectedDepartmentNodeRef?.current?.id,
      });
    }, 0);
  }, [selectedDepartmentNodeRef]);

  return {
    selectedDepartmentNode,
    setSelectedDepartmentNode,
    departmentList,
    getDepartmentsList,
    setDepartmentList,
    userList,
    setUserList,
    departmentTreeRef,
    getUserList,
    selectedDepartmentNodeRef,
    initialSelectedKeys,
    setInitialSelectedKeys,
    departmentListForAdd,
    setDepartmentListForAdd,
    userAddFormDefaultValues,
    setUserAddFormDefaultValues,
  };
}
