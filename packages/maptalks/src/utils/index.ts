export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getTicks(s: string) {
  if (s == undefined) return 0;
  try {
    const str = s.replace(/-/g, '/');
    return new Date(str).getTime();
  } catch (e) {
    return 0;
  }
}

//保留6位小数
export function formatNumber6(num: number) {
  return Math.round(num * 1000000) / 1000000;
}
