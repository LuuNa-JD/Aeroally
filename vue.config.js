const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://kp.gfz-potsdam.de',
        changeOrigin: true,
        pathRewrite: { '^/api': '/app/json' },
        secure: false,
      },
    },
  },
});
