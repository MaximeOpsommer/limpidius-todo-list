import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class TodolistAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const expectedBearer = 'Bearer limpidius_secret_api_key';
    const actualAuthorization = context.switchToHttp().getRequest().headers[
      'authorization'
    ];
    return actualAuthorization === expectedBearer;
  }
}
