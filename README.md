# ARESTA LAB

**Ambiente de produto, interfaces e experimentação do [Aresta Climb](https://arestaclimb.com/).**

Neste repositório desenvolvemos e testamos a **landing page navegável** e páginas de descoberta territorial do Aresta. O nome do laboratório não substitui a marca do aplicativo.

## Abrir a landing

Após ativar GitHub Pages, a prévia ficará em:

**https://evandrojaconi.github.io/aresta-lab/**

O caminho é calculado pelo nome do repositório. Antes de renomear, a URL usa o slug atual do GitHub.

> A publicação do GitHub Pages precisa ser habilitada em **Settings → Pages → Source: GitHub Actions**. A implantação não altera o domínio oficial.

## O que é navegável

| Área | Rota |
| --- | --- |
| Landing Aresta Climb | `/` |
| Explorar picos | `/picos` |
| Pedra Grande | `/picos/pedra-grande-igarape` |
| Guia: croqui de escalada | `/guias/croqui-de-escalada` |
| Guia: croqui offline | `/guias/croqui-offline` |
| Onde escalar perto de BH | `/guias/onde-escalar-em-belo-horizonte` |
| Comunidade | `/comunidade` |
| Dúvidas | `/faq` |

O **[catálogo oficial de croquis](https://arestaclimb.com/croquis)** e o **[Editor](https://arestaclimb.com/editor)** são externos. Seus endereços e APIs pertencem ao produto, não à landing experimental.

## Desenvolvimento local

Requisitos: Bun.

```bash
bun install --frozen-lockfile
bun run dev
```

Abra http://localhost:3000.

```bash
bun run build
GITHUB_PAGES=true GITHUB_REPOSITORY=evandrojaconi/aresta-lab bun run build
GITHUB_REPOSITORY=evandrojaconi/aresta-lab node scripts/verify-static.mjs
```

## Automação

- **Aresta Lab - QA da previa estatica:** compila, confere HTML, rotas e links, e disponibiliza um arquivo ZIP nos artefatos do Actions.
- **Aresta Lab - Publicar previa:** envia o site ao GitHub Pages depois que Pages estiver habilitado.
- **Landing build check:** verifica o build padrão de desenvolvimento.

As prévias usam `noindex` e `robots.txt` bloqueado para não concorrer com o site oficial. Não representar este ambiente como produção.

## Governança

- Código, CI e testes: **GitHub**.
- Produto público e croquis: **Aresta Climb**.
- Documentação estratégica e evidências: **Aresta Intelligence**.
- Publicação em `arestaclimb.com`: validação e implantação da equipe técnica.

Confira [CONTRIBUTING.md](CONTRIBUTING.md) e [docs/ARESTA-LAB-ESTADO.md](docs/ARESTA-LAB-ESTADO.md).

**Não publicar no domínio principal sem preservar `/croquis`, `/editor` e demais jornadas existentes.**
