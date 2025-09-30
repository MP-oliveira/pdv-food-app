# 🚀 Roadmap - PDV Food App

## 📊 Status Atual
Sistema funcional com módulos básicos implementados. Este documento lista todas as melhorias necessárias para tornar o PDV profissional e pronto para produção.

---

## ✅ Módulos Já Implementados
- [x] PDV (Ponto de Venda)
- [x] Gestão de Pedidos (Orders)
- [x] Cozinha (Kitchen)
- [x] Dashboard
- [x] Produtos
- [x] Cardápio/Menu
- [x] Clientes
- [x] Relatórios
- [x] Configurações
- [x] Login/Autenticação
- [x] Controle de Mesas

---

## 🔴 PRIORIDADE CRÍTICA (Essencial para Produção)

### 1. Fechamento de Caixa
**Status:** ❌ Não iniciado  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 4-6 horas

**Features:**
- [ ] Abertura de caixa com valor inicial
- [ ] Sangria (retirada de dinheiro)
- [ ] Reforço (entrada de dinheiro)
- [ ] Fechamento de caixa com conferência
- [ ] Relatório de movimentação do turno
- [ ] Quebra de caixa (diferença)
- [ ] Histórico de fechamentos

**Telas necessárias:**
- Abrir Caixa (modal)
- Gerenciar Caixa (sangria/reforço)
- Fechar Caixa (resumo + conferência)
- Histórico de Caixas

---

### 2. Gestão de Pagamentos
**Status:** ❌ Não iniciado  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 3-4 horas

**Features:**
- [ ] Múltiplas formas de pagamento
  - [ ] Dinheiro (com cálculo de troco)
  - [ ] Cartão Débito
  - [ ] Cartão Crédito
  - [ ] PIX
  - [ ] Vale Refeição
  - [ ] Outros
- [ ] Pagamento misto (dividir em várias formas)
- [ ] Integração com TEF (opcional)
- [ ] Histórico de pagamentos

**Telas necessárias:**
- Modal de Pagamento
- Seleção de formas de pagamento
- Confirmação e impressão

---

### 3. Impressão de Comandas/Cupons
**Status:** ❌ Não iniciado  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 5-7 horas

**Features:**
- [ ] Impressão de comanda para cozinha
- [ ] Impressão de cupom fiscal simplificado
- [ ] Impressão de recibo
- [ ] Configuração de impressora térmica
- [ ] Preview antes de imprimir
- [ ] Reimpressão de comandas
- [ ] Logo personalizado

**Tecnologias:**
- Electron Print API (se desktop)
- WebUSB API (navegador)
- ESC/POS (padrão térmico)

---

### 4. Cancelamento de Pedidos
**Status:** ❌ Não iniciado  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 2-3 horas

**Features:**
- [ ] Cancelar pedido completo
- [ ] Cancelar item individual
- [ ] Justificativa obrigatória
- [ ] Permissões por role (apenas gerente?)
- [ ] Histórico de cancelamentos
- [ ] Estorno de estoque
- [ ] Notificação para cozinha

**Telas necessárias:**
- Modal de cancelamento
- Formulário de justificativa
- Confirmação com senha (gerente)

---

### 5. Descontos e Promoções
**Status:** ❌ Não iniciado  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 3-4 horas

**Features:**
- [ ] Desconto percentual
- [ ] Desconto em valor fixo
- [ ] Desconto por item
- [ ] Desconto no total
- [ ] Cupons de desconto
- [ ] Promoções automáticas
- [ ] Permissões por role
- [ ] Limite máximo de desconto

**Telas necessárias:**
- Modal de aplicar desconto
- Gerenciar promoções
- Validar cupom

---

### 6. Split de Conta
**Status:** ❌ Não iniciado  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 4-5 horas

**Features:**
- [ ] Dividir conta igualmente
- [ ] Dividir por pessoa (atribuir itens)
- [ ] Dividir por valor personalizado
- [ ] Preview da divisão
- [ ] Pagamento individual de cada parte

**Telas necessárias:**
- Modal de divisão de conta
- Atribuir itens a pessoas
- Pagamento de cada parte

---

### 7. Controle de Estoque em Tempo Real
**Status:** ⚠️ Parcial (tem tabela, falta automação)  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 3-4 horas

**Features:**
- [ ] Baixa automática ao vender
- [ ] Alertas de estoque baixo
- [ ] Bloqueio de venda se sem estoque
- [ ] Entrada de estoque (compra/produção)
- [ ] Histórico de movimentações
- [ ] Inventário (contagem física)
- [ ] Transferência entre lojas

---

### 8. Sistema de Comanda/Tab
**Status:** ❌ Não iniciado  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 5-6 horas

**Features:**
- [ ] Abrir comanda
- [ ] Adicionar consumo
- [ ] Visualizar comanda aberta
- [ ] Fechar comanda (gerar conta)
- [ ] Transferir mesa
- [ ] Juntar comandas
- [ ] Comandas por CPF/Nome

**Telas necessárias:**
- Lista de comandas abertas
- Detalhes da comanda
- Adicionar ao consumo

---

## 🟡 PRIORIDADE ALTA (Melhora Experiência)

### 9. Gorjeta/Taxa de Serviço
**Status:** ❌ Não iniciado  
**Prioridade:** 🟡 Alta  
**Estimativa:** 2 horas

**Features:**
- [ ] Taxa de serviço configurável (10%)
- [ ] Gorjeta opcional
- [ ] Sugestões de gorjeta (10%, 15%, 20%)
- [ ] Gorjeta personalizada
- [ ] Distribuição entre garçons

---

### 10. Histórico de Vendas por Garçom
**Status:** ❌ Não iniciado  
**Prioridade:** 🟡 Alta  
**Estimativa:** 2-3 horas

**Features:**
- [ ] Vendas por garçom/operador
- [ ] Comissões
- [ ] Metas
- [ ] Ranking
- [ ] Relatório individual

---

### 11. Reservas de Mesa
**Status:** ❌ Não iniciado  
**Prioridade:** 🟡 Alta  
**Estimativa:** 4-5 horas

**Features:**
- [ ] Criar reserva
- [ ] Visualizar reservas do dia
- [ ] Confirmar/Cancelar reserva
- [ ] Notificações de reserva
- [ ] Bloqueio de mesa reservada

---

### 12. Fila de Espera
**Status:** ❌ Não iniciado  
**Prioridade:** 🟡 Alta  
**Estimativa:** 3 horas

**Features:**
- [ ] Adicionar cliente à fila
- [ ] Tempo estimado de espera
- [ ] Notificar quando mesa estiver pronta
- [ ] Prioridades (VIP, reserva)
- [ ] Histórico de espera

---

### 13. Delivery Integrado
**Status:** ❌ Não iniciado  
**Prioridade:** 🟡 Alta  
**Estimativa:** 8-10 horas

**Features:**
- [ ] Integração com iFood
- [ ] Integração com Uber Eats
- [ ] Rastreamento de entregador
- [ ] Cálculo de frete
- [ ] Taxa de entrega
- [ ] Área de entrega (CEP)

---

### 14. QR Code para Cardápio Digital
**Status:** ❌ Não iniciado  
**Prioridade:** 🟡 Alta  
**Estimativa:** 3-4 horas

**Features:**
- [ ] Gerar QR Code por mesa
- [ ] Cardápio digital responsivo
- [ ] Cliente faz pedido pelo celular
- [ ] Pedido vai direto para cozinha
- [ ] Chamar garçom

---

### 15. Programa de Fidelidade
**Status:** ❌ Não iniciado  
**Prioridade:** 🟡 Alta  
**Estimativa:** 6-7 horas

**Features:**
- [ ] Cadastro de clientes
- [ ] Acúmulo de pontos
- [ ] Resgate de pontos
- [ ] Cashback
- [ ] Histórico de pontos
- [ ] Níveis (bronze, prata, ouro)

---

## 🟢 PRIORIDADE MÉDIA (Diferenciais)

### 16. Modo Offline
**Status:** ❌ Não iniciado  
**Prioridade:** 🟢 Média  
**Estimativa:** 10-15 horas

**Features:**
- [ ] Service Worker
- [ ] IndexedDB
- [ ] Sincronização ao voltar online
- [ ] Indicador de status (online/offline)

---

### 17. Multi-loja
**Status:** ❌ Não iniciado  
**Prioridade:** 🟢 Média  
**Estimativa:** 8-10 horas

**Features:**
- [ ] Gestão de múltiplas lojas
- [ ] Estoque por loja
- [ ] Relatórios consolidados
- [ ] Transferência entre lojas

---

### 18. Metas e Comissões
**Status:** ❌ Não iniciado  
**Prioridade:** 🟢 Média  
**Estimativa:** 4-5 horas

**Features:**
- [ ] Definir metas
- [ ] Calcular comissões
- [ ] Visualizar progresso
- [ ] Relatório de comissionamento

---

### 19. Backup Automático
**Status:** ❌ Não iniciado  
**Prioridade:** 🟢 Média  
**Estimativa:** 3-4 horas

**Features:**
- [ ] Backup diário automático
- [ ] Backup manual
- [ ] Restauração
- [ ] Armazenamento em nuvem

---

### 20. Integração com Contabilidade
**Status:** ❌ Não iniciado  
**Prioridade:** 🟢 Média  
**Estimativa:** 5-6 horas

**Features:**
- [ ] Exportar para Excel
- [ ] Exportar para Conta Azul
- [ ] Exportar para Omie
- [ ] DRE automático

---

### 21. Cupom Fiscal (NFC-e/SAT)
**Status:** ❌ Não iniciado  
**Prioridade:** 🟢 Média  
**Estimativa:** 15-20 horas

**Features:**
- [ ] Integração com SEFAZ
- [ ] Emissão de NFC-e
- [ ] Impressão de DANFE
- [ ] Contingência
- [ ] Cancelamento de nota

---

## 📅 Cronograma Sugerido

### Sprint 1 (Semana 1) - Fundamentos Críticos
1. Gestão de Pagamentos
2. Descontos e Promoções
3. Cancelamento de Pedidos

### Sprint 2 (Semana 2) - Operação Diária
4. Fechamento de Caixa
5. Split de Conta
6. Controle de Estoque em Tempo Real

### Sprint 3 (Semana 3) - Comandas e Impressão
7. Sistema de Comanda/Tab
8. Impressão de Comandas/Cupons

### Sprint 4 (Semana 4) - Melhorias
9. Gorjeta/Taxa de Serviço
10. Histórico de Vendas por Garçom
11. Reservas de Mesa

---

## 🎯 Próxima Feature a Implementar

**Decisão:** Aguardando definição do usuário.

**Recomendação:** Começar pela **Gestão de Pagamentos** pois é fundamental e impacta outras features.

---

## 📝 Notas
- Cada feature será testada antes de commitar
- Documentação será atualizada conforme implementação
- Prioridades podem ser ajustadas conforme necessidade do negócio
