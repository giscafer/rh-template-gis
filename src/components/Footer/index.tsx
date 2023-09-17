import { CopyrightOutlined } from '@ant-design/icons';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.footer}>
      <div>
        Copyright <CopyrightOutlined /> 2023 LeekHub 版权所有{' '}
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
          粤ICP备600036号
        </a>
      </div>
    </div>
  );
};
