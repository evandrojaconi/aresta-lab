-- ARESTA Intelligence: módulos executáveis de Marketing, Produto e Dados.
-- Preserva ArestaDB, contas do app, Editor, Notion e fontes externas.
create table if not exists public.crm_content_items (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 title text not null check(length(trim(title)) between 3 and 240),
 brand text not null default 'Aresta',
 channel text not null default 'Instagram' check(channel in ('Instagram','LinkedIn','Facebook','WhatsApp','Discord','Site','Outro')),
 stage text not null default 'ideia' check(stage in ('ideia','rascunho','revisao','aprovado','agendado','publicado','medido')),
 objective text not null default '',
 caption text not null default '',
 asset_url text,
 source_url text,
 scheduled_at timestamptz,
 published_url text,
 result_notes text not null default '',
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint content_published_evidence check(stage not in ('publicado','medido') or
    (published_url is not null and length(trim(published_url)) >= 10))
);
create table if not exists public.crm_product_proposals (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 product_area text not null check(product_area in ('App','Editor','Landing','Intelligence','API','ArestaDB','Outro')),
 kind text not null check(kind in ('Bug','UX/UI','Funcionalidade','Dados','Pesquisa','Experimento')),
 title text not null check(length(trim(title)) between 3 and 240),
 problem text not null default '',
 hypothesis text not null default '',
 evidence_url text,
 impact text not null default 'Médio' check(impact in ('Baixo','Médio','Alto')),
 effort text not null default 'A avaliar' check(effort in ('Baixo','Médio','Alto','A avaliar')),
 stage text not null default 'capturada' check(stage in ('capturada','investigar','proposta','priorizada','implementando','entregue','medida')),
 next_action text not null default '',
 github_issue_url text,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.crm_metric_sources (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 provider text not null check(provider in ('Umami','Looker Studio','GA4','Outro')),
 display_name text not null,
 source_url text not null,
 connection_status text not null default 'link_only' check(connection_status in ('link_only','needs_auth','connected','error')),
 last_fetched_at timestamptz,
 last_error text,
 source_ref text not null,
 unique(workspace_id,provider,source_ref)
);
create table if not exists public.crm_metric_snapshots (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 source_id uuid not null references public.crm_metric_sources(id) on delete cascade,
 metric_name text not null check(length(trim(metric_name)) between 2 and 120),
 metric_value numeric not null,
 metric_unit text not null default '',
 period_label text not null default '',
 observed_at timestamptz not null default now(),
 provenance text not null default 'manual' check(provenance in ('manual','csv','api','verified_report')),
 source_note text not null default '',
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);
create index if not exists crm_content_workspace_stage on public.crm_content_items(workspace_id,stage,scheduled_at);
create index if not exists crm_product_workspace_stage on public.crm_product_proposals(workspace_id,stage);
create index if not exists crm_snapshots_by_source on public.crm_metric_snapshots(workspace_id,source_id,observed_at desc);
create trigger crm_content_updated before update on public.crm_content_items
 for each row execute function public.crm_touch_updated_at();
create trigger crm_product_updated before update on public.crm_product_proposals
 for each row execute function public.crm_touch_updated_at();
create trigger crm_content_audit after insert or update or delete on public.crm_content_items
 for each row execute function public.crm_audit_change();
create trigger crm_product_audit after insert or update or delete on public.crm_product_proposals
 for each row execute function public.crm_audit_change();
alter table public.crm_content_items enable row level security;
alter table public.crm_product_proposals enable row level security;
alter table public.crm_metric_sources enable row level security;
alter table public.crm_metric_snapshots enable row level security;
create policy content_read on public.crm_content_items for select to authenticated using(public.crm_is_member(workspace_id));
create policy content_create on public.crm_content_items for insert to authenticated with check(public.crm_can_edit(workspace_id));
create policy content_edit on public.crm_content_items for update to authenticated using(public.crm_can_edit(workspace_id)) with check(public.crm_can_edit(workspace_id));
create policy content_delete on public.crm_content_items for delete to authenticated using(public.crm_can_edit(workspace_id));
create policy proposal_read on public.crm_product_proposals for select to authenticated using(public.crm_is_member(workspace_id));
create policy proposal_create on public.crm_product_proposals for insert to authenticated with check(public.crm_can_edit(workspace_id));
create policy proposal_edit on public.crm_product_proposals for update to authenticated using(public.crm_can_edit(workspace_id)) with check(public.crm_can_edit(workspace_id));
create policy proposal_delete on public.crm_product_proposals for delete to authenticated using(public.crm_can_edit(workspace_id));
create policy metric_sources_read on public.crm_metric_sources for select to authenticated using(public.crm_is_member(workspace_id));
create policy metric_sources_create on public.crm_metric_sources for insert to authenticated with check(public.crm_can_edit(workspace_id));
create policy metric_sources_update on public.crm_metric_sources for update to authenticated using(public.crm_can_edit(workspace_id)) with check(public.crm_can_edit(workspace_id));
create policy metric_read on public.crm_metric_snapshots for select to authenticated using(public.crm_is_member(workspace_id));
create policy metric_create on public.crm_metric_snapshots for insert to authenticated
 with check(public.crm_can_edit(workspace_id) and exists(
   select 1 from public.crm_metric_sources s where s.id=source_id and s.workspace_id=crm_metric_snapshots.workspace_id
 ));
grant select,insert,update,delete on public.crm_content_items,public.crm_product_proposals to authenticated;
grant select,insert,update on public.crm_metric_sources to authenticated;
grant select,insert on public.crm_metric_snapshots to authenticated;

-- Disponibilidade da URL não prova acesso às métricas nem integração de API.
insert into public.crm_metric_sources (workspace_id,provider,display_name,source_url,source_ref,connection_status)
select w.id,v.provider,v.name,v.url,v.ref,'link_only'
from public.crm_workspaces w
cross join (values
 ('Umami','Analytics Aresta — tráfego e eventos',
  'https://analytics.arestaclimb.com/teams/c6e33b9d-ee6d-43f0-9c95-f95dfa72a698/websites/acafa0de-17ce-402b-a249-876ca5722659',
  'acafa0de-17ce-402b-a249-876ca5722659'),
 ('Looker Studio','Relatórios do produto — Looker Studio',
  'https://datastudio.google.com/u/0/reporting/b9413f94-dc15-4e6e-ac43-059d055ecc82/page/sSF8F?s=lzUMW7bmz6M',
  'b9413f94-dc15-4e6e-ac43-059d055ecc82')
) v(provider,name,url,ref)
where w.slug='aresta' on conflict (workspace_id,provider,source_ref) do nothing;
