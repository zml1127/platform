// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './router'
import { webpackPlugin } from './plugin.config';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  devServer: {
    open: true
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
      default: 'zh-CN',
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: './',
  },
  publicPath: './',
  history: { type: 'hash' },
  outputPath: './sk-platform/',
  headScripts: [
      'https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js',
      'https://webapi.amap.com/maps?v=1.4.15&key=fbd99adec7eec8c8a5085c448678dd84&plugin=AMap.Geocoder',
      'https://cache.amap.com/lbs/static/PlaceSearchRender.js',
  ],
  chainWebpack: webpackPlugin
});
