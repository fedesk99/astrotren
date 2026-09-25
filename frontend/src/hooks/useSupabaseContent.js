import { useCallback, useEffect, useState } from 'react';
import { listContent } from '../lib/contentApi';

export const useSupabaseContent = (table, fallback = []) => {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY));
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await listContent(table);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => { reload(); }, [reload]);
  return { items, setItems, loading, error, reload };
};
