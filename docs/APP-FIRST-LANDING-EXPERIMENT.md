# Experimento — Home App First (Aresta Climb)

**Data de referência:** 22/11/2026 · **Tipo:** teste de proposta visual no Aresta Lab · **URL:** `/v2/app-first/`

## Por quê
A primeira mensagem da home deve explicar ao escalador comum o que é o Aresta: **aplicativo de escalada e croquis**. Detalhes de manutenção, Editor, governança e implementação pertencem a jornadas secundárias.

## Para quê
Reduzir o esforço para compreender o produto e avançar até a instalação ou consulta dos croquis. A hipótese a validar é se uma página *app-first* aumenta cliques qualificados nos CTAs sem ocultar o caminho de contribuição.

## Como foi implementado
- Novo diretório `lab-v2/app-first/` com HTML, CSS e JS independentes; publicado pela etapa `scripts/build-app-first.mjs`.
- Visual inspirado na **hierarquia** do modelo enviado pelo usuário, nunca sua marca ou telas de produto.
- Identidade Aresta: coral, papel, tinta escura, Epilogue e Inter. Símbolo oficial existente.
- Capturas **reais já publicadas** no repositório oficial e copiadas para `/v2/assets/app/`: explorar locais, Pedra Grande, croqui interativo, comunidade do pico e setor principal.
- Sequência: hero de produto → três telas → benefícios → exploração → croqui → offline → comunidade → FAQ → download → chamada discreta para mantenedores.
- Nenhum depoimento, parceria, estatística ou função nova foi inventado. A página permanece `noindex`.
- Menu mobile e header com comportamento de notificação, seguindo o padrão do laboratório.
- Botões apontam para páginas internas da V2, exceto lojas externas explicitamente indicadas.

## Definição de concluído (teste técnico)
- [x] Arquivos disponíveis em caminho próprio sem substituir a V2.
- [x] Roteamento e imagens reais validados no CI.
- [x] Layout inspecionado em 320, 390, 768 e 1440 px com zero overflow horizontal.
- [x] Header some ao descer e retorna ao subir; menu mobile e FAQ testados.
- [ ] Observar comportamento de pessoas reais e validar se a promessa fica compreensível de primeira.

## Métrica futura
Comparar V2 atual e App First com campanhas equivalentes e mensuração identificada de cliques em `Baixar app`, cliques em `Croquis` e engajamento nas seções. Sem experimento comparável ou dados de tráfego, não afirmar superioridade de conversão.

## Estado
**IMPLEMENTADO no laboratório, protótipo de homologação.** Não publica no domínio `arestaclimb.com` nem substitui a home da V2.
