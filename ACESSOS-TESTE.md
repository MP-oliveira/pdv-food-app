# 🔐 Controle de Acessos - PDV Food App

## 📋 Credenciais de Teste

### 👨‍💼 **ADMIN** (Administrador)
**Email:** `admin@pdvfood.com`  
**Senha:** `admin123`

---

### 🍽️ **GARÇOM** (Garçom/Atendente)
**Email:** `garcom@pdvfood.com`  
**Senha:** `garcom123`

---

### 💰 **CAIXA** (Operador de Caixa)
**Email:** `caixa@pdvfood.com`  
**Senha:** `caixa123`

---

### 👨‍🍳 **COZINHA** (Cozinheiro)
**Email:** `cozinha@pdvfood.com`  
**Senha:** `cozinha123`

---

## 🎯 Acessos por Perfil

### 👨‍💼 **ADMIN** - Acessa TUDO
✅ Dashboard  
✅ PDV  
✅ Cardápio  
✅ Cozinha  
✅ Pedidos  
✅ Caixa  
✅ Comandas  
✅ Clientes  
✅ **Produtos** *(exclusivo)*  
✅ **Histórico Estoque** *(exclusivo)*  
✅ **Vendas Garçom** *(exclusivo)*  
✅ Fila de Espera  
✅ Reservas  
✅ Fidelidade  
✅ Relatórios  
✅ **Configurações** *(exclusivo)*  

**Função:** Controle total do sistema, configurações, relatórios gerenciais e gestão de produtos/estoque.

---

### 🍽️ **GARÇOM** - Foco em Atendimento
✅ Dashboard  
✅ PDV *(fazer vendas)*  
✅ Cardápio *(consultar produtos)*  
✅ Pedidos *(gerenciar pedidos das mesas)*  
✅ Comandas *(abrir e gerenciar comandas)*  
✅ Clientes *(cadastrar novos clientes)*  
✅ Fila de Espera *(adicionar e gerenciar fila)*  
✅ Reservas *(gerenciar reservas de mesas)*  
✅ Fidelidade *(adicionar pontos aos clientes)*  

❌ **NÃO acessa:**  
- Cozinha  
- Caixa  
- Produtos  
- Histórico Estoque  
- Vendas Garçom  
- Relatórios  
- Configurações  

**Função:** Atendimento ao cliente, vendas, gestão de mesas, comandas e fidelização.

---

### 💰 **CAIXA** - Foco em Pagamentos
✅ Dashboard  
✅ PDV *(fazer vendas)*  
✅ Pedidos *(visualizar status)*  
✅ **Caixa** *(abertura/fechamento de caixa)* **[EXCLUSIVO]**  
✅ Comandas *(fechar contas)*  
✅ Clientes *(consultar cadastro)*  
✅ Fidelidade *(resgatar pontos)*  
✅ Relatórios *(acessar relatórios financeiros)*  

❌ **NÃO acessa:**  
- Cardápio  
- Cozinha  
- Produtos  
- Histórico Estoque  
- Vendas Garçom  
- Fila de Espera  
- Reservas  
- Configurações  

**Função:** Gestão financeira, fechamento de caixa, recebimentos e relatórios.

---

### 👨‍🍳 **COZINHA** - Foco em Produção
✅ Dashboard  
✅ **Cozinha** *(gerenciar pedidos da cozinha)* **[ACESSO PRINCIPAL]**  

❌ **NÃO acessa:**  
- PDV  
- Cardápio  
- Pedidos  
- Caixa  
- Comandas  
- Clientes  
- Produtos  
- Histórico Estoque  
- Vendas Garçom  
- Fila de Espera  
- Reservas  
- Fidelidade  
- Relatórios  
- Configurações  

**Função:** Visualizar e gerenciar apenas os pedidos que precisam ser preparados.

---

## 🧪 Como Testar

1. Acesse: `http://localhost:5173/login`
2. Use as credenciais acima
3. Navegue pelo menu lateral
4. Verifique que só aparecem as opções permitidas
5. Tente acessar URLs diretas (ex: `/products`) - deve redirecionar se não tiver permissão

---

## 📝 Notas

- Todos os usuários precisam ser criados no banco de dados antes de testar
- A validação de acesso é feita tanto no **frontend** (sidebar) quanto no **backend** (API)
- Se precisar criar novos usuários, use o script: `node api/seeders/create-admin.js`
- Para criar usuários de outros perfis, modifique o script e ajuste o `role`

---

## 🔄 Próximos Passos

- [ ] Testar cada perfil
- [ ] Validar permissões de API no backend
- [ ] Adicionar tela de gestão de usuários (Admin only)
- [ ] Implementar troca de senha
- [ ] Adicionar log de ações por usuário

---

**Data de criação:** 01/10/2025  
**Versão:** 1.0  
**Sistema:** PDV Food App

