import { PrismaClient } from '@prisma/client';
import { materials } from './seed-data/materials';
import { categories, products } from './seed-data/products';
import { users } from './seed-data/users';
import { machines } from './seed-data/machines';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed materials
  console.log('📦 Seeding materials...');
  for (const material of materials) {
    await prisma.material.create({
      data: material,
    });
  }

  // Seed categories
  console.log('📂 Seeding categories...');
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  // Seed products
  console.log('🛍️ Seeding products...');
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  // Seed users
  console.log('👥 Seeding users...');
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Seed machines
  console.log('🏭 Seeding machines...');
  for (const machine of machines) {
    await prisma.machine.create({
      data: machine,
    });
  }

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
