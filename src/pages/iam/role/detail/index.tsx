import PermissionMenuTree from '@/pages/iam/components/PermissionMenuTree';
import { PageContainer } from '@ant-design/pro-components';
import { RhDescriptions } from '@roothub/components';
import { Button, Spin, Tag, message } from 'antd';
import { uniq } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { history, useModel } from 'umi';
import RoleModal from '../components/RoleModal';
import baseMeta from './base';

export default () => {
  const [editVisible, setEditVisible] = useState(false);
  const [menuKeys, setMenuKeys] = useState<string[]>([]);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const viewType = searchParams.get('type');
  const {
    loading,
    detailInfo,
    permissionList,
    menuList,
    getMenuList,
    getMenuListByRoleId,
    getRoleInfo,
    updateRoleById,
  } = useModel('iam.role');

  useEffect(() => {
    getMenuList();
  }, []);

  const refresh = useCallback(() => {
    if (id) {
      getRoleInfo(id);
      getMenuListByRoleId(id);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    // 选中的菜单权限
    setMenuKeys(permissionList);
  }, [permissionList]);

  const treeList = useMemo(() => {
    const list = menuList?.map?.((item: any) => {
      return {
        ...item,
        name: item.menuName,
        // id: item.menuCode,
      };
    });
    return list;
  }, [menuList]);

  const editHandle = useCallback(() => {
    setEditVisible(true);
  }, []);

  // 选择菜单权限
  const handleSelectPermission = useCallback(
    (checkedKeys: any[], e: { checked: boolean; checkedNodes: any; node: any; event: any; halfCheckedKeys: any }) => {
      console.log(checkedKeys, e);
      setMenuKeys(checkedKeys);
    },
    [detailInfo],
  );

  const handleSubmitPermission = useCallback(() => {
    console.log(1, menuKeys, detailInfo);
    const params = {
      ...detailInfo,
      menuIdList: menuKeys,
    };
    updateRoleById(params).then((isSuccess: boolean) => {
      if (isSuccess) {
        message.success('保存成功');
        getRoleInfo(detailInfo?.id);
      }
    });
  }, [menuKeys, detailInfo]);

  const hasDiff = useMemo(() => {
    const arr = uniq([...permissionList, ...menuKeys]);
    const flag = arr.length !== menuKeys.length || arr.length !== permissionList.length;
    return flag;
  }, [permissionList, menuKeys]);

  return (
    <PageContainer
      fixedHeader
      className="ghost"
      header={{
        title: detailInfo?.id ? `${detailInfo?.roleName} 详情` : '详情',
        subTitle: <Tag color={detailInfo?.status !== 'ACTIVE' ? 'processing' : 'error'}>{detailInfo?.statusDesc}</Tag>,
        breadcrumb: {
          routes: [],
        },
        onBack: () => history.back(-1),
        extra: [
          viewType !== 'view' ? (
            <Button key="edit" type="primary" ghost onClick={editHandle}>
              编辑
            </Button>
          ) : null,
          viewType === 'edit' && hasDiff && (
            <Button type={'secondary' as any} onClick={() => refresh()} style={{ marginRight: '10px' }}>
              重置
            </Button>
          ),
          viewType === 'edit' && (
            <Button type="primary" onClick={handleSubmitPermission}>
              保存
            </Button>
          ),
        ],
      }}
      content={<RhDescriptions schema={baseMeta as any} dataSource={detailInfo} />}
      tabList={[
        {
          tab: '功能权限',
          key: 'role',
        },
      ]}
    >
      <>
        <Spin spinning={loading}>
          <PermissionMenuTree
            checkedKeys={menuKeys}
            list={treeList}
            handleSelect={handleSelectPermission}
            disabled={viewType === 'view'}
          />
        </Spin>
      </>
      <RoleModal
        visible={editVisible}
        initialValues={detailInfo}
        onClose={() => setEditVisible(false)}
        afterSubmit={() => {
          setEditVisible(false);
          getRoleInfo(id);
        }}
      />
    </PageContainer>
  );
};
