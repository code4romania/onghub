import { Transform } from 'class-transformer';

export const ToNumber = () =>
  Transform(({ value }) => {
    return +value;
  });
