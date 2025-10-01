-- Tabela de fila de espera
CREATE TABLE IF NOT EXISTS waiting_queue (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  party_size INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'seated', 'cancelled', 'no_show')),
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'vip', 'reservation')),
  estimated_wait_time INTEGER,
  queue_number INTEGER NOT NULL,
  table_id INTEGER REFERENCES tables(id) ON DELETE SET NULL,
  called_at TIMESTAMP WITH TIME ZONE,
  seated_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_by_user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_queue_status ON waiting_queue(status);
CREATE INDEX IF NOT EXISTS idx_queue_created ON waiting_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_queue_number ON waiting_queue(queue_number, created_at);

COMMENT ON TABLE waiting_queue IS 'Fila de espera para mesas';

