# Cortex Design System

**Versão:** 1.0.0
**Criado:** 2026-05-25
**Projeto:** Elexia Cortex — Enterprise Data Intelligence Platform

---

## Filosofia: "Precision Dark"

O Cortex Design System foi construído em torno de um princípio único: **interfaces que comunicam confiança antes de qualquer palavra**. Plataformas enterprise que processam dados de empresas bilionárias não podem parecer startups. Devem parecer infraestrutura.

**Três princípios:**

1. **Sobriedade como luxo.** Menos cor, mais hierarquia. O fundo quase-preto não é um tema — é uma declaração de que os dados são o protagonista, não a UI.
2. **Precisão tipográfica.** Cada tamanho de fonte tem exatamente um papel. Nunca dois elementos competem pela mesma atenção.
3. **Densidade com respiro.** Dashboards enterprise precisam mostrar muita informação. O sistema usa espaçamento generoso para que densidade nunca vire caos.

---

## Accent Color: Emerald

**Escolhido:** Emerald (`#10B981` / `#059669`)
**Rejeitado:** Violet

**Justificativa:** O Cortex lida com dados financeiros, compliance e crescimento de receita de empresas bilionárias. Emerald evoca três coisas que esse contexto exige: segurança (verde = OK, dados íntegros), crescimento (receita, LTV, churn reduzido) e saúde (health scores, sistema operacional). Violet é sofisticado mas remete a ferramentas de criatividade (Figma, Notion) — não a infraestrutura de dados enterprise. Emerald é a cor dos terminais Bloomberg. É a cor que CFOs associam a números no verde.

---

## Paleta de Cores

### Backgrounds e Surfaces

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg-base` | `#0A0A0C` | Background da aplicação (quase preto, levemente quente) |
| `--color-surface-1` | `#111114` | Sidebar, painéis principais |
| `--color-surface-2` | `#18181C` | Cards, modais, dropdowns |
| `--color-surface-3` | `#1E1E23` | Hover states, inputs em foco |
| `--color-surface-4` | `#26262B` | Elementos elevados, tooltips |

### Borders

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-border-subtle` | `#26262B` | Divisórias, bordas de card |
| `--color-border-default` | `#313138` | Inputs, elementos interativos |
| `--color-border-strong` | `#3F3F47` | Elementos em foco, selecionados |

### Texto

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-text-primary` | `#F4F4F5` | Títulos, labels principais |
| `--color-text-secondary` | `#A1A1AA` | Subtítulos, descrições |
| `--color-text-muted` | `#71717A` | Metadata, timestamps, helper text |
| `--color-text-disabled` | `#3F3F47` | Elementos desabilitados |
| `--color-text-inverse` | `#0A0A0C` | Texto sobre fundos claros |

### Accent — Emerald

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-accent-subtle` | `#052E16` | Background de badges "ativo", alertas positivos |
| `--color-accent-muted` | `#064E3B` | Hover em elementos com accent |
| `--color-accent-default` | `#059669` | Borders de elementos accent, ícones |
| `--color-accent-bright` | `#10B981` | CTAs primários, elementos interativos accent |
| `--color-accent-light` | `#6EE7B7` | Texto accent sobre fundos escuros |
| `--color-accent-glow` | `rgba(16,185,129,0.12)` | Glow sutil em foco, hover |

### Status Colors

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-status-success` | `#10B981` | Conectado, saudável, OK |
| `--color-status-success-bg` | `#052E16` | Background de badge success |
| `--color-status-warning` | `#F59E0B` | Atenção, risco médio |
| `--color-status-warning-bg` | `#1C1100` | Background de badge warning |
| `--color-status-danger` | `#EF4444` | Risco alto, erro, churn crítico |
| `--color-status-danger-bg` | `#1C0000` | Background de badge danger |
| `--color-status-info` | `#6366F1` | Informativo, em progresso |
| `--color-status-info-bg` | `#0F0F2E` | Background de badge info |
| `--color-status-neutral` | `#71717A` | Inativo, desconhecido |
| `--color-status-neutral-bg` | `#111114` | Background de badge neutral |

---

## Tipografia

**Font Family:** Inter (via Google Fonts / system-font fallback)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; /* OpenType features para numerais */
```

### Escala

| Token | Size | Weight | Line Height | Letter Spacing | Uso |
|-------|------|--------|-------------|----------------|-----|
| `--text-display` | 32px / 2rem | 700 | 1.2 | -0.025em | Títulos de página, hero numbers |
| `--text-title-lg` | 24px / 1.5rem | 600 | 1.3 | -0.02em | Títulos de seção principais |
| `--text-title-md` | 20px / 1.25rem | 600 | 1.35 | -0.015em | Títulos de card, headers |
| `--text-title-sm` | 16px / 1rem | 600 | 1.4 | -0.01em | Subtítulos, labels importantes |
| `--text-body-lg` | 15px / 0.9375rem | 400 | 1.6 | 0 | Texto de leitura principal |
| `--text-body-md` | 14px / 0.875rem | 400 | 1.57 | 0 | Texto padrão da interface |
| `--text-body-sm` | 13px / 0.8125rem | 400 | 1.54 | 0 | Texto secundário, descrições |
| `--text-label-md` | 12px / 0.75rem | 500 | 1.33 | 0.01em | Labels uppercase, badges |
| `--text-label-sm` | 11px / 0.6875rem | 500 | 1.27 | 0.02em | Metadata, timestamps |
| `--text-mono` | 13px / 0.8125rem | 400 | 1.5 | 0 | Hashes, IDs, código |

**Mono Font:** `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace`

---

## Espaçamento

Sistema baseado em múltiplos de 4px.

| Token | Value | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Micro gaps, ícone + label |
| `--space-2` | 8px | Padding interno pequeno |
| `--space-3` | 12px | Gap entre elementos relacionados |
| `--space-4` | 16px | Padding padrão de componentes |
| `--space-5` | 20px | Gap entre grupos de elementos |
| `--space-6` | 24px | Padding de cards, seções |
| `--space-8` | 32px | Separação entre blocos |
| `--space-10` | 40px | Margens de seção |
| `--space-12` | 48px | Espaçamento generoso de página |
| `--space-16` | 64px | Separação de grandes seções |

---

## Border Radius

| Token | Value | Uso |
|-------|-------|-----|
| `--radius-sm` | 4px | Badges, chips, inputs |
| `--radius-md` | 6px | Botões, dropdowns |
| `--radius-lg` | 8px | Cards, painéis |
| `--radius-xl` | 12px | Modais, tooltips grandes |
| `--radius-2xl` | 16px | Seções destacadas |
| `--radius-full` | 9999px | Avatares, pills |

---

## Sombras e Elevação

Sombras no Cortex são intencionalmente sutis — o contraste vem da diferença entre surfaces, não de sombras projetadas.

| Token | Value | Uso |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.4)` | Cards no base |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.5)` | Dropdowns, tooltips |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.6)` | Modais |
| `--shadow-accent` | `0 0 0 1px rgba(16,185,129,0.4), 0 0 12px rgba(16,185,129,0.08)` | Focus ring accent |
| `--shadow-inset` | `inset 0 1px 0 rgba(255,255,255,0.04)` | Superfícies elevadas — realce sutil |

---

## Componentes

### Button

**Variantes:**
- `primary` — fundo emerald, texto escuro. Para a ação mais importante da tela.
- `secondary` — fundo surface-2, borda border-default, texto primário. Para ações secundárias.
- `ghost` — sem fundo, texto secundário. Para ações terciárias, navegação.
- `danger` — fundo danger-bg, borda danger, texto danger. Para ações destrutivas.

**Tamanhos:** `sm` (28px h), `md` (36px h), `lg` (44px h)

### Card

Fundo `surface-2`, borda `border-subtle`, radius `lg`.
Hover: fundo `surface-3`, borda `border-default`. Transição 150ms.

### Badge

Variantes por status: `success`, `warning`, `danger`, `info`, `neutral`.
Sempre: texto uppercase `label-md`, padding `2px 8px`, radius `sm`.

### Input

Fundo `surface-2`, borda `border-default`, radius `md`.
Focus: borda `accent-default`, shadow `shadow-accent`.
Placeholder: `text-muted`.

---

## Iconografia

**Biblioteca:** Lucide React
**Estilo:** `strokeWidth={1.5}` — fino, refinado, nunca pesado
**Tamanhos padrão:** 14px (inline), 16px (padrão), 20px (navegação), 24px (destaque)
**Cor padrão:** `text-muted` para ícones decorativos, `text-secondary` para ícones funcionais
**Zero emojis** em qualquer elemento de UI

---

## Princípios de Composição

1. **Hierarquia por luminosidade.** Elementos mais importantes são mais claros (`text-primary`). Elementos de suporte são mais escuros (`text-muted`). Nunca inverter essa lógica.

2. **Accent com parcimônia.** O emerald aparece apenas em: CTAs primários, status "ativo/conectado", health scores altos, e accent bars em KPIs positivos. Nunca como cor de fundo de grandes áreas.

3. **Tabelas como infraestrutura.** Tabelas de dados são o coração da plataforma. Sempre: cabeçalho `text-muted` uppercase pequeno, linhas alternadas com `surface-2`/`bg-base`, hover `surface-3`, sem bordas verticais — apenas separadores horizontais sutis.
