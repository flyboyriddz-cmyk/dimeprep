-- Create the orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_email TEXT,
  customer_name TEXT,
  phone TEXT,
  address JSONB,
  items JSONB,
  total_amount NUMERIC,
  payment_method TEXT,
  transaction_id TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to insert orders (since it's a public checkout)
-- In a real app, you might want to restrict this further or use a service role key on the server
CREATE POLICY "Allow public inserts" ON orders FOR INSERT WITH CHECK (true);

-- Create a policy to allow users to read their own orders (if you have auth)
-- For now, we might just allow the anon role to insert but not read
