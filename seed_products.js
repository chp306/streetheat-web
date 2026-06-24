
const { PrismaClient } = require('./src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const nike   = await prisma.brand.upsert({ where: { slug: 'nike' }, update: {}, create: { name: 'Nike', slug: 'nike' } });
  const jordan = await prisma.brand.upsert({ where: { slug: 'air-jordan' }, update: {}, create: { name: 'Air Jordan', slug: 'air-jordan' } });
  const adidas = await prisma.brand.upsert({ where: { slug: 'adidas' }, update: {}, create: { name: 'Adidas', slug: 'adidas' } });
  const nb     = await prisma.brand.upsert({ where: { slug: 'new-balance' }, update: {}, create: { name: 'New Balance', slug: 'new-balance' } });
  const cat    = await prisma.category.upsert({ where: { slug: 'sneakers' }, update: {}, create: { name: 'Sneakers', slug: 'sneakers' } });

  const products = [
    { name: 'Air Force 1 Low White', brandId: nike.id, basePrice: 120, description: 'The classic. Clean white leather upper, iconic Air cushioning.', condition: 'new' },
    { name: 'Jordan 1 Retro High OG Chicago', brandId: jordan.id, basePrice: 380, description: 'The shoe that started it all. Original Chicago colourway.', condition: 'new' },
    { name: 'Adidas Samba OG White Gum', brandId: adidas.id, basePrice: 110, description: 'Timeless football-turned-lifestyle silhouette. White leather with suede T-toe.', condition: 'new' },
    { name: 'New Balance 550 White Green', brandId: nb.id, basePrice: 130, description: 'Basketball heritage meets modern streetwear.', condition: 'new' },
    { name: 'Jordan 4 Retro Bred Reimagined', brandId: jordan.id, basePrice: 290, description: 'The Bred 4 returns with premium nubuck and updated details.', condition: 'new' },
    { name: 'Nike Dunk Low Panda', brandId: nike.id, basePrice: 150, description: 'Black and white leather Dunk Low. Clean, versatile, endlessly wearable.', condition: 'new' },
  ];

  const sizes = ['7', '8', '9', '10', '11'];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        brandId: p.brandId,
        basePrice: p.basePrice,
        description: p.description,
        condition: p.condition,
        categoryId: cat.id,
        status: 'published',
        offerEnabled: true,
        variants: {
          create: sizes.map((size, i) => ({
            size,
            sku: p.name.toLowerCase().replace(/\s+/g, '-') + '-uk' + size,
            stockQuantity: i === 2 ? 0 : 2,
          }))
        }
      }
    });
    console.log('Created:', product.name);
  }
  await prisma.$disconnect();
}

main().then(() => { console.log('Done'); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });
