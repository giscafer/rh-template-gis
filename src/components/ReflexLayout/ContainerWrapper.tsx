import cls from 'classnames';
import { CSSProperties, PropsWithChildren } from 'react';
import './styles.less';

export type WrapperProps = {
  className?: string;
  style?: CSSProperties;
};

export function ContainerWrapper(props: PropsWithChildren<WrapperProps>) {
  const { children, className, style } = props;
  return (
    <div className={cls('edge-content-wrapper', className)} style={style}>
      {children}
    </div>
  );
}
