import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  // 1. Crear Organización 'demo'
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Fundación Conservación Atacama',
      slug: 'demo',
      plan: 'PRO',
      users: {
        create: [
          {
            email: 'admin@demo.impacta.cl',
            passwordHash: passwordHash,
            role: 'SUPERADMIN',
          },
          {
            email: 'operador@demo.impacta.cl',
            passwordHash: passwordHash,
            role: 'OPERATOR',
          },
        ],
      },
    },
  });

  console.log('Organización demo lista:', organization.name);

  // 2. Crear Miembros / Socios
  const member1 = await prisma.member.upsert({
    where: { organizationId_rut: { organizationId: organization.id, rut: '18.452.391-K' } },
    update: {},
    create: {
      organizationId: organization.id,
      rut: '18.452.391-K',
      firstName: 'Camila',
      lastName: 'Valenzuela',
      email: 'camila.valenzuela@gmail.com',
      phone: '+56 9 8765 4321',
      status: 'ACTIVE',
    },
  });

  const member2 = await prisma.member.upsert({
    where: { organizationId_rut: { organizationId: organization.id, rut: '15.223.109-4' } },
    update: {},
    create: {
      organizationId: organization.id,
      rut: '15.223.109-4',
      firstName: 'Gonzalo',
      lastName: 'Pérez',
      email: 'gonzalo.perez@outdoors.cl',
      phone: '+56 9 7654 3210',
      status: 'ACTIVE',
    },
  });

  const member3 = await prisma.member.upsert({
    where: { organizationId_rut: { organizationId: organization.id, rut: '19.882.341-2' } },
    update: {},
    create: {
      organizationId: organization.id,
      rut: '19.882.341-2',
      firstName: 'Francisca',
      lastName: 'Morales',
      email: 'f.morales@biologia.cl',
      phone: '+56 9 5432 1098',
      status: 'ACTIVE',
    },
  });

  console.log('Miembros creados.');

  // 3. Crear Campañas
  const campaign1 = await prisma.campaign.create({
    data: {
      organizationId: organization.id,
      name: 'Reforestación Bosque Nativo 2026',
      description: 'Campaña comunitaria para la plantación de 5.000 huillungos y quilo en la serranía costera.',
      goalAmount: 15000000,
      currentAmount: 11250000,
      status: 'ACTIVE',
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      organizationId: organization.id,
      name: 'Protección del Zorro Chilote',
      description: 'Monitoreo fotográfico con cámaras trampa y vallado protector de hábitat.',
      goalAmount: 8500000,
      currentAmount: 4200000,
      status: 'ACTIVE',
    },
  });

  console.log('Campañas creadas.');

  // 4. Crear Donaciones
  await prisma.donation.createMany({
    data: [
      {
        organizationId: organization.id,
        memberId: member1.id,
        campaignId: campaign1.id,
        amount: 250000,
        currency: 'CLP',
        status: 'SUCCEEDED',
        gatewayRef: 'tx_mp_998123',
      },
      {
        organizationId: organization.id,
        memberId: member2.id,
        campaignId: campaign1.id,
        amount: 500000,
        currency: 'CLP',
        status: 'SUCCEEDED',
        gatewayRef: 'tx_mp_998124',
      },
      {
        organizationId: organization.id,
        memberId: member3.id,
        campaignId: campaign2.id,
        amount: 150000,
        currency: 'CLP',
        status: 'SUCCEEDED',
        gatewayRef: 'tx_mp_998125',
      },
    ],
  });

  console.log('Donaciones creadas.');

  // 5. Crear Especies en Conservación
  await prisma.species.createMany({
    data: [
      {
        organizationId: organization.id,
        commonName: 'Zorro de Darwin / Chilote',
        scientificName: 'Lycalopex fulvipes',
        description: 'Cánido endémico en peligro crítico de extinción que habita en los bosques templados del sur de Chile.',
        status: 'THREATENED',
      },
      {
        organizationId: organization.id,
        commonName: 'Gato del Desierto / Colocolo',
        scientificName: 'Leopardus garleppi',
        description: 'Felino nativo adaptar a matorrales y zonas áridas del altiplano y desierto.',
        status: 'ACTIVE',
      },
      {
        organizationId: organization.id,
        commonName: 'Puma Chileno',
        scientificName: 'Puma concolor puma',
        description: 'Gran felino predador tope clave para el equilibrio trófico de los ecosistemas patagónicos.',
        status: 'ACTIVE',
      },
    ],
  });

  console.log('Especies registradas.');

  // 6. Crear Misiones de Campo
  await prisma.mission.create({
    data: {
      organizationId: organization.id,
      title: 'Censo y Fototrampeo Parque Nahuelbuta',
      description: 'Despliegue de cuadrillas para revisión de cámaras y registro de rastros de carnívoros.',
      location: 'Parque Nacional Nahuelbuta, Región de la Araucanía',
      status: 'IN_PROGRESS',
      tasks: {
        create: [
          { title: 'Instalación de 12 cámaras trampa en sector Coihues', isCompleted: true },
          { title: 'Recolección de muestras biológicas y huellas', isCompleted: true },
          { title: 'Revisión y mantenimiento de vallados perimetrales', isCompleted: false },
        ],
      },
    },
  });

  console.log('Misiones creadas con éxito.');
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

