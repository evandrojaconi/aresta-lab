# Plugins do Aresta Intelligence

A intenção é permitir que outras equipes e apoiadores instalem integrações sem receber acesso às credenciais do Aresta.

**Estado em 22/11/2026:** manifestos e catálogo. **Não** há execução remota desses plugins no navegador; sem OAuth e backend verificado, os botões não publicam nada.

## Contrato

Cada extensão precisa declarar: versão de schema, origem, credenciais exigidas, escopos mínimos, tipo da ação, se exige aprovação humana, sensibilidade dos dados e contratos canônicos.

Ações `read` podem alimentar um dashboard autorizado. Ações `draft` geram rascunhos. Ações `publish/mutate/execute` exigem identidade, autorização por workspace, aprovação e auditoria. Tokens externos ficam em cofre de secrets do backend e nunca no GitHub nem em campos públicos do banco.

Os contratos do Editor são os do `aresta_api/openapi/colaboracao.yaml`; a implementação do Editor PyQt6 e seu servidor MCP estão em `aresta_db/editor/mcp/`. A presença desses arquivos comprova código e documentação, não conexão remota deste CRM.

## Extensibilidade

1. Novo workspace começa sem membros externos automaticamente.
2. Administrador aprova membros e ações permitidas.
3. Plugin é cadastrado como `catalogued` ou `needs_auth`.
4. Teste de autorização e capacidade confirma leitura, escrita ou publicação com escopos específicos.
5. Só então registrar `connected` e `last_verified_at`.

**Não usar o repositório público para armazenar** mensagens, contatos, tokens, chaves, histórico comercial ou arquivos privados. Licenças do Editor (MPL 2.0) e da base estruturada (ODbL) são distintas dos direitos autorais de imagens e textos.
