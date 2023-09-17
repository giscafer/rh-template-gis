import { toFixed } from '@roothub/helper/utils/number';

export function getQueryParam(url: string, name: string) {
  try {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = url.split('?')[1].match(reg);
    if (r !== null) {
      return r[2];
    }
    return ''; // 如果此处只写return;则返回的是undefined
  } catch (e) {
    return ''; // 如果此处只写return;则返回的是undefined
  }
}

/**
 * 大写字母、小写字母、数字和特殊字符至少包含3种（不能包含空格）,不得少于6个字符
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validatePassword = (rule: any, value: any, callback: any) => {
  if (value) {
    if (value.length < 6) {
      callback(new Error('密码长度不得少于6个字符'));
    }
    if (
      !/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{6,}$/.test(
        value,
      )
    ) {
      callback(new Error('大写字母、小写字母、数字和特殊字符至少包含3种（不能包含空格）'));
    } else {
      callback();
    }
  }
  callback();
};

/**
 * 更改favicon
 * @param icon
 */
export const changeFavicon = (icon: any) => {
  if (!icon) return;
  // 获取 head 标签
  const head = document.getElementsByTagName('head')[0];

  // 获取当前 favicon 元素
  const favicon: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
  favicon.type = 'image/x-icon';
  favicon.rel = 'shortcut icon';

  // 设置新的 favicon 地址
  favicon.href = icon;
  // 如果当前 head 标签中不存在 favicon 元素，则将新的 favicon 添加到 head 标签中
  if (!document.querySelector("link[rel*='icon']")) {
    head.appendChild(favicon);
  }
};

export function toYuan(v: string | number) {
  if (!v) return 0;
  return toFixed(Number(v) / 100, 2);
}
// 元to分
export function toFen(v: string | number) {
  if (!v) return 0;
  return Number(v) * 100;
}
