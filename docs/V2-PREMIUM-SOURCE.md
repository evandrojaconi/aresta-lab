# Aresta Lab V2 — fonte premium aprovada pelo usuário para homologação

## Fonte visual correta

**Arquivo:** \`aresta-climb-home-premium-conteudo-oficial-LEVE(2).html\`, enviado em 19/11/2026.

**Cópia original:** \`lab-v2/premium/source.html\`, preservada byte a byte em formato HTML UTF-8 com imagens WebP incorporadas. Os estilos CSS e scripts de alternância de tema já estão dentro do arquivo.

**Decisão:** esta é a fonte visual da V2. As referências de 31/08/2026 em \`lab-v2/drive-reference/\` e os documentos \`V2-DRIVE-IMPLEMENTACAO.md\` e \`V2-DIRECAO-CRIATIVA.md\` registram iterações anteriores; **não representam a implementação atual**.

## O que foi preservado sem redesenhar

- Hero original com fotografia de escalada e “Menos caça à informação. Mais tempo na parede.”
- Imagens e telas reais do app, do Editor e da comunidade, diretamente embutidas no arquivo.
- Layout, paleta, tipografia, grids e alternância entre temas claro e escuro.
- Seções de croquis, aplicativo, offline, cobertura, governança de autoria, Editor, código aberto, comunidade, FAQ e download.
- URLs das lojas e referências aos repositórios citados no material premium. A existência de referências e links não prova funcionamento atual de cada integração.

## Extensões específicas do Lab

- \`noindex,nofollow\` na home de homologação.
- Links internos para \`/aresta-lab/v2/app/\` e \`/aresta-lab/v2/editor/\` (páginas derivadas do build oficial).
- Atalho do catálogo oficial \`https://arestaclimb.com/croquis\` — a rota usa Cloudflare Worker e não foi copiada para o Lab.
- Menu responsivo adicional (o menu desktop original se oculta abaixo de 1180px).
- Seção adicional **Diário de Rocha** usando a estética do HTML premium, com índice e três textos piloto, busca por palavra e filtros. Trata-se de conteúdo editorial de demonstração.
- \`design-source.json\` descreve origem e transformações efetuadas.

## Áreas e responsabilidades

| Área | Origem | Estado no Lab |
| --- | --- | --- |
| Home /v2/ | HTML premium enviado | HOMOLOGAÇÃO, conteúdo e imagens preservados |
| Páginas /v2/app/, /v2/editor/ etc. | Build de \`aresta-climb/arestaclimb.com\` | ESPELHO/ADAPTAÇÃO ESTÁTICA |
| /v2/blog/ | Três textos piloto do Lab | DEMONSTRAÇÃO SEM CMS |
| /croquis | Cloudflare Worker + D1 no domínio oficial | LINK EXTERNO, sem espelho local |
| Produção arestaclimb.com | Repositório oficial | NÃO ALTERADA |

## Testes

O CI executa \`node scripts/build-v2.mjs\` e \`node scripts/verify-premium-v2.mjs\`, conferindo presença do HTML premium original, texto do hero, imagens WebP embutidas, capturas do Editor, seções, tema, rotas e blog. O teste estático não substitui revisão manual visual e de acessibilidade.

**Objetivo da próxima revisão:** abrir \`https://evandrojaconi.github.io/aresta-lab/v2/\`, conferir desktop/mobile e aprovar os detalhes para posterior PR técnico ao repositório oficial. Só depois avaliar publicação em produção, SEO real, analytics e governança editorial.
