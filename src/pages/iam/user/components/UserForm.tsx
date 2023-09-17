import RhTreePanelSelect from '@/components/RhTreePanelSelect';
import { useTranslation } from '@/locales/localeExports';
import { CELLPHONE, PASSWORD_PATTERN, USERNAME } from '@/pages/iam/components/constants';
import { ProFormDependency, ProFormSelect } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-form';
import { RhModalForm, RhSelect } from '@roothub/components';
import { RhModalFormProps } from '@roothub/components/lib/RhModalForm';
import { httpPost } from '@roothub/helper/http';
import { Form, message } from 'antd';
import { useEffect } from 'react';

type RoleModalProps = {
  visible: boolean;
  isView?: boolean;
  resetDiag?: (param: any) => void;
  afterSubmit?: () => void;
  departmentList?: any;
  initialValues?: Record<string, any>;
  onClose?: () => void;
};

export default (props: RoleModalProps) => {
  // const formRef = useRef<any>();
  const { isView, visible, departmentList = [], initialValues, onClose, afterSubmit } = props;
  const { t } = useTranslation();

  const onFinish = async (values: any) => {
    if (initialValues?.id === undefined) {
      // 新增
      await httpPost('/api/base/user/add', values);
      message.success('新增用户成功');
      afterSubmit?.();
    } else {
      // 编辑
      await httpPost('/api/base/user/updateById', values);
      message.success('编辑用户信息成功');
    }
    afterSubmit?.();
    return true;
  };

  const formProps: RhModalFormProps = {
    // formRef,
    title: initialValues?.username ? t('user.editUser', '编辑用户信息') : t('user.addUser', '新增用户'),
    confirmText: t('common.confirm', '确定'),
    visible: visible,
    onClose,
    onFinish,
    initialValues,
    width: '600px',
    isView,
  };
  // console.log('isView=', isView);
  useEffect(() => {
    if (initialValues?.id) {
      // formRef?.current?.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  return (
    <RhModalForm {...formProps}>
      <ProFormText name="id" hidden />
      <ProFormText
        name="username"
        label={t('user.userName', '用户名')}
        placeholder={t('user.requireEditUserName', '请输入用户名')}
        required
        rules={[
          { required: true, message: t('user.requireEditUserName', '请输入用户名') },
          {
            pattern: USERNAME,
            message: '请输入正确的用户名',
          },
        ]}
      />
      {/* {initialValues?.id === undefined && (
        <ProFormText.Password
          name={['password']}
          label={t('user.password', '密码')}
          placeholder={t('user.requireEditUserPassword', '请输入密码')}
          required
          rules={[
            { required: true, message: t('user.requireEditUserPassword', '请输入密码'), whitespace: true },
            { validator: validatePassword },
          ]}
        />
      )}
      {initialValues?.id === undefined && (
        <ProFormDependency name={[['password']]}>
          {({ password }) => {
            return (
              <ProFormText.Password
                name="confirmPassword"
                label={t('user.passwordConfirm', '确认密码')}
                placeholder={t('user.requireEditUserPasswordConfirm', '请输入确认密码')}
                required
                rules={[
                  {
                    validator: (rule, value, callback) => {
                      if (!value) {
                        callback(t('user.requireEditUserPasswordConfirm', '请输入确认密码'));
                      }
                      if (value && value === password) {
                        callback();
                      }
                      callback('确认密码和新密码不一致');
                    },
                  },
                ]}
              />
            );
          }}
        </ProFormDependency>
      )} */}
      <ProFormText
        name="realName"
        label={t('user.displayName', '姓名')}
        placeholder={t('user.requireEditUserDisplayName', '请输入姓名')}
        required
      />
      <ProFormSelect
        name="sex"
        label="性别"
        initialValue={'MALE'}
        rules={[{ required: true, message: '请选择' }]}
        options={[
          {
            label: '男',
            value: 'MALE',
          },
          {
            label: '女',
            value: 'FEMALE',
          },
          {
            label: '未知',
            value: 'UNKNOWN',
          },
        ]}
      />
      <ProFormText
        name="phone"
        required
        label={t('user.phoneNumber', '手机号')}
        placeholder={t('user.requireEditUserPhoneNumber', '请输入手机号码')}
        fieldProps={{ maxLength: 11 }}
        rules={[
          {
            pattern: CELLPHONE,
            message: '请输入合法的手机号',
          },
        ]}
      />
      <ProFormText
        name="password"
        label={t('user.password', '密码')}
        placeholder={'请输入密码'}
        tooltip={initialValues?.id ? '填写保存就会重置账号密码' : ''}
        rules={[
          { required: !initialValues?.id, message: '请输入密码' },
          {
            pattern: PASSWORD_PATTERN,
            message: '请输入合法的密码',
          },
        ]}
      />
      <>
        <Form.Item name="tenantId" label="租户">
          <RhTreePanelSelect
            id="department-panel-treeselect"
            width="100%"
            request={async () => {
              return departmentList.map((item: Record<string, any>) => ({
                ...item,
                id: item.tenantId,
              }));
            }}
          />
        </Form.Item>
        <ProFormDependency name={[['tenantId']]}>
          {({ tenantId }) => {
            console.log(1, tenantId);
            return (
              <RhSelect
                name="roleId"
                label="角色"
                apiMethod="POST"
                isFormItem={true}
                rawValue={true}
                api="/api/base/role/list"
                params={{ tenantId: tenantId }}
                fieldMapping={{
                  value: 'id',
                  label: 'roleName',
                }}
                rules={[{ required: false, message: '请选择角色' }]}
                onChange={() => {
                  // formRef?.current?.setFieldsValue(v);
                }}
              />
            );
          }}
        </ProFormDependency>
      </>
      {/*  <ProFormText
        name="jobNumber"
        label={t('user.jobNumber', '工号')}
        placeholder={t('user.requireEditUserJobNumber', '请输入工号')}
        rules={[
          { required: false, message: t('user.requireEditUserJobNumber', '请输入工号') },
          {
            max: 64,
          },
        ]}
      />
      <ProFormText
        name="job"
        label={t('user.position', '职位')}
        placeholder={t('user.requireEditUserPosition', '请输入职位')}
        rules={[
          { required: false, message: t('user.requireEditUserPosition', '请输入职位') },
          {
            max: 64,
          },
        ]}
      /> */}
    </RhModalForm>
  );
};
