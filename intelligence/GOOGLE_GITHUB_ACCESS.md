# Identidade do CRM e permissões de repositórios

**Decisão vigente:** acesso ao Aresta Intelligence por **e-mail e senha** da conta pessoal já autorizada no Supabase. Google OAuth fica como alternativa futura opcional. Não é obrigatório criar um aplicativo no Google Cloud para trabalhar no CRM.

## GitHub

O e-mail confirmado do CRM identifica a pessoa e suas memberships. O administrador pode associar esse e-mail a um usuário e repositórios GitHub específicos, com permissão `read` ou `propose`, na tabela `crm_github_approvals`, protegida por RLS.

**Atenção:** essa tabela é a lista de permissões desejadas, não uma autenticação GitHub operacional. Para repositórios privados, uma instalação de GitHub App/OAuth ainda precisa ser autorizada pelo dono da conta, com escopos limitados. Nenhuma senha Google ou GitHub precisa ser armazenada no CRM. Não há merge automático de PRs.

## Segurança

- Supabase Auth armazena **hash** de senhas e persiste sessões; o front-end nunca mantém a senha no banco ou no GitHub.
- O proprietário pode gerar senha forte localmente e atualizá-la por `auth.updateUser` estando autenticado.
- O usuário escolhe se quer salvar a credencial no navegador/gerenciador pessoal.
- Tokens de serviços externos pertencem ao servidor e devem ser revogáveis; dados de organizações permanecem isolados por RLS.
