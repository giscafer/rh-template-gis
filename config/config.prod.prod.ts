import { defineConfig } from '@umijs/max';
import proxy from '../proxy';

console.log('prod 配置文件=', process.env.NODE_ENV);

export default defineConfig({
  mock: false,
  define: {
    MOCK: false,
    BASE_URL: 'https://car-inspect-api.huomutech.com/car-inspect',
  },
  proxy: (proxy as any)[process.env.NODE_ENV || 'production'],
});
