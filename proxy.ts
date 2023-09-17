/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  development: {
    '/api/': {
      target: 'https://car-inspect-api.huomutech.com',
      changeOrigin: true,
      pathRewrite: { '^/api/': '/car-inspect/api/' },
    },
    '/car-inspect/api/': {
      target: 'https://car-inspect-api.huomutech.com',
      changeOrigin: true,
      pathRewrite: { '^/car-inspect/api/': '/car-inspect/api/' },
    },
  },
  test: {
    '/api/': {
      target: 'https://car-inspect-api.huomutech.com',
      changeOrigin: true,
      pathRewrite: { '^/api/': '/car-inspect/api/' },
    },
  },
  pre: {
    '/api/': {
      target: 'https://car-inspect-api.huomutech.com',
      changeOrigin: true,
      pathRewrite: { '^/api/': '/car-inspect/api/' },
    },
  },
};
