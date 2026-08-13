import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const organization = await prisma.organization.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'ONG Demo Impacta',
      slug: 'demo',
      plan: 'PRO',
      users: {
        create: {
          email: 'admin@demo.impacta.cl',
          passwordHash: passwordHash,
          role: 'SUPERADMIN',
        },
      },
    },
  });

  console.log({ organization });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
