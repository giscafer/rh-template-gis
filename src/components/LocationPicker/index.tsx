/* eslint-disable */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import autoBind from '@roothub/helper/utils/autobind';
import { Alert, Dropdown, Input } from 'antd';
import cx from 'classnames';
import React from 'react';
import BaiduMapPicker from './BaiduMapPicker';

import './styles.less';

export interface LocationProps {
  ak: string;
  vendor?: 'baidu' | 'gaode' | 'tenxun';
  coordinatesType?: 'bd09' | 'gcj02';
  placeholder?: string;
  clearable?: boolean;
  value?: {
    address: string;
    lat?: number;
    lng?: number;
    city?: string;
  };
  disabled?: boolean;
  className?: string;
  popoverClassName?: string;
  onChange: (value: any) => void;
  popOverContainer?: any;
  overlayWidth?: number | string;
  mobileUI?: boolean;
  width?: string | number;
  trigger?: any;
}

export interface LocationState {
  isFocused: boolean;
  isOpened: boolean;
}

export class LocationPicker extends React.Component<LocationProps, LocationState> {
  static defaultProps = {
    placeholder: '请输入',
    clearable: false,
  };
  domRef: React.RefObject<HTMLDivElement> = React.createRef();
  tempValue: any;
  state = {
    isFocused: false,
    isOpened: false,
  };

  @autoBind
  handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === ' ') {
      this.handleClick();
      e.preventDefault();
    }
  }

  @autoBind
  handleFocus() {
    this.setState({
      isFocused: true,
    });
  }

  @autoBind
  handleBlur() {
    this.setState({
      isFocused: true,
    });
  }

  @autoBind
  handleClick() {
    this.state.isOpened ? this.close() : this.open();
  }

  @autoBind
  getTarget() {
    return this.domRef.current;
  }

  @autoBind
  getParent() {
    return this.domRef.current?.parentElement;
  }

  @autoBind
  open(fn?: () => void) {
    this.props.disabled ||
      this.setState(
        {
          isOpened: true,
        },
        fn,
      );
    this.tempValue = this.props.value;
  }

  @autoBind
  close() {
    this.setState({
      isOpened: false,
    });
  }

  @autoBind
  clearValue(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    const onChange = this.props.onChange;
    onChange('');
  }

  @autoBind
  handlePopOverClick(e: React.MouseEvent<any>) {
    e.stopPropagation();
    e.preventDefault();
  }

  @autoBind
  handleChange(value: any) {
    if (value) {
      value = {
        ...value,
        vendor: this.props.vendor || 'baidu',
      };
    }
    this.props.onChange(value);
  }

  @autoBind
  handleTempChange(value: any) {
    if (value) {
      value = {
        ...value,
        vendor: this.props.vendor || 'baidu',
      };
    }
    this.tempValue = value;
  }

  @autoBind
  handleConfirm() {
    this.props.onChange(this.tempValue);
    this.close();
  }

  render() {
    const {
      value,
      className,
      popoverClassName,
      disabled,
      placeholder = '请输入',
      clearable = true,
      popOverContainer,
      vendor = 'baidu',
      coordinatesType = 'bd09',
      ak,
      width,
      trigger,
    } = this.props;
    const { isOpened } = this.state;
    const overlayWidth = this.props.overlayWidth || width;

    const picker = (() => {
      switch (vendor) {
        case 'baidu':
          return (
            <BaiduMapPicker ak={ak} value={value} coordinatesType={coordinatesType} onChange={this.handleChange} />
          );
        // case 'gaode':
        //     return (
        //         <GaodeMapPicker
        //             ak={ak}
        //             value={value}
        //             coordinatesType={coordinatesType}
        //             onChange={this.handleChange}
        //         />
        //     );
        default:
          return <Alert message={`${vendor} 地图控件不支持`} type="error" />;
      }
    })();

    const locationNode = (
      <div
        tabIndex={0}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={cx(`LocationPicker`, 'is-active', className)}
      >
        <div className={cx('LocationPicker-popover', popoverClassName)} style={{ width: overlayWidth }}>
          {vendor === 'baidu' ? (
            <BaiduMapPicker ak={ak} value={value} coordinatesType={coordinatesType} onChange={this.handleChange} />
          ) : (
            <Alert message={`${vendor} 地图控件不支持`} type="error" />
          )}
        </div>
      </div>
    );
    console.log('LocationPicker value=', value);
    return (
      <Dropdown
        trigger={['click']}
        open={isOpened}
        overlay={locationNode}
        onOpenChange={() => this.handleClick()}
        disabled={disabled}
        getPopupContainer={() => popOverContainer || document.body}
        overlayStyle={{ width: overlayWidth }}
      >
        <div ref={this.domRef} style={{ width: width || '100%' }}>
          {trigger || (
            <Input
              readOnly
              value={value?.address}
              placeholder={placeholder}
              style={{ width: width || '100%', backgroundColor: disabled ? '#f9f9fb' : 'inherit' }}
              allowClear={clearable}
            />
          )}
        </div>
      </Dropdown>
    );
  }
}

export default LocationPicker;
