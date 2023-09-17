export default function access(initialState: { userPermission?: any }): Record<string, any> {
  const { userPermission } = initialState || {};
  let permissionMap: Record<string, any> = userPermission;

  return {
    isLogin: userPermission?.length ? true : false, // 拿到权限数据自然就是登陆了
    ...permissionMap,
  };
}
