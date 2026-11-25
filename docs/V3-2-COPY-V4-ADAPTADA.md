# Aresta Climb — V3.2: copy V4 adaptada à arquitetura V3.1

**Decisão de produto:** preservar integralmente o design V3.1 aprovado e usar o HTML `ARESTA_V4_ABRIR_NO_NAVEGADOR.html` fornecido pelo responsável como fonte editorial.

**Atenção:** este é um *copy refresh*, **não** uma adoção do layout, navegação, funcionalidades demonstrativas ou novas matérias do arquivo V4. Não alterar a branch congelada `baseline/landing-v3.1-aprovada-2026-11-23`.

## POR QUÊ

O V4 torna mais clara a tese do Aresta: o produto começa na escalada e, por meio do conhecimento de quem conhece os lugares, pode apoiar colaboração, oportunidades e preservação. Porém, o cabeçalho do V4 prioriza “informação territorial em tempo real”, que é uma visão em desenvolvimento, não uma funcionalidade integralmente disponível. A V3.1 já havia sido aprovada para mostrar **primeiro o aplicativo**.

## PARA QUÊ

Manter a hierarquia de aquisição e incorporar a profundidade da V4 no momento certo. Escaladores entendem e instalam o aplicativo; quem conhece ou mantém picos descobre Editor, comunidade, autoria e visão territorial.

## MAPA DE APLICAÇÃO

| Seção V3.1 | Copy extraída/adaptada da V4 | Decisão editorial |
|---|---|---|
| Hero | “O Aresta começa na escalada”, “Use. Contribua. Preserve.” | H1 original `Escalada e croquis. Tudo no mesmo app.` preservado por clareza do produto |
| Telas do aplicativo | “Croquis interativos · acesso offline · autoria respeitada” | Reforço de benefícios, imagens reais inalteradas |
| Introdução | “Já existe. Já está na rocha”; “Um app de escalada. Uma porta para o território” | Módulo de benefício, não promessa de plataforma pronta |
| Três benefícios | “Boulder, via, parede”; “Croqui na própria rocha”; “Offline de verdade” | Prática antes de tese institucional |
| Descobrir / croquis / offline | Busca de picos; linhas em fotografias; consulta sem sinal | Informação útil de produto, com limitações apropriadas |
| Comunidade | “A comunidade já faz acontecer”; quem conquista documenta, quem visita observa | Não se atribuem validações não demonstradas às contribuições |
| Três caminhos de aprofundamento | “O aplicativo é só o começo”; memória, autoria e preservação | Direciona para Editor, Comunidade e Projeto, sem inflar a primeira dobra |
| Chamada escura | “Menos tempo procurando informação dispersa. Mais tempo na parede” | Mantém CTA de download e hierarquia App First |
| Diário | “Território e ideias”; “O croqui mostra a via. A história conta o resto” | Matéria real dinâmica existente; rascunhos do V4 não foram publicados |
| FAQ | Produto agora versus visão futura; offline; autoria; contribuições | Afirmar estado comprovado e separar hipóteses |
| Download / convite | “Use. Contribua. Preserve”; “O próximo território tem uma história...” | Download primeiro, convite de aprofundamento no encerramento |
| O projeto | “Conheça o território. Conecte possibilidades”; “O território não tem paywall” | Ponto de entrada para assuntos de autoria, pesquisa, tecnologia e preservação |

## O QUE NÃO FOI IMPORTADO

- O **layout, CSS, fontes, cores, imagens, interações, rotas e menu** do V4.
- A chamada `informação territorial em tempo real` como se fosse um serviço operacional; no V4 o próprio texto reconhece que contexto meteorológico e observações ambientais são visões.
- Indicadores `25+`, `2.500+`, `250+`, `1.000 usuários` apresentados no V4, pois requerem confirmação de origem, definições e período antes de entrar na nova home.
- Novos textos do Diário marcados como `PROPOSTA EDITORIAL`. A landing mantém somente posts efetivamente publicados no pipeline do Aresta Lab.
- Promessas de monetização, relatórios de impacto concluídos, parcerias e funcionalidades não verificadas.

## ESTADO E CONTROLES

- **IMPLEMENTADO NA V3.2:** atualização das *strings* em `lab-v2/app-first/index.html` e `lab-v2/app-first/projeto.html`.
- **INALTERADOS:** `style.css`, `legacy-merge.css`, `rock-backgrounds.css`, `app.js`, imagens, IDs, rotas e componentes.
- **VALIDAÇÃO:** comparação de sequências de tags e destinos de links e imagens entre a V3.1 aprovada e a V3.2; build e QA do GitHub Pages.
- **NÃO ALTERADO:** domínio `arestaclimb.com`, app, Editor, ArestaDB e CRM.
- **PENDENTE DE MEDIÇÃO:** benefício sobre compreensão da proposta, cliques e instalações. A V3.2 não comprova aumento de conversão.

**Critério de próximo passo:** após inspeção desktop/mobile da copy, aprovar a redação da V3.2 como próxima baseline sem apagar a referência V3.1.
