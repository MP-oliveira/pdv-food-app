# Deploy na Vercel - PDV Food App

## Pré-requisitos

1. Conta na Vercel
2. Projeto no Supabase configurado
3. CLI da Vercel instalada: `npm i -g vercel`

## Configuração do Supabase

### 1. Criar projeto no Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto
- Anote a URL e as chaves de API

### 2. Configurar banco de dados
```sql
-- Execute as migrações no SQL Editor do Supabase
-- Copie o conteúdo dos arquivos em api/migrations/ e execute
```

### 3. Configurar autenticação
- Vá em Authentication > Settings
- Configure as URLs permitidas
- Ative o provider de email

## Deploy do Backend (API)

### 1. Configurar variáveis de ambiente
```bash
cd api
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV production
```

### 2. Deploy
```bash
cd api
vercel --prod
```

## Deploy do Frontend

### 1. Configurar variáveis de ambiente
```bash
cd frontend
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_API_URL
```

### 2. Deploy
```bash
cd frontend
vercel --prod
```

## Configuração Final

### 1. Atualizar URLs no Supabase
- Authentication > Settings > Site URL
- Authentication > Settings > Redirect URLs
- Adicione as URLs de produção da Vercel

### 2. Testar a aplicação
- Acesse a URL do frontend
- Teste o login com as contas de demonstração
- Verifique se todas as funcionalidades estão funcionando

## Contas de Demonstração

- **Admin**: admin@pdvfood.com / 123456
- **Garçom**: garcom@pdvfood.com / 123456
- **Caixa**: caixa@pdvfood.com / 123456
- **Cozinha**: cozinha@pdvfood.com / 123456

## Troubleshooting

### Problemas comuns:

1. **Erro de CORS**: Verifique as URLs no Supabase
2. **Erro de autenticação**: Verifique as chaves de API
3. **Erro de banco**: Verifique a URL do banco e as migrações
4. **Build falha**: Verifique as dependências no package.json

### Logs:
```bash
vercel logs [deployment-url]
```

## Monitoramento

- Use o dashboard da Vercel para monitorar performance
- Configure alertas para erros
- Monitore o uso do banco no Supabase
