import { Cascader } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import areas from './data/areas.json';
import cities from './data/cities.json';
import provinces from './data/provinces.json';
import { cloneDeep, map } from 'lodash';

type ChinaDivisionType = {
  code?: string;
  name?: string;
  provinceCode?: string;
  cityCode?: string;
  label?: string;
  value?: string;
  children?: Array<ChinaDivisionType>;
};

type ProvinceType = {
  code?: string;
  name?: string;
  label?: string;
  value?: string;
  children?: Array<ProvinceType>;
};

type CityType = ProvinceType & {
  provinceCode?: string;
};

type AreaType = CityType & {
  cityCode?: string;
};

export interface ICascaderProps {
  /**
   * @description Cascader 级联选择
   * @description.zh-CN 还支持不同的 locale 后缀来实现多语言描述，使用 description 兜底
   * @default 参考 https://ant.design/components/cascader-cn/#API
   */
  cascaderProps?: any;
  /**
   * @description 是否显示区级
   * @description.zh-CN 还支持不同的 locale 后缀来实现多语言描述，使用 description 兜底
   * @default false
   */
  showArea?: boolean;
  /**
   * 值类型
   * code: 最后一级政区code，如440106
   * division: 每个级别的政区code数组，如 [44,4401,440106]
   * divisionMap: 如：{ provinceCode:44, cityCode:4401, districtCode:440106, fullLabel:"广东省/广州市/天河区" }
   * origin: Cascader组件原始值，如
   * @default 'code'
   */
  valueType?: string;
  onChange?: (...args: any) => void;
}

export default ({
  value,
  cascaderProps,
  showArea = false,
  valueType = 'origin',
  onChange,
}: ICascaderProps & { value?: any }) => {
  const [inputValue, setInputValue] = useState<any>();
  const all_data = cloneDeep(provinces);
  const all_cities = cloneDeep(cities);
  const pc_data = cloneDeep(provinces);
  const pc_cities = cloneDeep(cities);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onChangeHandle = useCallback(
    (...args: any) => {
      // console.log(args);
      const [provinceCode, cityCode, districtCode] = args[0] || [];
      const labels = map(args[1] || [], 'label');
      const [provinceName, cityName, districtName] = labels || [];
      const fullLabel = [provinceName, cityName, districtName].join('/');
      const changeFn = typeof onChange === 'function' ? onChange : cascaderProps?.onChange;
      let val: any;
      if (valueType === 'code') {
        val = showArea ? districtCode : cityCode;
      } else if (valueType === 'division') {
        val = [provinceCode, cityCode, districtCode];
      } else if (valueType === 'divisionMap') {
        val = [{ provinceCode, cityCode, districtCode, provinceName, cityName, districtName, fullLabel }];
      }
      console.log('val=', val, valueType, args[0]);
      if (valueType === 'origin') {
        changeFn?.(...args);
      } else {
        changeFn?.(val);
      }
      setInputValue(args[0]);
    },
    [onChange],
  );

  const handleCitiesData = (provinces: ProvinceType[], cites: CityType[]) => {
    cites.forEach((city: ChinaDivisionType) => {
      const matchProvince: ChinaDivisionType = provinces.filter(
        (province: ProvinceType) => province.code === city.provinceCode,
      )[0];
      if (matchProvince) {
        matchProvince.children = matchProvince.children || [];
        matchProvince.children.push({
          label: city.name,
          value: city.code,
          children: city.children,
        });
      }
    });
  };

  const handleAreasData = (cities: CityType[], areas: AreaType[]) => {
    areas.forEach((area: ChinaDivisionType) => {
      const matchCity: ChinaDivisionType = cities.filter((city) => city.code === area.cityCode)[0];
      if (matchCity) {
        matchCity.children = matchCity.children || [];
        matchCity.children.push({
          label: area.name,
          value: area.code,
        });
      }
    });
  };

  const getOptions = (provinces: ProvinceType[]) => {
    return provinces.map((province) => ({
      label: province.name,
      value: province.code,
      children: province.children,
    }));
  };

  const options = useMemo(() => {
    if (showArea) {
      handleAreasData(all_cities, areas);
      handleCitiesData(all_data, all_cities);
      return getOptions(all_data);
    } else {
      handleCitiesData(pc_data, pc_cities);
      return getOptions(pc_data);
    }
  }, [showArea]);

  return (
    <Cascader
      value={inputValue}
      options={options}
      showSearch
      placeholder="请选择区域"
      {...cascaderProps}
      onChange={onChangeHandle}
    />
  );
};
