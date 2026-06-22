# ARESTA CLIMB — Landing + SEO hub

Implementação completa da landing institucional + base de arquitetura SEO para crescimento. Mantém a estética definida (preto/grafite + laranja #E95624, Orbitron/Montserrat, lógica Messy Middle) e foca a copy em **dor antes de produto**.

## 1. Design system (`src/styles.css`)

Tokens semânticos em oklch espelhando a paleta:
- `--background` #08090D, `--card` #12151A, `--muted` #0D0F13
- `--primary` #E95624 + `--primary-glow`, `--accent-sage` #879874, `--accent-steel` #4C5E71
- `--foreground` #F7F5F2, `--muted-foreground` #A6A6A6, `--border` rgba branco 12%
- Sombras e gradientes do hero como tokens (`--shadow-elegant`, `--gradient-hero`)
- `--font-display` (Orbitron via Google Fonts) + `--font-sans` (Montserrat)
- `--font-display` preparado para futura troca pela PIRULEN licenciada (comentário no CSS); **não** carregar PIRULEN do Google Fonts

Fontes carregadas via `<link>` em `__root.tsx` (preconnect + stylesheet), nunca `@import` URL em CSS.

## 2. Arquitetura de rotas

Criar agora (com conteúdo real, focado em SEO):
- `/` — landing principal
- `/picos` — hub índice de regiões/picos
- `/picos/pedra-grande-igarape` — primeira página SEO de pico (croqui, acesso, clima, setores, comunidade)
- `/guias/croqui-de-escalada` — conteúdo educativo
- `/guias/croqui-offline` — conteúdo de dor
- `/guias/onde-escalar-em-belo-horizonte` — descoberta topo de funil
- `/comunidade` — colaboração e curadoria
- `/faq` — FAQ indexável completo

Páginas listadas no sitemap como futuras (não criadas ainda, para não inflar entrega):
- `/picos/pedra-rachada`, `/picos/serra-do-cipo`, `/picos/ouro-preto`
- `/guias/equipamentos-de-escalada`, `/guias/sapatilha-de-escalada`
- `/sobre`

Cada rota com `head()` próprio (title, description, og:*, twitter:*, canonical absoluto `https://arestaclimb.com/<rota>`), H1 único, H2 semânticos.

## 3. Home `/` (estrutura)

`<header>` sticky com `<nav>` (links âncora reais: `#duvida`, `#como-resolve`, `#jornada`, `#comunidade`, `#testar`, `#faq`) + menu mobile acessível (`aria-expanded`, `aria-controls`).

`<main>`:
1. **Hero** — H1 `Menos incerteza. Mais parede.` + subheadline focada em dor. CTA primário "Quero testar" (link `#testar`), secundário "Ver como funciona" (`#como-resolve`). Card visual com mini-jornada (4 etapas).
2. **#duvida — "Antes do app, a dúvida"** (NOVA seção) — bloco com buscas reais como balões/cards: "Tem croqui desse pico?", "A rocha está seca?", "Onde estaciona?", "Qual setor é melhor para começar?", "O croqui está atualizado?", "Dá pra acessar offline?", "Tem sinal lá?". Fechamento: "O Aresta nasce para organizar essas respostas em um só lugar."
3. **O problema real** — 5 pain-cards numerados (informação espalhada).
4. **"O que o escalador procura antes de sair de casa"** — 5 cards SEO: Croqui do pico, Condição do tempo, Acesso e logística, Setores e níveis, Comunidade local. CTA "Ver como o Aresta organiza isso".
5. **#como-resolve** — 6 features (picos/setores, croquis offline, acesso, alertas, comunidade, boas práticas).
6. **#jornada — Da dúvida ao pico** — flow de 6 passos.
7. **"Picos que já fazem parte da conversa"** — 4 cards (Pedra Grande Igarapé MG, Pedra Rachada, Serra do Cipó, Ouro Preto) linkando para `/picos/...` (cards futuros podem apontar para `/picos` com âncora até existirem).
8. **Duas jornadas** — toggle escalador / organizador comunidade.
9. **#comunidade — Confiança** — 3 trust-cards.
10. **#testar — Formulário waitlist** — inputs `name`, `email`, `city`, `whatsapp`, `climbing_spot`. `data-event="waitlist_submit"`, `data-source="landing_home"`, `data-project="aresta_climb"`. Validação client-side, estado de sucesso local com a mensagem combinada. Sem backend.
11. **#faq** — accordion shadcn com 6 perguntas SEO (onde encontrar croqui, croqui offline, rocha boa, onde escalar perto de BH, substitui curso, comunidade atualiza).

`<footer>` com marca, tagline, links de seção e voltar ao topo.

## 4. SEO técnico

**Head em cada rota** (via `createFileRoute.head()`):
- Title estratégico por página (≤60 chars). Home: `Aresta Climb | Croquis e guias de escalada offline`
- Meta description (140–160). Home: descrição combinada
- Canonical **absoluto** (`https://arestaclimb.com/...`) no leaf via `links`
- OG completo: `og:type`, `og:locale=pt_BR`, `og:site_name=Aresta Climb`, `og:title`, `og:description`, `og:url` absoluto, `og:image=https://arestaclimb.com/og-image.jpg`
- Twitter: `summary_large_image`, title/description/image
- Robots: `index, follow, max-image-preview:large`

**`__root.tsx`**:
- `<html lang="pt-BR">`
- Meta charset, viewport, theme-color #E95624
- Fonts via `<link>` preconnect + Google Fonts
- JSON-LD globais: `WebSite` (com `potentialAction` SearchAction futura), `Organization`
- **Não** colocar `og:image`, canonical ou title específico no root

**JSON-LD por página**:
- Home: `WebSite` + `Organization` (no root) + `SoftwareApplication` (em fase de testes, sem rating/price/availability falsos) + `FAQPage`
- `/faq`: `FAQPage` completo
- Páginas de pico: `Place` + `BreadcrumbList`
- Guias: `Article` + `BreadcrumbList`

**`public/robots.txt`** (substituir/criar):
```
User-agent: *
Allow: /

Sitemap: https://arestaclimb.com/sitemap.xml
```

**`src/routes/sitemap[.]xml.ts`** — server route dinâmica com `BASE_URL = "https://arestaclimb.com"` e entries para todas as rotas atuais + planejadas (changefreq/priority adequados).

**`public/og-image.jpg`** — gerar fallback 1200×630 com a identidade visual (preto + laranja, logo + tagline "Menos incerteza. Mais parede.") via imagegen.

## 5. Componentes

Em `src/components/landing/`:
- `Nav.tsx` (menu mobile acessível com `aria-expanded`/`aria-controls`)
- `Hero.tsx`, `SearchQuestions.tsx` (seção "Antes do app, a dúvida"), `PainGrid.tsx`, `SearchIntent.tsx` (5 cards SEO), `Solution.tsx`, `Flow.tsx`, `PicosPreview.tsx`, `AudienceTabs.tsx`, `Trust.tsx`, `WaitlistForm.tsx`, `Faq.tsx`, `Footer.tsx`
- `PicoPageLayout.tsx` reutilizável para `/picos/[slug]` + `GuiaLayout.tsx` para guias

Reuso shadcn: Button (variants alinhados ao design), Accordion (FAQ), Input/Textarea/Label. Zero hex hardcoded — só tokens semânticos.

## 6. Acessibilidade

- Único `<h1>` por rota; H2/H3 semânticos
- `<main>` único por rota dentro do root
- Ícones decorativos com `aria-hidden="true"`
- Botões icon-only com `aria-label`
- Foco visível (`focus-visible:ring`) em todos interativos
- Labels reais nos inputs (não placeholder-as-label)
- Tap targets ≥44×44 no mobile
- Contraste via tokens (foreground/muted-foreground sobre background/card)
- Mobile-first: layout testado em 375px primeiro

## 7. Performance

- Sem libs animação pesadas (apenas tailwindcss-animate já no projeto)
- Transições CSS leves; sem framer-motion
- Imagens (quando houver) com `loading="lazy"` fora do hero, `width`/`height`, `alt` descritivo
- Sem JS desnecessário — componentes funcionais leves
- Apenas Orbitron weights 600/700 e Montserrat 400/600/700/800

## 8. Copy — diretrizes aplicadas

- Sempre "dor antes do produto"
- Banidos: "baixe o melhor app", "plataforma definitiva", "comece grátis agora"
- CTAs: "Quero testar", "Ver como funciona", "Entrar na lista", "Entender a jornada"
- Marcas de terceiros (La Sportiva etc.) **não** aparecem nesta entrega — só serão usadas editorialmente em `/guias/sapatilha-de-escalada` futuro
- Palavras-chave integradas naturalmente nos textos das seções e FAQ, sem stuffing

## Fora desta entrega

- Integração do formulário com CRM (estado local + mensagem)
- Páginas `/picos/pedra-rachada`, `/serra-do-cipo`, `/ouro-preto`, `/sobre`, `/guias/equipamentos-*`, `/guias/sapatilha-*` — só entram no sitemap como futuras
- Google Analytics / Search Console (estrutura pronta, chaves a adicionar depois)
- Eventos analytics (apenas `data-event` attributes preparados no DOM)

Confirme para eu implementar.