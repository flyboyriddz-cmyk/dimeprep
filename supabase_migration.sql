-- Migration Script for D.P GEMS Supabase Setup

-- 1. Create profiles table
-- Stores Lead/User Data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  hardware_weight TEXT CHECK (hardware_weight IN ('450 GSM', '280 GSM')),
  retrieval_env TEXT,
  uplink_freq TEXT,
  preferred_size TEXT,
  location_country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create orders table
-- Stores Sales Data
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount NUMERIC,
  status TEXT DEFAULT 'pending',
  google_pay_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Profiles: Users can view/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders 
  FOR SELECT USING (auth.uid() = user_id);

-- Orders: Users can insert their own orders
CREATE POLICY "Users can insert own orders" ON orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Note: Since profiles references auth.users, this schema strictly requires Supabase Authentication.
-- Guest users cannot be inserted into the profiles table with this constraint.
