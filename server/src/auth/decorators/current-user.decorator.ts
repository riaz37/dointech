import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserResponse } from '../../shared/interfaces/user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<IUserResponse> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
