import { Prisma } from '@prisma/client';
import { tenantContextStorage } from '../common/utils/tenant-context';

export const multiTenantExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const context = tenantContextStorage.getStore();
          const orgId = context?.orgId;

          // List of models that have an 'organizationId' field
          const multiTenantModels = [
            'User',
            'Member',
            'Donation',
            'Campaign',
            'Species',
            'Mission',
          ];

          if (orgId && multiTenantModels.includes(model)) {
            const anyArgs = args as any;
            if (
              [
                'findFirst',
                'findFirstOrThrow',
                'findMany',
                'count',
                'aggregate',
                'groupBy',
                'updateMany',
                'deleteMany',
              ].includes(operation)
            ) {
              anyArgs.where = { ...anyArgs.where, organizationId: orgId };
            } else if (
              ['findUnique', 'findUniqueOrThrow', 'update', 'upsert', 'delete'].includes(operation)
            ) {
              anyArgs.where = { ...anyArgs.where, organizationId: orgId };
            } else if (['create', 'createMany'].includes(operation)) {
              if (operation === 'create') {
                anyArgs.data = { ...anyArgs.data, organizationId: orgId };
              } else if (operation === 'createMany') {
                if (Array.isArray(anyArgs.data)) {
                  anyArgs.data = anyArgs.data.map((item: any) => ({
                    ...item,
                    organizationId: orgId,
                  }));
                }
              }
            }
          }

          return query(args);
        },
      },
    },
  });
});
