# ARESTA Intelligence — estado verificado em 22/11/2026

## Implantação

- Supabase **aresta-lab**: projeto `fqurgrujuqcogbjrsytt`, ativo, organização `aresta-climb-agent-editor`, região `us-west-2`.
- Esquema aplicado no banco (sem acesso público deliberado): `001_core`, `002_evidence`, `003_knowledge_and_extensions` e `004_isolate_workspaces`.
- Nove tabelas `crm_*` com RLS ativada; `get_advisors(type=security)` retornou **nenhum alerta** após revogar `EXECUTE` de função de auditoria.
- 44 snapshots do Notion importados com origem: 9 ações, 18 projetos, 7 pautas, 5 territórios, 3 parceiros, 2 registros de inteligência. A importação foi **pontual**, não sincronização contínua.
- Dados separados: Aresta 30, Pessoal 6, FEMEMG 3, ACEC 2, Igarameca 3.
- O catálogo contém 10 integrações/extensões; **0 estão autenticadas pelo CRM**.
- Código: frontend Vite com páginas Hoje, Pipeline, Conhecimento, Extensões, Relacionamentos, Canais e IA.
- [PR #19](https://github.com/evandrojaconi/aresta-lab/pull/19) está em Draft. O job `crm` passou no GitHub Actions, mas login Google, autorização e browser E2E não foram testados.

## O que falta para login real

1. No Supabase do projeto `aresta-lab`, habilitar Google em Authentication → Providers; associar Google Cloud OAuth Client ID/Secret e URL `https://fqurgrujuqcogbjrsytt.supabase.co/auth/v1/callback`.
2. Publicar frontend em **URL de homologação separada** da landing; cadastrar a URL como `Site URL` ou URL permitida de redirect.
3. O primeiro login retorna um `auth.users.id` que deve receber `membership` manual aprovada para os cinco workspaces **necessários**, sem concessão automática a terceiros.
4. Testar leitura e escrita, sessão de usuário externo, histórico e troca de workspace em dois navegadores.
5. Só depois ativar conexões externas: tokens em secrets do servidor, escopos mínimos, auditoria, aprovação humana e limites de custo para IA.

## Fontes e licenças reais do Editor

- [aresta_db](https://github.com/aresta-climb/aresta_db): ferramentas Editor/MCP, processo de colaboração, catálogo SQLite, licença de código MPL 2.0; metadados ODbL; imagens/textos pertencem aos autores.
- [aresta_api](https://github.com/aresta-climb/aresta_api): contratos OpenAPI/Protobuf/SQL; referenciar contratos, não copiar banco privado.
- [aresta_app](https://github.com/aresta-climb/aresta_app): contas, Caderneta e integrações documentadas; a existência de documentação não significa acesso a um backend compartilhado com o CRM.
- O plano de colaboração do Editor documenta OTP e Git Proxy; aprovações e merges exigem mantenedores autorizados.

## Políticas para outras empresas

Cada instituição usa workspace e memberships próprios; dados pessoais e credenciais não são compartilhados. Um plugin declara capacidades, permissões, origem, aprovação necessária e nível de confidencialidade. A construção do contrato não cria autorização da API do provedor.

## Estado de produção

**Não publicado.** A GitHub Pages atual do Aresta Lab, landing pública, Aresta App e Editor permanecem sem modificações em `main`. Não afirmar Google Auth, Instagram, LinkedIn, WhatsApp ou Canva vinculados ao CRM antes de testes concluídos.
