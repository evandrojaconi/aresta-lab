# Aresta Lab V2 — proposta de direção criativa e conteúdo

## Problema
A landing oficial apresenta corretamente o aplicativo, mas sua linguagem visual pode comunicar com mais intensidade a escalada real, a rocha, o território e a comunidade. A proposta também não dispõe de um espaço editorial de blog.

## Regra de preservação
**Fonte técnica:** branch main de `aresta-climb/arestaclimb.com`.
**Espelho fiel:** `/aresta-lab/oficial/`.
**Experimento V2:** `/aresta-lab/v2/`.

Não refazer infraestrutura nem migrar Vite para React. O projeto original mantém suas páginas, assets e interações. O catálogo `/croquis` continua externo (Cloudflare Worker + D1). A equipe técnica decidirá como portar as mudanças para produção.

## Linguagem visual
- Arenito mineral `#f1ede4`, ferrugem `#6e2114`, laranja Aresta `#d95635`, carvão `#151515` e sálvia `#90a989`.
- Epilogue (títulos de impacto), Inter (leitura) e Roboto Mono (informações técnicas).
- Texturas minerais do próprio acervo público da marca. Grandes áreas de respiro, blocos editoriais, ritmo de revista de campo.
- Tom: direto, específico da escalada, com respeito à autoria e sem promessas de segurança.
- Hero: "Menos incerteza. Mais parede.", alinhado à proposta histórica da marca.

## Blog piloto
Home editorial e três textos de demonstração: a história por trás dos croquis, preparação offline e responsabilidade territorial. Todo conteúdo vem do posicionamento e capacidades descritas pelo site oficial; não representa relatos de campo, regras locais confirmadas ou números atualizados.

**Planejado para produção, não implementado no site oficial:** sitemap de blog, schema Article/BlogPosting, canonical, instrumentação real e pipeline editorial com governança e autoria. O Lab é deliberadamente `noindex`.

## QA e passagem técnica
- Build e QA estático aprovados em Actions.
- Links de catálogo, Editor, app e comunidade preservados.
- Navegação mobile e desktop demonstrável.
- Verificar desempenho, contraste, acessibilidade, dados e escrita antes de promover para arestaclimb.com.

## Definição de concluído
Home V2, índice do blog e três artigos navegáveis em GitHub Pages; original sem alterações; comparação disponível por URLs separadas.
