import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@impacta.cl';
  const password = 'admin123';
  const orgName = 'Impacta Org';

  console.log('--- Creando datos iniciales ---');

  // 1. Crear Organización
  const org = await prisma.organization.upsert({
    where: { slug: 'impacta' },
    update: {},
    create: {
      name: orgName,
      slug: 'impacta',
    },
  });
  console.log(`Organización creada: ${org.name} (${org.id})`);

  // 2. Crear Usuario Admin
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: org.id, email } },
    update: { passwordHash },
    create: {
      organizationId: org.id,
      email,
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Usuario admin creado: ${user.email}`);
  console.log(`\nACCESO DASHBOARD:`);
  console.log(`URL: http://localhost:5173/login`);
  console.log(`User: ${email}`);
  console.log(`Pass: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
