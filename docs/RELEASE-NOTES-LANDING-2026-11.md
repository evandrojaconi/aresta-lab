# Aresta Climb — Landing navegável / Novembro 2026

## Objetivo
Tornar a landing explorável, sem formulários fictícios, e conectá-la às funcionalidades públicas verificáveis: catálogo oficial de croquis, Editor e lojas Android/iOS.

## Mudanças desta versão
- Menu superior e mobile com croquis, picos, guias, Editor, comunidade e FAQ.
- CTA de instalação com links reais para as duas lojas.
- Seção de picos substituída por caminhos reais: catálogo, Pedra Grande e guia regional.
- Páginas editoriais e sitemap preservados; título e description da home ajustados para buscas de aplicativo/croqui.
- Página Pedra Grande aponta para catálogo oficial; removida afirmação desatualizada sobre croqui ainda não lançado.
- Formulário demonstrativo removido; eventos data-event são apenas marcadores até existir analytics.
- Favicon SVG para evitar caminho inexistente no head.

## Decisões de produto
- O catálogo https://arestaclimb.com/croquis é uma rota do site oficial. A landing prototipada apenas referencia essa rota e não a substitui.
- Sem criar deep links especulativos; aplicativo já anuncia suporte a QR/deep links, porém o formato de URL deve ser validado com Renato.
- O sistema não coleta nem armazena leads sem integração de backend.

## Checklist de validação
- [ ] bun run build no ambiente de desenvolvimento/CI
- [ ] Navegação desktop/mobile de todas as rotas internas
- [ ] Abrir links externos (catálogo, Editor, lojas)
- [ ] Verificar que o catálogo mantém o caminho /croquis no domínio
- [ ] Validar SSR, canonical, title, sitemap e robots
- [ ] Conferir acessibilidade e foco de navegação
- [ ] Comparar textos com o estado atual do aplicativo
- [ ] Registrar baseline no Search Console
- [ ] Planejar publicação com Renato sem substituir rotas legadas

## Riscos
O repositório é TanStack Start e possui dependências do Lovable. Um deploy sem analisar o roteamento do domínio oficial pode causar colisão de /croquis ou /editor. Prefira uma prévia isolada antes de integrar à produção.
