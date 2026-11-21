# Identidade Aresta Climb — variante branca para header compacto

## Fonte
- Fonte institucional: `aresta-climb/aresta_app/frontend/assets/logo_splash_inpi.jpg`, arquivo JPEG original preservado no laboratório como `lab-v2/premium/assets/aresta-climb-logo-oficial-inpi.jpg`.
- O símbolo da montanha em branco foi **derivado dos contornos da identidade visual fornecida pelo usuário**, sem troca do desenho por ícone genérico.
- Variante usada no site: `lab-v2/premium/assets/aresta-climb-simbolo-montanha-branco.svg`.

## Aplicação
O cabeçalho deixa de recortar o JPEG branco com símbolo e lettering empilhado. Passa a combinar um pequeno quadrado coral com o **símbolo branco da montanha** e o nome **ARESTA CLIMB** lateralmente, em texto. Mesmo tratamento no Diário de Rocha. Isso permite legibilidade nos modos claro e escuro e evita marca repetida.

**V2.3:** desktop até 780 px de largura e 50 px de altura; mobile até 820 px de viewport, com barra de 46 px. O menu Sobre só exibe opções quando está aberto. Header continua ocultando ao descer e reaparecendo ao subir.

## SEO / acessibilidade
- Nome descritivo do asset e `alt="Símbolo da montanha Aresta Climb"`. O link da marca contém o nome visível completo e leva ao início.
- Não usar lista de palavras-chave no `alt`. O posicionamento sobre aplicativo, escalada, Belo Horizonte e croquis pertence também às páginas e textos, não somente ao arquivo de logo.
- A V2 segue `noindex` por ser ambiente de homologação. Não foi alterado `arestaclimb.com`.

## Estado das variantes
- **Fonte:** JPEG oficial INPI no repositório `aresta_app`.
- **Derivado em uso:** SVG de contorno branco + lettering lateral.
- **Legado:** vetor aproximado usado no protótipo anterior e JPEG completo cortado dentro da barra.
