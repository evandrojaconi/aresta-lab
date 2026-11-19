# Migração — GitHub como fonte única

## Alterações
- Vite configurado com TanStack Start + React + Tailwind CSS + Nitro, sem plugin Lovable.
- Remoção de pasta .lovable, agente Lovable e reportador de erros Lovable.
- Remoção da dependência direta @lovable.dev/vite-tanstack-config.
- Subdiretório e roteamento adequados a GitHub Pages, por BASE_URL.
- Build em Actions; workflow de publicação GitHub Pages.

## Escopo
- Não altera aplicativo, base de croquis nem arestaclimb.com.
- Não torna o repositório público.
- Não apaga o projeto na conta Lovable: exige ação do titular.
- A publicação em GitHub Pages depende de elegibilidade do plano e verificação de deploy.

## Testes
- [ ] Build padrão.
- [ ] Build estático (GITHUB_PAGES=true).
- [ ] Home e páginas internas navegáveis.
- [ ] Links externos /croquis, /editor, Google Play e App Store.
