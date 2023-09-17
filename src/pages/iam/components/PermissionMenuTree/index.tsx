import { RhTree } from '@roothub/components';
import { noop } from 'lodash';

function PermissionMenuTree({ disabled, checkedKeys = [], list, handleSelect = noop }: Record<string, any>) {
  return (
    <RhTree
      list={list}
      checkedKeys={checkedKeys}
      disabled={disabled}
      height={500}
      checkable
      isDirectoryTree={true}
      showIcon={false}
      selectable={false}
      onCheck={handleSelect}
    />
  );
}

export default PermissionMenuTree;
