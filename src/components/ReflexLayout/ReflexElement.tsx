import { Children, isValidElement, PropsWithChildren, ReactNode } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';
import styles from './element.module.less';

export function RowLayout({ children }: any) {
  return <div className={styles['row-layout']}>{children}</div>;
}

export function LayoutItem({ flex = '1 1 0', children }: any) {
  return <div style={{ flex }}>{children}</div>;
}

function getChildProps(child: ReactNode): { options?: any } {
  if (isValidElement(child)) return child.props;
  return {};
}

export function Layout2Column({ children }: PropsWithChildren & { children: any[] }) {
  if (Children.count(children) !== 2) throw new Error('必须有两个子元素来组成两列布局');
  const [left, right] = Children.toArray(children).map((child) => getChildProps(child));
  return (
    <ReflexContainer orientation="vertical" className={styles['row-layout']}>
      <ReflexElement {...left.options} className="left-pane">
        {children[0]}
      </ReflexElement>
      <ReflexSplitter>
        <div className="sash"></div>
      </ReflexSplitter>
      <ReflexElement flex={1} {...right.options}>
        {children[1]}
      </ReflexElement>
    </ReflexContainer>
  );
}
