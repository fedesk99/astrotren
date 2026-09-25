/*
  One-time migration from the current Astrotrén mockData.js/public/Images
  to Supabase.

  Run from frontend after installing @supabase/supabase-js:
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-to-supabase.js

  NEVER commit SUPABASE_SERVICE_ROLE_KEY.
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createClient } = require('@supabase/supabase-js');

const root = path.resolve(__dirname, '..');
const mockPath = path.join(root, 'src', 'mock', 'mockData.js');
const imageRoot = path.join(root, 'public');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');

const source = fs.readFileSync(mockPath, 'utf8').replace(/export const /g, 'globalThis.');
const context = {};
vm.runInNewContext(source, context);
const db = createClient(url, key);

const monthIndex = { Enero:1, Febrero:2, Marzo:3, Abril:4, Mayo:5, Junio:6, Julio:7, Agosto:8, Septiembre:9, Octubre:10, Noviembre:11, Diciembre:12 };
const toIsoDate = (value) => { const [day, month, year] = value.split(' '); return `${year}-${String(monthIndex[month]).padStart(2,'0')}-${String(day).padStart(2,'0')}`; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function uploadPublicImage(publicPath, folder) {
  const relative = publicPath.replace(/^\//, '');
  const local = path.join(imageRoot, relative.replace(/^Images[\\/]/, 'Images/'));
  if (!fs.existsSync(local)) throw new Error(`No existe: ${local}`);
  const ext = path.extname(local).toLowerCase() || '.jpg';
  const storagePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const body = fs.readFileSync(local);
  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
  const { error } = await db.storage.from('media').upload(storagePath, body, { contentType, upsert:false });
  if (error) throw error;
  return db.storage.from('media').getPublicUrl(storagePath).data.publicUrl;
}

async function main() {
  const { error: clearError } = await db.from('playlists').delete().neq('id', '00000000-0000-0000-0000-000000000000'); if (clearError) throw clearError;
  const { error: clearShows } = await db.from('shows').delete().neq('id', '00000000-0000-0000-0000-000000000000'); if (clearShows) throw clearShows;
  const { error: clearGallery } = await db.from('gallery').delete().neq('id', '00000000-0000-0000-0000-000000000000'); if (clearGallery) throw clearGallery;
  const { error: clearProducts } = await db.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); if (clearProducts) throw clearProducts;

  const playlists = (context.playlists || []).map((x,i) => ({ title:x.title, url:x.url, embed_id:x.embedId, position:i }));
  if (playlists.length) { const { error } = await db.from('playlists').insert(playlists); if (error) throw error; }

  const shows = (context.shows || []).flatMap(group => group.dates.map((x,i) => ({ date:toIsoDate(x.date), time:x.time || '', venue:x.venue, address:x.address || '', position:i })));
  if (shows.length) { const { error } = await db.from('shows').insert(shows.map((x,i)=>({...x,position:i}))); if (error) throw error; }

  for (let i=0; i<(context.gallery || []).length; i++) {
    const x=context.gallery[i]; const image_url=await uploadPublicImage(x.url,'gallery');
    const { error }=await db.from('gallery').insert({image_url,caption:x.alt||'',position:i}); if(error) throw error;
    await sleep(50);
  }

  for (let i=0; i<(context.merchandise || []).length; i++) {
    const x=context.merchandise[i]; const images=[];
    for (let j=0;j<(x.images||[]).length;j++) images.push({url:await uploadPublicImage(x.images[j],'products'),label:x.imageLabels?.[j]||''});
    const price=Number(String(x.price).replace(/[^0-9.-]/g,''));
    const { error }=await db.from('products').insert({name:x.name,price,description:x.description||'',images,position:i}); if(error) throw error;
  }
  console.log('Migración completada.');
}
main().catch(err=>{ console.error(err); process.exit(1); });
