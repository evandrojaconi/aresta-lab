# Como contribuir com o Aresta Lab

O **Aresta Lab** é o ambiente de desenvolvimento e testes. A marca do produto público continua **Aresta Climb**.

## Regras de colaboração

1. Abra uma branch com nome descritivo (`feat/*`, `fix/*`, `docs/*`).
2. Antes de propor a integração, execute `bun install --frozen-lockfile` e `bun run build`.
3. Abra um pull request com descrição do problema, prints quando houver UI e passos para testar.
4. Não modifique `arestaclimb.com` nem as rotas `/croquis` e `/editor` sem alinhamento com a equipe do produto.
5. Não anuncie funcionalidades planejadas como implementadas nem use dados territoriais sensíveis sem autorização de publicação.
6. Não inclua chaves, credenciais, dados pessoais ou cadastros reais no repositório público.

## SEO e evidências

O catálogo oficial de croquis é a fonte de conteúdo do produto, enquanto esta landing explica e encaminha a jornada. Números e funcionalidades publicados precisam de fonte e data de verificação.

## Deploy

O GitHub Actions testa as páginas em cada PR. A publicação no GitHub Pages depende de ativação no painel **Settings → Pages → Build and deployment → GitHub Actions**.

O projeto usa o nome real do repositório para montar as URLs no GitHub Pages. Ao renomear o repositório, o caminho se adapta automaticamente no próximo build.
