# Aresta Lab V2.7 — navegação, links e sistema visual

**Status:** implementado no laboratório, não publicado no domínio oficial. **Referência:** 21/11/2026.

## POR QUÊ
A landing premium e o Diário de Rocha tinham linguagem visual consistente, mas App, Editor, Comunidade, Contato e documentos institucionais ainda usavam cabeçalhos, botões e links herdados do espelho original. Isso gerava saídas involuntárias da V2 e jornadas fragmentadas.

## PARA QUÊ
Tornar a navegação da prévia contínua: descobrir o app, consultar a interface de croquis web, conhecer o Editor, participar da comunidade e ler o Diário — sem confundir protótipo visual com dados de produção.

## COMO (implementado)
- Gerador: `scripts/unify-v2-pages.mjs`, chamado ao fim de `scripts/build-v2.mjs`; não altera a fonte HTML premium nem `/oficial/`.
- Tokens e estilos compartilhados: `lab-v2/premium/shared-pages.css`.
- Interações de menu, tema e scroll: `lab-v2/premium/shared-pages.js`.
- Menu comum (exceto home, que conserva seu header): Aplicativo, Croquis, Editor, Comunidade, Diário de Rocha, Baixar App.
- Menu mobile, foco por teclado, Escape, clique externo e header que desaparece/reaparece ao rolar.
- CTAs de continuidade nas páginas App, Download, Editor (incluindo Beta), Comunidade, Contato, Diário e 404.
- Links internos gerados apontam para `/aresta-lab/v2/`; lojas, downloads e fontes externas permanecem externos.
- A home mantém sua arquitetura e aparência premium, alterando somente destinos internos.
- Página `/v2/croquis/` funciona como hub da jornada web/app/editor. Sua abertura do catálogo oficial é marcada como ação externa.

## ROTEAMENTO

| Destino | URL V2 | Verdade demonstrada |
| --- | --- | --- |
| Home | `/v2/` | Landing premium de homologação |
| Aplicativo | `/v2/app/` | Página de download; lojas oficiais externas |
| Croquis Web | `/v2/croquis/` | Hub de navegação; dados do catálogo permanecem em `arestaclimb.com/croquis` |
| Editor | `/v2/editor/` | Página do instalador; arquivos reais externos |
| Comunidade | `/v2/comunidade/` | Página de convite; WhatsApp externo |
| Diário | `/v2/blog/` | Blog e artigos internos |
| Contato | `/v2/contato/` | Canais e suporte |
| Legal | `/v2/termos-de-uso/`, `/v2/politica-de-privacidade/` etc. | Documentos espelhados sem mudanças jurídicas |
| Fonte oficial preservada | `/oficial/` | Espelho imutável; referência técnica |

## Limites e riscos
**IMPLEMENTADO:** navegação, CTAs, CSS compartilhado, página de integração, verificações estáticas.

**INCERTO:** percepção de consistência e conversão real dos usuários; dependem de observação, analytics e feedback.

**NÃO IMPLEMENTADO:** cópia dinâmica do catálogo de croquis no laboratório. O usuário recebe uma página de contexto e links explícitos para o serviço oficial; não se promete paridade funcional. O domínio `arestaclimb.com` não foi alterado.

## Verificação
- GitHub Actions: build, QA V2 e validação do espelho oficial.
- Auditoria do artefato V2: 32 HTML, 723 referências internas existentes, zero destinos internos ausentes; duas saídas ao catálogo oficial, ambas explicitamente rotuladas.
- Amostra visual em Chromium 390/1440 px: cabeçalho 54/56 px, sem overflow; dropdown mobile abre dentro do viewport e o JS não apresentou erros.
- Testar novamente no celular real (iOS e Android) antes de publicar em produção.

## Próximo critério
Considerar a experiência pronta para envio ao domínio apenas quando os links externos corretos, menu mobile, tema, rolagem e CTAs estiverem testados em dispositivos reais e houver aprovação do responsável pelo release.
