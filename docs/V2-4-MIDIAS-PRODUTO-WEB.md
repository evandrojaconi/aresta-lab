# ARESTA LAB V2.4 — Conteúdo e mídia reais

**Data:** 21/11/2026  
**Ambiente:** homologação `/aresta-lab/v2/` (mantém `noindex`).  
**Repositório de produção:** não alterado.

## Por que a V2 precisava ser revisada
1. As três capturas reais do app estavam sobrepostas em molduras pesadas. Não havia plano visual compartilhado com o fundo da seção.
2. A imagem de Comunidade mostrava canais/links, não o fluxo de contribuição.
3. A imagem do Editor era anterior ao novo Painel de Qualidade. Uma captura real de 20/11/2026, fornecida pelo usuário, substitui a anterior.
4. As sombras dos botões laranja davam um brilho visual excessivo.
5. Existia link para o catálogo `/croquis`, mas faltava explicar a relação entre navegação web, app e consulta offline.

## Mudanças implementadas
- Dois telefones reais na seção Aplicativo, com composição mais leve, sem terceiro aparelho concorrendo pela atenção. Nenhuma tela fictícia foi incluída.
- A seção Comunidade utiliza a captura original do fluxo de envio de sugestão, já presente no HTML premium, com enquadramento de dispositivo e fundo menos pesado.
- Nova imagem **real** `lab-v2/premium/assets/aresta-editor-painel-qualidade-real-2026-11-20.webp`, otimizada a 1600×944 e com acesso ao arquivo em alta definição por clique, sem recriar a interface.
- Editor: novo texto sobre Painel de Qualidade, etapas e pontuação, acesso por tarefas, publicação com critérios e MCP local; sem afirmar que o agente é público, obrigatório ou conectado automaticamente a visitantes do site.
- Seção `#web`: apresenta a navegação web como complementar à experiência móvel e linka `https://arestaclimb.com/croquis`. O HTML premium, blog e rotas oficiais foram preservados.
- Redução de sombra, brilhos e radial laranja atrás de botões.
- QA automático revisado para proteger as capturas reais, link de catálogo e preservação da fonte original.

## Evidências e estado
| Afirmação | Fonte | Estado/limite |
|---|---|---|
| Painel de Qualidade em três etapas, pontuação e bloqueio de publicação de rascunhos incompletos | [aresta_db/openspec/changes/archive/2026-11-08-painel-nota-qualidade-croqui/tasks.md](https://github.com/aresta-climb/aresta_db/blob/main/openspec/changes/archive/2026-11-08-painel-nota-qualidade-croqui/tasks.md) | **IMPLEMENTADO no código** e evidenciado na captura de Editor Beta v0.6.8 do usuário. A nota mostrada (5.862 pts) é exemplo de um croqui em rascunho, não métrica global do Aresta. |
| Servidor MCP integrado ao Editor Aresta | [aresta_db/docs/mcp.md](https://github.com/aresta-climb/aresta_db/blob/main/docs/mcp.md) | **IMPLEMENTADO tecnicamente** como servidor local; não comprova conexão ativada na sessão de cada usuário. |
| Tela do formulário de contribuição do app | HTML premium original `lab-v2/premium/source.html` | **CAPTURA REAL** já presente; não é prova de volume de contribuições recebidas. |
| Catálogo web `arestaclimb.com/croquis` | Rota fornecida pelo projeto e usada pelo Lab | **INTEGRAÇÃO DE NAVEGAÇÃO**, não cópia da aplicação web nem prova de paridade de funções. URL e disponibilidade devem ser verificadas no ambiente de produção antes de migração. |

## Critério de aceitação visual
Em desktop e mobile, hero, aparelho, contribuição e screenshot do Editor devem parecer partes do layout (sem cartões com aparência de papel colado), sem degradar o texto legível, manter zoom da captura e respeitar modos claro/escuro. Botões não devem projetar glow de néon.

## Próxima decisão
Aprovar visualmente no Aresta Lab. Se aprovado, abrir uma PR separada no repositório oficial, com validação dos serviços web, dados técnicos, SEO e compatibilidade dos destinos.
