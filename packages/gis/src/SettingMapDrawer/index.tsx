import defaultSettings from '../defaultSettings';
import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { isBrowser } from '@ant-design/pro-utils';
import { useUrlSearchParams } from '@umijs/use-params';
import { Drawer, Radio } from 'antd';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React, { useEffect, useRef } from 'react';
import './index.less';

type BodyProps = {
  title: string;
  prefixCls: string;
};

type MergerSettingsType<T> = Partial<T> & {
  primaryColor?: string;
  colorWeak?: boolean;
};

const Body: React.FC<BodyProps> = ({ children, prefixCls, title }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 className={`${prefixCls}-drawer-title`}>{title}</h3>
    {children}
  </div>
);

export type SettingItemProps = {
  title: React.ReactNode;
  action: React.ReactElement;
  disabled?: boolean;
  disabledReason?: React.ReactNode;
};

export type SettingDrawerProps = {
  settings?: MergerSettingsType<any>;
  collapse?: boolean;
  getContainer?: any;
  publicPath?: string;
  hideLoading?: boolean;
  prefixCls?: string;
  onCollapseChange?: (collapse: boolean) => void;
  onSettingChange?: (settings: MergerSettingsType<any>) => void;
  pathname?: string;
  disableUrlParams?: boolean;
};

export type SettingDrawerState = {
  collapse?: boolean;
  language?: string;
} & MergerSettingsType<any>;

const getDifferentSetting = (state: Partial<any>): Record<string, any> => {
  const stateObj: Partial<any> = {};
  Object.keys(state).forEach((key: string) => {
    if (state[key] !== (defaultSettings as any)[key] && key !== 'collapse') {
      stateObj[key] = state[key];
    } else {
      stateObj[key] = undefined;
    }
    if (key.includes('Render')) {
      stateObj[key] = state[key] === false ? false : undefined;
    }
  });
  stateObj.menu = undefined;
  return stateObj;
};

const getParamsFromUrl = (urlParams: Record<string, any>, settings?: MergerSettingsType<any>) => {
  if (!isBrowser()) return defaultSettings;

  return {
    ...defaultSettings,
    ...(settings || {}),
    ...urlParams,
  };
};

/**
 * 可视化配置组件
 *
 * @param props
 */
const SettingDrawer: React.FC<SettingDrawerProps> = (props) => {
  const {
    settings: propsSettings = undefined,
    hideLoading = false,
    getContainer,
    onSettingChange,
    prefixCls = 'ant-pro',
    pathname = window.location.pathname,
    disableUrlParams = false,
  } = props;
  const firstRender = useRef<boolean>(true);

  const [show, setShow] = useMergedState(false, {
    value: props.collapse,
    onChange: props.onCollapseChange,
  });
  const [urlParams, setUrlParams] = useUrlSearchParams({});
  const [settingState, setSettingState] = useMergedState<Partial<any>>(
    () => getParamsFromUrl(urlParams, propsSettings),
    {
      value: propsSettings,
      onChange: onSettingChange,
    },
  );
  const preStateRef = useRef(settingState);

  const mapTypeList: any[] = [
    {
      title: 'Cesium三维',
      key: 'CESIUM',
    },
    {
      title: 'LeafLet',
      key: 'LEAFLET',
    },
    {
      title: 'MapBox',
      key: 'MAPBOX',
    },
  ];

  const { mapType } = settingState || {};

  // useEffect(() => {}, []);
  /**
   * 修改设置
   *
   * @param key
   * @param value
   * @param hideMessageLoading
   */
  const changeSetting = (key: string, value: string | boolean, hideMessageLoading?: boolean) => {
    const nextState = { ...preStateRef.current };
    nextState[key] = value;

    preStateRef.current = nextState;
    setSettingState(nextState);
  };

  useEffect(() => {
    /** 如果不是浏览器 都没有必要做了 */
    if (!isBrowser()) return;
    if (disableUrlParams) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const diffParams = getDifferentSetting({ ...urlParams, ...settingState });
    setUrlParams(diffParams);
  }, [setUrlParams, settingState, urlParams, pathname, disableUrlParams]);
  const baseClassName = `${prefixCls}-setting`;
  return (
    <Drawer
      visible={show}
      width={300}
      onClose={() => setShow(false)}
      placement="right"
      getContainer={getContainer}
      handler={
        <div className={`${baseClassName}-drawer-handle`} onClick={() => setShow(!show)}>
          {show ? (
            <CloseOutlined
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          ) : (
            <SettingOutlined
              style={{
                color: '#fff',
                fontSize: 20,
              }}
            />
          )}
        </div>
      }
      style={{
        zIndex: 999,
      }}
    >
      <div className={`${baseClassName}-drawer-content`}>
        <Body title="地图类型" prefixCls={baseClassName}>
          <Radio.Group
            size="small"
            defaultValue={defaultSettings.mapType}
            buttonStyle="solid"
            onChange={(e: any) => changeSetting('mapType', e.target.value, hideLoading)}
          >
            {mapTypeList.map((item) => {
              return (
                <Radio.Button key={item.key} value={item.key}>
                  {item.title}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Body>
      </div>
    </Drawer>
  );
};

export default SettingDrawer;
