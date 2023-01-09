import { Transform } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }) => {
    // if value is not a string return value
    if (typeof value !== 'string') {
      return value;
    }

    // remove space before and after the
    return value.trim();
  });
