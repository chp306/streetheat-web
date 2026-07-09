import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

async function upsertBrand(name: string, slug: string) {
  const existing = await prisma.brand.findFirst({ where: { name } })
  if (existing) return existing
  return prisma.brand.create({ data: { name, slug } })
}

async function upsertCategory(name: string) {
  const existing = await prisma.category.findFirst({ where: { name } })
  if (existing) return existing
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  return prisma.category.create({ data: { name, slug } })
}

function skuFor(productSlug: string, size: string) {
  const cleanSize = size.replace(/[^a-zA-Z0-9]/g, '')
  return `SH-${productSlug}-${cleanSize}`.toUpperCase()
}

async function main() {
  console.log('Wiping existing products...')
  await prisma.product.deleteMany({})
  console.log('Existing products wiped.')

  console.log('Ensuring brands...')
  const asics = await upsertBrand('ASICS', 'asics')
  const nike = await upsertBrand('Nike', 'nike')
  const jordan = await upsertBrand('Air Jordan', 'air-jordan')
  const valeLives = await upsertBrand('Vale Lives', 'vale-lives')
  const fendi = await upsertBrand('Fendi', 'fendi')

  console.log('Ensuring categories...')
  const sneakers = await upsertCategory('Sneakers')
  const apparel = await upsertCategory('Apparel')
  const accessories = await upsertCategory('Accessories')

  const products: any[] = [
    {
      name: 'ASICS Gel-Kayano 14 Pale Blue/Grey',
      slug: 'kayano14-pale-blue-grey',
      description: 'ASICS Gel-Kayano 14 in Pale Blue/Grey colourway.',
      brandId: asics.id,
      categoryId: sneakers.id,
      variants: [
        { size: '4', price: 170 }, { size: '4.5', price: 170 },
        { size: '5', price: 170 }, { size: '5.5', price: 170 },
        { size: '7', price: 180 }, { size: '7.5', price: 180 },
        { size: '8', price: 180 }, { size: '8.5', price: 180 },
        { size: '9.5', price: 180 },
      ],
      basePrice: 170,
    },
    {
      name: 'ASICS Gel-Kayano 14 Pink/Silver',
      slug: 'kayano14-pink-silver',
      description: 'ASICS Gel-Kayano 14 in Pink/Silver colourway.',
      brandId: asics.id,
      categoryId: sneakers.id,
      variants: [{ size: '4', price: 160 }, { size: '4.5', price: 160 }],
      basePrice: 160,
    },
    {
      name: 'ASICS GT-2160 Blue/Silver',
      slug: 'gt2160-blue-silver',
      description: 'ASICS GT-2160 in Blue/Silver colourway.',
      brandId: asics.id,
      categoryId: sneakers.id,
      variants: [
        { size: '4', price: 135 }, { size: '4.5', price: 135 },
        { size: '5.5', price: 135 }, { size: '6', price: 135 },
        { size: '7', price: 160 }, { size: '7.5', price: 160 },
        { size: '8.5', price: 160 },
      ],
      basePrice: 135,
    },
    {
      name: 'Air Jordan 4 Black Cat',
      slug: 'jordan4-black-cat',
      description: 'Air Jordan 4 in the iconic Black Cat colourway.',
      brandId: jordan.id,
      categoryId: sneakers.id,
      variants: [
        { size: '4', price: 180 }, { size: '5', price: 180 },
        { size: '7', price: 290 },
      ],
      basePrice: 180,
    },
    {
      name: 'ASICS Gel-Kayano 14 White/Black/Yellow',
      slug: 'kayano14-white-black-yellow',
      description: 'ASICS Gel-Kayano 14 in White/Black/Yellow colourway.',
      brandId: asics.id,
      categoryId: sneakers.id,
      variants: [
        { size: '7', price: 175 }, { size: '7.5', price: 175 },
        { size: '8.5', price: 175 }, { size: '9', price: 175 },
        { size: '9.5', price: 175 },
      ],
      basePrice: 175,
    },
    {
      name: 'Nike Air Force 1 Low Triple White',
      slug: 'af1-triple-white',
      description: 'Nike Air Force 1 Low in Triple White.',
      brandId: nike.id,
      categoryId: sneakers.id,
      variants: [
        { size: '7.5', price: 100, stock: 1 },
        { size: '8', price: 100, stock: 1 },
        { size: '8.5', price: 100, stock: 1 },
        { size: '9', price: 100, stock: 2 },
        { size: '9.5', price: 100, stock: 1 },
        { size: '10', price: 100, stock: 1 },
      ],
      basePrice: 100,
    },
    {
      name: 'ASICS Gel-Kayano 14 Black/Navy',
      slug: 'kayano14-black-navy',
      description: 'ASICS Gel-Kayano 14 in Black/Navy colourway.',
      brandId: asics.id,
      categoryId: sneakers.id,
      variants: [
        { size: '7', price: 160 }, { size: '7.5', price: 160 },
        { size: '8.5', price: 160 },
      ],
      basePrice: 160,
    },
    {
      name: 'ASICS Gel-Kayano 14 Aqua/Teal',
      slug: 'kayano14-aqua-teal',
      description: 'ASICS Gel-Kayano 14 in Aqua/Teal colourway.',
      brandId: asics.id,
      categoryId: sneakers.id,
      variants: [
        { size: '4', price: 170 }, { size: '4.5', price: 170 },
        { size: '5', price: 170 }, { size: '5.5', price: 170 },
      ],
      basePrice: 170,
    },
    {
      name: 'Vale Lives Vintage Graphic Tee',
      slug: 'vale-lives-tee',
      description: 'Vale Lives 1997 vintage graphic tee, bulldog military print.',
      brandId: valeLives.id,
      categoryId: apparel.id,
      variants: [{ size: 'M', price: 150 }],
      basePrice: 150,
    },
    {
      name: 'Nike P-6000 Dark Grey',
      slug: 'p6000-dark-grey',
      description: 'Nike P-6000 in Dark Grey/Iron Grey.',
      brandId: nike.id,
      categoryId: sneakers.id,
      variants: [
        { size: '7.5', price: 110 }, { size: '8.5', price: 110 },
      ],
      basePrice: 110,
    },
    {
      name: 'ASICS Gel-Kayano 14 White/Silver',
      slug: 'kayano14-white-silver',
      description: 'ASICS Gel-Kayano 14 in White/Silver colourway.',
      brandId: asics.id,
      categoryId: sneakers.id,
      variants: [
        { size: '4', price: 155 }, { size: '4.5', price: 155 },
        { size: '7.5', price: 170 }, { size: '8', price: 170 },
      ],
      basePrice: 155,
    },
    {
      name: 'Fendi Baguette Chain Wallet Denim Blue FF',
      slug: 'fendi-baguette-wallet',
      description: 'Fendi Baguette Chain Wallet, denim blue FF monogram.',
      brandId: fendi.id,
      categoryId: accessories.id,
      variants: [{ size: 'One Size', price: 720 }],
      basePrice: 720,
    },
    {
      name: 'Vale Lives Vintage Full-Zip Hoodie',
      slug: 'vale-lives-hoodie',
      description: 'Vale Lives vintage full-zip hoodie, two-tone acid wash, graphic print.',
      brandId: valeLives.id,
      categoryId: apparel.id,
      variants: [
        { size: 'S', price: 250 }, { size: 'M', price: 250 },
      ],
      basePrice: 250,
    },
  ]

  console.log(`Creating ${products.length} products...`)
  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        brandId: p.brandId,
        categoryId: p.categoryId,
        condition: 'new',
        status: 'published',
        basePrice: p.basePrice,
        offerEnabled: true,
      },
    })
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: created.id,
          size: v.size,
          stockQuantity: v.stock ?? 1,
          sku: skuFor(p.slug, v.size),
        },
      })
    }
    console.log(`  ✓ ${p.name} (${p.variants.length} variants)`)
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
