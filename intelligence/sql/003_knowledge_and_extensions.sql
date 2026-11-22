-- Aresta Intelligence: metadados e acervo replicável por workspace.
-- Não modificar tabelas dos croquis, contas ou ferramentas do Editor.
revoke all on function public.crm_audit_change() from public, anon, authenticated;
revoke all on function public.crm_touch_updated_at() from public, anon, authenticated;

create table if not exists public.crm_knowledge_records (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  source_system text not null check (source_system in ('notion','github','drive','canva','editor','manual')),
  source_collection text not null check (length(source_collection) between 1 and 120),
  source_id text not null check (length(source_id) between 1 and 512),
  source_url text,
  record_kind text not null check (record_kind in ('project','editorial','territory','evidence','partner','task','resource')),
  title text not null,
  summary text not null default '',
  area text not null default 'Aresta',
  source_status text,
  priority text,
  source_updated_at timestamptz,
  last_synced_at timestamptz not null default now(),
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (workspace_id,source_system,source_collection,source_id)
);
comment on table public.crm_knowledge_records is 'Snapshots selecionados, com proveniência, importados de bases existentes. A fonte original não é modificada.';

create table if not exists public.crm_extensions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  extension_key text not null,
  display_name text not null,
  category text not null default 'integration' check (category in ('integration','workflow','tool','report','plugin')),
  status text not null default 'catalogued' check (status in ('catalogued','needs_auth','planned','connected','disabled')),
  description text not null default '',
  source_url text,
  permissions jsonb not null default '[]'::jsonb,
  config_public jsonb not null default '{}'::jsonb,
  last_verified_at timestamptz,
  unique(workspace_id,extension_key)
);
comment on table public.crm_extensions is 'Manifesto de capacidade. Não guarda chaves nem tokens. Não implica acesso ao Aresta Editor.';
alter table public.crm_knowledge_records enable row level security;
alter table public.crm_extensions enable row level security;

create policy "crm_knowledge_select" on public.crm_knowledge_records
for select to authenticated using(public.crm_is_member(workspace_id));
create policy "crm_knowledge_insert" on public.crm_knowledge_records
for insert to authenticated with check(public.crm_can_edit(workspace_id));
create policy "crm_knowledge_update" on public.crm_knowledge_records
for update to authenticated using(public.crm_can_edit(workspace_id)) with check(public.crm_can_edit(workspace_id));
create policy "crm_extensions_select" on public.crm_extensions
for select to authenticated using(public.crm_is_member(workspace_id));
create policy "crm_extensions_write" on public.crm_extensions
for all to authenticated using(public.crm_can_edit(workspace_id)) with check(public.crm_can_edit(workspace_id));

grant select on public.crm_knowledge_records,public.crm_extensions to authenticated;
grant insert,update on public.crm_knowledge_records to authenticated;
grant insert,update,delete on public.crm_extensions to authenticated;

create index if not exists crm_records_workspace_area on public.crm_knowledge_records(workspace_id,record_kind,area);
create index if not exists crm_records_title_search on public.crm_knowledge_records using gin(to_tsvector('portuguese',title||' '||summary));

-- Domínios replicáveis para novas equipes; instalar conectores só depois de OAuth / autorização.
insert into public.crm_extensions (workspace_id,extension_key,display_name,category,status,description,source_url)
select w.id,v.key,v.name,v.category,v.status,v.description,v.url
from public.crm_workspaces w
cross join (values
('notion','Notion: backlogs e fontes','integration','needs_auth','Importação inicial por conexão do ChatGPT; sync do app depende de token próprio e permissão.','https://www.notion.so'),
('canva','Canva: design e criação','integration','needs_auth','Brand Kit encontrado pelo conector ChatGPT; não implica OAuth da aplicação.','https://www.canva.com'),
('instagram','Instagram Business','integration','needs_auth','Publicação requer Meta ou ferramenta de agendamento autorizada.','https://www.instagram.com'),
('linkedin','LinkedIn Page','integration','needs_auth','Publicar requer credenciais e permissões da página.','https://www.linkedin.com'),
('whatsapp','WhatsApp e comunidade','integration','needs_auth','API oficial tem elegibilidade e restrições; não há leitura de grupos comuns neste MVP.','https://www.whatsapp.com'),
('github','GitHub: repositórios e PRs','integration','needs_auth','Ler fluxo do Editor; eventual webhook vai ao backend, não ao browser.','https://github.com/aresta-climb'),
('editor_mcp','Editor Aresta MCP','tool','catalogued','Ferramentas MCP PyQt6 presentes no aresta_db; exigem ponte autenticada e revisão técnica.','https://github.com/aresta-climb/aresta_db/tree/main/editor/mcp'),
('editor_git_proxy','Editor: Git Proxy','workflow','catalogued','Fluxo autenticado de sugestões de croqui do Editor; não reutilizar sem validar backend.','https://github.com/aresta-climb/aresta_db/blob/main/docs/plano_colaboracao_editor.md'),
('aresta_db','ArestaDB: catálogo','integration','catalogued','Dados estruturados licenciados ODbL e contratos da API; imagens e textos têm direitos separados.','https://github.com/aresta-climb/aresta_db'),
('crm_ai','IA de triagem','plugin','planned','Edge Function separada; requires key, modelo, cotas e consentimento específico.','https://github.com/evandrojaconi/aresta-lab/pull/19')
) v(key,name,category,status,description,url)
where w.slug='aresta'
on conflict(workspace_id,extension_key) do nothing;
