# Aresta Lab V2.5 — Header que some como notificação

## Problema observado
Após as alterações na landing V2.4, o menu mobile ficou desproporcional. Uma regra de `display:grid` fazia o conteúdo do `details` aparecer mesmo quando fechado em determinados navegadores; o `:focus-within` disparado por toque podia contrariar a animação de ocultação do header. A largura fixa de 440 px na versão mobile também prejudicava telas intermediárias.

## Correção implementada
- Navbar central com largura fluida e limite de **560 px até 840 px de viewport**, altura **54 px** e área de toque dimensionada. Desktop mantém limite de **780 px**.
- Menu mobile fechado com `display:none` explícito; aberto como painel ancorado ao lado direito da barra, largura máxima de 350 px, altura limitada a 69dvh e rolagem própria.
- Header de comportamento **notificação**: no topo aparece; descendo a página some progressivamente; ao subir reaparece. O menu aberto e o foco via teclado mantêm o header visível. O simples toque em um controle não bloqueia o desaparecimento.
- `Escape`, toque fora e escolha de link fecham o dropdown. Suporte a `prefers-reduced-motion` sem animação.
- Mantidos links de Aplicativo, Croquis web, Comunidade, Diário de Rocha, Editor, Offline, FAQ, o tema e o CTA do app.

## QA
Verificações automatizadas em `scripts/verify-premium-v2.mjs`: estados do dropdown, breakpoint CSS/JS, limite do painel e lógica de scroll/foco. Teste de componente em Chromium headless com fragmento representativo do HTML e CSS: **320, 390, 430, 768, 1.024 px**; sem overflow; scroll down/up e abrir/fechar funcionais.

**Limite:** o teste isolado não substitui inspeção manual do site inteiro em Safari/iOS e Android. O domínio oficial `arestaclimb.com` não foi modificado.
