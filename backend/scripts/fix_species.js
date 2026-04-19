const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAndUpdate() {
  try {
    const org = await prisma.organization.findUnique({ where: { slug: 'demo' } });
    if (!org) {
      console.error('Organization demo not found');
      return;
    }

    // Limpiar especies duplicadas
    await prisma.species.deleteMany({ where: { organizationId: org.id } });

    const baseUrl = 'https://api-impacta.pinguinoseguro.cl/assets/organizations/demo/species';
    
    const species = [
      { commonName: 'Puma Chileno', scientificName: 'Puma concolor araucanus', status: 'THREATENED', description: 'Félido nativo de gran tamaño.', imageUrl: baseUrl + '/puma.png' },
      { commonName: 'Zorro Chilla', scientificName: 'Lycalopex griseus', status: 'ACTIVE', description: 'Cánido pequeño y versátil.', imageUrl: baseUrl + '/zorro.png' },
      { commonName: 'Monito del Monte', scientificName: 'Dromiciops gliroides', status: 'ENDANGERED', description: 'Marsupial fósil viviente.', imageUrl: baseUrl + '/monito.png' },
      { commonName: 'Cóndor Andino', scientificName: 'Vultur gryphus', status: 'ACTIVE', description: 'Ave voladora más grande del mundo.', imageUrl: baseUrl + '/condor.png' },
    ];

    for (const s of species) {
      await prisma.species.create({ data: { ...s, organizationId: org.id } });
    }
    
    console.log('Species cleaned and updated successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndUpdate();
