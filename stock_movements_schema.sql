-- Tabela de movimentações de estoque
CREATE TABLE IF NOT EXISTS stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT', 'SALE', 'PURCHASE', 'PRODUCTION', 'WASTE')),
  quantity DECIMAL(10, 3) NOT NULL,
  previous_quantity DECIMAL(10, 3),
  new_quantity DECIMAL(10, 3),
  reason VARCHAR(255),
  reference_type VARCHAR(50),
  reference_id INTEGER,
  user_id INTEGER NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_reference ON stock_movements(reference_type, reference_id);

COMMENT ON TABLE stock_movements IS 'Registra todas as movimentações de estoque';
COMMENT ON COLUMN stock_movements.type IS 'IN=Entrada, OUT=Saída, ADJUSTMENT=Ajuste, SALE=Venda, PURCHASE=Compra, PRODUCTION=Produção, WASTE=Desperdício';

