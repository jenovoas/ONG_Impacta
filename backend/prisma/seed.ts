import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const organization = await prisma.organization.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Fundación Impacta Biobío',
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

  console.log('Organization created/found:', organization.slug);

  // 1. Members
  const membersData = [
    { firstName: 'Juan', lastName: 'Pérez', rut: '12.345.678-5', email: 'juan.perez@email.com', status: 'ACTIVE' },
    { firstName: 'María', lastName: 'González', rut: '15.678.901-2', email: 'maria.g@email.com', status: 'ACTIVE' },
    { firstName: 'Carlos', lastName: 'Soto', rut: '18.901.234-k', email: 'csoto@email.com', status: 'ACTIVE' },
    { firstName: 'Ana', lastName: 'López', rut: '10.123.456-7', email: 'alopez@email.com', status: 'ACTIVE' },
    { firstName: 'Pedro', lastName: 'Ramírez', rut: '14.567.890-3', email: 'pramirez@email.com', status: 'ACTIVE' },
  ];

  for (const m of membersData) {
    await prisma.member.upsert({
      where: { organizationId_rut: { organizationId: organization.id, rut: m.rut! } },
      update: {},
      create: { ...m, organizationId: organization.id },
    });
  }
  console.log('Members seeded');

  // 2. Species
  const speciesData = [
    { commonName: 'Puma Chileno', scientificName: 'Puma concolor araucanus', status: 'THREATENED', description: 'Félido nativo de gran tamaño.' },
    { commonName: 'Zorro Chilla', scientificName: 'Lycalopex griseus', status: 'ACTIVE', description: 'Cánido pequeño y versátil.' },
    { commonName: 'Monito del Monte', scientificName: 'Dromiciops gliroides', status: 'ENDANGERED', description: 'Marsupial fósil viviente.' },
    { commonName: 'Cóndor Andino', scientificName: 'Vultur gryphus', status: 'ACTIVE', description: 'Ave voladora más grande del mundo.' },
  ];

  for (const s of speciesData) {
    await prisma.species.create({
      data: { ...s, organizationId: organization.id },
    });
  }
  console.log('Species seeded');

  // 3. Campaigns
  const campaign = await prisma.campaign.create({
    data: {
      name: 'Reforestación Cordillera 2026',
      description: 'Meta de 10.000 árboles nativos en la zona centro-sur.',
      goalAmount: 5000000,
      status: 'ACTIVE',
      organizationId: organization.id,
    },
  });
  console.log('Campaign created');

  // 4. Donations
  const members = await prisma.member.findMany({ where: { organizationId: organization.id } });
  for (let i = 0; i < 15; i++) {
    const randomMember = members[Math.floor(Math.random() * members.length)];
    await prisma.donation.create({
      data: {
        amount: (Math.floor(Math.random() * 50) + 5) * 1000, // 5k to 55k
        currency: 'CLP',
        status: 'SUCCEEDED',
        organizationId: organization.id,
        memberId: randomMember.id,
        campaignId: campaign.id,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    });
  }
  
  // Recalcular balance de campaña
  const total = await prisma.donation.aggregate({
    where: { campaignId: campaign.id, status: 'SUCCEEDED' },
    _sum: { amount: true },
  });
  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { currentAmount: total._sum.amount || 0 },
  });
  console.log('Donations seeded and balances updated');

  // 5. Missions
  await prisma.mission.create({
    data: {
      title: 'Censo de Biodiversidad Verano',
      description: 'Monitoreo de fauna en el Parque Nacional Nahuelbuta.',
      location: 'Región de La Araucanía',
      status: 'IN_PROGRESS',
      organizationId: organization.id,
      tasks: {
        create: [
          { title: 'Instalación de Cámaras Trampa', isCompleted: true },
          { title: 'Recolección de Muestras ADN', isCompleted: false },
        ]
      }
    }
  });
  console.log('Mission seeded');
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
