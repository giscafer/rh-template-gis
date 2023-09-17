/**
 * @author giscafer
 * @homepage
 * @created 2023-03-01 18:54:02
 * @description i18n 封装
 */

import { createIntl } from '@formatjs/intl';
import { Locale } from 'antd/es/locale-provider';
import EventEmitter from 'event-emitter';
import { MessageDescriptor } from 'react-intl';
import { IntlShape } from 'react-intl/src/types';
import jscookie from 'js-cookie';
import { httpPost } from '@roothub/helper/http';

import useTranslationHooks from '@roothub/helper/i18n/useTranslation';

export const useTranslation = useTranslationHooks;

export {
  createIntlCache,
  defineMessages,
  FormattedDate,
  FormattedDateParts,
  FormattedDisplayName,
  FormattedList,
  FormattedMessage,
  FormattedNumber,
  FormattedNumberParts,
  FormattedPlural,
  FormattedRelativeTime,
  FormattedTime,
  FormattedTimeParts,
  injectIntl,
  IntlContext,
  IntlProvider,
  RawIntlProvider,
  useIntl,
} from 'react-intl';

let g_intl: IntlShape;

const useLocalStorage = true;

// @ts-ignore
export const event = new EventEmitter();

export const LANG_CHANGE_EVENT = Symbol('LANG_CHANGE');

export const localeInfo: { [key: string]: any } = {};

/**
 * 获取当前选择的语言
 * @returns string
 */
export const getLocale = () => {
  // please clear localStorage if you change the baseSeparator config
  // because changing will break the app
  const lang =
    navigator.cookieEnabled && typeof localStorage !== 'undefined' && useLocalStorage
      ? jscookie.get('rc-console-language')
      : '';

  // support baseNavigator, default true
  let browserLang;
  const isNavigatorLanguageValid = typeof navigator !== 'undefined' && typeof navigator.language === 'string';
  browserLang = isNavigatorLanguageValid ? navigator.language.split('-').join('-') : '';
  // 只支持中文简体和英文的场景
  const finalLang = lang || browserLang || 'zh-CN';
  if (finalLang !== 'en' && finalLang !== 'zh-CN') {
    return 'zh-CN';
  }
  return finalLang;
};

/**
 * 增加一个新的国际化语言
 * @param name 语言的 key
 * @param messages 对应的枚举对象
 * @param extraLocales momentLocale, antd 国际化
 */
export const addLocale = (
  name: string,
  messages: Record<string, any>,
  extraLocales: {
    momentLocale: string;
    antd: Locale;
  },
) => {
  if (!name) {
    return;
  }
  // 可以合并
  const mergeMessages = localeInfo[name]?.messages ? Object.assign({}, localeInfo[name].messages, messages) : messages;

  const { momentLocale, antd } = extraLocales || {};
  const locale = name.split('-')?.join('-');
  localeInfo[name] = {
    messages: mergeMessages,
    locale,
    momentLocale: momentLocale,
    antd,
  };

  // 如果这是的 name 和当前的locale 相同需要重新设置一下，不然更新不了
  if (locale === getLocale()) {
    event.emit(LANG_CHANGE_EVENT, locale);
  }
};

/**
 * 获取当前的 intl 对象，可以在 node 中使用
 * @param locale 需要切换的语言类型
 * @param changeIntl 是否不使用 g_intl
 * @returns IntlShape
 */
export const getIntl = (locale?: string, changeIntl?: boolean) => {
  // 如果全局的 g_intl 存在，且不是 setIntl 调用
  if (g_intl && !changeIntl && !locale) {
    return g_intl;
  }
  // 如果存在于 localeInfo 中
  if (locale && localeInfo[locale]) {
    return createIntl(localeInfo[locale]);
  }
  // 使用 zh-CN
  if (localeInfo['zh-CN']) return createIntl(localeInfo['zh-CN']);

  // 如果还没有，返回一个空的
  return createIntl({
    locale: 'zh-CN',
    messages: {},
  });
};

/**
 * 切换全局的 intl 的设置
 * @param locale 语言的key
 */
export const setIntl = (locale: string) => {
  g_intl = getIntl(locale, true) as any;
};
// 设置缓存
export const setLocaleCache = (lang = '') => {
  // window.localStorage.setItem('rh_edge_platform_locale', lang);
  jscookie.set('rc-console-language', lang);
};

/**
 * 获取当前选择的方向
 * @returns string
 */
export const getDirection = () => {
  const lang = getLocale();
  // array with all prefixs for rtl langueges ex: ar-EG , he-IL
  const rtlLangs = ['he', 'ar', 'fa', 'ku'];
  const direction = rtlLangs.filter((lng) => lang.startsWith(lng)).length ? 'rtl' : 'ltr';
  return direction;
};

/**
 * 切换语言
 * @param lang 语言的 key
 * @param realReload 是否刷新页面，默认刷新
 * @returns string
 */
export const setLocale = (lang: string, realReload: boolean = true) => {
  // 这里 使用 `rh_edge_platform_locale` 保证和微前端父级应用的一致，从而语言类型一致，不需要额外做通信
  // const updater = () => {
  //   if (getLocale() !== lang) {
  //     if (navigator.cookieEnabled && typeof window.localStorage !== 'undefined' && useLocalStorage) {
  //       setLocaleCache(lang || '');
  //     }
  //     setIntl(lang);
  //     if (realReload) {
  //       window.location.reload();
  //     } else {
  //       event.emit(LANG_CHANGE_EVENT, lang);
  //       // chrome 不支持这个事件。所以人肉触发一下
  //       if (window.dispatchEvent) {
  //         const event = new Event('languagechange');
  //         window.dispatchEvent(event);
  //       }
  //     }
  //   }
  // };

  // updater();

  new Promise<boolean>(async (resolve, reject) => {
    try {
      await httpPost(`/api/v1/locale/language?language=${lang}`);
      window.location.reload();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

let firstWaring = true;

/**
 * intl.formatMessage 的语法糖
 * 使用此 api 会造成切换语言的时候无法自动刷新，请使用 useIntl 或 injectIntl
 * @param descriptor { id : string, defaultMessage : string }
 * @param values { [key:string] : string }
 * @returns string
 */
export const formatMessage: IntlShape['formatMessage'] = (descriptor: MessageDescriptor, values: any) => {
  if (firstWaring) {
    console.warn?.(
      `Using this API will cause automatic refresh when switching languages, please use useIntl or injectIntl.

使用此 api 会造成切换语言的时候无法自动刷新，请使用 useIntl 或 injectIntl。`,
    );
    firstWaring = false;
  }
  if (!g_intl) {
    setIntl(getLocale());
  }
  return g_intl.formatMessage(descriptor, values);
};

/**
 * 获取语言列表
 * @returns string[]
 */
export const getAllLocales = () => Object.keys(localeInfo);

/**
 * 国际化路由title
 * @param props
 */
export function runtimePatchRoutes({ routes = [] }) {
  // loop all route for patch title field
  const traverseRoute = (routes: any) => {
    Object.keys(routes).forEach((key) => {
      const route = routes[key];
      if (route.name) {
        const newTitle = route.localeId ? formatMessage?.({ id: route.localeId }, {}) : route.title;
        route.title = newTitle;
        route.name = newTitle;
      }
      if (route.routes) {
        traverseRoute(route.routes);
      }
      if (route.routes) {
        traverseRoute(route.routes);
      }
    });
  };
  routes.forEach((item: { routes: any[] }) => {
    if (item?.routes?.length > 0) {
      traverseRoute(item?.routes);
    }
  });
}
