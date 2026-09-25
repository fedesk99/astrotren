-- Astrotrén CMS - Supabase schema
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  embed_id text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.shows (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time text,
  venue text not null,
  address text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null default 0,
  description text not null default '',
  images jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.playlists enable row level security;
alter table public.shows enable row level security;
alter table public.gallery enable row level security;
alter table public.products enable row level security;

-- Public website: anyone can read.
create policy "Public can read playlists" on public.playlists for select using (true);
create policy "Public can read shows" on public.shows for select using (true);
create policy "Public can read gallery" on public.gallery for select using (true);
create policy "Public can read products" on public.products for select using (true);

-- Admin: only the intended Supabase Auth account can write.
-- Change this email if the admin account uses another email.
create policy "Admin can insert playlists" on public.playlists for insert to authenticated with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can update playlists" on public.playlists for update to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com')) with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can delete playlists" on public.playlists for delete to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));

create policy "Admin can insert shows" on public.shows for insert to authenticated with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can update shows" on public.shows for update to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com')) with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can delete shows" on public.shows for delete to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));

create policy "Admin can insert gallery" on public.gallery for insert to authenticated with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can update gallery" on public.gallery for update to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com')) with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can delete gallery" on public.gallery for delete to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));

create policy "Admin can insert products" on public.products for insert to authenticated with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can update products" on public.products for update to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com')) with check (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can delete products" on public.products for delete to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));

-- Storage bucket. Public read is intentional because the website displays these images.
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;

create policy "Public can read media" on storage.objects for select using (bucket_id = 'media');
create policy "Admin can upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can update media" on storage.objects for update to authenticated using (bucket_id = 'media' and lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com')) with check (bucket_id = 'media' and lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
create policy "Admin can delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and lower(coalesce(auth.jwt() ->> 'email','')) = lower('astrotrengdln@gmail.com'));
