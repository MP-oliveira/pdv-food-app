# 🗄️ Setup do Banco de Dados

## 🚀 Como Configurar (PASSO A PASSO)

### 1️⃣ Reiniciar o Backend
O Sequelize criará/atualizará as tabelas automaticamente:

```bash
cd api
NODE_ENV=development node server.js
```

Aguarde ver a mensagem:
```
✅ Conexão com o banco de dados Supabase estabelecida com sucesso.
✅ Modelos sincronizados com o banco de dados.
```

### 2️⃣ Criar Usuários no Supabase Auth

Acesse: **Supabase Dashboard → Authentication → Users → Add User**

Crie os 4 usuários:

| Email | Senha | Função |
|-------|-------|--------|
| `admin@pdvfood.com` | `admin123` | Administrador |
| `garcom@pdvfood.com` | `garcom123` | Garçom |
| `caixa@pdvfood.com` | `caixa123` | Caixa |
| `cozinha@pdvfood.com` | `cozinha123` | Cozinha |

### 3️⃣ Popular o Banco com Dados

No **SQL Editor do Supabase**, execute:

```bash
# Copie o conteúdo de:
database/seed_data.sql
```

Ou execute direto no terminal:
```bash
psql -U postgres -d seu_banco -f database/seed_data.sql
```

### 4️⃣ Atualizar Roles dos Usuários

No **SQL Editor do Supabase**:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@pdvfood.com';
UPDATE users SET role = 'garcom' WHERE email = 'garcom@pdvfood.com';
UPDATE users SET role = 'caixa' WHERE email = 'caixa@pdvfood.com';
UPDATE users SET role = 'cozinha' WHERE email = 'cozinha@pdvfood.com';
```

### 5️⃣ Pronto! 🎉

Acesse: `http://localhost:5173/login`

Faça login com qualquer usuário acima!

---

## 📦 O que foi criado:

✅ **10 categorias** com cores únicas  
✅ **32 produtos** variados  
✅ **Estoque automático** (100 unidades de cada)  
✅ **6 clientes** com histórico e pontos  
✅ **12 mesas** (Salão, Varanda, Bar, VIP)  
✅ **Programa de fidelidade** ativo  

---

## 🔐 Credenciais de Teste

### 👨‍💼 ADMIN (Acesso Total)
- **Email:** `admin@pdvfood.com`
- **Senha:** `admin123`

### 🍽️ GARÇOM (Vendas e Atendimento)
- **Email:** `garcom@pdvfood.com`
- **Senha:** `garcom123`

### 💰 CAIXA (Financeiro)
- **Email:** `caixa@pdvfood.com`
- **Senha:** `caixa123`

### 👨‍🍳 COZINHA (Produção)
- **Email:** `cozinha@pdvfood.com`
- **Senha:** `cozinha123`

---

## ⚠️ Importante

- **Sequelize sync** está habilitado em desenvolvimento
- Cria/atualiza tabelas automaticamente
- Use `seed_data.sql` para popular dados
- Crie usuários no Supabase Auth primeiro
- Depois atualize as roles com UPDATE

---

## 🎯 Próximos Passos

Depois de configurar:

1. ✅ Login funcionará
2. ✅ Produtos aparecerão no PDV
3. ✅ Mesas disponíveis
4. ✅ Sistema completo sem mocks
5. 🎨 Ajustes finais de UX

---

## 📁 Arquivos

- `seed_data.sql` - Dados iniciais (categorias, produtos, clientes, mesas)
- `README.md` - Este arquivo com instruções
- `ACESSOS-TESTE.md` - Documentação de acessos por perfil
