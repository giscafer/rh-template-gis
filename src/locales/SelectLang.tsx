/**
 * @author houbin.lao
 * @homepage
 * @created 2023-03-01 18:54:02
 * @description i18n 多语言切换组件
 */

import React, { useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { DropDownProps } from 'antd/lib/dropdown';
import { getLocale, getAllLocales, setLocale } from './localeExports';
import IconFont from '@/components/IconFont';

export interface HeaderDropdownProps extends DropDownProps {
  overlayClassName?: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

const HeaderDropdown: React.FC<any> = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown overlayClassName={cls} {...restProps} overlay={restProps.overlay} />
);

interface LocalData {
  lang: string;
  label?: string;
  icon?: string;
  title?: string;
}

interface SelectLangProps {
  globalIconClassName?: string;
  postLocalesData?: (locales: LocalData[]) => LocalData[];
  onItemClick?: (params: Record<string, any>) => void;
  className?: string;
  reload?: boolean;
  showLabel?: boolean;
  icon?: React.ReactNode;
  style?: ElementCSSInlineStyle;
}

export const transformArrayToObject = (allLangUIConfig: LocalData[]) => {
  return allLangUIConfig.reduce((obj, item) => {
    if (!item.lang) {
      return obj;
    }

    return {
      ...obj,
      [item.lang]: item,
    };
  }, {});
};

const defaultLangUConfigMap = {
  'en-US': {
    lang: 'en',
    label: 'English',
    icon: '🇺🇸',
    title: 'Language',
  },
  'zh-CN': {
    lang: 'zh-CN',
    label: '简体中文',
    icon: '🇨🇳',
    title: '语言',
  },
};

export const SelectLang: React.FC<SelectLangProps> = (props: SelectLangProps) => {
  const { globalIconClassName, postLocalesData, onItemClick, icon, showLabel, style, reload, ...restProps } = props;
  const [selectedLang, setSelectedLang] = useState(() => getLocale());

  const changeLang = ({ key }: Record<string, any>): void => {
    setLocale(key, reload);
    setSelectedLang(getLocale());
  };

  const defaultLangUConfig = getAllLocales().map(
    (key) =>
      defaultLangUConfigMap[key] || {
        lang: key,
        label: key,
        icon: '🌐',
        title: key,
      },
  );

  const allLangUIConfig = postLocalesData?.(defaultLangUConfig) || defaultLangUConfig;
  const allLangUIConfigMap = defaultLangUConfigMap;
  const handleClick = onItemClick ? (params: Record<string, any>) => onItemClick(params) : changeLang;

  const menuItemStyle = { minWidth: '96px', color: '#505363', textAlign: 'center' };
  // const menuItemIconStyle = { marginRight: '8px' };

  const langMenu = (
    <Menu selectedKeys={[selectedLang]} onClick={handleClick}>
      {allLangUIConfig.map((localeObj) => {
        return (
          <Menu.Item key={localeObj.lang || localeObj.key} style={menuItemStyle as any}>
            {/*   <span role="img" aria-label={localeObj?.label || 'en-US'} style={menuItemIconStyle}>
              {localeObj?.icon || '🌐'}
            </span> */}
            {localeObj?.label || 'en-US'}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const inlineStyle = {
    cursor: 'pointer',
    padding: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    verticalAlign: 'middle',
    ...style,
  };

  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight" {...restProps}>
      <span className={globalIconClassName} style={inlineStyle}>
        <i className="anticon" title={allLangUIConfigMap[selectedLang]?.title}>
          {icon ? (
            icon
          ) : (
            <svg viewBox="0 0 24 24" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z "
                className="css-c4d79v"
              />
            </svg>
          )}
        </i>
        {showLabel && (
          <>
            <span style={{ color: '#21252E', fontSize: 14, marginLeft: 8 }}>
              {allLangUIConfigMap[selectedLang]?.label}
            </span>
            <IconFont type="icon-iconyangshi" style={{ color: '#21252E', fontSize: 14, marginLeft: 3 }} />
          </>
        )}
      </span>
    </HeaderDropdown>
  );
};
