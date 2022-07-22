import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const USER_PARAM_ON_REQUEST = 'user';

export const ExtractUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request[USER_PARAM_ON_REQUEST];

    return data ? user?.[data] : user;
  },
);
