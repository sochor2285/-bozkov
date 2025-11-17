-- SQL schéma pro Supabase databázi
-- Spusťte tento SQL v Supabase SQL Editoru

-- 1. Tabulka produktů
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  alcohol TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabulka profilů uživatelů (rozšíření auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabulka objednávek
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabulka položek objednávek
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabulka košíku
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Row Level Security (RLS) politiky
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Produkty: všichni mohou číst, jen admini můžou upravovat
CREATE POLICY "Produkty jsou veřejně čitelné" ON products
  FOR SELECT USING (true);

CREATE POLICY "Pouze admini mohou upravovat produkty" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Profily: uživatelé vidí jen svůj profil
CREATE POLICY "Uživatelé vidí pouze svůj profil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Uživatelé mohou vytvořit svůj profil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Objednávky: uživatelé vidí jen své objednávky, admini vidí všechny
CREATE POLICY "Uživatelé vidí pouze své objednávky" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Uživatelé mohou vytvářet objednávky" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Položky objednávek: přístup přes objednávku
CREATE POLICY "Uživatelé vidí položky svých objednávek" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Uživatelé mohou vytvářet položky objednávek" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Košík: uživatelé přistupují jen ke svému košíku
CREATE POLICY "Uživatelé vidí pouze svůj košík" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Uživatelé mohou upravovat svůj košík" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Funkce pro automatické vytvoření profilu po registraci
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, is_admin)
  VALUES (new.id, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pro automatické vytvoření profilu
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Vložení ukázkových produktů
INSERT INTO products (name, description, type, alcohol, price, stock, image_url) VALUES
  ('Božkov Original', 'Vlajková loď značky a ikona tuzemského rumu. S charakteristickou plachetnicí na etiketě od roku 1948.', 'Tuzemský rum', '37,5%', 299.00, 50, null),
  ('Božkov Republica Exclusive', 'Prémiová směs 8letých rumů z Nikaraguy, Dominikánské republiky, Barbadosu a Jamajky.', 'Karibský rum', '38%', 499.00, 30, null),
  ('Božkov Republica Solera', 'Vysoce kvalitní rum vyrobený tradiční metodou Solera v Dominikánské republice.', 'Karibský rum', '38%', 449.00, 40, null),
  ('Božkov Republica Honey', 'Jemný rumový likér s medovou příchutí.', 'Rumový likér', '35%', 349.00, 35, null),
  ('Božkov Republica White', 'Bílý rum z cukrové třtiny pro milovníky čistých chutí.', 'Bílý rum', '38%', 399.00, 45, null),
  ('Božkov Republica Espresso', 'Rum s výraznou kávovou příchutí pro jedinečný zážitek.', 'Ochucený rum', '35%', 379.00, 25, null)
ON CONFLICT DO NOTHING;
