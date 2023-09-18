// action type
export enum ACTION_TYPE {
  CONFIG,
  MAP,
  LOADING,
  CURRENTGROUPSHOW,
}

export interface ACTION {
  type: ACTION_TYPE;
  [prop: string]: any;
}
