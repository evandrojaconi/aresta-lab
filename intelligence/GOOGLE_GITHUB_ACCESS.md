# Login Google + permissões GitHub (Aresta Intelligence)

## Regra de produto aprovada para o CRM

- **Entrar no CRM:** autenticar pelo Google usando um e-mail cadastrado e previamente autorizado para o workspace.
- **Acessar GitHub:** a conta Google não é uma conta GitHub. O proprietário do workspace define um `github_login`, repositório e permissão (`read` ou `propose`) para o e-mail Google autorizado.
- **Conta GitHub privada:** para o CRM acessar via API um repositório privado, ainda é necessária a autorização oficial do GitHub (GitHub App de instalação limitada a repositórios específicos, ou OAuth com escopos mínimos). Google sozinho não fornece tokens de GitHub.
- **Nenhum merge automático:** operações que escrevem código exigem confirmação explícita e escopos apropriados.
- **Nenhuma concessão automática:** a tabela `crm_github_approvals` inicia vazia, só admin pode incluir ou revogar, e registra a configuração no Supabase com RLS.
- **Status atual:** regras de permissão implementadas. Integração real da API GitHub **não implantada** até existir uma instalação OAuth/GitHub App autenticada e verificada.

## Migração de login, sem interromper a conta atual

O Supabase `fqurgrujuqcogbjrsytt` possuía, no momento da implementação, **uma identidade do tipo email** e nenhuma identidade `google`. O novo botão “Entrar com Google” só habilita automaticamente quando o próprio Supabase reportar que Google está configurado; a forma antiga de Magic Link continua escondida em “Acesso por e-mail (transição)” até que o proprietário teste e aprove o login Google.

Para habilitar autenticação Google verdadeira é necessário **uma única vez**, sem publicar o CRM ou lançar um aplicativo público:

1. Configurar consentimento OAuth em modo **Testing** com a conta do proprietário e criar um **OAuth Client ID de aplicativo Web** na conta Google Cloud escolhida. Essa etapa técnica é obrigatória para login real com Google.
2. Cadastrar Client ID e Secret em Supabase → Authentication → Sign In / Providers → Google. A callback é `https://fqurgrujuqcogbjrsytt.supabase.co/auth/v1/callback`.
3. Manter o endereço `https://evandrojaconi.github.io/aresta-lab/intelligence/**` em Authentication → URL Configuration → Redirect URLs.
4. Testar a entrada pela conta Google cadastrada. Supabase poderá vincular a identidade à conta de e-mail pré-existente após validar o e-mail; confirmar que memberships e tarefas foram preservados.
5. Só depois de teste de acesso negado para Google não autorizado e validação do fluxo, remover o Magic Link provisório.

**Nunca versionar segredos OAuth no GitHub. Nunca compartilhar Client Secret no chat.**

## Modelo de segurança na integração futura

- Sessão Google verificada pelo Supabase; conta e e-mail autorizados ao workspace.
- Aprovação do repositório por um administrador no CRM, com conta GitHub exata, repositório exato e `read` ou `propose`.
- Backend verifica credenciais GitHub App/instalação, identidade associada, autorização do repositório e escopos efetivos antes de cada requisição.
- Repositórios privados não são acessíveis apenas com aprovação textual no banco.
- Auditoria de operações, revogação e segregação por workspace.
