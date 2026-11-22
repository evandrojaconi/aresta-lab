# ARESTA Intelligence — abrir o CRM na nuvem

**Link:** https://evandrojaconi.github.io/aresta-lab/intelligence/

O painel é um produto próprio na identidade do Aresta, diferente do sistema Alura. O frontend foi publicado pelo GitHub Pages do laboratório; o banco de dados está no Supabase `aresta-lab`. O domínio oficial `arestaclimb.com` não foi modificado.

## Primeiro acesso (uma vez)

1. Abra o endereço acima.
2. Digite o **mesmo e-mail da sua conta pessoal conectada** e clique em **Receber link de acesso**.
3. Abra o e-mail e confirme o link. O acesso à base foi previamente autorizado para esse e-mail verificado, em configuração privada no Supabase.
4. **Se o link redirecionar para endereço errado:** abra [Supabase Authentication → URL Configuration](https://supabase.com/dashboard/project/fqurgrujuqcogbjrsytt/auth/url-configuration) e acrescente em **Additional Redirect URLs** exatamente: `https://evandrojaconi.github.io/aresta-lab/intelligence/**`. Salve e solicite outro link.

Não é necessário Google Cloud, senha, OAuth, configurar domínio ou executar terminal.

## Funcionalidades já implementadas

- Painel Hoje, Pipeline de demandas, Conhecimento migrado, Extensões, Relacionamentos, Canais e recomendações determinísticas.
- Banco Supabase com RLS em todas as tabelas `crm_*`; 44 registros históricos importados do Notion e tarefas operacionais já cadastradas.
- Cinco workspaces por escopo: Aresta, Pessoal, FEMEMG, ACEC, Igarameca.
- Login privado por Magic Link; o e-mail verificado pré-aprovado recebe membership automaticamente após autenticação. Contatos e evidências ficam privados na base, não no GitHub.

## Ainda NÃO executa automaticamente

- Publicação no Instagram/LinkedIn/WhatsApp, integração do Canva Content Planner, sincronização contínua do Notion/Drive/Calendar, alteração de croquis pelo Editor MCP e IA remota não estão conectadas/implantadas. O painel indica os estados reais.
- A publicação bem-sucedida do GitHub Pages não substitui a confirmação de primeiro login e de gravação em dois dispositivos.

## Código e auditoria

- Frontend: `intelligence/src/`.
- Migrations aplicadas no banco: `intelligence/sql/001_*.sql` até `006_*.sql`.
- Pipeline de Pages: `.github/workflows/github-pages.yml`, etapa que monta `.output/public/intelligence/` sem alterar a landing.
- Todos os dados estão protegidos por membership; código e assets estáticos são públicos no GitHub Pages, como normalmente acontece em aplicações SPA.

Se o primeiro login falhar, o erro exato da tela do CRM é suficiente para corrigirmos o fluxo.
