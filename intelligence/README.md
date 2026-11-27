# ARESTA Intelligence V5 — Gestão aberta da escalada

**Entrega:** interface funcional demonstrativa, temas claro e escuro do aplicativo, Editor integrado, perfis de contribuição e gestão federativa. O Aresta Climb permanece a interface pública. Esta versão está versionada em aresta-lab/intelligence, no ambiente de laboratório, não está conectada ao backend de produção e não efetua pagamentos, autenticação real, filiações ou decisões oficiais.

## Rodar

- Extraia o ZIP e abra `index.html` num navegador. O estado local usa `localStorage` (`aresta-intelligence-v3`); a V2 permanece preservada. Use somente dados fictícios.
- Alternativa: com Python instalado, execute `python -m http.server 8080 --bind 127.0.0.1` nesta pasta e abra `http://127.0.0.1:8080`. Não exponha o servidor demonstrativo à internet com dados reais.
- Testes: `node tests.cjs` (Node 18+). Não requer dependências externas.

## Como demonstrar os painéis

1. Abra **Meu perfil** e selecione Escalador demonstração ou crie pseudônimo. O acesso a croquis e orientações não depende de login ou XP.
2. No **Editor**, crie um croqui, preencha critérios de qualidade e proponha rascunho ou publicação. As notas de 1.000/100/10 são do croqui; XP pessoal só vem após validação de entrega. O editor web reproduz parte do comportamento, não executa o motor Python oficial.
3. Entre em **Central de aprovações**. Há cinco filas: associações demonstrativas da Lapinha, Pedra Grande e Dr. Gravatá; FEMEMG; CBME. Os nomes e perfis de teste não indicam adesão ou mandato real.
4. Como representante local, protocole uma cooperação para a FEMEMG. Na fila estadual, selecione Revisor FEMEMG 1, informe justificativa e aprove. Confira em Decididos. O próprio autor não aprova; outra esfera não tem autorização para decidir na fila alheia.
5. Como representante FEMEMG, protocole uma diretriz para CBME. Entre como Revisor CBME 1 para analisar. Associações e curadores com escopo local também revisam croquis, contribuições, comunicados e solicitações de responsabilidade territorial. O apoio federativo é opcional; apenas mantenedores locais validados e representantes de associações do território podem encaminhar propostas diretamente à federação.
6. Na Rede, submeta OKR próprio com representante institucional; revise em Central de aprovações com outro representante da mesma entidade. Avance data simulada para fechar ciclos. O histórico permanece; saldo pessoal expira. Nenhuma pontuação equivale a dinheiro.
7. Em Impacto e auditoria, exporte JSON dos registros locais. Em Investimentos, simule lançamentos. O livro financeiro é demonstrativo, não um meio de movimentar recursos.

## Arquitetura e identidade

- `aresta_app/frontend/lib/theme/cores_app.dart`, commit `0ef1523be656f8dfa15abc414dbcb38e097b85e8`: Deep Basalt #161616, Cave Shadow #1F1F1F, Granite Edge #2A2A2A, Chalk White #F4F3ED, Brand #E25844, Dry Moss #7B8B6F. Logo aproximado do SVG original (não substitui o asset oficial).
- `aresta_db/openspec/specs/painel-nota-qualidade-croqui/spec.md`, commit `d86e4ed87be93f6697af1077908e1c9d444c9d44`: critérios do Editor, cobertura parcial, publicação condicionada aos essenciais, revisão e autoria. Preservar o motor original como fonte de verdade na integração.
- CBME → federações → associações; autonomia de curadores independentes; XP individual sem multiplicador de cargo, herança institucional 10/20/30% e OKR próprio, ciclos mensais/trimestrais/semestrais/anuais. Limites e marcos de progressão são hipóteses de produto para validar, não requisitos institucionais aprovados.
- Fila de decisões: protocolo, autor, entidade, território, evidência, status, revisor distinto, justificativa e data. Leitura pública na demo com dados fictícios. Em produção, evidências sensíveis e dados pessoais devem ser minimizados e protegidos.

## Publicação no GitHub (quando autorizado)

O destino indicado é `https://github.com/aresta-climb/aresta_intelligence`. A leitura de README, commits, branches e a tentativa de criar `feat/intelligence-governanca-v3` retornaram 404 com a conta conectada. O repositório oficial não foi alterado. Posteriormente, com autorização explícita do usuário, as versões V3, V4 e V5 foram publicadas no repositório pessoal `evandrojaconi/aresta-lab`, em `intelligence/`.

Em um clone autorizado do repositório oficial, crie uma branch a partir da branch padrão verificada, copie os arquivos desta pasta para `prototypes/intelligence-v3/` (preservando o conteúdo anterior), rode `node prototypes/intelligence-v3/tests.cjs`, revise e abra um pull request. Não substitua arquivos de produção antes de avaliar dependências e integração. Se desejar demonstração estática, publique apenas esta pasta pelo fluxo de Pages/hosting aprovado. O Pages não fornece autenticação, persistência compartilhada ou controle de acesso.

## Critérios de produção ainda pendentes

1. Confirmar repositórios e versões reais, reutilizar o Editor nativo e seu motor de qualidade por adaptador oficial (sem duplicar ArestaDB), conectar leitura de catálogo e envio/revisão via PR; publicação somente após aprovação e pipeline comprovados.
2. Login OTP/OAuth, perfis e vínculo institucional verificados, permissões por território e entidade aplicadas pelo servidor. Escaladores independentes devem conseguir colaborar sem vínculo. Nenhuma função representativa pode ser autodeclarada em produção.
3. Banco compartilhado com `profiles`, `memberships`, `role_grants`, `territories`, `organizations`, `contributions`, `reviews`, `institutional_cases`, `decisions`, `entity_okrs`, `cycles`, `cycle_closures`, `funding_contracts`, `ledger_entries`, `audit_events`; registros de origem, anfitrião e identificador único. Política pública de minimização de dados. A interface atual persiste apenas no navegador.
4. Decisão atômica e idempotente no servidor (escopo, revisor distinto, estado pendente, evidência, conflito de interesses), auditoria append-only, direito de recurso e retificação, limitação de abuso e acessibilidade. XP não substitui competência técnica, autorização local ou responsabilidade legal.
5. Financeiro segregado por contrato, dupla aprovação, conciliação e documentação jurídica. XP não é moeda e não garante retorno financeiro. As entidades e gestores precisam aprovar governança e adesão antes de uso oficial.

## QA

Testes Node de lógica: 12 telas (11 originais e Central de aprovações), nota parcial, publicação, revisão, XP, expiração, cofre, três esferas e cinco filas, autorização por escopo, autoaprovação bloqueada, justificativa obrigatória, rejeição, aprovação independente de OKR e apoio opcional. Chromium: a navegação direta a arquivo foi bloqueada pelo ambiente; carregamento do HTML em memória com armazenamento simulado permitiu testar a interface, tema escuro e o fluxo de proposta de associação à federação, validação e histórico. Não equivale a teste de integração nem a persistência real entre dispositivos.

## Publicação no Aresta Lab

A interface V3 substitui a entrada anterior em `intelligence/index.html` na branch `main`. A versão CRM anterior está preservada na branch `baseline/intelligence-antes-v3-2026-11-27`. Os módulos e migrations anteriores não foram removidos. O GitHub Pages depende do workflow existente. Esta interface demonstrativa não usa as tabelas privadas do CRM, não autentica usuários reais nem opera aprovações financeiras reais. Não inserir dados pessoais ou credenciais reais no ambiente de demonstração.


## V4 — navegação por finalidade

Cinco menus principais: Visão Geral, Território, Colaboração, Transparência e Impacto. O perfil permanece acessível pelo cabeçalho. Subtelas mantêm o contexto do menu de origem pelo hash da URL. Os módulos e as regras de contribuição V3 foram preservados; não houve migração ou exclusão do armazenamento local.

Prioridade editorial proposta (Fibonacci decrescente): 8 ação principal, 5 próxima ação, 3 apoio, 2 organização, 1 preferências. Essa prioridade não modifica XP ou direitos. Ações primárias usam Brand Color #E25844; fundo Deep Basalt #161616; indicadores Chalk White #F4F3ED; apoio Dry Moss #7B8B6F. Campos de seleção têm interface visível por botões, conservando os valores dos formulários. Blocos secundários são expansíveis.

A seleção de picos usa cartões em Visão Geral e Território. O usuário escolhe manualmente o pico; a localização é opcional, solicitada pelo navegador e usada em memória para ordenar os três picos de demonstração pela distância em linha reta aos centros municipais aproximados. Não são distâncias de acesso nem localização exata de vias. O catálogo ArestaDB real e as coordenadas verificadas permanecem pendentes de integração. O histórico recente é separado por perfil local. A consulta é livre.

Verificação: testes de lógica V3 e novos casos V4 (cinco menus, rotas, contexto, distância aproximada e prioridade) passaram com DOM simulado. Renderização visual e permissão de geolocalização em navegador real ainda precisam de verificação. Deploy via GitHub Actions existente.


## V5 — participação, temas e impacto

- Temas claro/escuro com preferência local e padrão inicial do sistema operacional. Fundo Deep Basalt #161616 e Chalk White #F4F3ED; Brand Color #E25844 em ações primárias.
- Visão Geral com pico selecionado, comunicados validados, próximo passo de contribuição, impacto registrado e seleção visual de picos. O mural público não apresenta comunicados ainda não validados; autor e revisores autorizados podem consultar suas pendências.
- Acervo documental: mapa histórico da Lapinha (Daniel Ferreira Mariano e Eustáquio Macedo Melo Júnior, 2002), capa Igarameca 2024 (Alexsandro) e mapa dos setores da Pedreira Dr. Gravatá, referenciados por URLs fixadas na revisão `d86e4ed87be93f6697af1077908e1c9d444c9d44` do ArestaDB. Carregamento externo com fallback. Não são fotos de visita atual.
- Escalador: contribuições, observações, sugestões locais e participação em ações; sem protocolo institucional direto. Curador validado: protocolo à associação no seu escopo. Mantenedor/autonomia validada e representante de associação no território: protocolo local ou à federação. Federação: sua esfera ou CBME. Confederação: sua esfera. XP e filiação isolados não concedem representação. Aprovações permanecem independentes. Casos históricos não foram removidos.
- Painel pessoal e territorial conta entregas validadas por categoria e pendências. Benefícios esperados são distintos de resultados medidos. A prática responsável não gera XP automaticamente.
- Testes de regressão e V5 passaram com DOM simulado. Renderização dos temas, carregamento de imagens externas e deploy ainda requerem confirmação em navegador. Controle efetivo de autorização depende de backend e autenticação reais.
