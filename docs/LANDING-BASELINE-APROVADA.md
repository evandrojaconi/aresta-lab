# ARESTA CLIMB — Landing oficial de referência (Aresta Lab)

**Decisão:** APROVADA PELO RESPONSÁVEL PELO PROJETO EM 23/11/2026.

**Versão de referência:** V3.1 · App First + Diário de Rocha + fotografia real de rocha.

**Ambiente aprovado:** [Aresta Lab /v2/](https://evandrojaconi.github.io/aresta-lab/v2/).

**Repositório:** `evandrojaconi/aresta-lab`.

**Commit exato de aprovação:** `e9ec881a1dd97e673ff85364b64187fbf3ce59ab`.

**Cópia de segurança da versão aprovada:** [branch `baseline/landing-v3.1-aprovada-2026-11-23`](https://github.com/evandrojaconi/aresta-lab/tree/baseline/landing-v3.1-aprovada-2026-11-23). Não atualizar a branch de baseline em futuras alterações: é o ponto estável para comparar ou restaurar.

## POR QUÊ
O responsável aprovou a V3.1 como direção visual e editorial a preservar nas próximas iterações. Não reabrir decisões de layout ou proposta de valor sem necessidade documentada.

## PARA QUÊ
Garantir uma única fonte de referência sobre a experiência escolhida; permitir mudanças pontuais com comparação clara entre estado aprovado, novo experimento e publicação.

## O QUE ESTÁ APROVADO

- **Aplicativo primeiro:** apresentação de um app de escalada e croquis para quem escala; promessa clara e download destacado.
- **Fotografias reais:** imagem original de rocha da landing premium, recortada e com overlays que preservam o contraste.
- **Telas reais do produto:** três celulares na primeira dobra e fotos de interface nas seções, sem mockups inventados.
- **Recursos essenciais:** explorar picos, croquis interativos, offline e comunidade.
- **Descoberta progressiva:** quem quer aprofundar encontra Editor, autoria, tecnologia, projeto e Diário de Rocha sem disputar a primeira dobra.
- **Blog integrado:** artigo publicado da Lapinha incluído dinamicamente; navegação consistente para o Diário.
- **Navegação:** menu desktop/mobile proporcional, CTA para baixar, cabeçalho que desaparece na descida e reaparece na subida.
- **Versão premium anterior preservada:** `/v2/visao/`.
- **Croquis Web:** conteúdo real servido pelo catálogo oficial, com transição explicitamente informada quando o usuário sai do laboratório.

## COMO TRABALHAR A PARTIR DE AGORA

1. **Base de trabalho:** a branch `main` continua sendo a fonte editável da landing aprovada. Os arquivos-fonte da entrada principal estão em `lab-v2/app-first/`, com composição do build em `scripts/build-app-first.mjs` e testes em `scripts/verify-app-first.mjs`.
2. **Mudanças pontuais:** criar branch a partir de `main`, implementar somente o escopo solicitado, fazer PR, conferir o resultado em mobile/desktop e passar os testes.
3. **Preservação:** não modificar a branch de baseline, não perder a V2 premium nem o Diário e não alterar `/oficial/`, CRM, app ou banco para editar a landing.
4. **Critério de concluído:** código revisado, rotas internas e externas verificadas, assets reais, testes de build/QA aprovados e deploy do GitHub Pages concluído.
5. **Decisões futuras:** registrar o que mudou, por quê, evidência utilizada, risco, resultado e nova versão. Cada futura versão aprovada poderá gerar nova baseline sem sobrescrever a atual.

## CLASSIFICAÇÃO / CUIDADOS

- **APROVADO:** identidade, direção visual e estrutura da landing V3.1 no ambiente Aresta Lab.
- **IMPLEMENTADO:** código, blog, fotos, rotas e publicação na URL de laboratório.
- **NÃO PUBLICADO EM PRODUÇÃO:** `arestaclimb.com` continua sendo mantido pela equipe. Esta aprovação é do **design de referência** e **não equivale a autorização para alterar DNS, deploy ou domínio oficial**.
- **INCERTO:** desempenho de aquisição e conversão da nova landing; medir após instrumentação e publicação de produção.

## RASTREABILIDADE

- [PR #32 — App First como home, blog e caminhos secundários](https://github.com/evandrojaconi/aresta-lab/pull/32)
- [PR #33 — fotografia real da rocha](https://github.com/evandrojaconi/aresta-lab/pull/33)
- [Deploy V3.1 aprovado](https://github.com/evandrojaconi/aresta-lab/actions/runs/45103870014)
- [Detalhes do fundo de rocha](V3-1-ROCHA-ORIGINAL.md)
- [Decisões de arquitetura da V3](V3-APP-FIRST-RELEASE-2026-11.md)
