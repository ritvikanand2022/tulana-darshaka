import { PrismaClient, UserRole, ProductStatus, StockStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tulanadarshaka.com' },
    update: {},
    create: {
      email: 'admin@tulanadarshaka.com',
      username: 'admin',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
      reputation: 1000,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create test user
  const testUserPassword = await bcrypt.hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      password: testUserPassword,
      role: UserRole.USER,
      emailVerified: true,
      reputation: 50,
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // Create categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      icon: '📱',
      order: 1,
    },
  });

  const laptopsCategory = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Portable computers and notebooks',
      icon: '💻',
      parentId: electronicsCategory.id,
      order: 1,
      specFields: {
        fields: [
          { name: 'processor', type: 'text', label: 'Processor' },
          { name: 'ram', type: 'number', label: 'RAM (GB)' },
          { name: 'storage', type: 'number', label: 'Storage (GB)' },
          { name: 'screenSize', type: 'number', label: 'Screen Size (inches)' },
          { name: 'weight', type: 'number', label: 'Weight (kg)' },
        ],
      },
    },
  });

  console.log('✅ Created categories');

  // Create sample products
  const laptop1 = await prisma.product.create({
    data: {
      name: 'MacBook Pro 14"',
      brand: 'Apple',
      model: 'M3 Pro',
      slug: 'macbook-pro-14-m3',
      description: 'Powerful laptop with M3 Pro chip, perfect for professionals',
      price: 1999,
      categoryId: laptopsCategory.id,
      status: ProductStatus.ACTIVE,
      stockStatus: StockStatus.IN_STOCK,
      specifications: {
        processor: 'Apple M3 Pro',
        ram: 18,
        storage: 512,
        screenSize: 14.2,
        weight: 1.6,
        gpu: '18-core GPU',
        battery: 'Up to 18 hours',
      },
      images: {
        create: [
          {
            url: 'https://via.placeholder.com/800x600?text=MacBook+Pro',
            alt: 'MacBook Pro 14"',
            order: 0,
          },
        ],
      },
    },
  });

  const laptop2 = await prisma.product.create({
    data: {
      name: 'Dell XPS 15',
      brand: 'Dell',
      model: '9530',
      slug: 'dell-xps-15-9530',
      description: 'Premium Windows laptop with stunning OLED display',
      price: 1799,
      categoryId: laptopsCategory.id,
      status: ProductStatus.ACTIVE,
      stockStatus: StockStatus.IN_STOCK,
      specifications: {
        processor: 'Intel Core i7-13700H',
        ram: 16,
        storage: 512,
        screenSize: 15.6,
        weight: 1.86,
        gpu: 'NVIDIA RTX 4050',
        battery: 'Up to 12 hours',
      },
      images: {
        create: [
          {
            url: 'https://via.placeholder.com/800x600?text=Dell+XPS+15',
            alt: 'Dell XPS 15',
            order: 0,
          },
        ],
      },
    },
  });

  const laptop3 = await prisma.product.create({
    data: {
      name: 'ThinkPad X1 Carbon',
      brand: 'Lenovo',
      model: 'Gen 11',
      slug: 'lenovo-thinkpad-x1-carbon-gen11',
      description: 'Business laptop with excellent keyboard and durability',
      price: 1599,
      categoryId: laptopsCategory.id,
      status: ProductStatus.ACTIVE,
      stockStatus: StockStatus.IN_STOCK,
      specifications: {
        processor: 'Intel Core i7-1355U',
        ram: 16,
        storage: 512,
        screenSize: 14,
        weight: 1.12,
        gpu: 'Intel Iris Xe',
        battery: 'Up to 15 hours',
      },
      images: {
        create: [
          {
            url: 'https://via.placeholder.com/800x600?text=ThinkPad+X1',
            alt: 'ThinkPad X1 Carbon',
            order: 0,
          },
        ],
      },
    },
  });

  console.log('✅ Created sample products');

  // Create sample reviews
  await prisma.review.create({
    data: {
      rating: 5,
      title: 'Best laptop I\'ve ever owned',
      content: 'The M3 Pro chip is incredibly fast and the battery life is amazing. Highly recommended!',
      pros: ['Excellent performance', 'Long battery life', 'Beautiful display'],
      cons: ['Expensive', 'Limited ports'],
      verified: true,
      productId: laptop1.id,
      userId: testUser.id,
      status: 'APPROVED',
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      title: 'Great Windows alternative',
      content: 'The OLED display is stunning and performance is solid. Some heat issues under load.',
      pros: ['Beautiful OLED screen', 'Good performance', 'Nice design'],
      cons: ['Gets warm', 'Average battery life'],
      verified: true,
      productId: laptop2.id,
      userId: testUser.id,
      status: 'APPROVED',
    },
  });

  console.log('✅ Created sample reviews');

  // Create price history
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    await prisma.priceHistory.create({
      data: {
        price: 1999 - Math.random() * 200,
        productId: laptop1.id,
        source: 'Apple Store',
        createdAt: date,
      },
    });
  }

  console.log('✅ Created price history');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
