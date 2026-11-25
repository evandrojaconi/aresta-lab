# V3.4 — orientação do PDF Copy Completa e Style V4, sem mudar a paleta

**Fonte primária:** `ARESTA_COPY_COMPLETA_E_STYLE_V4.pdf`, enviado pelo responsável em 25/11/2026; 28 páginas, 11 páginas de site e seis artigos.

**Escopo autorizado:** seguir a orientação editorial, de conteúdo, estrutura e usabilidade da V4 **EXCETO as cores**. Preservar a identidade coral, papel, tinta escura e imagens reais da landing V3.1, já aprovada como baseline.

## POR QUÊ
A V3.3 tinha a assinatura principal correta, mas ainda apresentava essencialmente o app. O PDF descreve uma narrativa mais completa: a escalada é a primeira aplicação, enquanto organização do conhecimento, colaboração e preservação são a finalidade do projeto.

## PARA QUÊ
Manter uma porta de entrada simples para escaladores e dar pistas navegáveis e verificáveis para quem tem interesse em comunidade, autoria, pesquisa, oportunidades, impacto e transparência.

## COMO FOI IMPLEMENTADO

| Camada | Entrega | Estado |
|---|---|---|
| Home /v2/ | Hero V3.3 + telas reais + narrativa territorial + ciclo em cinco etapas | IMPLEMENTADO NA PRÉVIA |
| Home | Oportunidades exemplificativas de turismo, bioeconomia e pesquisa com rotulagem explícita | VISÃO |
| Home | Ciência cidadã, proteção de dados e método de impacto | MÉTODO PROPOSTO |
| Home | Código aberto, autoria, autonomia e CTAs de aprofundamento | CONTEÚDO INFORMATIVO |
| /manifesto/ | “O território é o centro. O resto se conecta.” | PÁGINA EDITORIAL |
| /impacto/ | Ciclo registrar, interpretar, mobilizar, realizar e verificar | MÉTODO PROPOSTO |
| /transparencia/ | Produto existente, fontes, lacunas, direitos e proteção | PÁGINA DE COMPROMISSOS |
| /propostas/ | Seis textos editoriais com sinalização de revisão e `noindex` | NÃO PUBLICADOS COMO NOTÍCIA |
| /blog/ | Link para propostas, separado dos artigos existentes | PÁGINA PUBLICADA INALTERADA, COM REFERÊNCIA CONTEXTUAL |

Os seis textos em revisão seguem os tópicos do PDF: “O território não é um produto”; “Um agricultor, um escalador”; “Informação territorial em tempo real”; “Comunidade, autonomia e confiança”; “Impacto e transparência”; “Croqui e memória”.

## DECISÕES DE DESIGN
- **Mantido:** token de cores, tipografia Epilogue/Inter, fundo de rocha real, logo oficial e telas reais do aplicativo, menu compacto, header que desaparece ao rolar.
- **Adicionado:** CSS específico de novos módulos (usando tokens de cores existentes), cards, sequência visual de cinco etapas, páginas internas coesas e responsivas.
- **Não importado:** variáveis de verde `#14332D`, `#07372E`, `#0A4D3E` nem o dourado `#D9AD62`, nem o logo abstrato ⌁, pois a marca oficial permanece.
- **Assinatura principal preservada:** **“Feito pela comunidade. Aberto para o mundo.”** O “Use. Contribua. Preserve.” do PDF é secundário.

## EVIDÊNCIA E LIMITES
- **IMPLEMENTADO:** aplicativo com picos, vias, croquis interativos e consulta offline a conteúdos preparados; Editor beta; páginas de informação e código aberto onde disponível.
- **VISÃO FUTURA:** informação ambiental integrada, clima contextualizado, oportunidades econômicas, ciência cidadã conectada e relatórios de impacto automatizados.
- **HIPÓTESE:** a informação territorial melhor organizada pode revelar novas colaborações e possibilidades de preservação.
- **SEM DEMONSTRAÇÃO:** números de 25+, 2.500+, 250+ ou 1.000 usuários do PDF não foram incorporados a esta página sem fonte analítica recente validada.
- **STATUS EDITORIAL:** os seis textos são propostas para revisão, não foram registrados em `lab-v2/posts.json` como artigos publicados.
- **PUBLICAÇÃO:** somente `evandrojaconi/aresta-lab`; o domínio `arestaclimb.com` não é alterado.

## ORIGEM DOS ARQUIVOS
- `lab-v2/app-first/index.html`: estrutura da home com novos blocos.
- `lab-v2/app-first/territorio-v4.css`: estilos incrementais com cores existentes.
- `lab-v2/app-first/territorio-v4-content.json`: páginas e textos editoriais.
- `scripts/build-territorio-v4.mjs`: gera as rotas propostas.
- `scripts/build-v2.mjs`: chama o gerador somente após preparar a V3.
- `scripts/verify-app-first.mjs`: verifica rotas, versões, status, conteúdo e preservação da paleta.

## PRÓXIMO PASSO
Testar menu, ritmo de rolagem, H1, contraste, links, rotas em mobile e desktop. Revisão humana obrigatória antes de publicar os seis textos do Diário como reportagens e antes de atualizar o domínio oficial.
