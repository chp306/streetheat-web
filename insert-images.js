const { Pool } = require('pg');

const images = [
  { id: '4eb009d4-66dc-4ba8-b3be-dded4c316e78', url: 'https://media.sivasdescalzo.com/media/catalog/product/1/2/1203A537-106_sivasdescalzo-Asics-GEL-KAYANO_14-1734954965-2.jpg' },
  { id: '9568ce66-42c9-4f64-9353-23e4d10e3c4f', url: 'https://sneakernews.com/wp-content/uploads/2023/07/asics-gel-kayano-14-pink-glo-1201A019-700-6-1.jpg?w=1920' },
  { id: '4b03d0c7-93cb-4d91-bf34-46891a36ec68', url: 'https://jdsports.ca/cdn/shop/files/1201A019-102_asics_gel_kayano_14_white__black___gold_5.jpg?v=1758951343&width=1200' },
  { id: 'b9154aca-c274-4aea-9270-4e2e75262ca5', url: 'https://uncrate.com/assets_c/2022/08/asics-gel-kayano-14-black-2-thumb-960xauto-150749.jpg' },
  { id: '6b1aa2c2-81f1-45b4-bd0c-5b54d97ef7d4', url: 'https://sneakernews.com/wp-content/uploads/2023/04/asics-gel-kayano-14-midnight-pure-silver-1201A019-402-5.jpg?w=1920' },
  { id: '4321f0f2-bb0d-4d75-a4ce-256f764e67e6', url: 'https://newcop.com/cdn/shop/files/newcop-asics-gel-kayano-14-white-ivory-zapatillas-2.webp?height=600&v=1780229164' },
  { id: 'ac24a7ed-5f0e-4ccf-b56c-099988031572', url: 'https://hqz.gg/wp-content/uploads/2024/04/asics-gt-2160-white-silver-blue-1203A320-107-4-1024x717.webp' },
  { id: '835a2b80-8ba4-470f-8012-7575fe7a34b8', url: 'https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/112/064/695/original/1567309_01.jpg.jpeg?action=crop&width=3500' },
  { id: 'a9668de9-7cae-4ae1-84e5-94cf8f434aba', url: 'https://grailkick.com/wp-content/uploads/2024/08/Nike-Air-Force-1-Low-Triple-White-Grailkick-2.webp' },
  { id: '5b656de1-d4af-4f30-8470-2545ecdfb1ae', url: 'https://cms-cdn.thesolesupplier.co.uk/2026/01/nike-p-6000-black-dark-grey-front.jpg' },
];

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const ids = images.map(i => i.id);
  await pool.query('DELETE FROM "ProductImage" WHERE "productId" = ANY($1)', [ids]);
  for (const img of images) {
    const rid = require('crypto').randomUUID();
    await pool.query(
      'INSERT INTO "ProductImage" (id, "productId", url, "displayOrder") VALUES ($1, $2, $3, 0)',
      [rid, img.id, img.url]
    );
    console.log('inserted:', img.id);
  }
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM "ProductImage"');
  console.log('Total ProductImage rows now:', rows[0].n);
  await pool.end();
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
