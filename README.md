# PDV Food App - Sistema de Ponto de Venda para Restaurantes

Sistema completo de PDV para restaurantes com frontend em React (Vite) e backend em Node.js (Express), integrado com Supabase para autenticação, banco de dados e realtime.

## 🚀 Características

- **Cardápio interativo** com seleção por categorias
- **Gestão de mesas e comandas** 
- **Pedidos em tempo real** para a cozinha
- **Emissão de notas fiscais** (PDF + JSON)
- **Relatórios financeiros** diários
- **Controle de estoque** com alertas
- **Painel administrativo** completo
- **Interface responsiva** para todos os dispositivos

## 🛠 Stack Técnico

- **Frontend**: React + Vite + CSS puro
- **Backend**: Node.js + Express
- **Banco**: Supabase (PostgreSQL)
- **ORM**: Sequelize
- **Autenticação**: Supabase Auth
- **Realtime**: Supabase Realtime
- **Deploy**: Vercel

## 📁 Estrutura do Projeto

```
pdv-food-app/
├── api/                    # Backend API
│   ├── controllers/        # Controladores
│   ├── models/            # Modelos Sequelize
│   ├── migrations/        # Migrações do banco
│   ├── seeders/          # Dados iniciais
│   ├── services/         # Lógica de negócio
│   ├── routes/           # Rotas da API
│   ├── middleware/       # Middlewares
│   └── server.js         # Servidor principal
├── frontend/             # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # Serviços de API
│   │   ├── styles/       # Estilos globais
│   │   └── main.jsx      # Entry point
│   ├── public/           # Arquivos estáticos
│   └── vite.config.js    # Configuração Vite
├── .env.example          # Variáveis de ambiente
└── README.md            # Este arquivo
```

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd pdv-food-app
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
DATABASE_URL=sua_url_do_banco_postgres
JWT_SECRET=seu_jwt_secret
NODE_ENV=development
```

### 3. Instale as dependências
```bash
# Backend
cd api
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configure o banco de dados
```bash
# Execute as migrações
cd api
npx sequelize-cli db:migrate

# Execute os seeders
npx sequelize-cli db:seed:all
```

### 5. Execute o projeto
```bash
# Terminal 1 - Backend
cd api
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📱 Perfis de Usuário

- **Admin**: Acesso total ao sistema
- **Garçom**: Criação de pedidos e gestão de mesas
- **Caixa**: Processamento de pagamentos
- **Cozinha**: Visualização e atualização de pedidos

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar em produção
npm run test         # Executar testes
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run test         # Executar testes
```

## 🚀 Deploy na Vercel

### 1. Configure o projeto na Vercel
```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

### 2. Configure as variáveis de ambiente na Vercel
Adicione todas as variáveis do `.env` no painel da Vercel.

## 📊 Funcionalidades Principais

### Cardápio
- Visualização por categorias
- Busca de produtos
- Filtros avançados
- Carrinho de compras

### Gestão de Pedidos
- Criação de pedidos
- Atribuição a mesas/comandas
- Envio em tempo real para cozinha
- Acompanhamento de status

### Cozinha
- Fila de pedidos em tempo real
- Atualização de status
- Notificações de novos pedidos

### Financeiro
- Relatórios diários
- Controle de receitas e despesas
- Emissão de notas fiscais
- Análise de lucratividade

### Estoque
- Controle de produtos
- Alertas de estoque baixo
- Histórico de movimentações

## 🔐 Segurança

- Autenticação JWT
- Autorização baseada em roles
- Validação de dados
- Sanitização de inputs
- Rate limiting

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- 392px (mobile pequeno)
- 768px (tablet)
- 984px (desktop pequeno)
- 1220px (desktop médio)
- 1440px (desktop grande)

## 🧪 Testes

```bash
# Backend
cd api
npm test

# Frontend
cd frontend
npm test
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através dos issues do GitHub.
