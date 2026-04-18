import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TenantRequest } from '../interfaces/tenant-request.interface';
import { tenantContextStorage } from '../utils/tenant-context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: TenantRequest, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    let orgId: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.decode(token) as any;
        if (payload && payload.orgId) {
          orgId = payload.orgId as string;
          req.tenant = { id: orgId };
        }
      } catch (e) {
        // Ignore decoding errors in middleware, let the Guard handle authentication
      }
    }

    tenantContextStorage.run({ orgId }, () => {
      next();
    });
  }
}
