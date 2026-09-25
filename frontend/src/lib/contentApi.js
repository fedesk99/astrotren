import { supabase } from './supabase';

export const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Revisá REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY.');
  }
  return supabase;
};

export const listContent = async (table) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from(table)
    .select('*')
    .order('position', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createContent = async (table, values) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from(table)
    .insert(values)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateContent = async (table, id, values) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from(table)
    .update(values)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteContent = async (table, id) => {
  const client = requireSupabase();
  const { error } = await client
    .from(table)
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const reorderContent = async (table, items) => {
  const client = requireSupabase();

  const results = await Promise.all(
    items.map((item, index) =>
      client
        .from(table)
        .update({ position: index })
        .eq('id', item.id)
    )
  );

  const failed = results.find((result) => result.error);

  if (failed) throw failed.error;
};

export const uploadImage = async (file, folder) => {
  const client = requireSupabase();

  const extension = file.name.includes('.')
    ? file.name.split('.').pop().toLowerCase()
    : 'jpg';

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const path = `${folder}/${safeName}`;

  const { error } = await client.storage.from('media').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  return {
    url: `/media/${path}`,
    path,
  };
};

export const removeStorageFile = async (path) => {
  if (!path) return;

  const client = requireSupabase();

  const { error } = await client
    .storage
    .from('media')
    .remove([path]);

  if (error) throw error;
};

export const extractStoragePath = (url) => {
  if (!url) return null;

  // URL antigua de Supabase:
  const marker = '/storage/v1/object/public/media/';
  const index = url.indexOf(marker);

  if (index !== -1) {
    return decodeURIComponent(url.slice(index + marker.length));
  }

  // Nueva ruta relativa:
  const relativeMarker = '/media/';

  if (url.startsWith(relativeMarker)) {
    return decodeURIComponent(url.slice(relativeMarker.length));
  }

  return null;
};