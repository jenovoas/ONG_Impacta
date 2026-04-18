import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { multiTenantExtension } from './prisma-multi-tenant.extension';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma = new PrismaClient();
  
  // The 'tenant' property is an extended Prisma client that automatically
  // filters all queries by the current organization ID found in the AsyncLocalStorage context.
  public readonly tenant = this.prisma.$extends(multiTenantExtension);

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Provide access to the base client if needed (e.g. for cross-tenant operations)
  get base() {
    return this.prisma;
  }
}
