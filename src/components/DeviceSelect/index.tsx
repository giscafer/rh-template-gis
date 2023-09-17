/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2023-02-19 15:30:56
 * @modifier giscafer
 * @modified 2023-02-19 16:04:25
 * @description 设备下拉业务组件
 */

import { RhSelect } from '@roothub/components';

export default function DeviceSelect(props: { isFormItem?: boolean }) {
  const { isFormItem = true } = props;
  return (
    <RhSelect
      name="packageId"
      label="添加设备"
      rawValue={true}
      api="/operate/device/list?pageNum=1&pageSize=20"
      fieldMapping={{
        path: 'rows',
        value: 'deviceId',
        label: '${deviceName} (${price}元)',
      }}
      search
      filter
      isFormItem={isFormItem}
      rules={[{ required: true, message: '请选择' }]}
      onChange={(v: Record<string, any>) => {
        console.log(v);
        // formRef?.current?.setFieldsValue(v);
      }}
    />
  );
}
