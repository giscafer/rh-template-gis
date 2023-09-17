export type NoticeIconList = {
  data?: NoticeIconItem[];
  /** 列表的内容总数 */
  total?: number;
  success?: boolean;
};

export type NoticeItemType = 'ALARM' | 'SYSTEM' | 'TASK' | 'SERVICE';

export type NoticeIconItem = {
  title: string;
  extra?: string;
  key?: string;
  read?: boolean;
  status?: string;
  level?: string;
  levelName?: string;
  createTime?: string;
  description?: string;
  applyType?: string | number;
  orderType?: string | number;
  id?: string | number;
  type?: NoticeItemType;
  typeLabel?: string;
  [key: string]: any;
};

export const NOTIFY_TYPE = { ALARM: 'ALARM', SYSTEM: 'SYSTEM', TASK: 'TASK', SERVICE: 'SERVICE' };
export const LEVEL_TYPE = { URGENCY: 'URGENCY', IMPORTANT: 'IMPORTANT', ALARM: 'ALARM', UNKNOWN: 'UNKNOWN' };

export const noticeTypeMapCh = {
  ALARM: '报警通知',
  SYSTEM: '系统通知',
  TASK: '任务通知',
  SERVICE: '服务通知',
};

export const noticeTypeLabelMapCh: Record<string, any> = {
  ALARM: '报警',
  SYSTEM: '系统',
  TASK: '任务',
  SERVICE: '服务',
};

export const noticeTypeMapEn: Record<string, any> = {
  ALARM: 'Alarm notification',
  SYSTEM: 'System notification',
  TASK: 'Task notification',
  SERVICE: 'Service notification',
};

export const noticeLevelMapCh = {
  URGENCY: '紧急',
  IMPORTANT: '重要',
  ALARM: '警告',
  NORMAL: '一般',
  UNKNOWN: '不确定',
};

export const noticeLevelMapEn = {
  URGENCY: 'Urgency',
  IMPORTANT: 'Important',
  ALARM: 'ALARM',
  NORMAL: 'Normal',
  UNKNOWN: 'Unknown',
};
