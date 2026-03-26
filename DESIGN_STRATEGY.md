# PSI-Gov Connect — Estratégia de Design & Implementação Técnica

**Versão:** 1.0 | **Data:** 26 de Março de 2026 | **Status:** Análise Completa

---

## 📊 ANÁLISE DE UX/UI ATUAL

### ✅ Pontos Fortes
- **Hierarquia clara** com cards bem estruturados
- **Animações suaves** que melhoram a experiência
- **Paleta de cores** profissional e confiável
- **Espaçamento consistente** entre elementos
- **Feedback visual** em botões e interações

### ⚠️ Problemas Identificados

#### 1. **Navegação Confusa**
- **Problema:** Abas no tab bar não indicam claramente qual tela está ativa
- **Impacto:** Usuário não sabe em qual seção está
- **Solução:** Adicionar indicador visual + label descritivo + animação de transição

#### 2. **Falta de Hierarquia Visual**
- **Problema:** CTAs (Call-to-Action) não se destacam o suficiente
- **Impacto:** Usuário não sabe por onde começar
- **Solução:** Usar contraste maior + ícones mais visíveis + tamanho maior para ações primárias

#### 3. **Espaçamento Inconsistente**
- **Problema:** Padding/margin variam entre telas
- **Impacto:** Interface parece desorganizada
- **Solução:** Implementar sistema de spacing (8px grid)

#### 4. **Falta de Feedback em Formulários**
- **Problema:** Inputs não mostram estado (focus, error, success)
- **Impacto:** Usuário não sabe se preencheu corretamente
- **Solução:** Adicionar bordas coloridas + mensagens de erro claras

#### 5. **Baixo Contraste em Modo Dark**
- **Problema:** Texto muted é difícil de ler em dark mode
- **Impacto:** Acessibilidade prejudicada
- **Solução:** Aumentar luminosidade do texto em dark mode

#### 6. **Modais/Overlays Sem Contexto**
- **Problema:** Modais aparecem sem transição clara
- **Impacto:** Usuário fica desorientado
- **Solução:** Adicionar backdrop + animação de slide-up + close button visível

#### 7. **Ícones Inconsistentes**
- **Problema:** Mix de emojis + ícones de linha
- **Impacto:** Interface parece amadora
- **Solução:** Padronizar em um sistema de ícones (Feather ou Heroicons)

---

## 🎨 NOVA PALETA DE CORES

### **Tema 1: DEEP OCEAN (Padrão - Dark Mode)**
Inspirado em profundidade, calma e confiança. Perfeito para o tom empático + sério.

```
Primary:      #1E88E5 (Azul profundo - ações principais)
Secondary:    #00BCD4 (Teal calmante - acentos)
Tertiary:     #7C4DFF (Roxo suave - destaque)

Background:   #0D1B2A (Azul muito escuro - quase preto)
Surface:      #1A2F45 (Azul escuro - cards)
Overlay:      #0D1B2A (com 80% opacidade)

Foreground:   #E8F0F7 (Branco azulado - texto principal)
Muted:        #7A8FA3 (Cinza azulado - texto secundário)
Border:       #2A3F54 (Azul escuro - separadores)

Success:      #4CAF50 (Verde calmo)
Warning:      #FF9800 (Laranja profissional)
Error:        #F44336 (Vermelho claro)
```

**Uso:** Modo padrão do app (transmite seriedade + confiança)

---

### **Tema 2: CALM LIGHT (Light Mode)**
Inspirado em claridade, acessibilidade e leveza.

```
Primary:      #0D47A1 (Azul escuro - ações principais)
Secondary:    #0097A7 (Teal profundo - acentos)
Tertiary:     #6A1B9A (Roxo profissional - destaque)

Background:   #F5F7FA (Branco com toque azul)
Surface:      #FFFFFF (Branco puro - cards)
Overlay:      #000000 (com 20% opacidade)

Foreground:   #1A2F45 (Azul escuro - texto principal)
Muted:        #5A6F85 (Cinza azulado - texto secundário)
Border:       #D8E5F0 (Azul muito claro - separadores)

Success:      #2E7D32 (Verde escuro)
Warning:      #E65100 (Laranja escuro)
Error:        #C62828 (Vermelho escuro)
```

**Uso:** Modo claro (para usuários que preferem ou em ambientes com muita luz)

---

## 📐 SISTEMA DE SPACING (8px Grid)

Implementar um sistema consistente baseado em múltiplos de 8px:

```
xs:  4px   (micro spacing)
sm:  8px   (padrão mínimo)
md:  16px  (padrão)
lg:  24px  (seções)
xl:  32px  (grandes seções)
xxl: 48px  (entre telas)
```

**Aplicação:**
- Padding de cards: `md` (16px)
- Margin entre cards: `md` (16px)
- Padding de tela: `lg` (24px)
- Gap entre elementos em linha: `sm` (8px)

---

## 🔤 TIPOGRAFIA RECOMENDADA

### Fontes
- **Primária:** Inter (já implementada) ✅
- **Fallback:** System Font Stack (Segoe UI, Roboto)

### Escala de Tamanho

```
Display:      32px | Weight: 800 | Line Height: 40px (títulos principais)
Heading 1:    28px | Weight: 700 | Line Height: 36px (títulos de seção)
Heading 2:    24px | Weight: 600 | Line Height: 32px (subtítulos)
Heading 3:    20px | Weight: 600 | Line Height: 28px (cards títulos)
Body Large:   16px | Weight: 500 | Line Height: 24px (texto principal)
Body:         14px | Weight: 400 | Line Height: 20px (texto padrão)
Body Small:   12px | Weight: 400 | Line Height: 18px (labels, hints)
Caption:      11px | Weight: 400 | Line Height: 16px (metadata)
```

---

## 🎯 REDESIGN POR TELA

### 1. **HOME SCREEN (Dashboard)**

#### Problemas Atuais
- CTAs não se destacam
- Falta de indicador de progresso geral
- Cards estatísticos muito pequenos

#### Solução Proposta

```
┌─────────────────────────────────────┐
│ PSI-Gov Connect          [Avatar]   │ ← Header com greeting
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🎯 Seu Progresso Hoje          ││ ← Progress card (novo)
│  │ ████████░░ 80% completo        ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 😊 Como você está hoje?         ││ ← CTA Primária (maior)
│  │ Registre seu bem-estar diário   ││
│  │              [Começar →]        ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌──────────────┬──────────────────┐│
│  │ 📋 Questioná │ 📊 Meus Relatos  ││ ← CTAs Secundárias (2 cols)
│  │rios          │                  ││
│  │ 3 pendentes  │ 5 enviados       ││
│  └──────────────┴──────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 📈 Seu Bem-Estar (últimos 7 dias)││ ← Mini gráfico
│  │ [Gráfico de linha simples]      ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Mudanças:**
- ✅ Progress card no topo (mostra progresso geral)
- ✅ CTA primária maior (80% da largura)
- ✅ CTAs secundárias em 2 colunas
- ✅ Mini gráfico de bem-estar
- ✅ Melhor hierarquia visual

---

### 2. **DDE SCREEN (Diário de Bem-Estar)**

#### Problemas Atuais
- Seletor de humor muito pequeno
- Histórico não é visível
- Falta de feedback após salvar

#### Solução Proposta

```
┌─────────────────────────────────────┐
│ Bem-Estar Diário     [?]            │ ← Header com info
├─────────────────────────────────────┤
│                                     │
│  Como você está se sentindo?        │ ← Pergunta clara
│                                     │
│  ┌─────┬─────┬─────┬─────┬─────┐  │
│  │ 😊  │ 🙂  │ 😐  │ 😟  │ 😢  │  │ ← Emojis maiores (tappable)
│  │ Exce│ Bem │Neutr│Cans │ Mal │  │
│  │lente│     │ o   │ ado │     │  │
│  └─────┴─────┴─────┴─────┴─────┘  │
│                                     │
│  Nível de Estresse                  │ ← Slider com labels
│  [●─────────────────] 6/10          │
│  Muito Baixo ←→ Muito Alto         │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Notas (opcional)                ││
│  │ ┌───────────────────────────────┐││
│  │ │ Descreva como você se sente...│││
│  │ └───────────────────────────────┘││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ [Salvar Registro]               ││ ← Botão primário
│  └─────────────────────────────────┘│
│                                     │
│  ─────────────────────────────────  │
│  Histórico (últimos 7 dias)         │
│  ─────────────────────────────────  │
│                                     │
│  Hoje, 14:30 - 😊 Bem               │ ← Cards de histórico
│  Estresse: 4/10                    │
│                                     │
│  Ontem, 09:15 - 😐 Neutro           │
│  Estresse: 6/10                    │
│                                     │
└─────────────────────────────────────┘
```

**Mudanças:**
- ✅ Emojis maiores (40x40px) e tappable
- ✅ Slider com feedback visual
- ✅ Histórico visível na mesma tela
- ✅ Feedback de sucesso após salvar
- ✅ Melhor espaçamento vertical

---

### 3. **REPORTS SCREEN (Relatos)**

#### Problemas Atuais
- Filtros não são visíveis
- Status dos relatos confuso
- Falta de empty state

#### Solução Proposta

```
┌─────────────────────────────────────┐
│ Relatos              [+ Novo]       │ ← Header com CTA
├─────────────────────────────────────┤
│                                     │
│  Filtros: [Todos ▼] [Recentes ▼]   │ ← Filtros visíveis
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🔴 Relato #001                  ││ ← Status com cor
│  │ Assédio moral na equipe         ││
│  │ Enviado em 25 de março          ││
│  │ Status: Em Análise              ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🟢 Relato #002                  ││
│  │ Demanda de equipamentos         ││
│  │ Enviado em 24 de março          ││
│  │ Status: Resolvido               ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🟡 Relato #003                  ││
│  │ Falta de comunicação            ││
│  │ Enviado em 20 de março          ││
│  │ Status: Aguardando Resposta     ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Mudanças:**
- ✅ Filtros no topo (visíveis)
- ✅ Status com cores (🔴 vermelho, 🟡 amarelo, 🟢 verde)
- ✅ Cards com mais informações
- ✅ CTA de novo relato no header
- ✅ Empty state quando não há relatos

---

### 4. **PSI CHAT SCREEN**

#### Problemas Atuais
- Mensagens não têm espaçamento claro
- Falta de indicador "digitando"
- Input não é destacado

#### Solução Proposta

```
┌─────────────────────────────────────┐
│ PSI Chat - Suporte Mental           │ ← Header claro
├─────────────────────────────────────┤
│                                     │
│                   ┌─────────────┐   │
│                   │ Olá! Como   │   │ ← Mensagem da IA
│                   │ posso ajudar?   │   (alinhada à direita)
│                   └─────────────┘   │
│                                     │
│  ┌─────────────────────────┐        │
│  │ Me sinto muito cansado  │        │ ← Mensagem do usuário
│  │ ultimamente             │        │   (alinhada à esquerda)
│  └─────────────────────────┘        │
│                                     │
│                   ┌─────────────┐   │
│                   │ Entendo...  │   │
│                   │ Isso é      │   │
│                   │ comum entre │   │
│                   │ servidores. │   │
│                   └─────────────┘   │
│                                     │
│                   ✏️ Digitando...    │ ← Indicador de digitação
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Digite sua mensagem...          │ │ ← Input com placeholder
│ └─────────────────────────────────┘ │
│                                [↑] │ ← Botão enviar
└─────────────────────────────────────┘
```

**Mudanças:**
- ✅ Mensagens com bolhas claras
- ✅ Alinhamento diferente (IA à direita, usuário à esquerda)
- ✅ Indicador "digitando"
- ✅ Input destacado no rodapé
- ✅ Melhor espaçamento entre mensagens

---

### 5. **CHECKLISTS SCREEN**

#### Problemas Atuais
- Progress não é visível
- Questões não têm hierarquia clara
- Falta de feedback de progresso

#### Solução Proposta

```
┌─────────────────────────────────────┐
│ Questionários                       │ ← Header
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Seu Progresso: 2/5 completos   ││ ← Progress card
│  │ ████████░░░░░░░░░░░░░░░░░░░░░ ││
│  │ 40% concluído                  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ✅ Checklist #1                 ││ ← Completo
│  │ Avaliação de Desempenho        ││
│  │ Respondido em 20 de março      ││
│  │ [Ver Respostas]                ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ⏳ Checklist #2                 ││ ← Em progresso
│  │ Levantamento de Necessidades   ││
│  │ 3/8 questões respondidas       ││
│  │ [Continuar →]                  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ⭕ Checklist #3                 ││ ← Não iniciado
│  │ Pesquisa de Clima Organizacional││
│  │ Não iniciado                   ││
│  │ [Começar →]                    ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Mudanças:**
- ✅ Progress card no topo
- ✅ Status com ícones (✅ ⏳ ⭕)
- ✅ Informações claras por checklist
- ✅ CTAs contextuais (Ver, Continuar, Começar)
- ✅ Melhor hierarquia visual

---

### 6. **PROFILE SCREEN**

#### Problemas Atuais
- Muita informação em uma tela
- Botões de ação não se destacam
- Falta de seções claras

#### Solução Proposta

```
┌─────────────────────────────────────┐
│ Perfil                              │ ← Header
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │        [Avatar]                 ││ ← Avatar grande
│  │     João da Silva               ││
│  │  Servidor Público - SEDUC       ││
│  │    Prefeitura de São Paulo      ││
│  └─────────────────────────────────┘│
│                                     │
│  ─── INFORMAÇÕES PESSOAIS ───       │ ← Seção
│                                     │
│  Email: joao@email.gov.br           │ ← Informação
│  Telefone: (11) 98765-4321          │
│  Matrícula: 123456                  │
│                                     │
│  ─── SEGURANÇA ───                  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🔐 Alterar Senha                ││ ← Botão
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 📱 Autenticação Biométrica      ││
│  │ [Ativado]                       ││
│  └─────────────────────────────────┘│
│                                     │
│  ─── PREFERÊNCIAS ───               │
│                                     │
│  Tema: [Dark ▼]                     │
│  Notificações: [Ativado]            │
│  Idioma: Português Brasileiro       │
│                                     │
│  ─── AÇÕES ───                      │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ [Sair da Conta]                 ││ ← Botão destrutivo
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Mudanças:**
- ✅ Avatar maior e mais visível
- ✅ Seções claramente separadas
- ✅ Informações organizadas
- ✅ Botões de ação destacados
- ✅ Botão de logout no final (padrão)

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### Stack Recomendado (React Native + Expo)

| Camada | Tecnologia | Versão | Motivo |
|--------|-----------|--------|--------|
| **Framework** | React Native | 0.81+ | Nativo para iOS/Android |
| **Build** | Expo | 54+ | Simplifica build e deployment |
| **Styling** | NativeWind + Tailwind | 4.x | Utility-first, consistente |
| **Animações** | Reanimated | 4.x | ✅ Já implementado |
| **Ícones** | Heroicons + Feather | Latest | Consistência visual |
| **Formulários** | React Hook Form | 7.x | Validação eficiente |
| **Estado** | Zustand | 4.x | Leve e performático |
| **Async Storage** | AsyncStorage | 1.x | Persistência local |
| **Backend** | Firebase | Latest | ✅ Já integrado |
| **UI Components** | Custom + Radix Primitives | - | Controle total |

---

### Componentes React Native Essenciais

```typescript
// 1. Input com validação visual
<TextInput
  style={[
    styles.input,
    {
      borderColor: error ? colors.error : colors.border,
      borderWidth: error ? 2 : 1,
    }
  ]}
  placeholder="Digite aqui..."
  placeholderTextColor={colors.muted}
/>
{error && <Text style={styles.errorText}>{error}</Text>}

// 2. Button com feedback
<Pressable
  onPress={handlePress}
  style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
  ]}
>
  <Text style={styles.buttonText}>Enviar</Text>
</Pressable>

// 3. Card com sombra
<View
  style={{
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  }}
>
  {children}
</View>

// 4. Modal com backdrop
<Modal
  transparent
  animationType="slide"
  visible={isVisible}
>
  <Pressable
    style={styles.backdrop}
    onPress={onClose}
  />
  <Animated.View style={[styles.modal, animatedStyle]}>
    {children}
  </Animated.View>
</Modal>
```

---

### Boas Práticas para APK

#### 1. **Responsividade**
```typescript
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375; // iPhone SE
const isLargeScreen = width > 430;  // Samsung Galaxy S21

// Ajustar tamanhos dinamicamente
const fontSize = isSmallScreen ? 14 : 16;
const padding = isSmallScreen ? 12 : 16;
```

#### 2. **Safe Area**
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top }}>
  {/* Conteúdo seguro */}
</View>
```

#### 3. **Performance**
```typescript
// ✅ Use FlatList para listas
<FlatList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>

// ❌ Evite ScrollView com .map()
<ScrollView>
  {items.map(item => <Item key={item.id} item={item} />)}
</ScrollView>
```

#### 4. **Temas (Light/Dark)**
```typescript
// theme-provider.tsx
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Usar em qualquer componente
const colors = useColors(); // Automático baseado em isDark
```

---

## ✅ CHECKLIST DE RESPONSIVIDADE PARA APK

### Testes em Diferentes Tamanhos

- [ ] **iPhone SE (375px)** - Menor tela
- [ ] **iPhone 14 (390px)** - Padrão
- [ ] **iPhone 14 Pro Max (430px)** - Maior
- [ ] **Samsung Galaxy A12 (360px)** - Android pequeno
- [ ] **Samsung Galaxy S21 (360px)** - Android padrão
- [ ] **Samsung Galaxy Tab (600px+)** - Tablet

### Verificações

- [ ] Texto não é cortado
- [ ] Botões são tappable (min 44x44px)
- [ ] Espaçamento é consistente
- [ ] Imagens não ficam distorcidas
- [ ] Modais cabem na tela
- [ ] Teclado não cobre inputs
- [ ] Notch/Safe area respeitados
- [ ] Animações são suaves (60fps)
- [ ] Cores legíveis em ambos os temas
- [ ] Touch feedback funciona

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### Fase 1: Cores & Tipografia (1-2 dias)
- [ ] Atualizar `theme.config.js` com novas paletas
- [ ] Criar `theme-dark.ts` e `theme-light.ts`
- [ ] Implementar toggle de tema
- [ ] Testar contraste em ambos os temas

### Fase 2: Redesign de Telas (3-5 dias)
- [ ] Home Screen
- [ ] DDE Screen
- [ ] Reports Screen
- [ ] PSI Chat Screen
- [ ] Checklists Screen
- [ ] Profile Screen

### Fase 3: Componentes Reutilizáveis (2-3 dias)
- [ ] Input com validação
- [ ] Button com estados
- [ ] Card com variações
- [ ] Modal com animação
- [ ] Filter/Dropdown
- [ ] Progress Bar

### Fase 4: Testes & Otimização (2-3 dias)
- [ ] Testes em diferentes telas
- [ ] Performance profiling
- [ ] Acessibilidade (WCAG 2.1)
- [ ] Build APK final

---

## 📱 COMANDOS ÚTEIS

```bash
# Gerar APK para Android
eas build --platform android --local

# Testar em Expo Go
expo start --tunnel

# Verificar performance
npx react-native log-android

# Lint & Format
pnpm lint
pnpm format

# Testes unitários
pnpm test
```

---

## 🎯 CONCLUSÃO

O PSI-Gov Connect tem uma **base sólida**, mas precisa de:

1. **Paleta de cores refinada** (Deep Ocean + Calm Light)
2. **Hierarquia visual clara** (tamanhos, pesos, contraste)
3. **Navegação intuitiva** (indicadores visuais, feedback)
4. **Componentes consistentes** (spacing, tipografia, ícones)
5. **Testes em múltiplos dispositivos** (antes de publicar APK)

Com essas melhorias, o app será **profissional, acessível e confiável** — exatamente o que um servidor público precisa para lidar com questões sensíveis como saúde mental e denúncias.

---

**Próximo Passo:** Implementar as mudanças de cor e redesign das telas em ordem de prioridade.
