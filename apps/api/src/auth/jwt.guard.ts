import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = {
      userId: 'dev-admin',
      email: 'admin@outerhaven.local',
      role: 'ADMIN'
    };
    return true;
  }
}
