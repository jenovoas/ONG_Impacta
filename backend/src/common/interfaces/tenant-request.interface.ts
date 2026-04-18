import { Request } from 'express';

export interface TenantRequest extends Request {
  tenant?: {
    id: string;
  };
  user?: {
    id: string;
    email: string;
    orgId: string;
    role: string;
  };
}
