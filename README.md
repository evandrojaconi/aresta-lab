# Aresta Climb — Landing navegável + SEO

Landing institucional em React 19 / TanStack Start / TypeScript / Tailwind CSS, com páginas de picos, guias, comunidade e FAQ.

## Executar

Requisitos: Node.js compatível com Vite 8 ou Bun.

~~~bash
bun install
bun run dev
~~~

Para verificar a compilação:

~~~bash
bun run build
~~~

## Navegação

- \`/\` — Landing, proposta de valor, jornada, perguntas frequentes e links de download.
- \`/picos\` — Índice de picos.
- \`/picos/pedra-grande-igarape\` — Página contextual da Pedra Grande.
- \`/guias/croqui-de-escalada\`, \`/guias/croqui-offline\`, \`/guias/onde-escalar-em-belo-horizonte\` — Guias SEO.
- \`/comunidade\`, \`/faq\` — Participação e perguntas.
- \`/sitemap.xml\` — Sitemap dinâmico.

O catálogo de croquis (\`https://arestaclimb.com/croquis\`) e o Editor (\`https://arestaclimb.com/editor\`) são **links externos para o domínio oficial**. Não duplicar essas rotas neste repositório nem implantar o projeto sobre elas sem planejar a coexistência com a aplicação atual.

## Fluxos

- Download Android: \`https://play.google.com/store/apps/details?id=app.escalada.croquis\`
- Download iOS: \`https://apps.apple.com/br/app/aresta-climb-guia-de-escalada/id6776467893\`
- A área antiga de formulário de espera foi removida: o formulário não tinha backend e exibia um sucesso fictício.
- Os atributos \`data-event\` nos links são pontos de instrumentação previstos; **não** enviam eventos automaticamente.

## Deploy e integração oficial

O projeto é TanStack Start com renderização no servidor (Nitro). Não presumir que pode ser enviado como HTML estático puro. Para integrar à produção, validar com Renato hospedagem, rewrites, rotas já existentes e URLs canônicas. A integração com \`/croquis\` deve preservar o catálogo atual, incluindo deep links que já existam no aplicativo.

## Nota editorial e técnica

Não usar métricas fixas de cobertura sem validar a base do produto; não anunciar recursos em planejamento como implementados. A página da Pedra Grande é contexto editorial, não substituto do croqui validado no app. Conferir comportamento no mobile, cabeçalhos HTTP, SEO SSR e navegação real antes da publicação no domínio.

Este repositório está vinculado ao Lovable; não reescrever o histórico já publicado. 
