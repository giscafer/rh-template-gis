import { useTranslation } from '@/locales/localeExports';
import { JOB_NUMBER, ROLE_NAME_PATTERN } from '@/pages/iam/components/constants';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { RhModalForm } from '@roothub/components';
import { RhModalFormProps } from '@roothub/components/lib/RhModalForm';
import { httpPost } from '@roothub/helper/http';
import { useModel } from 'umi';
import { Form, message } from 'antd';
import RhTreePanelSelect from '@/components/RhTreePanelSelect';
import { useEffect } from 'react';

type RoleModalProps = {
  visible: boolean;
  afterSubmit?: () => void;
  initialValues?: any;
  onClose?: () => void;
};

export default (props: RoleModalProps) => {
  const { visible, onClose, afterSubmit, initialValues } = props;
  const { t } = useTranslation();
  const { userInfo } = useModel('base.user');
  const { departmentList, getDepartmentsList } = useModel('iam.department');

  useEffect(() => {
    getDepartmentsList();
  }, []);

  const doSubmit = async (values: any) => {
    const tenantId = userInfo?.type === 'ADMIN' ? values.tenantId : userInfo?.tenantId;
    if (!initialValues?.id) {
      // 新增
      await httpPost('/api/base/role/add', { ...values, tenantId });
      message.success('新增角色成功');
    } else {
      // 编辑
      const body = { ...values, tenantId, id: initialValues?.id, menuIdList: initialValues?.menuIdList };
      await httpPost('/api/base/role/updateById', body);
      message.success('编辑角色成功');
    }
    afterSubmit?.();
    onClose?.();
    return true;
  };

  const formProps: RhModalFormProps = {
    title: initialValues?.id ? '编辑角色' : '新增角色',
    confirmText: t('common.confirm', '确定'),
    visible: visible,
    onClose,
    onFinish: async (values) => doSubmit(values),
    initialValues,
    width: '600px',
  };

  return (
    <RhModalForm {...formProps}>
      {userInfo?.type === 'ADMIN' && (
        <Form.Item name="tenantId" label="租户" required={userInfo?.type === 'ADMIN'}>
          <RhTreePanelSelect
            id="departments-panel-tree-select"
            width="100%"
            request={async () => {
              return departmentList.map((item: Record<string, any>) => ({
                ...item,
                id: item.tenantId,
              }));
            }}
          />
        </Form.Item>
      )}
      <ProFormText
        name="roleName"
        label="角色名称"
        rules={[
          { required: true, whitespace: true, message: '请输入角色名称！' },
          {
            pattern: ROLE_NAME_PATTERN,
            message: '请输入正确的角色名称',
          },
        ]}
      />
      <ProFormText
        name="roleCode"
        label="角色Code"
        tooltip="唯一ID，不能重复"
        rules={[
          { required: true, whitespace: true, message: '请输入角色Code！' },
          {
            pattern: JOB_NUMBER,
            message: '只能字母、数字、下划线和横杆组成',
          },
        ]}
      />
      <ProFormTextArea
        name="remark"
        label="描述"
        placeholder="请输入角色描述"
        rules={[
          { whitespace: true },
          {
            type: 'string',
            max: 128,
            message: t('common.form.maxLength', { s: 128, defaultMessage: '描述最大长度为128' }),
          },
        ]}
      />
    </RhModalForm>
  );
};
