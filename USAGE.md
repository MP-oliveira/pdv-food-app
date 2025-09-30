# Guia de Uso - PDV Food App

## 🚀 Início Rápido

### 1. Instalação Local

```bash
# Clone o repositório
git clone <repository-url>
cd pdv-food-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Execute as migrações
npm run db:migrate

# Execute os seeders
npm run db:seed

# Inicie o projeto
npm run dev
```

### 2. Acesse a aplicação
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 👥 Perfis de Usuário

### Administrador
- **Login**: admin@pdvfood.com
- **Senha**: 123456
- **Permissões**: Acesso total ao sistema

### Garçom
- **Login**: garcom@pdvfood.com
- **Senha**: 123456
- **Permissões**: Criar pedidos, gerenciar mesas

### Caixa
- **Login**: caixa@pdvfood.com
- **Senha**: 123456
- **Permissões**: Processar pagamentos, relatórios

### Cozinha
- **Login**: cozinha@pdvfood.com
- **Senha**: 123456
- **Permissões**: Visualizar e atualizar pedidos

## 📱 Funcionalidades Principais

### 1. Dashboard
- Visão geral das vendas do dia
- Estatísticas em tempo real
- Ações rápidas
- Pedidos recentes

### 2. Cardápio
- Visualização de produtos por categoria
- Busca e filtros
- Carrinho de compras
- Adição rápida de itens

### 3. Cozinha
- Fila de pedidos em tempo real
- Atualização de status
- Notificações de novos pedidos
- Controle de preparo

### 4. Pedidos
- Lista completa de pedidos
- Filtros por status e data
- Detalhes do pedido
- Histórico de alterações

### 5. Clientes
- Cadastro de clientes
- Histórico de pedidos
- Informações de contato
- Programa de fidelidade

### 6. Produtos
- Gestão de produtos
- Controle de estoque
- Categorias
- Preços e custos

### 7. Relatórios
- Vendas diárias
- Produtos mais vendidos
- Receita e despesas
- Análise de performance

## 🔄 Fluxo de Trabalho

### 1. Criar Pedido (Garçom)
1. Acesse o Cardápio
2. Selecione os produtos
3. Escolha a mesa
4. Adicione observações
5. Confirme o pedido

### 2. Preparar Pedido (Cozinha)
1. Visualize novos pedidos
2. Marque como "Preparando"
3. Atualize status dos itens
4. Marque como "Pronto"

### 3. Processar Pagamento (Caixa)
1. Acesse o pedido
2. Selecione forma de pagamento
3. Confirme o valor
4. Processe o pagamento
5. Emita a nota fiscal

## 📊 Relatórios Disponíveis

### Relatório Diário
- Total de vendas
- Número de pedidos
- Ticket médio
- Produtos mais vendidos
- Comparação com dias anteriores

### Relatório de Estoque
- Produtos com estoque baixo
- Movimentação de estoque
- Alertas de reposição
- Histórico de entradas/saídas

### Relatório Financeiro
- Receita total
- Despesas
- Lucro líquido
- Formas de pagamento
- Análise de margem

## 🔧 Configurações

### 1. Produtos
- Adicionar/editar produtos
- Definir categorias
- Configurar preços
- Estabelecer estoque mínimo

### 2. Mesas
- Cadastrar mesas
- Definir capacidade
- Organizar por localização
- Gerenciar disponibilidade

### 3. Usuários
- Criar novos usuários
- Definir permissões
- Gerenciar perfis
- Controle de acesso

## 🚨 Alertas e Notificações

### Estoque Baixo
- Notificação automática
- Lista de produtos críticos
- Sugestão de reposição
- Histórico de alertas

### Novos Pedidos
- Notificação em tempo real
- Som de alerta (opcional)
- Atualização automática
- Priorização por tempo

### Pagamentos
- Confirmação de pagamento
- Notificação de falha
- Histórico de transações
- Relatório de inadimplência

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop**: Interface completa
- **Tablet**: Layout adaptado
- **Mobile**: Interface otimizada

### Breakpoints
- 392px: Mobile pequeno
- 768px: Tablet
- 984px: Desktop pequeno
- 1220px: Desktop médio
- 1440px: Desktop grande

## 🔒 Segurança

### Autenticação
- Login seguro com Supabase
- Tokens JWT
- Sessões controladas
- Logout automático

### Autorização
- Controle de acesso por perfil
- Permissões granulares
- Auditoria de ações
- Proteção de rotas

### Dados
- Criptografia de senhas
- Validação de inputs
- Sanitização de dados
- Backup automático

## 🆘 Suporte

### Problemas Comuns

**Erro de login**
- Verifique email e senha
- Confirme se a conta está ativa
- Limpe o cache do navegador

**Pedidos não aparecem**
- Verifique a conexão com internet
- Recarregue a página
- Confirme se está logado

**Erro de pagamento**
- Verifique os dados do cartão
- Confirme a conexão
- Tente outra forma de pagamento

### Contato
- Email: suporte@pdvfood.com
- Telefone: (11) 99999-9999
- Chat: Disponível no sistema

## 📈 Próximas Funcionalidades

- [ ] Integração com delivery
- [ ] App mobile nativo
- [ ] Sistema de cupons
- [ ] Relatórios avançados
- [ ] Integração com contabilidade
- [ ] Sistema de reservas
- [ ] Programa de fidelidade
- [ ] Análise de dados com IA
