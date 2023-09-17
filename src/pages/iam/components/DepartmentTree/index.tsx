import { RhTree } from '@roothub/components';
import { ILeafNode } from '@roothub/components/RhTree/type';
import { noop } from 'lodash';
import { FC, forwardRef, useEffect, useState } from 'react';

const DepartmentTree: FC<{
  height?: any;
  ref?: any;
  hasAssign?: boolean;
  hasBorder?: boolean;
  list?: ILeafNode[];
  defaultCheckedKeys?: string[];
  disabledList?: string[];
  onSelect?: (keys: any, info: any) => void;
}> = forwardRef((props, ref) => {
  const { list = [], defaultCheckedKeys = [], height, onSelect = noop } = props;
  const [selectedKeys, setSelectedKeys] = useState<any[]>(defaultCheckedKeys);

  useEffect(() => {
    setSelectedKeys(defaultCheckedKeys);
  }, [defaultCheckedKeys]);

  return (
    <RhTree
      showIcon
      search
      // height={height}
      showLine={false}
      selectedKeys={selectedKeys}
      list={list}
      onSelect={(keys: any, info) => {
        setSelectedKeys(keys);
        onSelect(keys, info);
      }}
      hasBorder={false}
    />
  );
});

export default DepartmentTree;
