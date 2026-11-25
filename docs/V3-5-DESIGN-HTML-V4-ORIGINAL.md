# ARESTA LAB V3.5 — design V4 original, com identidade Aresta

**Fonte exata:** `ARESTA_V4_ABRIR_NO_NAVEGADOR.html`, fornecido pelo responsável, preservado integralmente em `lab-v2/reference-v4-original.html`. A copy de referência também foi documentada no `ARESTA_COPY_COMPLETA_E_STYLE_V4.pdf`.

## POR QUÊ
A V3.4 acrescentou os temas da V4 à home anterior, mas manteve a composição visual. A orientação era adotar **o mesmo design do HTML**. A V3.5 usa o próprio HTML (markup, CSS original, componentes e roteamento das páginas internas) como matriz da nova home, sem tentar recriar um visual semelhante.

## PARA QUÊ
Comunicar simultaneamente que:
- O **produto disponível** é um aplicativo de escalada e croquis, com consulta offline.
- A **comunidade** é protagonista e a autoria precisa ser preservada.
- O **território** é o centro da visão futura: conhecimento, conexão, oportunidades, pesquisa e impacto demonstrável.
- A **assinatura principal** é “Feito pela comunidade. Aberto para o mundo.”

## ALTERAÇÕES DE DESIGN
- Hero da V4 recuperado: **duas colunas** de texto e três telas reais, sobre fotografia de rocha real.
- Layout V4 genuíno: fontes Outfit e DM Sans, grids, timeline, seções claras/escuras, cards, painéis de contexto, fluxo territorial e páginas internas.
- Cores V4 substituídas pela identidade **Aresta V3.1**: coral, ferrugem, papel e tinta. Não usar verde-escuro corporativo da V4 como marca principal.
- Logotipo ilustrativo “⌁” substituído pelo símbolo de montanha do Aresta.
- Header mais fino e responsivo, com recolhimento na rolagem; menu vira gaveta abaixo de 960 px, evitando overflow no tablet.
- Principal argumento no hero: “Feito pela comunidade. Aberto para o mundo.” e categoria visível: “App de escalada · Croquis interativos · Offline”.
- Faixa anteriormente numérica mudou para **Croquis, Offline, Autoria e Aberto**. Dados sem fonte atual não são apresentados como comprovados.
- As páginas Manifesto, Impacto e Transparência compartilham o visual V4 em endereços reais; seis propostas de artigos permanecem claramente marcadas como **textos em revisão**, não como notícias publicadas.

## CAMINHOS
- **Nova home:** `/v2/`
- **Versão imediatamente anterior:** `/v2/anterior-v34/`
- **V3.4 App First preservada:** `/v2/app-first/`
- **V2 premium:** `/v2/visao/`
- **Páginas internas:** `/v2/manifesto/`, `/v2/impacto/`, `/v2/transparencia/`
- **Diário publicado:** `/v2/blog/` (separado de `/v2/propostas/`)

## QUALIDADE
O build exige o arquivo V4 de referência e preserva as rotas anteriores. O QA verifica estrutura do hero, slogan, fotos, fluxo territorial, rotas, cores e status editorial.

Inspeção visual local em 1440, 1024, 390 e 320 px: hero renderizado e screenshots reais carregados; identificamos overflow do menu em tablets e criamos breakpoint corretivo 721–960 px. Devem ser executados novamente testes automatizados e revisão final após o ajuste.

## LIMITES
- **NÃO ALTERADO:** domínio oficial `arestaclimb.com`, banco, app, Editor, CRM ou requisitos de infraestrutura.
- **FUTURO/INCERTO:** previsão contextualizada, monitoração ambiental, oportunidades econômicas e impacto territorial não são prometidos como funcionalidades entregues.
- O protótipo permanece `noindex` no Aresta Lab. A versão oficial aprovada de base V3.1 continua preservada na branch `baseline/landing-v3.1-aprovada-2026-11-23`.
