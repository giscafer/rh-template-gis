import { defineConfig } from '@umijs/max';
import proxy from '../proxy';

console.log('local 配置文件=', process.env.NODE_ENV);

export const mfsu = {};

export default defineConfig({
  define: {
    MOCK: false,
    BASE_URL: 'https://car-inspect-api.huomutech.com/car-inspect',
  },
  mfsu,
  proxy: (proxy as any)[process.env.NODE_ENV || 'development'],
});
