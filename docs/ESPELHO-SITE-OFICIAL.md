# Espelho do site oficial no Aresta Lab

Fonte primária: [aresta-climb/arestaclimb.com](https://github.com/aresta-climb/arestaclimb.com), branch main.

## Para quê

Comparar a landing oficial com ideias de UX, branding e growth dentro do laboratório antes de propor qualquer alteração ao domínio principal.

## Como funciona

O GitHub Actions faz checkout do repositório público oficial em uma pasta temporária, remove telemetria e integração com Sentry **somente na cópia de homologação**, compila com Vite e coloca os arquivos estáticos em /aresta-lab/oficial/. O código da produção permanece intacto. O laboratório React continua na raiz do Pages.

A origem exata e a data da cópia estão em /aresta-lab/oficial/source.json.

## Atualizar

Abra GitHub Actions > Aresta Lab - Publicar previa > Run workflow na main. Cada execução obtém a versão mais recente da branch main oficial.

## Limitações

- /croquis é um Cloudflare Worker + D1 e não faz parte deste repositório Vite; links correspondentes apontam para a produção real. Não há espelho de API, backend ou dados dinâmicos.
- Links das lojas de aplicativos continuam externos.
- Páginas do Lab possuem noindex e robots.txt que bloqueia indexação; a prévia não deve concorrer com o domínio oficial.
- Builds de homologação não enviam eventos ao Umami nem ao Sentry de produção.
- Algumas rotas e integrações Cloudflare exigem ambiente oficial; não representam comportamento completo na homologação.
- A cópia estática é gerada como artefato de publicação, não incorporada ao código-fonte do Lab.

## Governança

Qualquer nova interface ou alteração editorial deve ser testada no laboratório e, após aprovação, encaminhada à equipe técnica para integração ao repositório oficial. Não modificar arestaclimb.com automaticamente.
