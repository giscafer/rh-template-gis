import action from './zh-CN/action';
import common from './zh-CN/common';
import menu from './zh-CN/menu';
import page from './zh-CN/page';
import portalPage from './zh-CN/portal';

const zh_CN = {
  'app.name': '后台管理',
  'app.appVersion': '软件版本',
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.noPermissionTip': '无权限！',
  'app.user.userCenter': '个人中心',
  'app.user.setting': '个人设置',
  'app.user.logout': '退出',
  'app.copyright': 'Copyright © 2023 HuoMuTech. All rights reserved.',
  ...action,
  ...common,
  ...menu,
  ...page,
  ...portalPage,
};
export default zh_CN;
