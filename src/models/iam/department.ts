import { httpGet } from '@roothub/helper/http';
import { useState } from 'react';

export default function useUserService() {
  const [departmentList, setDepartmentList] = useState<any[]>([]); //部门列表

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
  return {
    departmentList,
    getDepartmentsList,
    setDepartmentList,
  };
}
