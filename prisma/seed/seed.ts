import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
const adminEmail = process.env.SEED_ADMIN_EMAIL;

if (!adminEmail) {
  throw new Error('SEED_ADMIN_EMAIL não definido no .env');
}

const user = await prisma.user.upsert({
  where: { email: adminEmail },
  update: {},
  create: {
    name: 'Admin JPBR',
    email: adminEmail,
    role: 'ADMIN',
  },
});
  console.log('Seed executado. Usuário:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
