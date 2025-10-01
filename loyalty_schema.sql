-- Tabela de programas de fidelidade
CREATE TABLE IF NOT EXISTS loyalty_programs (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  available_points INTEGER NOT NULL DEFAULT 0,
  used_points INTEGER NOT NULL DEFAULT 0,
  level VARCHAR(20) NOT NULL DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
  total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
  visits_count INTEGER NOT NULL DEFAULT 0,
  cashback_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações de fidelidade
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id SERIAL PRIMARY KEY,
  loyalty_program_id INTEGER NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earn', 'redeem', 'expire', 'adjustment', 'cashback')),
  points INTEGER NOT NULL,
  amount DECIMAL(10, 2),
  description VARCHAR(255) NOT NULL,
  reference_type VARCHAR(50),
  reference_id INTEGER,
  user_id INTEGER REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_loyalty_customer ON loyalty_programs(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_level ON loyalty_programs(level);
CREATE INDEX IF NOT EXISTS idx_loyalty_trans_program ON loyalty_transactions(loyalty_program_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_trans_created ON loyalty_transactions(created_at DESC);

COMMENT ON TABLE loyalty_programs IS 'Programas de fidelidade dos clientes';
COMMENT ON TABLE loyalty_transactions IS 'Histórico de transações de pontos/cashback';

