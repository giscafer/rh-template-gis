import { PageContainer } from '@ant-design/pro-components';
import LocationPicker, { LocationProps } from '@/components/LocationPicker';
import { useState } from 'react';
import { BAIDU_MAP_AK } from '@/constants';

function MapDemoPage() {
  const [location, setLocation] = useState<LocationProps['value']>();
  return (
    <PageContainer
      fixedHeader
      header={{
        title: 'Demo Page',
        breadcrumb: {},
        extra: [],
      }}
    >
      <LocationPicker
        ak={BAIDU_MAP_AK}
        value={location}
        width={320}
        overlayWidth={720}
        onChange={(e) => {
          console.log(e);
          setLocation(e);
        }}
      />
    </PageContainer>
  );
}

export default MapDemoPage;
