-- Tabela de Caixas
CREATE TABLE IF NOT EXISTS cashiers (
  id SERIAL PRIMARY KEY,
  opened_by_user_id INTEGER NOT NULL REFERENCES users(id),
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  initial_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  current_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  closed_by_user_id INTEGER REFERENCES users(id),
  closed_at TIMESTAMP WITH TIME ZONE,
  final_amount DECIMAL(10, 2),
  expected_amount DECIMAL(10, 2),
  difference DECIMAL(10, 2),
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de Transações do Caixa
CREATE TABLE IF NOT EXISTS cashier_transactions (
  id SERIAL PRIMARY KEY,
  cashier_id INTEGER NOT NULL REFERENCES cashiers(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('opening', 'sale', 'withdrawal', 'deposit', 'closing')),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  description TEXT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  order_id INTEGER REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cashiers_status ON cashiers(status);
CREATE INDEX IF NOT EXISTS idx_cashiers_opened_at ON cashiers(opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_cashier_transactions_cashier_id ON cashier_transactions(cashier_id);
CREATE INDEX IF NOT EXISTS idx_cashier_transactions_type ON cashier_transactions(type);
CREATE INDEX IF NOT EXISTS idx_cashier_transactions_created_at ON cashier_transactions(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_cashiers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cashiers_updated_at
  BEFORE UPDATE ON cashiers
  FOR EACH ROW
  EXECUTE FUNCTION update_cashiers_updated_at();

CREATE OR REPLACE FUNCTION update_cashier_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cashier_transactions_updated_at
  BEFORE UPDATE ON cashier_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_cashier_transactions_updated_at();

-- Comentários
COMMENT ON TABLE cashiers IS 'Registro de aberturas e fechamentos de caixa';
COMMENT ON TABLE cashier_transactions IS 'Todas as movimentações financeiras do caixa';
COMMENT ON COLUMN cashiers.difference IS 'Diferença entre o valor final e o esperado (positivo = sobra, negativo = falta)';
COMMENT ON COLUMN cashier_transactions.type IS 'opening=abertura, sale=venda, withdrawal=sangria, deposit=reforço, closing=fechamento';
