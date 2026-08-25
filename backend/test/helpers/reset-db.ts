import { PrismaClient } from '@prisma/client';

export async function resetDb(prisma: PrismaClient) {
  const tables = ['Mission', 'Species', 'Donation', 'Campaign', 'Member', 'User', 'Organization'];
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tables.map((t) => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE;`
  );
}
