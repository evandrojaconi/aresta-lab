# Aresta Lab V2 — implementação da referência do Google Drive

**Fonte de referência:** pasta `[LANDING]` — https://drive.google.com/drive/folders/1pDcOjL-mN1NvBP4tpFq8zWZHnFzbuUKs

**Data dos arquivos do Drive:** 31/08/2026. O protótipo visual é histórico; não prova o estado atual do app.

## Regra de preservação

- `/aresta-lab/oficial/` é a cópia fiel do site público oficial, construída a cada deploy a partir de `aresta-climb/arestaclimb.com` (`main`).
- `/aresta-lab/v2/` reaproveita o build oficial para páginas institucionais, Editor e assets, mas a **homepage usa o HTML, CSS e JS do protótipo Drive** como base de redesign.
- `/aresta-lab/v2/blog/` contém o Diário de Rocha editorial com três artigos piloto.
- `https://arestaclimb.com/croquis` é um catálogo servido separadamente por Cloudflare Worker e continua apontando para a produção real. O laboratório não copia banco, API ou croquis privados.
- **Não há commit nem deploy no repositório de produção.**

## Conteúdo e interações da V2

| Item | Estado |
| --- | --- |
| Layout claro, papel, laranja, Epilogue/Inter/Roboto Mono | Implementado na prévia |
| Logo original do protótipo Drive | Copiado para a prévia |
| Hero, celular ilustrativo, jornada, autoria, transparência | Implementados na prévia |
| Celular ilustrativo com etapas clicáveis e navegação por teclado | Demonstração interativa, não conteúdo real das vias |
| Catálogo web, app e Editor | Links para ambientes existentes |
| Menu mobile e navegação entre seções | Implementado na prévia |
| Formulário com cinco caminhos e campos condicionais | Abre um `mailto:` — **não há backend de CRM** |
| Blog com três artigos, pesquisa, filtros e compartilhamento | Implementado na prévia |
| Estatísticas de croquis de agosto/2026 | Identificadas como **históricas** |
| Analytics, Search Console e indexação da V2 | Não implementados nesta prévia `noindex` |
| CMS, publicação de posts, painel editorial | Planejado, sem implementação |

## Arquivos versionados

- `lab-v2/drive-reference/index.html`, `styles.css`, `script.js`, `brand/aresta-logo.png` — cópias da referência original, sem edição.
- `lab-v2/drive-enhancements.css`, `drive-enhancements.js` — adaptações de interface e interações.
- `scripts/build-v2.mjs` — monta a versão híbrida, isolada, de homologação.
- `scripts/verify-drive-v2.mjs` — QA automático de rotas, arquivos, formulário e seções.
- `lab-v2/posts.json` — três textos editoriais piloto.

## Como verificar

1. Acesse [V2](https://evandrojaconi.github.io/aresta-lab/v2/).
2. Teste menu desktop/mobile, botões `Croquis` e `Baixar app`, e a demonstração clicável no celular.
3. Abra [Diário de Rocha](https://evandrojaconi.github.io/aresta-lab/v2/blog/), pesquise `offline`, filtre por `Território` e abra os três artigos.
4. Escolha `Quero revisar um croqui` no formulário, confira os campos contextuais e **não trate o rascunho de e-mail como contato enviado**.
5. Compare com o [espelho fiel](https://evandrojaconi.github.io/aresta-lab/oficial/).

## Passagem ao domínio oficial

Após aprovação visual e editorial, Renato e a equipe técnica devem portar as alterações necessárias **para o repositório oficial**, em branch revisada, mantendo arquitetura Vite, rotas, assets, catálogo Worker, URLs canônicas e medição da produção. Blog de produção exigirá URLs canônicas, sitemap, autoria editorial, revisão de conteúdo e processo de atualização antes de indexação.

**Definição de concluído no Lab:** build + QA aprovados, conteúdo navegável, interações funcionando e domínio oficial inalterado.
