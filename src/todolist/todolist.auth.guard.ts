import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { BEARER } from '../app.constants';

@Injectable()
export class TodoListAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const expectedBearer = BEARER;
    const actualAuthorization = context.switchToHttp().getRequest().headers[
      'authorization'
    ];
    return actualAuthorization === expectedBearer;
  }
}
