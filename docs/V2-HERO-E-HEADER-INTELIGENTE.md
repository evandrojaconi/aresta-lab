# Aresta Lab V2.2 — Hero legível e cabeçalho inteligente

## Brief visual
Referência enviada pelo usuário: menu flutuante integrado à imagem de rocha, com estilos claro e escuro, logo oficial à esquerda, poucos destinos e CTA de download à direita.

## Mudanças implementadas na V2

- **Hero:** fotografia original mantida; filtros de brilho (0,62) e saturação (0,8), com gradiente escuro de sobreposição e sombra discreta nos textos. O conteúdo do hero permanece editável e os CTAs originais foram preservados.
- **Header:** agora posicionado fora da seção `hero` para funcionar ao longo de toda a landing. Fundo translúcido com blur e mudança discreta de opacidade/sombra no scroll. Respeita o tema claro/escuro da própria página.
- **Scroll:** menu visível ao abrir a página; desaparece gradualmente após a pessoa rolar **para baixo** e reaparece quando rola **para cima**. Ao voltar próximo do topo, aparece novamente. Permanece visível enquanto um menu estiver aberto ou houver foco de teclado. Em preferência por movimento reduzido, não some.
- **Menu principal (desktop):** Aplicativo · Croquis · Diário de Rocha · Sobre. CTA **Baixar App** e alternador de tema permanecem.
- **Sobre:** agrupa Comunidade, Por que Aresta, Editor Aresta, Acesso offline, Picos e cobertura, Autoria e comunidade, Código aberto e Dúvidas frequentes.
- **Mobile:** um menu único com download, as jornadas principais e um bloco "Conheça o Aresta"; fecha ao escolher link, clicar fora ou apertar Escape.
- **URLs:** Croquis abre o catálogo oficial https://arestaclimb.com/croquis. Diário de Rocha abre /v2/blog/. Baixar App usa a página do aplicativo do espelho oficial de homologação. Nenhuma rota de produção foi alterada.

## QA e limites
- Build roda a partir do HTML premium íntegro em `lab-v2/premium/source.html`; os ajustes são gerados por `scripts/build-v2.mjs` e `lab-v2/premium/enhancements.{css,js}`.
- QA estático confere o posicionamento do header, rótulos de navegação, links e estados de rolagem em `scripts/verify-premium-v2.mjs`.
- O QA estático não mede contraste WCAG com medidor de pixel ou substitui inspeção real em diversos dispositivos. Essas verificações visuais continuam sendo um gate editorial.
- O site `arestaclimb.com` não foi modificado. A V2 segue em homologação e com `noindex`.

## Critérios de aceitação
1. Hero com texto legível sobre foto preservada em desktop e mobile.
2. Menu flutuante que não impede a leitura nem cobre os controles.
3. Scroll para baixo oculta menu; scroll para cima revela; teclado e movimento reduzido mantêm acesso.
4. Menus e drop-downs abrem e fecham; alternador de tema e CTAs não quebram.
5. Links Croquis, Diário de Rocha, Editor e App funcionam no ambiente de homologação.

## Atualização V2.2
A fonte oficial do logotipo foi substituída pelo arquivo INPI do repositório `aresta_app`. A barra foi limitada a 1.000 px e compactada, com a navegação de desktop disponível a partir de 961 px. Consulte [a fonte da marca](LOGO-OFICIAL-SEO.md).
