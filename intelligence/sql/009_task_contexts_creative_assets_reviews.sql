-- Sprint UI: encaminhamento real de tarefas, biblioteca Canva e notas de revisão.
-- Somente metadados: nada de tokens, credenciais ou cópias de arquivos privados.
create table if not exists public.crm_task_contexts(
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 work_item_id uuid primary key references public.crm_work_items(id) on delete cascade,
 target_type text not null check(target_type in ('content','product','metrics','opportunities','pipeline')),
 target_id uuid,
 context_url text,
 created_at timestamptz not null default now()
);
create table if not exists public.crm_creative_assets(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 provider text not null default 'Canva' check(provider in ('Canva','Figma','Outro')),
 kind text not null check(kind in ('folder','design','reference')),
 label text not null,
 provider_id text not null,
 item_url text,
 category text not null default 'Marketing',
 verified_at timestamptz,
 created_at timestamptz not null default now(),
 unique(workspace_id,provider,kind,provider_id)
);
create table if not exists public.crm_review_marks(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 product_area text not null default 'App',
 view_url text not null,
 mark_x numeric(6,3),
 mark_y numeric(6,3),
 title text not null,
 observation text not null,
 stage text not null default 'capturada' check(stage in ('capturada','revisar','transformada')),
 proposal_id uuid references public.crm_product_proposals(id) on delete set null,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now(),
 constraint coords_both_or_neither check((mark_x is null)=(mark_y is null)),
 constraint coords_valid check((mark_x between 0 and 100 or mark_x is null) and (mark_y between 0 and 100 or mark_y is null))
);
alter table public.crm_task_contexts enable row level security;
alter table public.crm_creative_assets enable row level security;
alter table public.crm_review_marks enable row level security;
create policy task_contexts_select on public.crm_task_contexts for select to authenticated
using (public.crm_is_member(workspace_id));
create policy task_contexts_write on public.crm_task_contexts for all to authenticated
using (public.crm_can_edit(workspace_id)) with check (
 public.crm_can_edit(workspace_id) and
 exists(select 1 from public.crm_work_items t where t.id=work_item_id and t.workspace_id=workspace_id)
 and (target_type <> 'content' or target_id is null or
 exists(select 1 from public.crm_content_items c where c.id=target_id and c.workspace_id=workspace_id))
);
create policy creative_assets_select on public.crm_creative_assets for select to authenticated
using(public.crm_is_member(workspace_id));
create policy creative_assets_write on public.crm_creative_assets for all to authenticated
using(public.crm_can_edit(workspace_id)) with check(public.crm_can_edit(workspace_id));
create policy review_marks_select on public.crm_review_marks for select to authenticated
using(public.crm_is_member(workspace_id));
create policy review_marks_write on public.crm_review_marks for all to authenticated
using(public.crm_can_edit(workspace_id)) with check(public.crm_can_edit(workspace_id));
grant select,insert,update,delete on public.crm_task_contexts,public.crm_creative_assets,public.crm_review_marks to authenticated;
create index if not exists crm_assets_category on public.crm_creative_assets(workspace_id,category);
create index if not exists crm_review_marks_area on public.crm_review_marks(workspace_id,product_area,created_at desc);

-- Conectar as tarefas específicas às peças existentes, sem depender de busca textual.
insert into public.crm_task_contexts(workspace_id,work_item_id,target_type,target_id)
select t.workspace_id,t.id,'content',c.id
from public.crm_work_items t
join public.crm_content_items c on c.workspace_id=t.workspace_id
where (t.external_key='s0-rupestre-ig' and c.channel='Instagram' and c.title ilike '%Rupestre%')
   or (t.external_key='s0-rupestre-linkedin' and c.channel='LinkedIn' and c.title ilike '%Rupestre%')
on conflict(work_item_id) do update set target_type=excluded.target_type,target_id=excluded.target_id;

-- Pastas e modelos verificados na conta Canva conectada em 22/11/2026.
insert into public.crm_creative_assets(workspace_id,kind,label,provider_id,item_url,category,verified_at)
select w.id,v.kind,v.label,v.provider_id,v.item_url,v.category,now()
from public.crm_workspaces w
cross join (values
('folder','Biblioteca Aresta · Canva','FAHT36unQvg',null::text,'Marketing'),
('folder','Instagram · Feed e Stories','FAHT30LP71o',null::text,'Instagram'),
('folder','Feed · Instagram','FAHT3-J44D4',null::text,'Instagram'),
('folder','Stories · Instagram','FAHT34Dr1jw',null::text,'Instagram'),
('folder','Identidade · Branding','FAHT4GsPWps',null::text,'Marca'),
('folder','Landing Page','FAHT4nS3g2A',null::text,'Produto'),
('folder','Vídeos','FAHT4nO2bfQ',null::text,'Vídeos'),
('folder','FEMEMG · Comunicação','FAHZZyXwF20',null::text,'FEMEMG'),
('design','Feed Aresta · Instagram','DAHTZTPR9GI','https://www.canva.com/d/-ieTm-BrthtFrL7','Instagram'),
('design','Picos mais acessados no aplicativo','DAHah4KGw2c','https://www.canva.com/d/A4klpbuqVtSH9UB','Dados'),
('design','Campanha Comunidade e Apoio V3','DAHVCiXVDEA','https://www.canva.com/d/8mYB6h5y4IDpEZp','Comunidade'),
('design','Central de Marca e Comunidade','DAHZQAVscP8','https://www.canva.com/d/8g6zybC7ghtHhfn','Marca')
) v(kind,label,provider_id,item_url,category)
where w.slug='aresta'
on conflict(workspace_id,provider,kind,provider_id) do nothing;

-- Fotografia real consultada no relatório do usuário (NÃO coleta em tempo real).
insert into public.crm_metric_snapshots
(workspace_id,source_id,metric_name,metric_value,metric_unit,period_label,provenance,source_note,observed_at)
select m.workspace_id,m.id,v.metric,v.val,v.unit,'2026-01-01 a 2026-11-22','verified_report',
 'Fonte: painel Looker Studio Visão Geral dos Croquis, visualizado em 22/11/2026. Fotografia histórica, não sincronizada; conferir definição e cobertura antes de inferir conversões.',
 '2026-11-22T20:55:00Z'::timestamptz
from public.crm_metric_sources m
cross join (values
 ('Escaladores Ativos',766::numeric,'pessoas'),
 ('Tempo de Sessão (segundos)',1165::numeric,'seg'),
 ('Eventos por sessão',23.99::numeric,'eventos/sessão'),
 ('Croquis Abertos',3755::numeric,'aberturas'),
 ('Setores Visualizados',4723::numeric,'visualizações'),
 ('Escaladas Consultadas',16023::numeric,'consultas'),
 ('Sessões · Pedra Grande',515::numeric,'sessões'),
 ('Sessões · Gruta da Lapinha',180::numeric,'sessões')
) v(metric,val,unit)
where m.provider='Looker Studio' and m.source_ref='b9413f94-dc15-4e6e-ac43-059d055ecc82'
and not exists(select 1 from public.crm_metric_snapshots existing
 where existing.workspace_id=m.workspace_id and existing.source_id=m.id
 and existing.metric_name=v.metric and existing.period_label='2026-01-01 a 2026-11-22');
