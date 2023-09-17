import { defineConfig } from '@umijs/max';
import routes from '../src/config/routes';
import theme from '../src/config/theme';

const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

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
    layout: 'mix',
    fixedHeader: true,
    title: 'GIS&MIS',
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
    // const alias = getWorkspaceAlias();

    // // const includeArr: string[] = [];
    // for (const key in alias) {
    //   // 设置 alias
    //   config.resolve.alias.set(key, alias[key]);
    //   // includeArr.push(path.join(__dirname, path.relative(__dirname, alias[key])));
    // }

    // monaco-editor
    // config.plugin('monaco-editor-webpack-plugin').use(MonacoWebpackPlugin, [
    //   // 按需配置
    //   { languages: ['html', 'css', 'javascript', 'tsx', 'typescript'] },
    // ]);
    return config;
  },
});
