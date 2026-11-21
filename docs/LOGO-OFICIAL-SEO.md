# Identidade oficial Aresta Climb — fonte INPI (V2.2)

## Fonte de verdade
A identidade **atual do cabeçalho** vem **sem redesenho** de [`aresta-climb/aresta_app/frontend/assets/logo_splash_inpi.jpg`](https://github.com/aresta-climb/aresta_app/blob/main/frontend/assets/logo_splash_inpi.jpg). Cópia binária com o mesmo SHA `64b198d619a04f6706cef2be1f428ee1ea11e888` em `lab-v2/premium/assets/aresta-climb-logo-oficial-inpi.jpg`.

O arquivo contém o símbolo da montanha e o nome ARESTA CLIMB juntos. O build retira o lettering HTML redundante e mostra a marca completa usando um **recorte visual via CSS** das grandes margens brancas do JPG; não altera a imagem original. Usado na landing e no Diário de Rocha (índice, artigos e rodapé).

**LEGADO:** o SVG `aresta-climb-logo-oficial-croquis-escalada-belo-horizonte-mg.svg` foi uma vetorização provisória. Não deve voltar a aparecer no cabeçalho.

## Layout
- Barra de navegação com largura máxima 1.000 px e altura compacta, com marca única e CTA.
- Links principais: Aplicativo · Croquis · Diário de Rocha · Sobre. Comunidade, Editor e informações institucionais continuam acessíveis em Sobre.
- A navegação mobile entra em telas de 960 px ou menos; comportamento de ocultar ao descer e revelar ao subir permanece.

## SEO e acessibilidade
Nome do arquivo com marca e identificação institucional. Texto alternativo claro: “Aresta Climb — logotipo oficial com montanha e nome. Aplicativo e croquis de escalada”. A imagem está dentro de um link para a home. Não carregar lista artificial de palavras-chave no alt.

O Aresta Lab segue marcado como `noindex`. A implementação **não altera** o domínio oficial `arestaclimb.com` nem prova indexação em mecanismos de busca.
