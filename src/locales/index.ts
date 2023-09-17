import { addLocale, getLocale, localeInfo, setLocaleCache } from './localeExports';
import antdZhCN from 'antd/es/locale/zh_CN';
import antdEnUS from 'antd/es/locale/en_US';
import zh_CN from './zh-CN';
import en_US from './en-US';

const initLocales = () => {
  // 中文
  addLocale('zh-CN', zh_CN, {
    momentLocale: 'zh-cn',
    antd: antdZhCN,
  });
  // 英文
  addLocale('en-US', en_US, {
    momentLocale: 'en-US',
    antd: antdEnUS,
  });
  // 宿主容器的国际化语言
  const params = new URL(document.location as any).searchParams;
  const rhLocale = params.get('rh_locale') ?? 'zh-CN';
  let userLocale = rhLocale;
  if (rhLocale === 'en-US' || rhLocale === 'zh-CN') {
    setLocaleCache(rhLocale);
  } else {
    if (getLocale() === 'en') {
      userLocale = 'en-US';
    } else {
      userLocale = 'zh-CN';
    }
  }

  return localeInfo[userLocale];
};

export default initLocales;
