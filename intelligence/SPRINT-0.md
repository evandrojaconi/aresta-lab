# Sprint 0 — 23 a 27 de novembro de 2026

**Objetivo:** estruturar workflow Aresta Intelligence com login e CRM, SEM atrasar Rupestre e landing.

**Capacidade declarada:** 4 a 6 horas por dia (20–30h brutas de segunda a sexta) para Aresta, Produto, Dados, Marketing, instituições e parceiros. Não presumir disponibilidade de terceiros; registrar tempo real.

## Prioridades existentes

| Demanda | Quando | Responsável | Concluído quando |
| --- | --- | --- | --- |
| Publicar conteúdo Rupestre no Instagram | Segunda 23/11 cedo | Evandro | Link e comprovante reais |
| Adaptar a publicação para LinkedIn | Segunda 23/11 | Evandro | Texto institucional aprovado e URL publicada |
| Entregar landing page V2 | Durante a sprint, sem prazo exato informado | Evandro; revisão técnica | Link de versão, QA, aceite ou pendências |
| Habilitar CRM com login Google | Até sexta 27/11 | Evandro e responsável pelo Supabase | Google Auth, membership e tarefa sincronizada em dois dispositivos |
| Conciliar fontes da Lapinha | Fila P1; não compete com P0 | Evandro + revisores | Divergências, fontes e estado de revisão registrados |

## Sequência

**Segunda:** publicar Rupestre primeiro; reaproveitar conteúdo no LinkedIn; registrar links. Revisar versão final e lista de pendências da landing.

**Terça:** preparar/entregar revisão da landing e confirmar responsável pelo aceite. Conferir banco escolhido e escopo do CRM antes de configurar.

**Quarta:** migrar SQL em projeto isolado; configurar Google OAuth; aprovar membership; criar e mover uma demanda real com evidência. Prioridade não é criar formulários novos.

**Quinta:** listar integrações por benefício/risco/esforço. Selecionar UMA leitura de baixo risco para a próxima etapa (candidata: Notion com IDs e revisão humana). Não tentar conectar todas as APIs no mesmo dia.

**Sexta:** confirmar posts e landing; realizar testes RLS e backup; registrar esforço, bloqueios e aprendizado. Separar Sprint 1 com até três resultados importantes.

## Critérios de aceite

- [ ] Branch e PR independentes, sem alterar produção.
- [ ] `npm run test` e `npm run build` aprovados.
- [ ] Migrations em Supabase aprovado.
- [ ] Login Google e membro aprovado funcionando.
- [ ] Usuário não autorizado bloqueado pela RLS.
- [ ] Uma tarefa criada, movida e visualizada em dois dispositivos.
- [ ] Evidência registrada antes de mudar tarefa para Medido.
- [ ] Contato de teste + interação salvos em banco privado.
- [ ] Canais sem API continuam indicados como NÃO conectados.
- [ ] Rupestre publicada com links reais, landing entregue com revisão.
- [ ] Tempo gasto medido, impedimentos e próxima decisão documentados.

## Fora do escopo

Disparo automático em Meta/LinkedIn/WhatsApp, scraping de grupos e conversas privadas, integração irrestrita com contas Google, importação completa de leads, troca de backend do app de escalada, execução autônoma de decisões de produto.

**Observação:** este código foi colocado temporariamente em branch isolada do repositório acessível `aresta-lab`. A morada definitiva recomendada é um repositório/aplicação independente de Aresta Intelligence. O Notion existente não foi substituído ou modificado.
