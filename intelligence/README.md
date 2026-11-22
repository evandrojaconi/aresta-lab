# ARESTA Intelligence — CRM de Operação (Sprint 0)

**Estado:** MVP versionado em branch de desenvolvimento. NÃO é um CRM implantado, autenticado ou conectado a contas reais.

Este é um aplicativo independente da landing Aresta Lab. O repositório que guarda o protótipo é público: não incluir contatos reais, chaves, credenciais ou documentos pessoais. Dados internos, depois de autorizados, ficam em um Supabase isolado e protegido por RLS.

## Entregue em código

- Visão de hoje, Pipeline, Relacionamentos, Canais, IA & Evidências, Configuração.
- Prioridades P0–P3; etapas Entrada, Pronto, Em execução, Aguardando, Revisão, Concluído e Medido.
- Tarefa com prazo, fonte, próxima ação, DoD, registro de evidência e auditoria. *Medido* exige evidência.
- Contatos privados com etapa de negociação, próximo follow-up e histórico de interações.
- Login Google via Supabase Auth e **autorização individual separada** via membership (admin/editor/viewer).
- PostgreSQL com Row Level Security por workspace e histórico das mudanças.
- Painel de canais SEM declarar integrações como conectadas.
- Triagem por regras funciona sem IA; Edge Function de IA opcional, com chave apenas em servidor e escopo minimizado.
- Modo prévia mostra apenas tarefas ilustrativas e não permite escrita quando o Supabase está sem configuração.

## Subir o ambiente

1. Criar um **projeto Supabase exclusivo para o CRM** ou selecionar um projeto sob aprovação técnica. Não reaproveitar automaticamente a base do app de escalada.
2. Executar, nesta ordem, `sql/001_core.sql` e `sql/002_evidence.sql` no SQL Editor. Serão criados o workspace `aresta`, dez canais ainda não conectados e cinco tarefas iniciais, sem contatos pessoais.
3. Ativar Google em Supabase → Authentication → Providers. Criar credenciais OAuth Web no Google Cloud Console e configurar callback **`https://<project-ref>.supabase.co/auth/v1/callback`**. Configurar URL principal e Redirect URLs do frontend no Supabase Auth.
4. Copiar `.env.example` para `.env.local`. Preencher `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` com os valores PÚBLICOS do projeto. **Jamais** usar `service_role`, secret key, Client Secret Google ou tokens de rede social em `VITE_`.
5. Executar dentro de `intelligence/`:

```bash
npm install
npm run test
npm run build
npm run dev
```

6. Entrar com Google pela primeira vez. A tela exibirá o ID de `auth.users` e NÃO dará acesso ao CRM. Após a aprovação do administrador, executar manualmente no SQL Editor:

```sql
insert into public.crm_memberships (workspace_id,user_id,role)
select id, '<UUID_DO_LOGIN_GOOGLE>'::uuid, 'admin'
from public.crm_workspaces where slug='aresta'
on conflict (workspace_id,user_id) do update set role=excluded.role;
```

7. Recarregar: agora o usuário aprovado poderá ler e editar tarefas. Confirmar que **outro Google sem membership** não consegue visualizar informações, inclusive por consulta direta à API Supabase.
8. O CRM deve ter hospedagem própria. Em subpasta, configurar `VITE_PUBLIC_BASE=/subcaminho/` e cadastrar a URL final exata em Supabase Auth → Redirect URLs. O hosting publica `dist/` e não deve publicar SQL ou arquivos `.env`.

## IA opcional após login

A função `supabase/functions/ai-triage/index.ts` é chamada **apenas por clique**, após validar JWT e membership, com até dez tarefas sem contatos, telefones, e-mails, documentos ou credenciais.

Para ativar, usar Supabase CLI na pasta `intelligence/`, vincular o projeto e executar `supabase functions deploy ai-triage`. Configurar no serviço os secrets `OPENAI_API_KEY`, `OPENAI_MODEL` (opcional) e `CRM_ALLOWED_ORIGIN` (origem HTTPS exata do frontend, sem barra final). Antes de uso contínuo, adicionar quota/rate-limit, limites de custo, testes de segurança, política de retenção e registros sem dados pessoais. A função não publica em rede social.

## Canais — estado inicial real

| Canal/fonte | Estado | Dependência |
| --- | --- | --- |
| Notion | Sem sync | Mapear bases existentes e usar IDs externos, sync unidirecional revisado |
| GitHub | Conectado ao ChatGPT, não ao CRM | Webhooks/proxy no servidor para PR e releases |
| Google Drive | Sem sync no CRM | OAuth separado com escopos mínimos |
| Google Calendar | Sem sync no CRM | OAuth separado e leitura de agenda |
| Gmail | Sem sync no CRM | OAuth separado e seleção de conversas |
| Instagram/Meta e Facebook | Sem API no CRM | Conta profissional/página, Meta app, permissões e revisão |
| LinkedIn | Sem API no CRM | Permissões de publicação da organização e app autorizado |
| WhatsApp | Sem API no CRM | WhatsApp Business Platform (incluindo Groups API quando elegível); não assumir acesso automático aos grupos pessoais já existentes |
| Discord | Sem API no CRM | Bot/webhook limitado a canal aprovado |

O login Google não concede acesso automático a Drive, Calendar ou Gmail. Publicação é sempre aprovada por humano e verificada na plataforma de destino. Tokens permanecem em secrets do servidor. Nenhuma integração deve trocar dados sem consentimento, escopo definido, idempotência, auditoria e tratamento de erros.

## Sistemas de referência

Notion registra trabalho e decisões existentes; GitHub é fonte de implementação; Drive mantém documentos e evidências; o Supabase será a fonte do estado operacional do CRM **após implantação**. Os registros de Sprint 0 são um espelho inicial, não uma sincronização bidirecional com o Notion.

O CRM separado não modifica Aresta App, Editor, /croquis ou a landing de produção. Não misturar com dados do app sem revisão conjunta dos fundadores.

**Antes de considerar concluído:** testes e build passam; OAuth validado; usuário permitido entra e grava em dois dispositivos; usuário não permitido não vê dados; canal não verificado continua indicado como não conectado.

Ver [Sprint 0](SPRINT-0.md).
