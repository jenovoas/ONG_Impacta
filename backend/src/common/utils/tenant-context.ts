import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  orgId?: string;
}

export const tenantContextStorage = new AsyncLocalStorage<TenantContext>();
