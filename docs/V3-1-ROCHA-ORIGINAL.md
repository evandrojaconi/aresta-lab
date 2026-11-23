# V3.1 — Fotografia real da rocha recuperada

**Origem da evidência:** `lab-v2/premium/source.html` (HTML premium anterior).
A fonte possui duas ocorrências idênticas de uma imagem WebP de rocha: no *hero* e no bloco offline. Trata-se da fotografia que já era utilizada na landing anterior, não de um arquivo produzido por IA.

## POR QUÊ
A primeira versão App First resolvia a hierarquia do conteúdo, mas o fundo geométrico coral perdeu a relação visual com o território presente na landing anterior.

## PARA QUÊ
Manter aplicativo e download como protagonistas enquanto se reconhece imediatamente uma **rocha real** ao entrar na página.

## COMO
- O build extrai a imagem original do HTML premium e publica o arquivo **sem modificar os bytes** em `/v2/assets/aresta-rocha-fundo-original.webp`. A extração exige as duas ocorrências idênticas e assinatura RIFF/WEBP válida, falhando se a fonte for alterada.
- A V3 em `/v2/` e `/v2/app-first/` carrega `app-first/rock-backgrounds.css`.
- **Hero:** foto original + sobreposição escura por gradiente para legibilidade e CTA.
- **Blocos do app e comunidade:** a mesma fotografia em fundo suave atrás dos aparelhos, preservando telas reais e cartões.
- **Chamada de valor:** fotografia real escurecida em vez de fundo chapado.
- **Download:** foto como fundo apenas do mockup na coluna direita, preservando a leitura do texto.
- Ajustes responsivos em 720 e 430 px; sem brilho neon extra.
- A V2 premium preservada em `/v2/visao/` e os artigos do Diário não foram alterados.

## EVIDÊNCIA E LIMITES
**IMPLEMENTADO:** recuperação da fotografia de fonte versionada, CSS e build gerado. O QA compara igualdade de bytes da foto extraída com a fonte original e verifica todas as aplicações.

**NÃO ALTERADO:** `arestaclimb.com`, app, Editor, API, CRM, blog e código de produção.

**A VALIDAR:** leitura da imagem e do texto em celulares reais com luminosidade elevada. Um teste estático de overlay não substitui uma avaliação de contraste por pixel.

## Critério de concluído
GitHub Actions passa no build, valida arquivo WebP, rotas e as duas entradas V3; Pages publica no Aresta Lab. 
