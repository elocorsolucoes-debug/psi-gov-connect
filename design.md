# PSI-Gov Connect — Design Document

## Brand Identity

**Paleta de Cores:**
- Primary: `#1E3A5F` (Azul governo profundo)
- Accent: `#4A90D9` (Azul claro interativo)
- Secondary: `#6C63FF` (Roxo suave — PSI/bem-estar)
- Background: `#F4F7FB` (Cinza azulado claro)
- Surface: `#FFFFFF`
- Success: `#2ECC71`
- Warning: `#F39C12`
- Error: `#E74C3C`
- Muted: `#8A9BB0`

**Tipografia:** Sistema nativo (SF Pro no iOS, Roboto no Android)

**Estilo Visual:**
- Cards com bordas arredondadas (12–16px)
- Sombras sutis (shadow-sm)
- Espaçamento generoso
- Ícones lineares com preenchimento suave
- Botões com feedback háptico

---

## Screens List

### Auth Flow
1. **SplashScreen** — Logo animado + verificação de sessão
2. **LoginScreen** — Email/senha + botão Google OAuth
3. **RegisterScreen** — Cadastro com nome, email, senha, CPF, telefone

### Main Tabs (Bottom Navigation)
4. **HomeScreen** — Dashboard dinâmico por role
5. **DDEScreen** — Rastreamento de bem-estar diário
6. **ReportsScreen** — Lista de relatórios de incidentes
7. **PsiScreen** — Chat de suporte mental com IA
8. **ProfileScreen** — Perfil do usuário

### Stack Screens (dentro dos tabs)
9. **ChecklistListScreen** — Lista de checklists ativos
10. **ChecklistResponseScreen** — Resposta dinâmica de checklist
11. **ChecklistSuccessScreen** — Tela de sucesso pós-submissão
12. **ReportCreateScreen** — Criação de novo relatório
13. **ReportDetailScreen** — Detalhe de relatório com histórico de status
14. **ActionPlanListScreen** — Lista de planos de ação
15. **ActionPlanDetailScreen** — Detalhe de plano de ação
16. **BenefitsScreen** — Benefícios, cupons e eventos

---

## Primary Content and Functionality

### HomeScreen (Role-Based)
- **SERVIDOR_PUBLICO**: Card "Como você está hoje?" (atalho DDE), último relatório, benefícios em destaque
- **GESTOR/SECRETARIO**: KPIs (total relatórios, criticidade média), gráfico de tendência, atalho checklists
- **PREFEITO/ADMIN**: IMVP (Índice Municipal de Vulnerabilidade Psicossocial), status PGR, visão estratégica

### DDEScreen
- Seletor de humor (emoji grid: 😊 Excelente, 🙂 Bem, 😐 Neutro, 😟 Cansado, 😢 Mal)
- Escala de estresse 1–5 (slider visual)
- Campo de notas (textarea)
- Histórico: linha do tempo últimos 7 dias + gráfico de linha
- Gerentes: apenas dados agregados (sem identificação individual)

### ReportsScreen
- Lista de relatórios com badge de status colorido
- FAB (Floating Action Button) para novo relatório
- Filtros: status, data, categoria (para admins)
- Status flow: Enviado → Visualizado → Em Análise → Respondido

### PsiScreen
- Interface de chat estilo iMessage
- Balões de mensagem (usuário: azul, IA: cinza suave)
- Input com botão enviar
- Indicador de digitação (3 pontos animados)
- Tom: calmo, acolhedor, profissional

### ChecklistListScreen
- Cards com título, descrição e badge de status ("Não respondido" / "Concluído")
- Botão "Iniciar Questionário"
- Filtro por prefeitureId

### ChecklistResponseScreen
- Uma questão por vez (ou agrupadas por seção)
- Indicador de progresso: "3 de 10"
- Tipos: likert (1–5), múltipla escolha, texto, sim/não, checkbox, data
- Validação inline com mensagem de erro
- Botões: Anterior / Próximo / Enviar

### ProfileScreen
- Avatar (foto Google ou placeholder com iniciais)
- Nome, email (imutável), role, telefone, CPF
- Formulário de edição inline
- Botão de logout com confirmação

---

## Key User Flows

### Flow 1: Login → Home
Login → Firebase Auth → Buscar perfil /users/{uid} → Redirecionar por role → Home

### Flow 2: DDE Entry
Home (CTA) → DDEScreen → Selecionar humor → Definir estresse → Adicionar nota → Salvar → Toast sucesso

### Flow 3: Checklist
ChecklistList → Selecionar checklist → ChecklistResponse (paginado) → Submit → Firestore → Tela de sucesso

### Flow 4: Relatório
ReportsScreen → FAB → ReportCreate → Texto + anonimato → Submit → Análise IA → Lista atualizada

### Flow 5: PSI Chat
PsiScreen → Digitar mensagem → Enviar → IA responde → Histórico local

---

## Color Tokens (theme.config.js)

```
primary:    #1E3A5F / #4A90D9  (dark)
accent:     #4A90D9 / #6C9FD4  (dark)
secondary:  #6C63FF / #8B85FF  (dark)
background: #F4F7FB / #0F1923  (dark)
surface:    #FFFFFF / #1A2535  (dark)
foreground: #1A2535 / #E8EDF4  (dark)
muted:      #8A9BB0 / #6B7A8D  (dark)
border:     #D8E2EE / #2A3A4F  (dark)
success:    #2ECC71 / #4ADE80  (dark)
warning:    #F39C12 / #FBBF24  (dark)
error:      #E74C3C / #F87171  (dark)
```
