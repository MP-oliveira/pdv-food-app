-- ============================================
-- PDV FOOD APP - DADOS INICIAIS
-- ============================================
-- Execute DEPOIS que o backend rodar (sync automático criará as tabelas)
-- ============================================

-- CATEGORIAS
INSERT INTO categories (name, description, color, sort_order, is_active, created_at, updated_at) VALUES
('Lanches', 'Hambúrgueres e sanduíches', '#ef4444', 1, true, NOW(), NOW()),
('Pizzas', 'Pizzas artesanais', '#f59e0b', 2, true, NOW(), NOW()),
('Bebidas', 'Bebidas geladas e quentes', '#3b82f6', 3, true, NOW(), NOW()),
('Sobremesas', 'Doces e sobremesas', '#ec4899', 4, true, NOW(), NOW()),
('Massas', 'Massas italianas', '#10b981', 5, true, NOW(), NOW()),
('Porções', 'Porções para compartilhar', '#8b5cf6', 6, true, NOW(), NOW()),
('Carnes', 'Pratos de carne', '#dc2626', 7, true, NOW(), NOW()),
('Saladas', 'Saladas frescas', '#22c55e', 8, true, NOW(), NOW()),
('Pratos Executivos', 'Refeições completas', '#06b6d4', 9, true, NOW(), NOW()),
('Sucos', 'Sucos naturais', '#f97316', 10, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- PRODUTOS
INSERT INTO products (name, description, price, category_id, preparation_time, is_available, created_at, updated_at) VALUES
-- Lanches
('X-Burger', 'Hambúrguer artesanal com queijo, alface e tomate', 25.90, (SELECT id FROM categories WHERE name='Lanches' LIMIT 1), 15, true, NOW(), NOW()),
('X-Bacon', 'Hambúrguer com bacon crocante e queijo cheddar', 28.90, (SELECT id FROM categories WHERE name='Lanches' LIMIT 1), 15, true, NOW(), NOW()),
('X-Salada', 'Hambúrguer completo com salada', 27.90, (SELECT id FROM categories WHERE name='Lanches' LIMIT 1), 15, true, NOW(), NOW()),
('X-Egg', 'Hambúrguer com ovo, queijo e bacon', 26.90, (SELECT id FROM categories WHERE name='Lanches' LIMIT 1), 15, true, NOW(), NOW()),

-- Pizzas
('Pizza Margherita', 'Molho de tomate, mussarela e manjericão fresco', 45.00, (SELECT id FROM categories WHERE name='Pizzas' LIMIT 1), 25, true, NOW(), NOW()),
('Pizza Calabresa', 'Calabresa fatiada, cebola e azeitonas', 48.00, (SELECT id FROM categories WHERE name='Pizzas' LIMIT 1), 25, true, NOW(), NOW()),
('Pizza Portuguesa', 'Presunto, queijo, ovo, cebola e azeitona', 50.00, (SELECT id FROM categories WHERE name='Pizzas' LIMIT 1), 25, true, NOW(), NOW()),
('Pizza Quatro Queijos', 'Mussarela, provolone, gorgonzola e parmesão', 52.00, (SELECT id FROM categories WHERE name='Pizzas' LIMIT 1), 25, true, NOW(), NOW()),

-- Bebidas
('Coca-Cola 350ml', 'Refrigerante gelado lata', 4.50, (SELECT id FROM categories WHERE name='Bebidas' LIMIT 1), 0, true, NOW(), NOW()),
('Coca-Cola 600ml', 'Refrigerante gelado garrafa', 8.50, (SELECT id FROM categories WHERE name='Bebidas' LIMIT 1), 0, true, NOW(), NOW()),
('Guaraná Antarctica', 'Refrigerante de guaraná 350ml', 4.00, (SELECT id FROM categories WHERE name='Bebidas' LIMIT 1), 0, true, NOW(), NOW()),
('Água Mineral', 'Água mineral sem gás 500ml', 3.00, (SELECT id FROM categories WHERE name='Bebidas' LIMIT 1), 0, true, NOW(), NOW()),
('Cerveja Heineken', 'Cerveja long neck 330ml', 8.00, (SELECT id FROM categories WHERE name='Bebidas' LIMIT 1), 0, true, NOW(), NOW()),

-- Sobremesas
('Petit Gateau', 'Bolo de chocolate quente com sorvete', 18.00, (SELECT id FROM categories WHERE name='Sobremesas' LIMIT 1), 10, true, NOW(), NOW()),
('Pudim de Leite', 'Pudim caseiro de leite condensado', 12.90, (SELECT id FROM categories WHERE name='Sobremesas' LIMIT 1), 0, true, NOW(), NOW()),
('Sorvete 2 Bolas', 'Sorvete de diversos sabores', 15.00, (SELECT id FROM categories WHERE name='Sobremesas' LIMIT 1), 0, true, NOW(), NOW()),
('Brownie com Sorvete', 'Brownie de chocolate com sorvete', 16.00, (SELECT id FROM categories WHERE name='Sobremesas' LIMIT 1), 5, true, NOW(), NOW()),

-- Massas
('Espaguete à Carbonara', 'Massa com molho carbonara e bacon', 38.00, (SELECT id FROM categories WHERE name='Massas' LIMIT 1), 20, true, NOW(), NOW()),
('Lasanha Bolonhesa', 'Lasanha caseira de carne moída', 42.00, (SELECT id FROM categories WHERE name='Massas' LIMIT 1), 25, true, NOW(), NOW()),
('Penne ao Pesto', 'Penne com molho pesto e tomate seco', 36.00, (SELECT id FROM categories WHERE name='Massas' LIMIT 1), 18, true, NOW(), NOW()),

-- Porções
('Batata Frita', 'Porção de batata frita crocante (500g)', 12.90, (SELECT id FROM categories WHERE name='Porções' LIMIT 1), 10, true, NOW(), NOW()),
('Anéis de Cebola', 'Porção de anéis de cebola empanados', 15.90, (SELECT id FROM categories WHERE name='Porções' LIMIT 1), 12, true, NOW(), NOW()),
('Porção de Frango a Passarinho', 'Frango frito temperado (400g)', 28.90, (SELECT id FROM categories WHERE name='Porções' LIMIT 1), 20, true, NOW(), NOW()),
('Mandioca Frita', 'Porção de mandioca frita (400g)', 14.90, (SELECT id FROM categories WHERE name='Porções' LIMIT 1), 12, true, NOW(), NOW()),

-- Carnes
('Picanha Grelhada', 'Picanha ao ponto com arroz, feijão e farofa', 65.00, (SELECT id FROM categories WHERE name='Carnes' LIMIT 1), 30, true, NOW(), NOW()),
('Filé Mignon ao Molho Madeira', 'Filé mignon com molho madeira', 75.00, (SELECT id FROM categories WHERE name='Carnes' LIMIT 1), 25, true, NOW(), NOW()),
('Pastel de Carne', 'Pastel recheado com carne moída', 8.90, (SELECT id FROM categories WHERE name='Carnes' LIMIT 1), 15, true, NOW(), NOW()),

-- Saladas
('Salada Caesar', 'Alface, croutons, parmesão e molho caesar', 28.00, (SELECT id FROM categories WHERE name='Saladas' LIMIT 1), 10, true, NOW(), NOW()),
('Salada Tropical', 'Mix de folhas verdes com frutas da estação', 32.00, (SELECT id FROM categories WHERE name='Saladas' LIMIT 1), 10, true, NOW(), NOW()),

-- Pratos Executivos
('PF Completo', 'Arroz, feijão, carne, salada e batata frita', 35.00, (SELECT id FROM categories WHERE name='Pratos Executivos' LIMIT 1), 20, true, NOW(), NOW()),
('PF Frango Grelhado', 'Arroz, feijão, frango grelhado e salada', 30.00, (SELECT id FROM categories WHERE name='Pratos Executivos' LIMIT 1), 20, true, NOW(), NOW()),

-- Sucos
('Suco de Laranja', 'Suco natural de laranja (500ml)', 10.00, (SELECT id FROM categories WHERE name='Sucos' LIMIT 1), 5, true, NOW(), NOW()),
('Suco de Limão', 'Limonada refrescante (500ml)', 9.00, (SELECT id FROM categories WHERE name='Sucos' LIMIT 1), 5, true, NOW(), NOW()),
('Suco de Morango', 'Suco natural de morango (500ml)', 11.00, (SELECT id FROM categories WHERE name='Sucos' LIMIT 1), 5, true, NOW(), NOW());

-- CRIAR ESTOQUE PARA PRODUTOS
INSERT INTO stock (product_id, current_quantity, min_quantity, unit, created_at, updated_at)
SELECT id, 100, 10, 'un', NOW(), NOW()
FROM products
WHERE NOT EXISTS (SELECT 1 FROM stock WHERE stock.product_id = products.id);

-- CLIENTES DE EXEMPLO
INSERT INTO customers (name, email, phone, document, document_type, is_vip, total_orders, total_spent, loyalty_points, created_at, updated_at) VALUES
('João Silva', 'joao@email.com', '(11) 98765-4321', '123.456.789-00', 'cpf', false, 15, 450.00, 150, NOW(), NOW()),
('Maria Santos', 'maria@email.com', '(11) 98765-1234', '234.567.890-11', 'cpf', true, 28, 1250.00, 230, NOW(), NOW()),
('Pedro Oliveira', 'pedro@email.com', '(11) 98765-5678', '345.678.901-22', 'cpf', false, 5, 180.00, 50, NOW(), NOW()),
('Ana Costa', 'ana@email.com', '(11) 98765-8765', null, null, true, 32, 1680.00, 180, NOW(), NOW()),
('Carlos Souza', 'carlos@email.com', '(11) 98765-4567', '456.789.012-33', 'cpf', false, 8, 290.00, 90, NOW(), NOW()),
('Restaurante XYZ Ltda', 'contato@restaurantexyz.com', '(11) 3333-4444', '12.345.678/0001-99', 'cnpj', true, 50, 5200.00, 500, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- MESAS
INSERT INTO tables (number, name, capacity, location, is_available, is_active, created_at, updated_at) VALUES
(1, 'Mesa 1', 4, 'Salão Principal', true, true, NOW(), NOW()),
(2, 'Mesa 2', 4, 'Salão Principal', true, true, NOW(), NOW()),
(3, 'Mesa 3', 2, 'Salão Principal', true, true, NOW(), NOW()),
(4, 'Mesa 4', 2, 'Salão Principal', true, true, NOW(), NOW()),
(5, 'Mesa 5', 6, 'Salão Principal', true, true, NOW(), NOW()),
(6, 'Mesa 6', 6, 'Varanda', true, true, NOW(), NOW()),
(7, 'Mesa 7', 4, 'Varanda', true, true, NOW(), NOW()),
(8, 'Mesa 8', 4, 'Varanda', true, true, NOW(), NOW()),
(9, 'Mesa 9', 2, 'Bar', true, true, NOW(), NOW()),
(10, 'Mesa 10', 2, 'Bar', true, true, NOW(), NOW()),
(11, 'Mesa 11', 8, 'Salão VIP', true, true, NOW(), NOW()),
(12, 'Mesa 12', 8, 'Salão VIP', true, true, NOW(), NOW())
ON CONFLICT (number) DO NOTHING;

-- PROGRAMA DE FIDELIDADE
INSERT INTO loyalty_programs (name, points_per_real, active, created_at, updated_at) VALUES
('Programa PDV Food', 1.00, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- INSTRUÇÕES
-- ============================================

/*
PASSO 1: Reiniciar o backend para criar/atualizar tabelas automaticamente
  cd api && NODE_ENV=development node server.js

PASSO 2: Executar este SQL no Supabase
  - Copia e cola no SQL Editor do Supabase
  - Clica em "Run"

PASSO 3: Criar usuários no Supabase Auth:
  - Vá em Authentication > Users > Add User
  - Crie os 4 usuários:
    * admin@pdvfood.com (senha: admin123)
    * garcom@pdvfood.com (senha: garcom123)  
    * caixa@pdvfood.com (senha: caixa123)
    * cozinha@pdvfood.com (senha: cozinha123)

PASSO 4: Atualizar roles dos usuários:
  UPDATE users SET role = 'admin' WHERE email = 'admin@pdvfood.com';
  UPDATE users SET role = 'garcom' WHERE email = 'garcom@pdvfood.com';
  UPDATE users SET role = 'caixa' WHERE email = 'caixa@pdvfood.com';
  UPDATE users SET role = 'cozinha' WHERE email = 'cozinha@pdvfood.com';

PASSO 5: Pronto! Faça login no sistema

O QUE FOI CRIADO:
✅ 10 categorias coloridas
✅ 32 produtos variados  
✅ Estoque automático (100 unidades de cada)
✅ 6 clientes com histórico
✅ 12 mesas (salão, varanda, bar, VIP)
✅ Programa de fidelidade ativo
*/

-- ============================================
-- FIM
-- ============================================

