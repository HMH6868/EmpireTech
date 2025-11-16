-- =====================================================
-- TABLE DEFINITIONS
-- =====================================================

-- ===== 1. PROFILES TABLE =====
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar TEXT,
  role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  status TEXT CHECK (status IN ('active', 'banned')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 2. CATEGORIES TABLE =====
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 3. ACCOUNTS TABLE (no price columns) =====
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  description_en TEXT,
  description_vi TEXT,
  image TEXT,
  category_id TEXT REFERENCES categories(id),
  inventory_status TEXT CHECK (inventory_status IN ('in-stock', 'low-stock', 'out-of-stock')) DEFAULT 'in-stock',
  delivery_type_en TEXT,
  delivery_type_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 4. ACCOUNT_IMAGES TABLE =====
CREATE TABLE IF NOT EXISTS account_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 5. ACCOUNT_VARIANTS TABLE =====
CREATE TABLE IF NOT EXISTS account_variants (
  id TEXT PRIMARY KEY,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  price_vnd INTEGER NOT NULL,
  original_price_usd DECIMAL(10,2),
  original_price_vnd INTEGER,
  sku TEXT UNIQUE NOT NULL,
  image TEXT,
  stock BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 6. COURSES TABLE =====
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  thumbnail TEXT,
  instructor TEXT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  price_vnd INTEGER NOT NULL,
  description_en TEXT,
  description_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 7. COURSE_IMAGES TABLE =====
CREATE TABLE IF NOT EXISTS course_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 8. PROMOTIONS TABLE =====
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  description_en TEXT,
  description_vi TEXT,
  discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  max_discount_amount INTEGER CHECK (max_discount_amount >= 0),
  minimum_order_amount INTEGER CHECK (minimum_order_amount >= 0),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('active', 'expired', 'scheduled')) DEFAULT 'scheduled',
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 9. CART TABLE =====
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ===== 10. CART_ITEMS TABLE =====
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('account', 'course')) NOT NULL,
  variant_id TEXT,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  price_usd DECIMAL(10,2) NOT NULL,
  price_vnd INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, item_id, item_type, variant_id)
);

-- ===== 11. ORDERS TABLE =====
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  total_usd DECIMAL(10,2) NOT NULL,
  total_vnd INTEGER NOT NULL,
  status TEXT CHECK (status IN ('completed', 'pending', 'cancelled')) DEFAULT 'pending',
  delivery_email TEXT,
  promotion_code TEXT REFERENCES promotions(code),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 12. ORDER_ITEMS TABLE =====
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('account', 'course')) NOT NULL,
  name_en TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  price_vnd INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  variant_en TEXT,
  variant_vi TEXT,
  credentials TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== 13. COMMENTS TABLE =====
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  item_type TEXT CHECK (item_type IN ('account', 'course')) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- ACCOUNTS INDEXES
CREATE INDEX IF NOT EXISTS idx_accounts_category ON accounts(category_id);
CREATE INDEX IF NOT EXISTS idx_accounts_slug ON accounts(slug);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(inventory_status);
CREATE INDEX IF NOT EXISTS idx_account_images_account ON account_images(account_id);
CREATE INDEX IF NOT EXISTS idx_account_variants_account ON account_variants(account_id);
CREATE INDEX IF NOT EXISTS idx_account_variants_sku ON account_variants(sku);

-- COURSES INDEXES
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_course_images_course ON course_images(course_id);

-- CART INDEXES
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_item ON cart_items(item_id, item_type);

-- ORDERS INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- COMMENTS INDEXES
CREATE INDEX IF NOT EXISTS idx_comments_item ON comments(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);

-- PROMOTIONS INDEXES
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- 1. Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- 3. Auto create profile for new auth user
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
  avatar_seed TEXT;
BEGIN
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    'User'
  );

  avatar_seed := SUBSTRING(NEW.id::TEXT, 1, 8);

  INSERT INTO public.profiles (id, email, full_name, avatar, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      'https://api.dicebear.com/7.x/micah/png?seed=' || avatar_seed
    ),
    'user',
    'active'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE LOG 'Error in create_profile_for_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Auto create cart for user
CREATE OR REPLACE FUNCTION create_cart_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cart (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Update cart timestamp when items change
CREATE OR REPLACE FUNCTION update_cart_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cart
  SET updated_at = NOW()
  WHERE id = COALESCE(NEW.cart_id, OLD.cart_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Clear cart items after order completed
CREATE OR REPLACE FUNCTION clear_cart_after_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    DELETE FROM cart_items
    WHERE cart_id = (
      SELECT id FROM cart WHERE user_id = NEW.user_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Auto update promotion status
CREATE OR REPLACE FUNCTION update_promotion_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date < NOW() THEN
    NEW.status = 'expired';
  ELSIF NEW.start_date > NOW() THEN
    NEW.status = 'scheduled';
  ELSE
    NEW.status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Increment promotion usage when order completed
CREATE OR REPLACE FUNCTION increment_promotion_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.promotion_code IS NOT NULL AND NEW.status = 'completed' 
     AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE promotions
    SET used_count = used_count + 1
    WHERE code = NEW.promotion_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Get cart total with realtime price (variants / courses)
CREATE OR REPLACE FUNCTION get_cart_total(cart_uuid UUID, currency TEXT DEFAULT 'vnd')
RETURNS DECIMAL AS $$
DECLARE
  total DECIMAL;
BEGIN
  IF currency = 'usd' THEN
    SELECT COALESCE(SUM(
      CASE 
        WHEN ci.item_type = 'account' THEN av.price_usd
        WHEN ci.item_type = 'course' THEN co.price_usd
        ELSE 0
      END * ci.quantity
    ), 0)
    INTO total
    FROM cart_items ci
    LEFT JOIN account_variants av ON ci.variant_id = av.id
    LEFT JOIN courses co ON ci.item_id = co.id AND ci.item_type = 'course'
    WHERE ci.cart_id = cart_uuid;
  ELSE
    SELECT COALESCE(SUM(
      CASE 
        WHEN ci.item_type = 'account' THEN av.price_vnd
        WHEN ci.item_type = 'course' THEN co.price_vnd
        ELSE 0
      END * ci.quantity
    ), 0)
    INTO total
    FROM cart_items ci
    LEFT JOIN account_variants av ON ci.variant_id = av.id
    LEFT JOIN courses co ON ci.item_id = co.id AND ci.item_type = 'course'
    WHERE ci.cart_id = cart_uuid;
  END IF;

  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- 10. Get cart item count
CREATE OR REPLACE FUNCTION get_cart_item_count(cart_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(quantity), 0)
  INTO total_count
  FROM cart_items
  WHERE cart_id = cart_uuid;

  RETURN total_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto update timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at
  BEFORE UPDATE ON cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_new_user();

-- Auto create cart when profile created
CREATE TRIGGER create_cart_on_user_creation
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_cart_for_user();

-- Update cart timestamp when items change
CREATE TRIGGER update_cart_on_items_change
  AFTER INSERT OR UPDATE OR DELETE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_cart_timestamp();

-- Clear cart after order complete
CREATE TRIGGER clear_cart_on_order_complete
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION clear_cart_after_order();

-- Promotion status & usage triggers
CREATE TRIGGER update_promotion_status_trigger
  BEFORE INSERT OR UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_promotion_status();

CREATE TRIGGER increment_promotion_usage_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION increment_promotion_usage();

-- =====================================================
-- VIEWS
-- =====================================================

-- 1. Account with min price from variants
CREATE OR REPLACE VIEW account_with_min_price AS
SELECT 
  a.*,
  (
    SELECT MIN(price_usd)
    FROM account_variants v
    WHERE v.account_id = a.id
  ) AS min_price_usd,
  (
    SELECT MIN(price_vnd)
    FROM account_variants v
    WHERE v.account_id = a.id
  ) AS min_price_vnd
FROM accounts a;

-- 2. Cart details with realtime price
CREATE OR REPLACE VIEW cart_details AS
SELECT 
  c.id as cart_id,
  c.user_id,
  ci.id as cart_item_id,
  ci.item_id,
  ci.item_type,
  ci.variant_id,
  ci.quantity,
  CASE 
    WHEN ci.item_type = 'account' THEN av.price_usd
    WHEN ci.item_type = 'course' THEN co.price_usd
  END as unit_price_usd,
  CASE 
    WHEN ci.item_type = 'account' THEN av.price_vnd
    WHEN ci.item_type = 'course' THEN co.price_vnd
  END as unit_price_vnd,
  CASE 
    WHEN ci.item_type = 'account' THEN a.name_en
    WHEN ci.item_type = 'course' THEN co.title_en
  END as item_name_en,
  CASE 
    WHEN ci.item_type = 'account' THEN a.name_vi
    WHEN ci.item_type = 'course' THEN co.title_vi
  END as item_name_vi,
  CASE 
    WHEN ci.item_type = 'account' THEN COALESCE(av.image, a.image)
    WHEN ci.item_type = 'course' THEN co.thumbnail
  END as item_image,
  CASE 
    WHEN ci.item_type = 'account' THEN a.slug
    WHEN ci.item_type = 'course' THEN co.slug
  END as item_slug,
  av.name_en as variant_name_en,
  av.name_vi as variant_name_vi,
  ci.created_at,
  ci.updated_at
FROM cart c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
LEFT JOIN accounts a ON ci.item_id = a.id AND ci.item_type = 'account'
LEFT JOIN courses co ON ci.item_id = co.id AND ci.item_type = 'course'
LEFT JOIN account_variants av ON ci.variant_id = av.id;

-- 3. Cart summary with realtime total
CREATE OR REPLACE VIEW cart_summary AS
SELECT 
  c.id as cart_id,
  c.user_id,
  COUNT(ci.id) as total_items,
  SUM(ci.quantity) as total_quantity,
  SUM(
    CASE 
      WHEN ci.item_type = 'account' THEN av.price_usd
      WHEN ci.item_type = 'course' THEN co.price_usd
      ELSE 0
    END * ci.quantity
  ) as total_usd,
  SUM(
    CASE 
      WHEN ci.item_type = 'account' THEN av.price_vnd
      WHEN ci.item_type = 'course' THEN co.price_vnd
      ELSE 0
    END * ci.quantity
  ) as total_vnd,
  c.updated_at as last_updated
FROM cart c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
LEFT JOIN accounts a ON ci.item_id = a.id AND ci.item_type = 'account'
LEFT JOIN courses co ON ci.item_id = co.id AND ci.item_type = 'course'
LEFT JOIN account_variants av ON ci.variant_id = av.id
GROUP BY c.id, c.user_id, c.updated_at;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admin can update all profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin())
  WITH CHECK (auth.uid() = id OR is_admin());

-- CATEGORIES POLICIES
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO public USING (true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- ACCOUNTS POLICIES
CREATE POLICY "Public can read accounts"
  ON accounts FOR SELECT
  TO public USING (true);

CREATE POLICY "Admin can manage accounts"
  ON accounts FOR ALL
  USING (is_admin());

-- ACCOUNT IMAGES POLICIES
CREATE POLICY "Public can read account images"
  ON account_images FOR SELECT
  TO public USING (true);

CREATE POLICY "Admin can manage account images"
  ON account_images FOR ALL
  USING (is_admin());

-- ACCOUNT VARIANTS POLICIES
CREATE POLICY "Public can read account variants"
  ON account_variants FOR SELECT
  TO public USING (true);

CREATE POLICY "Admin can manage account variants"
  ON account_variants FOR ALL
  USING (is_admin());

-- COURSES POLICIES
CREATE POLICY "Public can read courses"
  ON courses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage courses"
  ON courses FOR ALL
  USING (is_admin());

-- COURSE IMAGES POLICIES
CREATE POLICY "Public can read course images"
  ON course_images FOR SELECT
  TO public USING (true);

CREATE POLICY "Admin can manage course images"
  ON course_images FOR ALL
  USING (is_admin());

-- PROMOTIONS POLICIES
CREATE POLICY "Public can read active promotions"
  ON promotions FOR SELECT
  TO public
  USING (status = 'active' AND NOW() BETWEEN start_date AND end_date);

CREATE POLICY "Admin can view all promotions"
  ON promotions FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can manage promotions"
  ON promotions FOR ALL
  USING (is_admin());

-- CART POLICIES
CREATE POLICY "Users can view own cart"
  ON cart FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cart"
  ON cart FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all carts"
  ON cart FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can manage all carts"
  ON cart FOR ALL
  USING (is_admin());

-- CART ITEMS POLICIES
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add to own cart"
  ON cart_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all cart items"
  ON cart_items FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can manage all cart items"
  ON cart_items FOR ALL
  USING (is_admin());

-- ORDERS POLICIES
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can manage orders"
  ON orders FOR ALL
  USING (is_admin());

-- ORDER ITEMS POLICIES
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all order items"
  ON order_items FOR SELECT
  USING (is_admin());

CREATE POLICY "Admin can manage order items"
  ON order_items FOR ALL
  USING (is_admin());

-- COMMENTS POLICIES
CREATE POLICY "Public can read comments"
  ON comments FOR SELECT
  TO public USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all comments"
  ON comments FOR ALL
  USING (is_admin());

-- =====================================================
-- SAMPLE DATA
-- =====================================================

INSERT INTO categories (id, name_en, name_vi, slug) VALUES
('all', 'All', 'Tất cả', 'all'),
('ai-tools', 'AI Tools', 'Công cụ AI', 'ai-tools'),
('design-tools', 'Design Tools', 'Công cụ thiết kế', 'design-tools'),
('entertainment', 'Entertainment', 'Giải trí', 'entertainment'),
('productivity', 'Productivity', 'Năng suất', 'productivity')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
