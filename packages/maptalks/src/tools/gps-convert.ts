/**
 * GPS 坐标转换
 */
const GpsConvert: any = {
  PI: 3.14159265358979324,
  x_pi: (3.14159265358979324 * 3000.0) / 180.0,
  delta: function (lat: number, lon: number) {
    //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    //  ee: 椭球的偏心率。
    let a = 6378245.0;
    let ee = 0.00669342162296594323;
    let dLat = this.transformLat(lon - 105.0, lat - 35.0);
    let dLon = this.transformLon(lon - 105.0, lat - 35.0);
    let radLat = (lat / 180.0) * this.PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI);
    dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI);
    return { lat: dLat, lon: dLon };
  },

  //WGS-84 to GCJ-02
  WGS84_to_GCJ02: function (wgsLat: number, wgsLon: number, noFormat?: any) {
    if (this.outOfChina(wgsLat, wgsLon)) return { lat: wgsLat, lon: wgsLon };

    let d = this.delta(wgsLat, wgsLon);

    if (noFormat) return { lat: Number(wgsLat) + Number(d.lat), lon: Number(wgsLon) + Number(d.lon) };
    return {
      lat: this.formatNumber6(Number(wgsLat) + Number(d.lat)),
      lon: this.formatNumber6(Number(wgsLon) + Number(d.lon)),
    };
  },
  //GCJ-02 to WGS-84
  GCJ02_to_WGS84: function (gcjLat: number, gcjLon: number, noFormat: any) {
    if (this.outOfChina(gcjLat, gcjLon)) return { lat: gcjLat, lon: gcjLon };

    let d = this.delta(gcjLat, gcjLon);

    if (noFormat) return { lat: gcjLat - d.lat, lon: gcjLon - d.lon };
    return { lat: this.formatNumber6(gcjLat - d.lat), lon: this.formatNumber6(gcjLon - d.lon) };
  },
  //GCJ-02 to WGS-84 exactly
  GCJ02_to_WGS84_Exact: function (gcjLat: number, gcjLon: number, noFormat: any) {
    let initDelta = 0.01;
    let threshold = 0.000000001;
    let dLat = initDelta,
      dLon = initDelta;
    let mLat = gcjLat - dLat,
      mLon = gcjLon - dLon;
    let pLat = gcjLat + dLat,
      pLon = gcjLon + dLon;
    let wgsLat,
      wgsLon,
      i = 0;
    while (1) {
      wgsLat = (mLat + pLat) / 2;
      wgsLon = (mLon + pLon) / 2;
      let tmp = this.WGS84_to_GCJ02(wgsLat, wgsLon);
      dLat = tmp.lat - gcjLat;
      dLon = tmp.lon - gcjLon;
      if (Math.abs(dLat) < threshold && Math.abs(dLon) < threshold) break;

      if (dLat > 0) pLat = wgsLat;
      else mLat = wgsLat;
      if (dLon > 0) pLon = wgsLon;
      else mLon = wgsLon;

      if (++i > 10000) break;
    }

    if (noFormat) return { lat: wgsLat, lon: wgsLon };
    return { lat: this.formatNumber6(Number(wgsLat)), lon: this.formatNumber6(Number(wgsLon)) };
  },
  //GCJ-02 to BD-09
  GCJ02_to_BD09: function (gcjLat: any, gcjLon: any, noFormat: any) {
    let x = gcjLon,
      y = gcjLat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    const bdLon = z * Math.cos(theta) + 0.0065;
    const bdLat = z * Math.sin(theta) + 0.006;

    if (noFormat) return { lat: bdLat, lon: bdLon };
    return { lat: this.formatNumber6(bdLat), lon: this.formatNumber6(bdLon) };
  },
  //BD-09 to GCJ-02
  BD09_to_GCJ02: function (bdLat: number, bdLon: number, noFormat: any) {
    let x = bdLon - 0.0065,
      y = bdLat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
    let gcjLon = z * Math.cos(theta);
    let gcjLat = z * Math.sin(theta);

    if (noFormat) return { lat: gcjLat, lon: gcjLon };
    return { lat: this.formatNumber6(gcjLat), lon: this.formatNumber6(gcjLon) };
  },
  WGS84_to_BD09: function (wgsLat: string, wgsLon: string, noFormat: any) {
    if (this.outOfChina(Number(wgsLat), Number(wgsLon))) return { lat: wgsLat, lon: wgsLon };

    let d = this.delta(Number(wgsLat), Number(wgsLon));
    let gcjLat = Number(wgsLat) + Number(d.lat);
    let gcjLon = Number(wgsLon) + Number(d.lon); //WGS84 to GCJ-02

    let x = gcjLon,
      y = gcjLat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    const bdLon = z * Math.cos(theta) + 0.0065;
    const bdLat = z * Math.sin(theta) + 0.006; //GCJ-02 to BD09

    if (noFormat) return { lat: bdLat, lon: bdLon };
    return { lat: this.formatNumber6(bdLat), lon: this.formatNumber6(bdLon) };
  },
  BD09_to_WGS84: function (bdLat: number, bdLon: number, noFormat: any) {
    let x = bdLon - 0.0065,
      y = bdLat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi); //BD09 to GCJ-02
    let gcjLon = z * Math.cos(theta);
    let gcjLat = z * Math.sin(theta);

    if (this.outOfChina(gcjLat, gcjLon)) return { lat: gcjLat, lon: gcjLon };

    let d = this.delta(gcjLat, gcjLon); //GCJ-02 to WGS84

    if (noFormat) return { lat: gcjLat - d.lat, lon: gcjLon - d.lon };
    return { lat: this.formatNumber6(gcjLat - d.lat), lon: this.formatNumber6(gcjLon - d.lon) };
  },
  //WGS-84 to Web mercator
  //mercatorLat -> y mercatorLon -> x
  mercator_encrypt: function (wgsLat: number, wgsLon: number) {
    let x = (wgsLon * 20037508.34) / 180;
    let y = Math.log(Math.tan(((90 + wgsLat) * this.PI) / 360)) / (this.PI / 180);
    y = (y * 20037508.34) / 180;
    return { lat: y, lon: x };
  },
  // Web mercator to WGS-84
  // mercatorLat -> y mercatorLon -> x
  mercator_decrypt: function (mercatorLat: number, mercatorLon: number) {
    let x = (mercatorLon / 20037508.34) * 180;
    let y = (mercatorLat / 20037508.34) * 180;
    y = (180 / this.PI) * (2 * Math.atan(Math.exp((y * this.PI) / 180)) - this.PI / 2);
    return { lat: y, lon: x };
  },
  // 两点之间的距离
  distance: function (latA: number, lonA: number, latB: number, lonB: number) {
    let earthR = 6371000;
    let x =
      Math.cos((latA * this.PI) / 180) * Math.cos((latB * this.PI) / 180) * Math.cos(((lonA - lonB) * this.PI) / 180);
    let y = Math.sin((latA * this.PI) / 180) * Math.sin((latB * this.PI) / 180);
    let s = x + y;
    if (s > 1) s = 1;
    if (s < -1) s = -1;
    let alpha = Math.acos(s);
    let distance = alpha * earthR;
    return distance;
  },
  outOfChina: function (lat: number, lon: number) {
    if (lon < 72.004 || lon > 137.8347) return true;
    if (lat < 18.15 || lat > 55.8271) return true;
    return false;
  },
  transformLat: function (x: number, y: number) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((y / 12.0) * this.PI) + 320 * Math.sin((y * this.PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  },
  transformLon: function (x: number, y: number) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((x / 12.0) * this.PI) + 300.0 * Math.sin((x / 30.0) * this.PI)) * 2.0) / 3.0;
    return ret;
  },
  formatNumber6: function (num: number) {
    //保留6位小数
    return Math.round(num * 1000000) / 1000000;
  },
};

export default GpsConvert;
