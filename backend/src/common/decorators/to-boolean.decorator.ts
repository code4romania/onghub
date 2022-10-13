import { Transform } from 'class-transformer';

export const ToBoolean = () =>
  Transform(({ value }) => {
    return value?.toString() === 'true';
  });
