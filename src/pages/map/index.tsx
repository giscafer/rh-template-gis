import { InfoBar, MapVisual, layerApi, mapApi, utils } from '@roothub/gis/maptalks';
import { Button, Form, Input, Popover, Radio, Slider, Switch, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import './index.less';

// 通用样式
const buttonSpace = {
  marginLeft: '.4rem',
};

const layers = layerApi.allBaseGroup();

const HomePage = () => {
  const [fsTxt, setFsTxt] = useState('进入全屏');
  const [sliderShow, setSliderShow] = useState(false);
  const [disableState, setDisableState] = useState(false);

  // 订阅更新
  const currentGroupShow = useSelector((state: any) => state?.currentGroupShow);

  // 监听全屏状态下的esc事件
  const windowChangeEvent = useCallback(() => {
    if (!utils.isFullScreen()) setFsTxt('进入全屏');
  }, []);

  useEffect(() => {
    window.addEventListener('resize', windowChangeEvent);

    return () => {
      window.removeEventListener('resize', windowChangeEvent);
    };
  }, [windowChangeEvent]);

  // 进入全屏
  const fullScreen = () => {
    // mapApi.mapFullScreen(mapRef.current);

    const isFull = mapApi.mapFullScreen(document.body);
    setFsTxt(!isFull ? '退出全屏' : '进入全屏');
  };

  // 显示隐藏base图层
  const onLayerSelectChange = (e: any) => {
    layerApi.showLayerByGroupName(e.target?.value);
  };

  // 是否开启地图卷帘
  const onSwiperSwitchChange = (state: any) => {
    setDisableState(state);
    setSliderShow(state);
    layerApi.swipeScaleChange(50, false); // 设置卷帘默认值
    layerApi.swipe(state);

    state && message.warning('启用卷帘将禁用图层切换');
  };

  // 卷帘滑动条滑动
  const onSliderChange = (value: any) => {
    layerApi.swipeScaleChange(value, true);
  };

  const MapNode = useMemo(() => <MapVisual />, []);

  return (
    <main className="page-content">
      {MapNode}
      <section className="swiper-bar">
        <Switch onChange={onSwiperSwitchChange} checkedChildren="卷帘开启" unCheckedChildren="卷帘关闭" />
        {sliderShow ? (
          <div className="slider-container">
            <Slider defaultValue={50} min={1} onChange={onSliderChange} />
          </div>
        ) : null}
      </section>
      <section className="layer-bar">
        <Radio.Group
          onChange={onLayerSelectChange}
          value={currentGroupShow}
          disabled={disableState}
          defaultValue={layerApi.currentGroupShow}
        >
          {layers.map((item) => (
            <Radio.Button value={item} key={item}>
              {item}
            </Radio.Button>
          ))}
        </Radio.Group>
      </section>
      <section className="tool-bar">
        <Button onClick={fullScreen}>{fsTxt}</Button>
        <Popover content={<LocationWindow />} title="请输入经纬度坐标" trigger="click">
          <Button type="primary" style={{ ...buttonSpace }}>
            {'坐标定位'}
          </Button>
        </Popover>
      </section>
      <section className="tool-bar">
        <Button type="primary" onClick={mapApi.mapFullExtent}>
          {'全幅'}
        </Button>
        <Button onClick={mapApi.mapTo2Dview}>{'2D'}</Button>
        <Button onClick={mapApi.mapTo3Dview}>{'3D'}</Button>
        <Button type="primary" shape="circle" onClick={mapApi.zoomIn} style={{ fontWeight: 'bold' }}>
          {'+'}
        </Button>
        <Button type="primary" shape="circle" onClick={mapApi.zoomOut} style={{ fontWeight: 'bold' }}>
          {'-'}
        </Button>
      </section>
      <section className="info-bar">
        <InfoBar />
      </section>
    </main>
  );
};

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
  tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
  };

// 定位弹窗内容
function LocationWindow() {
  const [form] = Form.useForm();

  // 提交并验证数据之后
  const onFinish = (values: any) => {
    mapApi.mapToCoordinate(values.xValue, values.yValue);
  };

  // 重置
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form {...layout} form={form} className="location-window" onFinish={onFinish}>
      <Form.Item
        label="经度"
        name="xValue"
        rules={[
          {
            required: true,
            message: '请输入经度坐标！',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || utils.coordinateValidate(getFieldValue('xValue'), true)) {
                return Promise.resolve();
              }

              return Promise.reject('经度坐标不符合规范！');
            },
          }),
        ]}
      >
        <Input placeholder={'经度坐标'} />
      </Form.Item>
      <Form.Item
        label="纬度"
        name="yValue"
        rules={[
          {
            required: true,
            message: '请输入纬度坐标！',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || utils.coordinateValidate(getFieldValue('yValue'), false)) {
                return Promise.resolve();
              }

              return Promise.reject('纬度坐标不符合规范！');
            },
          }),
        ]}
      >
        <Input placeholder={'纬度坐标'} />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {'确定'}
        </Button>
        <Button htmlType="button" onClick={onReset} style={{ ...buttonSpace }}>
          {'重置'}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default HomePage;
