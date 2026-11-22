# Aresta Intelligence — comece aqui (somente uso pessoal)

**Não publicar site. Não configurar Google Cloud. Não integrar redes sociais agora.**

Já está pronto no repositório: interface, acervo migrado, dados no Supabase `aresta-lab`, banco com RLS e login por link de e-mail. A infraestrutura do Google não é necessária.

## Abrir localmente no seu Windows

1. Clone/abra no GitHub Desktop a branch `feat/aresta-intelligence-crm-sprint0` do repositório `evandrojaconi/aresta-lab`.
2. Abra um terminal PowerShell na pasta `intelligence` e rode:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

3. No navegador, abra **http://localhost:5173**.
4. Digite seu e-mail e abra o link recebido. O Supabase pode exigir que **http://localhost:5173/** esteja cadastrado em [Authentication → URL Configuration](https://supabase.com/dashboard/project/fqurgrujuqcogbjrsytt/auth/url-configuration) como redirect permitido.
5. No primeiro login, a tela mostrará um ID de usuário. Como o CRM contém dados privados, ele não concede permissão automaticamente: um administrador precisa aprovar esse ID na tabela `crm_memberships`. Essa é uma única liberação por pessoa; não tem nada a ver com publicar um aplicativo.
6. Depois disso, o CRM abre os cinco espaços, respeitando o acesso individual, e mostra as tarefas e o conhecimento migrado.

**O que NÃO está ativo:** publicação direta no Instagram/LinkedIn/WhatsApp, edição de croquis pelo MCP, sincronização contínua com Notion/Canva/Drive e IA remota. Essas extensões estão catalogadas com seus contratos, mas requerem autenticação específica antes de executar.

**Segurança:** a chave no `.env.example` é apenas a *publishable key*, destinada a clientes. Não colocar `service_role`, client secrets, senhas ou tokens em arquivos versionados. O projeto continua privado quanto aos dados graças às políticas RLS; entretanto, o código está numa **branch de um repositório público existente**, acessível a quem visita o GitHub.

**Quando terminar o teste:** pressione Ctrl+C no terminal. Nada foi publicado ou implantado em hospedagem.
