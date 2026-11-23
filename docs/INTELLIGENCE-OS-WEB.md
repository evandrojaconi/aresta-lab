# Modelo web de Territórios

A página de protótipo usa HTML e CSS para o desenho e Vite para empacotar os módulos para o GitHub Pages. A criação de rascunhos usa TypeScript e armazenamento local. O painel de Territórios, os campos e a revisão de sugestões continuam na mesma navegação.

## Rodar

```sh
bun install --frozen-lockfile
bun run dev:intelligence-os
```

Em Territórios, escolha **Criar Croqui**, salve um rascunho e volte a abri-lo em **Seus rascunhos**.

## Caminho para o produto

- Frontend: mantenha os componentes e a navegação web como referência de produto. Evolua os módulos de tela para TypeScript conforme forem implementados.
- Backend: o formulário usa um repositório de rascunhos local. Quando houver persistência compartilhada, adapte a tela para um repositório assíncrono no workspace autenticado, com validação e direitos de acesso no servidor. A tabela e as políticas devem ficar em migrations versionadas.
- Qualidade: os exemplos de foto, localização e trilha demonstram a experiência. Para mostrar pendências reais, exponha um resultado do avaliador oficial por croqui e versão. Use esse resultado para abrir as tarefas relevantes.
- Publicação: aproveitamento de mídia, revisão e envio ao ArestaDB são fluxos próprios. Um rascunho salvo no navegador não é um croqui publicado.
