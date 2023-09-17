import action from './en-US/action';
import common from './en-US/common';
import menu from './en-US/menu';
import page from './en-US/page';
import portalPage from './en-US/portal';
const en_US = {
  'app.name': 'Management',
  'app.appVersion': 'App Version',
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.noPermissionTip': 'Permission deny',
  'app.user.userCenter': 'User center',
  'app.user.setting': 'User setting',
  'app.user.logout': 'Logout',
  'app.copyright': 'Copyright  2023 HuoMuTech. All rights reserved. 长沙火木科技有限公司 版权所有',
  ...action,
  ...common,
  ...menu,
  ...page,
  ...portalPage,
};
export default en_US;
