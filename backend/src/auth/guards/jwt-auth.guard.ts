import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    
    // Hardcoded bypass for assets due to compiler stripping metadata
    if (req.url && req.url.startsWith('/assets/')) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(`[AuthGuard] Checking route: ${req.url}, isPublic: ${isPublic}`);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
