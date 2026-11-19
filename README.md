# ARESTA LAB

**Ambiente de produto, interfaces e experimentação do [Aresta Climb](https://arestaclimb.com/).**

Neste repositório desenvolvemos e testamos a **landing page navegável** e páginas de descoberta territorial do Aresta. O nome do laboratório não substitui a marca do aplicativo.

## Abrir a landing

Após ativar GitHub Pages, a prévia ficará em:

**https://evandrojaconi.github.io/aresta-lab/**

O caminho é calculado pelo nome do repositório. Antes de renomear, a URL usa o slug atual do GitHub.

> A publicação do GitHub Pages precisa ser habilitada em **Settings → Pages → Source: GitHub Actions**. A implantação não altera o domínio oficial.

## Prévia do site oficial: espelho automático

Aresta Lab contém duas experiências separadas:

- **Laboratório (protótipo React):** https://evandrojaconi.github.io/aresta-lab/
- **Espelho da landing oficial (Vite original):** https://evandrojaconi.github.io/aresta-lab/oficial/

O workflow de publicação baixa uma cópia **somente leitura** de [aresta-climb/arestaclimb.com](https://github.com/aresta-climb/arestaclimb.com) na branch main, compila e publica seu HTML/CSS/JS em /oficial/. Não precisamos reconstruir a landing original em React nem duplicar seu repositório. Para atualizar o espelho, use Actions > Aresta Lab - Publicar previa > Run workflow.

A fonte oficial de croquis é um Worker separado e continua sendo [arestaclimb.com/croquis](https://arestaclimb.com/croquis). A cópia do Lab não altera o site de produção, não ativa telemetria real e traz a revisão exata do código usado em /oficial/source.json.

Veja [a documentação de homologação](docs/ESPELHO-SITE-OFICIAL.md).

## Proposta V2: mesma base oficial, visual territorial e blog

- **Versão oficial (espelho fiel):** https://evandrojaconi.github.io/aresta-lab/oficial/
- **Proposta V2 (reestilizada):** https://evandrojaconi.github.io/aresta-lab/v2/
- **Diário de Rocha (blog piloto):** https://evandrojaconi.github.io/aresta-lab/v2/blog/

A V2 preserva páginas e assets do build oficial, mas agora usa o **HTML, CSS, JavaScript e logo da landing histórica do Google Drive (31/08/2026)** como base visual da homepage. Integra catálogo, aplicativo, Editor, formulário contextual de cinco jornadas e blog com pesquisa/filtros. Consulte [a implementação V2](docs/V2-DRIVE-IMPLEMENTACAO.md), `lab-v2/drive-reference/`, `lab-v2/drive-enhancements.css`, `lab-v2/posts.json` e `scripts/build-v2.mjs`.

Não substitui /croquis (Cloudflare Worker), não altera a produção, não envia telemetria e usa `noindex` por ser ambiente de avaliação. Dados exibidos na landing de produção continuam sujeitos a validação de data e qualidade antes da futura publicação. Os três textos do blog são **rascunhos editoriais para discussão**, não notícias validadas.

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
