export const REGEX = {
  ALPHANUMERIC: /^[a-zA-Z0-9-\s]*$/,
  NUMERIC: /^[0-9]*$/,
  NAME: /^[a-zA-Z-\s]*$/,
  LINK: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/,
  DESCRIPTION: /^(.|\s)*[a-zA-Z]+(.|\s)*$/,
  CUI: /((RO)?\d+)/,
  RAF: /^[a-zA-Z0-9/]*$/,
  PHONE: /0\d{9}/,
};
