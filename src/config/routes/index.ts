import { iamStatus } from '../config';

/**
 * Generates authentication and authorization props for a route based on a given access string,
 * and whether or not IAM permissions are enabled.
 * @param {string} access - The access string associated with the route.
 * @returns {Object} - An object containing authentication and authorization props for the route.
 */
const genAccess = (access: string | string[]) => {
  let props = {};
  if (iamStatus) {
    // iam开关
    props = {
      wrappers: ['@/auth/wrapper'],
      access,
    };
  }
  return props;
};

const routes = [
  // 首页动态跳转，因为可能没有权限，动态查找时会按此数组顺序遍历
  { exact: true, path: '/', component: './welcome' },
  {
    path: '/home',
    name: '首页',
    // icon: 'rh-icon-home',
    component: './home/index',
    // ...genAccess('home'),
  },
  // IAM
  {
    path: '/iam',
    name: '权限管理',
    // icon: 'rh-icon-quanxianguanli',
    // ...genAccess('auth'),
    routes: [
      {
        path: '/iam/c-user',
        name: 'C端用户',
        component: './iam/c-user/index',
        // ...genAccess('auth-c'),
      },
      {
        path: '/iam/user',
        name: '用户管理',
        // localeId: 'menu.user',
        component: './iam/user/index',
        // ...genAccess('auth-user'),
      },
      {
        path: '/iam/role',
        name: '角色管理',
        component: './iam/role',
        // ...genAccess('auth-role'),
      },
      {
        exact: true,
        path: '/iam/role/detail/:id',
        component: './iam/role/detail',
        // ...genAccess('auth-role-info'),
      },
    ],
  },
  {
    path: '/sub-vue',
    layout: {
      // menuRender:false
    },
    name: '微前端Vue',
    microApp: 'sub-vue',
    microAppProps: {
      // autoSetLoading: true,
    },
    props: {
      isMicroApp: true,
    },
    routes: [
      {
        path: '/sub-vue/*',
      },
    ],
  },
  {
    path: '/sub-react',
    layout: {
      // menuRender:false
    },
    name: '微前端React',
    microApp: 'sub-react',
    microAppProps: {
      // autoSetLoading: true,
    },
    props: {
      isMicroApp: true,
    },
    routes: [
      {
        path: '/sub-react/*',
      },
    ],
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/demo',
    component: './demo',
  },
  {
    component: './404',
  },
];

export default routes;
