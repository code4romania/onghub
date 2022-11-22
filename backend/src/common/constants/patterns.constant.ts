export const REGEX = {
  ALPHANUMERIC: /^(?!.*[ ]{2})[a-zA-Z\d-\s.#@%&()+/ăîâșțĂÎÂȘȚ,'"]*$/,
  NUMERIC: /^\d*$/,
  NAME: /^(?!.*[ ]{2})[a-zA-Z\s-ăîâșțĂÎÂȘȚ]*$/,
  LINK: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https:\/\/(?:www\.|(?!www))|[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  CUI: /^(RO|)?[\d]*$/,
  RAF: /^[a-zA-Z\d/]*$/,
};
