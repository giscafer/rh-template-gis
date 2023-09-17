export const INPUT_MAX_LEN = {
  NORMAL_INPUT: 64,
  DESCRIPTION_INPUT: 128,
};

// 角色名模式
export const ROLE_NAME_PATTERN = /^[^`~!#@$%^*|\\=?;:'",<>{}[\]/]+$/;

export const MOBILE_NUMBER_REGEX = /^1\d{10}$/;

// refer to https://www.owasp.org/index.php/Password_special_characters
export const PASSWORD_PATTERN = /^[a-zA-Z0-9\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/;

export const USER_ID_PATTERN = /^[a-zA-Z0-9@.\-_]+$/;
// 手机号
export const CELLPHONE = /^1[3456789]\d{9}$/;
// 手机号脱敏正则
export const CELLPHONETOMING = /(\d{3})\d*(\d{4})/;
// 座机号
export const TEL = /^0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}$/;
export const EMAIL = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

export const USERNAME = new RegExp(`^[a-zA-Z0-9_.]{3,${INPUT_MAX_LEN.NORMAL_INPUT}}$`);

export const PASSWORD =
  /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{1,}$/;

export const PASSWORD_MAX_LENGTH = 32;
export const BLANK_CHARACTER = /\s+/;

// 工号
export const JOB_NUMBER = /^[a-zA-Z0-9_-]*$/;
// 职位
export const JOB_TITLE = /^[\S][\s\S]{0,127}$/;
