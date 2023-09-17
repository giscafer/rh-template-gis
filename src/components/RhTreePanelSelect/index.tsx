/**
 * @author giscafer
 * @homepage
 * @created 2022-05-02 14:59:16
 * @description 下拉面板树选择，基于RhTree
 */

import { useTranslation } from '@/locales/localeExports';
import { DownOutlined } from '@ant-design/icons';
import { ProFieldRequestData } from '@ant-design/pro-utils';
import { RhSearchInput, RhTree } from '@roothub/components';
import { searchByNodeName } from '@roothub/components/lib/RhTree/utils';
import { useRequest } from 'ahooks';
import { Button, Dropdown, Input, Row, Space, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const RhTreePanelSelect: React.FC<{
  id: string; // 用于标识唯一性
  value?: string;
  placeholder?: string;
  width?: string;
  disabled?: boolean;
  treeData?: any[];
  request?: (params?: Record<string, any>) => Promise<ProFieldRequestData[] | undefined | null>;
  trigger?: JSX.Element;
  params?: Record<string, any>;
  onChange?: (...args: any[]) => void;
  onSelect?: (...args: any[]) => unknown;
}> = (props) => {
  const domRef = useRef<any>();
  const [visible, setVisible] = useState(false);
  const [treeSearchKey, setTreeSearchKey] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [label, setLabel] = useState('');
  const { t } = useTranslation();

  const {
    id,
    value = '',
    trigger,
    treeData,
    request,
    placeholder = '请选择',
    disabled = false,
    params = {},
    onChange = (v: string, node: Record<string, any>) => {},
    ...resProps
  } = props;

  const getList = useCallback(async () => {
    if (request) {
      const list = await request(params);
      return list;
    } else {
      return treeData;
    }
  }, [request, treeData]);

  const { data, loading } = useRequest(getList, {
    cacheKey: id || 'tree-panel-select',
    refreshDeps: [id, request, treeData],
  }) as any;

  useEffect(() => {
    if (value && data && data?.length > 0) {
      const node = data.find((item: { id: string }) => item.id === value);
      setSelectedValue(value);
      setSelectedNode(node);
      setLabel(node?.name || '');
    }
  }, [value, data]);

  const onConfirm = useCallback(() => {
    setVisible(false);
    if (selectedNode) {
      setLabel(selectedNode.name);
    }
    onChange(selectedValue, selectedNode);
  }, [onChange, selectedNode, selectedValue]);

  // 前端搜索过滤
  const searchData = useMemo(() => {
    return searchByNodeName(data, treeSearchKey);
  }, [treeSearchKey, data]);

  const menu = (
    <div
      className="ant-modal-content"
      style={{ padding: 24, width: 400 }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
    >
      <div style={{ margin: '10px 0' }}>
        <RhSearchInput
          bordered
          placeholder={'输入名称搜索'}
          onChange={(v: any) => {
            setTreeSearchKey(v);
          }}
        />
      </div>
      <Spin spinning={loading}>
        <RhTree
          showIcon
          search={false}
          editable={false}
          showLine={false}
          height={300}
          autoExpandParent={false}
          highlightText={treeSearchKey}
          list={searchData as any}
          switcherIcon={<DownOutlined />}
          className="rh-tree-select-panel"
          onClick={(node: any) => {
            console.log(1, node);
            setSelectedNode(node);
            setSelectedValue(node.id || '');
          }}
        />
      </Spin>
      <Row justify="end" style={{ marginTop: 24 }}>
        <Space>
          <Button onClick={() => setVisible(false)}>{t('common.cancel', '取消')}</Button>{' '}
          <Button type="primary" disabled={!selectedValue} onClick={onConfirm}>
            {t('common.confirm', '确定')}
          </Button>
        </Space>
      </Row>
    </div>
  );

  return (
    <Dropdown
      trigger={['click']}
      open={visible}
      overlay={menu}
      onOpenChange={setVisible}
      disabled={disabled}
      getPopupContainer={() => domRef.current || document.body}
    >
      <div ref={domRef}>
        {trigger || (
          <Input
            readOnly
            value={label}
            placeholder={placeholder}
            style={{ width: resProps.width || '100%', backgroundColor: disabled ? '#f9f9fb' : 'inherit' }}
          />
        )}
      </div>
    </Dropdown>
  );
};
export default RhTreePanelSelect;
