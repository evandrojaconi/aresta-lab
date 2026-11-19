# Aresta Lab — estado técnico

Atualização: 2026-11-19

## Identidade

- **Aresta Lab:** ambiente de desenvolvimento e testes.
- **Aresta Climb:** produto e marca exibida na landing e no aplicativo.
- **Aresta Intelligence:** camada de conhecimento e rastreabilidade do projeto, separada do código desta landing.

## Implementado neste repositório

- Landing React / TanStack Start / TypeScript / Tailwind CSS.
- Páginas de picos, guias, comunidade e FAQ.
- Links para o catálogo oficial `https://arestaclimb.com/croquis`, Editor e lojas.
- Geração estática para GitHub Pages, roteamento com subdiretório dinâmico.
- Metadados SEO e dados estruturados.
- GitHub Actions para validação, artefato de prévia e workflow de publicação.
- Prévia com marca Aresta Lab e instruções de retorno ao site oficial.
- Teste automático de páginas, links e caminho de assets.
- Noindex/robots.txt para impedir duplicação da versão de produção.

## Não implementado / dependências

- Não há backend de captação de leads neste repositório.
- Eventos data-event são apenas marcadores, não há prova de mensuração ativa.
- O formato dos deep links de croquis ainda requer validação com o app atual.
- Publicação no GitHub Pages: depende de o administrador habilitar Pages na configuração do GitHub; o conector não possui ação de administração de repositório.
- Renomeação do repositório: depende de Settings → General → Repository name.

## Critério de concluído

1. Builds normal e estático passam na main.
2. GitHub Pages publica a prévia em `https://evandrojaconi.github.io/aresta-lab/` após o nome ser alterado.
3. Homepage, picos, guias, comunidade e FAQ abrem diretamente e por links internos.
4. Links para lojas, `/croquis` e Editor funcionam sem duplicar conteúdo.
5. Renato valida a versão antes de qualquer alteração em `arestaclimb.com`.
