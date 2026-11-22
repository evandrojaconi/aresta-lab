# Integrações — Aresta Intelligence

**Verificado em:** 2026-11-22; fonte: consultas autenticadas dos conectores disponíveis ao ChatGPT.

> **Importante:** "Conectado ao ChatGPT" NÃO significa "conectado ao CRM web". OAuth, tokens e permissões não são transferidos entre esses ambientes.

| Fonte | Conexão via ChatGPT | CRM web | Observação e próxima ação |
|---|---|---|---|
| Canva | SIM | NÃO | Brand Kit ARESTA CLIMB ID kAHZIoEeQCY e designs encontrados. O Content Planner pode agendar IG Business, Facebook Pages e LinkedIn Pages quando as contas estão autorizadas dentro do Canva; nenhuma publicação via CRM confirmada. |
| Notion | SIM | NÃO | Workspace e bases AÇÕES e Editorial acessíveis. Em 22/11 foram adicionadas seis tarefas, duas pautas e uma central na página existente. Integração direta CRM depende de token/API própria e deduplicação por external_key. |
| GitHub | SIM na conta evandrojaconi | Código local, sem webhook | PR #19 contém MVP isolado. Organização aresta-climb não acessível por essa conexão; nenhum merge no produto oficial. |
| Google Drive | SIM | NÃO | Pasta de pesquisa e arquivos acessíveis pelo conector ChatGPT; para CRM, exigir OAuth Drive com escopo mínimo. |
| Google Calendar | SIM | NÃO | Disponibilidade e compromissos acessíveis no ChatGPT; CRM exigirá integração autorizada independente. |
| Gmail | SIM | NÃO | Consultas autenticadas ao ChatGPT; CRM não lê mensagens nem envia e-mails. |
| Supabase | Ferramentas disponíveis; org visível, SEM projeto | NÃO | Organização única retornada: aresta-climb-agent-editor, plano Free. Criação do projeto depende de escolha explícita do usuário, confirmação de custo se houver e configuração OAuth. |
| Instagram | Não há API autenticada no CRM/ChatGPT | NÃO | Canva já é usado pelo fundador; verificar contas reais no Canva Content Planner ou conectar ferramenta de publicação. |
| Facebook | Não há API autenticada no CRM/ChatGPT | NÃO | Conferir página e Instagram Business vinculados no Content Planner. |
| LinkedIn | Não há API autenticada no CRM/ChatGPT | NÃO | Agendamento da Página depende de permissão da conta no Canva. |
| WhatsApp | Não há API autenticada | NÃO | Grupos pessoais não podem ser presumidos como compatíveis com API empresarial. Integrar somente após identificar modalidade elegível, administrador, consentimento e finalidade. |
| Discord | Não há webhook autenticado | NÃO | Pode usar webhook dedicado autorizado pelo administrador em etapa posterior. |
| OpenAI / ChatGPT | Disponível nesta conversa | Edge Function de IA em código, sem deploy | Não reutilizar sessão ChatGPT como API key. Exige OPENAI_API_KEY no backend, quotas e política de dados. |

## Links operacionais confirmados

- [Central Notion](https://app.notion.com/p/3f77f5b64c2c81358655f4903f7fc819)
- [AÇÕES](https://app.notion.com/p/718a8011c2314b7f81101d81e14b0541)
- [Editorial](https://app.notion.com/p/01f65babddcd45c39f02c3e8474604fc)
- [Canva — modelo de feed Aresta](https://www.canva.com/d/CRa23sgv0cPaImL)
- [Canva — logo Aresta](https://www.canva.com/d/jp8IxMQmEzRFwLd)
- [Pasta de pesquisa Drive](https://drive.google.com/drive/folders/1DKoEfrQR7fOM4loKwK3eP35I--mLycV0)
- [PR CRM](https://github.com/evandrojaconi/aresta-lab/pull/19)
- [Canva Content Planner — documentação](https://www.canva.com/pt_br/help/content-planner/)

## Critério de integração confirmada

Uma integração só passa para **VERIFICADA** quando uma chamada autenticada via próprio CRM obtiver um recurso permitido, registrar horário de teste e confirmar escopos. Para publicação, exigir autorização humana, realizar ação em canal de teste e registrar ID/URL da publicação de volta no CRM.

## Workflow-alvo

**Conteúdo:** Notion editorial → origem e fonte → peça Canva → texto por canal → aprovação → Canva Content Planner ou API com autorização → link real → métrica → evidência no Notion/CRM.

**Trabalho profundo:** Notion AÇÕES → priorização/duração/DoD → execução → revisão → entrega/evidência → decisão, sem duplicar dado em dois lugares.

**Privacidade:** nenhum token, e-mail pessoal, conteúdo de grupos ou dados do app devem ser versionados publicamente.
