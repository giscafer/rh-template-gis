declare const MOCK: string;
declare const BASE_URL: string;
declare global {
  interface Window {
    document: Document;
  }
}
/**
 * 解决ts eslint error
 */
declare module '@roothub/helper/src/*';
declare module 'umi';
declare module '@umijs/max';
