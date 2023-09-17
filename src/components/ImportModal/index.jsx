import React, { Component } from 'react';
import { message, Upload, Button, Checkbox } from 'antd';
import { httpPost } from '@roothub/helper/http';
import styles from './index.module.scss';
import { RhModal } from '@roothub/components';

export default class ImportModal extends Component {
  state = {
    fileList: [],
    failList: [],
    uploading: false,
    failFileName: '',
    extendCheckParams: false,
  };

  onSelect = (selectedKeys) => {
    this.selectedKeys = selectedKeys;
  };
  handleOnOk = async () => {
    const { fileList, extendCheckParams } = this.state;
    if (this.props.handleOnOk) {
      this.props.handleOnOk(fileList);
      return;
    }
    if (fileList.length <= 0) {
      message.error('先添加文件');
      return;
    }
    const formData = new FormData();
    fileList.forEach((file) => {
      file.status = 'uploading';
      formData.append('file', file);
      if (this.props.hasOverride) {
        if (extendCheckParams) {
          formData.append('override', true);
        } else {
          formData.append('override', false);
        }
      }
    });
    if (this.props.formParam && Object.prototype.toString.call(this.props.formParam) === '[object Object]') {
      for (const key in this.props.formParam) {
        if (Object.hasOwnProperty.call(this.props.formParam, key)) {
          const element = this.props.formParam[key];
          formData.append(key, element);
        }
      }
    }
    this.setState({
      uploading: true,
      failList: [],
    });
    let res;
    if (this.props.action) {
      try {
        res = (await httpPost(this.props.action, formData)) || {};
        this.setState({
          uploading: false,
        });
        this.setState({
          fileList: fileList.map((file) => {
            file.status = 'done';
            return file;
          }),
          failList: (res && res.failList) || [],
          failFileName: res.failFileName || '',
        });
      } catch (error) {
        this.setState({
          uploading: false,
        });
        this.setState({
          fileList: fileList.map((file) => {
            file.status = 'error';
            return file;
          }),
        });
      }
    }
    // todo 增加成功条数提示
    if (this.props.onOk) {
      this.props.onOk(res, fileList);
    }
  };
  handleOnCancel = () => {
    // 重置变量
    this.setState({
      fileList: [],
      failList: [],
      uploading: false,
      failFileName: '',
      extendCheckParams: false,
    });
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    if (this.props.onListChange) {
      this.props.onListChange([]);
    }
  };

  onRemove = (file) => {
    this.setState((state) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      if (this.props.onListChange) {
        this.props.onListChange(newFileList);
      }
      return {
        fileList: newFileList,
      };
    });
  };
  beforeUpload = (file) => {
    const { limitSize = 10, accept = '.xls,.xlsx' } = this.props;
    if (limitSize) {
      const isLt2M = file.size / 1024 / 1024 < limitSize;
      if (!isLt2M) {
        message.error(`文件要小于${limitSize}MB!`);
        return false;
      }
    }
    if (accept) {
      console.log('file', file);
      // 获取文件类型
      const typeArr = file.name.split('.');
      const isAccept = accept.includes(typeArr[typeArr.length - 1]);
      if (!isAccept) {
        message.error('文件格式不对!');
        return false;
      }
    }
    this.setState((state) => ({
      fileList: [...state.fileList, file],
      failList: [],
      uploading: false,
      failFileName: '',
    }));
    if (this.props.onListChange) {
      setTimeout(() => {
        this.props.onListChange(this.state.fileList);
      }, 0);
    }
    return false;
  };
  componentDidUpdate(prevProps) {
    if (this.props.showModal !== prevProps.showModal) {
      if (this.props.showModal) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          fileList: [],
          failList: [],
          uploading: false,
          failFileName: '',
          extendCheckParams: false,
        });
      }
    }
  }
  handleCheck = (e) => {
    if (e.target.checked) {
      this.setState({
        extendCheckParams: true,
      });
    } else {
      this.setState({
        extendCheckParams: false,
      });
    }
  };

  render() {
    const {
      t,
      title,
      showModal, // 是否显示此modal
      action,
      accept = '.xls,.xlsx',
      limitSize = 10,
      limit = 1,
      templateName,
      templateUrl,
      hasOverride,
      content,
    } = this.props;
    const { fileList, uploading, failList } = this.state;

    return (
      <RhModal
        isLoadingConfirmBtn={uploading}
        showModal={showModal}
        title={title}
        onOk={failList.length > 0 ? this.handleOnCancel : this.handleOnOk}
        onCancel={this.handleOnCancel}
      >
        <div className={styles.importBox}>
          {this.props.children}
          {
            <div className="f-16 m-b-20" style={{ textIndent: '24px' }}>
              {content}
            </div>
          }
          {hasOverride && (
            <div className="label mb1">
              <span>
                <Checkbox onChange={(e) => this.handleCheck(e)}>是否覆盖重复用户信息</Checkbox>
              </span>
            </div>
          )}
          <Upload
            accept={accept}
            beforeUpload={this.beforeUpload}
            onRemove={this.onRemove}
            fileList={fileList}
            className={styles.importUpload}
          >
            {limit && limit > fileList.length ? (
              <>
                <Button className="w-full" type="primary" ghost>
                  添加本地文件
                </Button>
                <div className="f-12 f-c-9e m-t-5" style={{ color: '#9ea5b2ff', fontSize: '12px', marginTop: '5px' }}>
                  {limitSize ? <span>{`文件最大为${limitSize}M`},</span> : null}
                  {accept ? <span>{`支持${accept}格式`}</span> : null}
                </div>
              </>
            ) : null}
          </Upload>
          {fileList.length <= 0 ? (
            <div className="m-t-15" style={{ marginTop: '15px' }}>
              {templateUrl !== null && templateUrl !== undefined ? (
                <a
                  className="download-template primary-text"
                  href={`${process.env.PUBLIC_PATH}template/${templateUrl}`}
                  rel="noopener noreferrer"
                >
                  {templateName}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </RhModal>
    );
  }
}
