import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  materials,
  categories,
  products,
  users,
  machines,
} from '../src/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // 1. Czyszczenie bazy (opcjonalne - użyj ostrożnie!)
  console.log('🗑️  Clearing existing data...');
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.productionJob.deleteMany();
  await prisma.order.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.file.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.material.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.dailyStats.deleteMany();
  console.log('✅ Data cleared\n');

  // 2. Kategorie
  console.log('📂 Seeding categories...');
  for (const category of categories) {
    await prisma.category.create({ data: category });
  }
  console.log(`✅ Created ${categories.length} categories\n`);

  // 3. Materiały
  console.log('📦 Seeding materials...');
  for (const material of materials) {
    await prisma.material.create({ data: material });
  }
  console.log(`✅ Created ${materials.length} materials\n`);

  // 4. Produkty
  console.log('🛍️  Seeding products...');
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ Created ${products.length} products\n`);

  // 5. Użytkownicy
  console.log('👥 Seeding users...');
  const password = 'Test1234!';
  const hashedPassword = await bcrypt.hash(password, 10);

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    // Dodaj przykładowy adres dla każdego użytkownika
    await prisma.address.create({
      data: {
        userId: createdUser.id,
        type: 'SHIPPING',
        firstName: user.firstName,
        lastName: user.lastName,
        street: 'ul. Testowa',
        streetNumber: '123',
        apartment: '45',
        city: 'Kraków',
        postalCode: '30-001',
        country: 'Polska',
        phone: user.phone || '+48123456789',
        isDefault: true,
        company: user.companyName,
      },
    });
  }
  console.log(`✅ Created ${users.length} users (password: ${password})\n`);

  // 6. Maszyny
  console.log('🖨️  Seeding machines...');
  for (const machine of machines) {
    await prisma.machine.create({ data: machine });
  }
  console.log(`✅ Created ${machines.length} machines\n`);

  // 7. Statystyki - utwórz pusty wpis na dzisiaj
  console.log('📊 Creating daily stats entry...');
  await prisma.dailyStats.create({
    data: {
      date: new Date(),
      ordersCount: 0,
      revenue: 0,
      m2Printed: 0,
      jobsCompleted: 0,
    },
  });
  console.log('✅ Daily stats created\n');

  console.log('🎉 Seed completed successfully!\n');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin@amgsquant.pl / Test1234!');
  console.log('   B2B: firma@example.com / Test1234!');
  console.log('   Agency: agencja@example.com / Test1234!');
  console.log('   Customer: klient@example.com / Test1234!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
