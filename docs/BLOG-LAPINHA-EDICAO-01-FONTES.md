# Diário de Rocha — Edição 01: Gruta da Lapinha

**Status:** artigo publicado somente em ambiente de homologação (Aresta Lab V2), não indexado. **Data editorial:** 19/11/2026.

## Decisão editorial
A história da Lapinha é o primeiro conteúdo de reportagem do Diário de Rocha. Os outros três artigos do Lab continuam como pilotos; não reivindicam a posição de primeira publicação.

A narrativa combina história documentada (1980–2011), fonte técnica atual de manutenção (2026) e contribuição do Aresta à organização do conhecimento. Menção comercial **sutil** à Rupestre da Lapa, sem prometer descontos, parceria formal, remuneração ou responsabilização de segurança.

## Fontes / peso probatório
| Afirmação | Fonte | O que prova | Limitação |
| --- | --- | --- | --- |
| Primeiras escaladas anos 1980, relação com escotismo e equipamento improvisado | Diego Contaldo de Lara, dissertação PUC Minas (2018), p. 77–85 | História reconstruída a partir de entrevistas e documentos | Relatos históricos, não estado atual |
| Proibição municipal em 2002, mobilização da AME e reabertura regulamentada em 2011 | Lara (2018), p. 20–25 e capítulo 3; IEF (2016) | Histórico institucional | Não representa regras de 2026 |
| ACEC-MG e Rupestre da Lapa Aventuras creditadas nas inspeções técnicas e manutenções (2026+) | ArestaDB: \`database/br_mg_lagoa_santa_gruta_da_lapinha/creditos.md\` | Crédito explícito em base técnica atual | Não comprova volume de manutenção, cronograma ou contrato comercial |
| GTEL responsável pelo contexto local; Helon, André, Renato, Denise etc. | ArestaDB: \`creditos.md\` | Nomes e grupo de trabalho registrados | Não substitui aprovação institucional |
| Revisões de nomes, graus, históricos, datas e referências no Editor Aresta em novembro de 2026 | ArestaDB: \`openspec/changes/archive/2026-11-09-mcp-lote-migrar-escalada-e-revisao-lapinha/tasks.md\` | Tarefas de implementação e revisão concluídas no histórico técnico | Não comprova distribuição real para todos os usuários |
| Hospedagem e alimentação da Rupestre da Lapa, na região de Fidalgo | ArestaDB: \`database/br_mg_pedro_leopoldo_gruta_do_bau/opcoes_hospedagem.md\`, site citado pelo usuário | Referência de hospedagem na documentação do próprio projeto | Serviços, valores e disponibilidade precisam ser consultados com a empresa |
| Regras e orientações atuais de visitação e escalada | IEF: https://www.ief.mg.gov.br/w/parque-estadual-do-sumidouro | Fonte oficial sobre gestão do parque | Podem mudar; consultar antes de ir |
| Mapa de 2002 e crédito do croqui | ArestaDB: \`capa.md\`, \`imagens/capa_p0_i0.webp\`, \`creditos.md\` | Documento histórico de Mariano e Melo Júnior | **NÃO é croqui operacional atual** |

## Referências
- [Diego Contaldo de Lara (2018), *Geografia, montanhismo e escalada: o caso do Maciço Lapinha em Lagoa Santa, Minas Gerais* (PUC Minas)](https://www.biblioteca.pucminas.br/teses/TratInfEspacial_LaraDC_1.pdf)
- [ArestaDB — créditos do guia e do GTEL](https://github.com/aresta-climb/aresta_db/blob/main/database/br_mg_lagoa_santa_gruta_da_lapinha/creditos.md)
- [ArestaDB — revisão de novembro de 2026](https://github.com/aresta-climb/aresta_db/blob/main/openspec/changes/archive/2026-11-09-mcp-lote-migrar-escalada-e-revisao-lapinha/tasks.md)
- [Rupestre da Lapa](https://www.rupestredalapa.com.br/)
- [IEF — Parque Estadual do Sumidouro](https://www.ief.mg.gov.br/w/parque-estadual-do-sumidouro)

## Artefatos implementados
- Primeiro objeto em \`lab-v2/posts.json\`, slug \`historia-escalada-gruta-da-lapinha\`.
- Capa histórica \`lab-v2/premium/assets/gruta-da-lapinha-mapa-historico-2002.webp\`, preservada da ArestaDB.
- Estrutura \`timeline\`, \`figure\`, \`callout\`, \`partner\` e \`sources\` em \`scripts/build-v2.mjs\`.
- Metadados Open Graph + Schema.org BlogPosting (somente preview \`noindex\`) e cartão de destaque na home.
- Testes em \`scripts/verify-premium-v2.mjs\`.

## Próximas etapas fora do Lab
Para publicação indexável no domínio oficial: revisão da gestão do parque e de divulgação do local; revisão de marca/posição da Rupestre da Lapa e aprovação de parcerias se necessário; revisão editorial de autoria e imagens; adoção de URL canônica, sitemap, atualização de fontes e acompanhamento de uso.
