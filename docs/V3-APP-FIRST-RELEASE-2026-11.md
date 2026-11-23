# ARESTA LAB V3 — Home App First, Diário e caminhos de aprofundamento

**Data de implementação:** novembro de 2026 · **Estado:** protótipo V3 para homologação no Aresta Lab (sem alteração no domínio oficial).

## POR QUÊ
A pesquisa `14_Pesquisa_de_Publico_Aresta.pdf` descreve dois contextos diferentes: para a persona analítica **Lucas**, falta organização de croquis, vias, acesso e offline; para a persona analítica **Rafael**, o desafio é organizar informações territoriais e contribuir sem sobrecarregar a comunidade. Esses nomes são modelos de trabalho, não relatos individuais validados.

A pesquisa analisou históricos de três grupos de WhatsApp com 156 participantes em potencial (sem deduplicação) e 29 meses acumulados de observação. Isso ajuda a formular hipóteses sobre linguagem, mas não permite medir prevalência nem inferir conversão de landing.

O `Dossiê de Público Alvo - Personas - ICP - FEMEMG.pdf` é sobre a **Federação**, não sobre a base atual de usuários do Aresta. Foi utilizado apenas como referência para distinguir público, persona e rota de interesse, sem incluir a FEMEMG como parceira ou endossante e sem misturar públicos.

## PARA QUÊ
A pessoa que entra quer entender em segundos que o Aresta é um **aplicativo de escalada e croquis**, conhecer picos/setores, preparar a consulta offline e baixar o app. O mantenedor, apoiador ou criador de croquis acessa uma camada secundária de informação quando tiver interesse.

## COMO FICOU

| Nível | Página | Intenção predominante | Ação principal |
|---|---|---|---|
| 1 | `/v2/` | Entender/baixar o aplicativo | Baixar app |
| 1 | `/v2/croquis/` | Descobrir croquis web | Ir ao catálogo oficial atualizado |
| 2 | `/v2/blog/` | Conhecer histórias e locais | Ler artigos e fontes |
| 2 | `/v2/comunidade/` | Participar e contribuir | Conhecer canais |
| 3 | `/v2/editor/` | Criar e organizar croquis | Conhecer Editor Beta |
| 3 | `/v2/projeto/` | Entender autoria, território e tecnologia | Escolher aprofundamento |
| Acervo | `/v2/visao/` | Consultar landing premium V2 anterior | Explorar seções completas |
| Comparação | `/v2/app-first/` | Inspecionar versão App First em rota legada | Comparar a apresentação |
| Espelho | `/oficial/` | Referência técnica estática do site de produção | Não alterar |

### Home
- Preserva três telas reais, benefícios e blocos de navegação/uso offline.
- Logo abaixo da experiência do escalador, apresenta três caminhos discretos: **Editor**, **Comunidade**, **O projeto**.
- Destaca o **primeiro post efetivamente publicado** no Diário, com título, descrição e imagem retirados de `lab-v2/posts.json`. Não inventa depoimentos, métricas ou novas publicações.
- Menu principal reduzido: **Aplicativo, Croquis, Diário de Rocha, Sobre, Baixar app**.
- Mobile possui navegação acessível e o cabeçalho mantém a lógica tipo notificação: some descendo, volta subindo.

### Diário
O mesmo arranjo de menu também aparece no blog e nas páginas internas. A marca remete para `/v2/`, não para a página premium anterior.

### Projeto
A página `/v2/projeto/` dá acesso à história, autoria, Editor, plataforma web e implementação aberta. A imagem do Editor é uma captura real do beta v0.6.8. O texto diferencia função documentada, benefícios pretendidos e visão de futuro.

## Classificação de evidências
**IMPLEMENTADO NA LANDING:** navegação, rotas internas, seção editorial dinâmica no build, página Projeto e versão premium preservada.

**FATO DOCUMENTAL:** os PDFs sustentam o problema de informação dispersa, a escolha de públicos prioritários e a proposta de comunicação direta; não comprovam taxas de conversão.

**HIPÓTESE:** a mensagem App First reduz esforço de compreensão e aumenta cliques qualificados.

**INCERTO:** efeito sobre instalações reais, retenção, engajamento e qualidade percebida. Exige analytics e teste com pessoas.

**NÃO ALTERADO:** `arestaclimb.com`, repositórios oficiais de app, Editor, dados, serviços, CRM, conteúdo jurídico e fontes do Diário.

## Critério para publicação em produção
1. GitHub Pages build, verificação estática e navegação real desktop/mobile aprovados.
2. Confirmação visual dos CTAs das lojas, links internos e telas reais.
3. Revisão final das afirmações de produto com responsável técnico.
4. Aprovação humana da troca do domínio; não deduzir autorização pela publicação do experimento no laboratório.

## Métricas de experimento
Comparar visitas atribuídas, cliques no download, clique no catálogo, clique no Diário e cliques nos caminhos secundários. Coletar consentimentos, fontes, período e limitações da atribuição. Não considerar cliques equivalentes a instalações ou uso offline comprovado.
