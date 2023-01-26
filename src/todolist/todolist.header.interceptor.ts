import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ResponseObj = context.switchToHttp().getResponse();
    ResponseObj.setHeader('ReturnedAt', formattedDate());
    return next.handle();
  }
}

function formattedDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = ('0' + d.getMonth() + 1).slice(-2);
  const date = ('0' + d.getDate()).slice(-2);
  const hour = ('0' + d.getHours()).slice(-2);
  const minute = ('0' + d.getMinutes()).slice(-2);
  const second = ('0' + d.getSeconds()).slice(-2);

  return `${date}/${month}/${year}, ${hour}:${minute}:${second}`;
}
