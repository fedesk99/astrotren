/*
  Migración única del contenido REAL de Astrotrén a Supabase.

  Requiere:
    SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY

  La SERVICE_ROLE_KEY nunca debe subirse a GitHub.
*/

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createClient } = require('@supabase/supabase-js');

const WebSocket = require('ws');

const root = path.resolve(__dirname, '..');
const mockPath = path.join(root, 'src', 'mock', 'mockData.js');
const imageRoot = path.join(root, 'public');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    'Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.'
  );
}

if (!fs.existsSync(mockPath)) {
  throw new Error(`No existe mockData.js: ${mockPath}`);
}

const source = fs
  .readFileSync(mockPath, 'utf8')
  .replace(/export const /g, 'globalThis.');

const context = {};
vm.runInNewContext(source, context);

const db = createClient(url, key, {
  realtime: {
    transport: WebSocket,
  },
});

const monthIndex = {
  Enero: 1,
  Febrero: 2,
  Marzo: 3,
  Abril: 4,
  Mayo: 5,
  Junio: 6,
  Julio: 7,
  Agosto: 8,
  Septiembre: 9,
  Octubre: 10,
  Noviembre: 11,
  Diciembre: 12,
};

const toIsoDate = (value) => {
  const [day, month, year] = value.split(' ');

  const monthNumber = monthIndex[month];

  if (!monthNumber) {
    throw new Error(`Mes desconocido en fecha: ${value}`);
  }

  return `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function getLocalImagePath(publicPath) {
  const relative = publicPath.replace(/^\//, '');
  return path.join(imageRoot, relative);
}

function getContentType(extension) {
  if (extension === '.png') return 'image/png';
  if (extension === '.webp') return 'image/webp';
  if (extension === '.gif') return 'image/gif';
  if (extension === '.svg') return 'image/svg+xml';
  return 'image/jpeg';
}

async function uploadPublicImage(publicPath, folder) {
  const local = getLocalImagePath(publicPath);

  if (!fs.existsSync(local)) {
    throw new Error(`No existe la imagen: ${local}`);
  }

  const extension =
    path.extname(local).toLowerCase() || '.jpg';

  const storagePath =
    `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;

  const body = fs.readFileSync(local);

  const { error } = await db.storage
    .from('media')
    .upload(storagePath, body, {
      contentType: getContentType(extension),
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return {
    url: `/media/${storagePath}`,
    path: storagePath,
  };
}

async function clearTable(table) {
  console.log(`Limpiando ${table}...`);

  const { error } = await db
    .from(table)
    .delete()
    .neq(
      'id',
      '00000000-0000-0000-0000-000000000000'
    );

  if (error) {
    throw error;
  }
}

async function main() {
  console.log('');
  console.log('======================================');
  console.log(' ASTROTRÉN → SUPABASE');
  console.log('======================================');
  console.log('');

  console.log('Contenido que se va a migrar:');
  console.log(`- Playlists: ${(context.playlists || []).length}`);
  console.log(
    `- Shows: ${(context.shows || []).reduce(
      (total, group) => total + group.dates.length,
      0
    )}`
  );
  console.log(`- Galería: ${(context.gallery || []).length}`);
  console.log(
    `- Productos: ${(context.merchandise || []).length}`
  );
  console.log('');

  console.log(
    'ATENCIÓN: se eliminarán los datos actuales de prueba'
  );
  console.log(
    'de playlists, shows, gallery y products.'
  );
  console.log('');

  await clearTable('playlists');
  await clearTable('shows');
  await clearTable('gallery');
  await clearTable('products');

  console.log('');
  console.log('Migrando playlists...');

  const playlists = (context.playlists || []).map(
    (item, index) => ({
      title: item.title,
      url: item.url,
      embed_id: item.embedId,
      position: index,
    })
  );

  if (playlists.length) {
    const { error } = await db
      .from('playlists')
      .insert(playlists);

    if (error) throw error;
  }

  console.log(`✓ ${playlists.length} playlists`);

  console.log('');
  console.log('Migrando shows...');

  const shows = (context.shows || []).flatMap(
    (group) =>
      group.dates.map((item) => ({
        date: toIsoDate(item.date),
        time: item.time || '',
        venue: item.venue,
        address: item.address || '',
      }))
  );

  const showsWithPosition = shows.map(
    (item, index) => ({
      ...item,
      position: index,
    })
  );

  if (showsWithPosition.length) {
    const { error } = await db
      .from('shows')
      .insert(showsWithPosition);

    if (error) throw error;
  }

  console.log(`✓ ${showsWithPosition.length} shows`);

  console.log('');
  console.log('Migrando galería...');

  for (
    let index = 0;
    index < (context.gallery || []).length;
    index++
  ) {
    const item = context.gallery[index];

    console.log(
      `  ${index + 1}/${context.gallery.length}: ${item.url}`
    );

    const uploaded = await uploadPublicImage(
      item.url,
      'gallery'
    );

    const { error } = await db
      .from('gallery')
      .insert({
        image_url: uploaded.url,
        caption: item.alt || '',
        position: index,
      });

    if (error) throw error;

    await sleep(50);
  }

  console.log(
    `✓ ${(context.gallery || []).length} imágenes de galería`
  );

  console.log('');
  console.log('Migrando productos...');

  for (
    let index = 0;
    index < (context.merchandise || []).length;
    index++
  ) {
    const item = context.merchandise[index];

    console.log(
      `  Producto ${index + 1}/${context.merchandise.length}: ${item.name}`
    );

    const images = [];

    for (
      let imageIndex = 0;
      imageIndex < (item.images || []).length;
      imageIndex++
    ) {
      const originalPath = item.images[imageIndex];

      console.log(
        `    Imagen ${imageIndex + 1}/${item.images.length}: ${originalPath}`
      );

      const uploaded = await uploadPublicImage(
        originalPath,
        'products'
      );

      images.push({
        url: uploaded.url,
        label: item.imageLabels?.[imageIndex] || '',
      });

      await sleep(50);
    }

    const price = Number(
      String(item.price).replace(/[^0-9.-]/g, '')
    );

    const { error } = await db
      .from('products')
      .insert({
        name: item.name,
        price,
        description: item.description || '',
        images,
        position: index,
      });

    if (error) throw error;
  }

  console.log(
    `✓ ${(context.merchandise || []).length} productos`
  );

  console.log('');
  console.log('======================================');
  console.log(' MIGRACIÓN COMPLETADA');
  console.log('======================================');
  console.log('');
}

main().catch((error) => {
  console.error('');
  console.error('❌ MIGRACIÓN FALLIDA');
  console.error('');
  console.error(error);
  process.exit(1);
});