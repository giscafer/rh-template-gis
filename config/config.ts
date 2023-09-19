import { defineConfig } from '@umijs/max';
import routes from '../src/config/routes';
import theme from '../src/config/theme';
const pro = process.env.NODE_ENV === 'production';
const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');

const getWorkspaceAlias = (cb = () => {}) => {
  const basePath = path.resolve(__dirname, '../');
  const pkg = fs.readJSONSync(path.resolve(basePath, 'package.json')) || {};
  const results: any = {};
  const workspaces = pkg.workspaces;
  if (Array.isArray(workspaces)) {
    workspaces.forEach((pattern) => {
      const packagesPath = new glob.sync(pattern, { cwd: basePath });
      packagesPath.forEach((name: string) => {
        const namePath = path.resolve(basePath, name);
        const stat = fs.statSync(namePath);
        if (stat.isDirectory()) {
          const pkg = fs.readJSONSync(path.resolve(namePath, './package.json'));
          results[pkg.name] = path.resolve(namePath, './src');
        }
      });
    });
  }
  return results;
};

export default defineConfig({
  define: {
    MOCK: false, // mock，不校验token
    BASE_URL: 'https://car-inspect-api.huomutech.com/car-inspect',
  },
  routes,
  theme,
  initialState: {},
  layout: {
    title: 'GIS+MIS系统',
    iconfontUrl: '//at.alicdn.com/t/c/font_4217061_7q65lr2j4de.js',
  },
  antd: {
    // https://ant.design/components/config-provider-cn/
    configProvider: {
      componentSize: 'middle',
    },
  },
  access: {},
  model: {},
  request: {},
  qiankun: {
    master: {
      apps: [
        {
          name: 'sub-vue',
          entry: !pro ? '//localhost:3000/sub-vue' : 'https://sub-vue.giscafer.com/',
        },
        {
          name: 'sub-react',
          entry: !pro ? '//localhost:4000/sub-react' : 'https://sub-react.giscafer.com//',
        },
      ],
      sandbox: {
        experimentalStyleIsolation: true,
      },
    },
  },
  /*   plugins: ["@alitajs/plugin-theme"],
  dynamicTheme: {
    type: "antd",
    themeVariables: ["@primary-color"],
  }, */
  npmClient: 'yarn',
  monorepoRedirect: { srcDir: ['packages', 'src'] },
  // https://github.com/umijs/umi/issues/6576
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chainWebpack: (config: any, { webpack }: any) => {
    const alias = getWorkspaceAlias();

    for (const key in alias) {
      // 设置 alias
      config.resolve.alias.set(key, alias[key]);
    }

    return config;
  },
});
