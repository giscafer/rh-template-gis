import { defineConfig } from '@umijs/max';
import proxy from '../proxy';

console.log('local 配置文件=', process.env.NODE_ENV);

export const mfsu = {};

export default defineConfig({
  define: {
    MOCK: false,
    BASE_URL: 'https://www.fastmock.site/mock/d3ff2764a5fc5958b802cd6a8ce829c5',
  },
  mfsu,
  proxy: (proxy as any)[process.env.NODE_ENV || 'development'],
});
