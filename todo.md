# PSI-Gov Connect — TODO

## Setup & Infraestrutura
- [x] Instalar dependências Firebase (firebase SDK)
- [x] Configurar tema de cores governo (azul/roxo)
- [x] Configurar ícones dos tabs
- [x] Criar variáveis de ambiente Firebase (webdev_request_secrets)
- [x] Configurar app.config.ts com nome e branding
- [x] Criar arquivo de tipos globais (UserRole, RBAC, DDEEntry, Report, Checklist, ActionPlan)
- [x] Criar serviço Firebase (inicialização com env vars)
- [x] Adicionar accent, secondary, tint nas CSS vars do ThemeProvider

## Autenticação
- [x] Tela de Login (email/senha)
- [x] Tela de Registro
- [x] AuthContext com Firebase Auth
- [x] Persistência de sessão
- [x] Buscar perfil do usuário no Firestore (/users/{uid})
- [x] Route guards baseados em role (AuthGate)

## Navegação
- [x] Bottom tabs: Home, DDE, Reports, Psi, Profile
- [x] Stack navigation dentro dos tabs
- [x] Navegação para Checklists e Planos de Ação

## Home Screen
- [x] Dashboard SERVIDOR_PUBLICO (CTA DDE, checklists, benefícios)
- [x] Dashboard GESTOR/SECRETARIO (KPIs, painel operacional)
- [x] Dashboard PREFEITO/ADMIN (IMVP, PGR status)
- [x] Sistema de notificações (placeholder UI)

## DDE Screen
- [x] Seletor de humor (emoji + label)
- [x] Escala de estresse 1–5
- [x] Campo de notas
- [x] Salvar em /ddeEntries no Firestore
- [x] Histórico últimos 7 dias (lista cronológica)

## Reports Screen
- [x] Lista de relatórios do usuário
- [x] Badge de status colorido
- [x] Modal de criação de relatório
- [x] Campo de texto + opção anônimo
- [x] Status flow: Enviado → Visualizado → Em Análise → Respondido

## PSI Screen (Chat IA)
- [x] Interface de chat (balões de mensagem)
- [x] Input + botão enviar
- [x] Integração com LLM do servidor (invokeLLM via rota Express)
- [x] Indicador de digitação animado
- [x] URL da API corrigida para multiplataforma (getApiBaseUrl)

## Checklists
- [x] Tela de lista de checklists ativos
- [x] Filtro por prefectureId
- [x] Badge de status (não respondido / concluído)
- [x] Tela de resposta dinâmica (schema-driven)
- [x] Suporte a tipos: likert, multiple_choice, text, yes_no, checkbox, date
- [x] Indicador de progresso (X/Y)
- [x] Validação de campos obrigatórios
- [x] Submissão para /checklistResponses no Firestore
- [x] Tela de sucesso pós-submissão
- [x] Prevenção de submissão duplicada

## Profile Screen
- [x] Exibir nome, email, role, telefone, CPF
- [x] Avatar com iniciais
- [x] Formulário de edição (firstName, lastName, phone, cpf)
- [x] Salvar alterações no Firestore
- [x] Botão de logout com confirmação

## Action Plans
- [x] Lista de planos de ação
- [x] Filtros: status
- [x] Badges de status e grau de risco

## Branding
- [x] Gerar logo do app (escudo azul + figura humana + coração/pulso)
- [x] Configurar icon.png, splash-icon.png, favicon.png, android-icon-foreground.png
- [x] Atualizar app.config.ts com nome "PSI-Gov Connect" e logoUrl

## Serviços Firebase
- [x] firebase.ts (inicialização)
- [x] auth.service.ts
- [x] user.service.ts
- [x] dde.service.ts
- [x] reports.service.ts
- [x] actionPlans.service.ts
- [x] checklist.service.ts

## Qualidade
- [x] Zero erros TypeScript (npx tsc --noEmit)
- [x] Testes de validação das credenciais Firebase (3/3 passando)
- [x] Regras de segurança Firestore documentadas

## Futuras Extensões (backlog)
- [ ] Dashboard de resultados agregados de checklists (IMVP, clima)
- [ ] Vinculação de resultados a métricas PGR
- [ ] Notificações push para novos checklists
- [ ] Exportação de relatórios em PDF
- [ ] Modo offline com sincronização posterior
- [ ] Tela de detalhe do relatório
- [ ] Upload de evidências nos planos de ação (GESTOR+)
- [ ] Benefits Screen (cupons, eventos, recompensas)


## Redesign com Inspiração Visual (GitHub)
- [x] Analisar paleta de cores e tipografia do novo design
- [x] Atualizar Home Screen com layout profissional
- [x] Redesenhar DDE Screen com gráficos bem feitos
- [x] Atualizar Reports Screen com cards modernos
- [x] Redesenhar PSI Chat com interface melhorada
- [x] Atualizar Checklists com UX otimizada
- [x] Redesenhar Profile Screen
- [x] Testar e validar todas as telas


## Animações de Transição
- [x] Criar componentes de animação reutilizáveis (FadeIn, SlideIn)
- [x] Implementar fade e slide nas telas principais
- [x] Adicionar animações nos modais e overlays
- [x] Animar cards e listas com stagger effect
- [x] Testar animações em todas as telas
