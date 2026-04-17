import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const impacta = await prisma.organization.upsert({
    where: { slug: 'impacta' },
    update: {},
    create: {
      name: 'ONG Impacta',
      slug: 'impacta',
      logo: 'https://impacta.pinguinoseguro.cl/logo.svg',
      config: {
        primary: '#00A8FF',
        accent: '#00D4AA',
        background: '#000000',
      },
      plan: 'PRO',
    },
  });

  console.log({ impacta });
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
