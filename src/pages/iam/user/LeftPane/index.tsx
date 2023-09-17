import DepartmentTree from '@/pages/iam/components/DepartmentTree';
import cls from 'classnames';
import styles from '../index.module.less';
import { useMemo } from 'react';
import React from 'react';

const LeftPane = (props: Record<string, any>) => {
  const { list = [], tableAction$ } = props;

  const defaultCheckedKeys = useMemo(() => {
    return list?.length ? [list[0].tenantId] : [];
  }, [list]);

  return (
    <div className={cls('flex-column', 'align-center', styles['left-tree-panel'])}>
      <DepartmentTree
        height={'100%'}
        defaultCheckedKeys={defaultCheckedKeys}
        list={list}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSelect={(keys, info) => {
          tableAction$.put({ type: '$assign', payload: { tenantId: info?.node?.tenantId } });
          tableAction$.next({ type: '$table/reload' });
        }}
        hasAssign
      />
    </div>
  );
};
export default LeftPane;
