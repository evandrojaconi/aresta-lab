# Aresta Climb — Landing + SEO (GitHub)

Projeto React/TanStack Start, Vite, TypeScript e Tailwind CSS, hospedado e versionado no GitHub.

## Desenvolvimento

Instale Bun e execute:

```bash
bun install --frozen-lockfile
bun run dev
```

Acesse http://localhost:3000.

## Teste e publicação

- GitHub Actions executa build em pushes e PRs.
- O workflow `.github/workflows/github-pages.yml` compila as rotas estaticamente.
- URL de prévia **após deploy bem-sucedido**: https://evandrojaconi.github.io/aresta-climb-navegue-e-escalar/
- GitHub Pages em repositório **privado** exige plano do GitHub elegível. Não mude a visibilidade sem avaliar o conteúdo.

## Rotas

- `/` landing; `/picos`, `/picos/pedra-grande-igarape`, `/guias/*`, `/comunidade`, `/faq`.
- O catálogo https://arestaclimb.com/croquis e o Editor https://arestaclimb.com/editor continuam no domínio oficial, por links externos.

## Produção

Não implantar este projeto na raiz de arestaclimb.com sem que Renato valide as rotas já existentes e o contrato de integração. A landing não tem backend de captação. Atributos data-event são marcadores, não analytics funcionando.

## Encerrar o Lovable

O código passa a usar apenas plugins oficiais. Para interromper a sincronização: Lovable → Project settings → Git → GitHub → Disconnect. A remoção do projeto do Lovable é separada e deve ser feita na conta; **nunca exclua o repositório GitHub**.
