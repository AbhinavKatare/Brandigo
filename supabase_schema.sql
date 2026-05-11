-- ============================================================
-- BRANDINGO SUPABASE DATABASE SCHEMA + AUTH SETUP
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. PRODUCTS TABLE
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  image_url text,
  images jsonb,
  rating numeric(3,1) default 4.5,
  reviews integer default 0,
  in_stock boolean default true,
  is_featured boolean default false,
  is_active boolean default true,
  specs jsonb,
  certifications jsonb,
  badge text,
  created_at timestamptz default now()
);

-- 2. ORDERS TABLE
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  tax numeric(10,2) not null,
  total numeric(10,2) not null,
  status text default 'pending',
  customer_email text,
  customer_name text,
  shipping_address text,
  created_at timestamptz default now()
);

-- 3. QUOTES TABLE
create table if not exists quotes (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  organization text not null,
  professional_role text,
  email text not null,
  budget_range text,
  delivery_timeline text,
  specifications text,
  status text default 'pending',
  admin_notes text,
  created_at timestamptz default now()
);

-- 4. SUPPORT TICKETS TABLE
create table if not exists support_tickets (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  category text,
  message text not null,
  status text default 'open',
  admin_response text,
  created_at timestamptz default now()
);

-- 5. NEWSLETTER TABLE
create table if not exists newsletter (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  subscribed_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Products: public read, authenticated write
alter table products enable row level security;
create policy "Public can read active products"
  on products for select
  using (is_active = true);

-- Allow admins to insert/update/delete products
create policy "Authenticated can manage products"
  on products for all
  using (auth.role() = 'authenticated');

-- Orders: anyone can insert (for checkout without account)
alter table orders enable row level security;
create policy "Anyone can create orders"
  on orders for insert
  with check (true);

-- Quotes: anyone can insert
alter table quotes enable row level security;
create policy "Anyone can submit quotes"
  on quotes for insert
  with check (true);

-- Allow authenticated users to read/update quotes (admin only)
create policy "Authenticated can manage quotes"
  on quotes for all
  using (auth.role() = 'authenticated');

-- Support tickets: anyone can insert
alter table support_tickets enable row level security;
create policy "Anyone can submit tickets"
  on support_tickets for insert
  with check (true);

-- Allow authenticated users to read/update tickets
create policy "Authenticated can manage tickets"
  on support_tickets for all
  using (auth.role() = 'authenticated');

-- Newsletter: anyone can subscribe
alter table newsletter enable row level security;
create policy "Anyone can subscribe"
  on newsletter for insert
  with check (true);

-- ============================================================
-- SAMPLE PRODUCTS (uncomment to seed)
-- ============================================================
/*
INSERT INTO products (name, category, description, price, original_price, image_url, rating, reviews, in_stock, is_featured, badge)
VALUES
  ('Precision Digital Microscope Z-1', 'Optics & Imaging', 'High-resolution 4K sensor microscope with auto-calibration.', 12499, 15999, 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600', 4.9, 128, true, true, 'BESTSELLER'),
  ('Hematology Analyser HA-36', 'Diagnostics', '36-parameter analyser with automated processing.', 5800, 7200, 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600', 4.7, 85, true, true, 'POPULAR'),
  ('Advanced Centrifuge X-400', 'Lab Equipment', 'High-speed refrigerated centrifuge.', 4250, 5100, 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600', 4.8, 62, true, true, null),
  ('PCR Thermocycler Pro', 'Molecular Biology', 'Real-time PCR with cloud connectivity.', 8900, 11500, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600', 4.9, 44, true, true, null);
*/

-- ============================================================
-- STORAGE BUCKET SETUP (For Product Images)
-- ============================================================

-- Create a new public bucket for product images
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Policy to allow public read access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Policy to allow authenticated admin users to upload images
create policy "Admin Upload Access"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

-- Policy to allow authenticated admin users to update images
create policy "Admin Update Access"
  on storage.objects for update
  using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

-- Policy to allow authenticated admin users to delete images
create policy "Admin Delete Access"
  on storage.objects for delete
  using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
