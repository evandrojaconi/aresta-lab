-- Oportunidades de captação, pesquisa, parceria e expansão territorial
create table if not exists public.crm_opportunities(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 title text not null check(length(trim(title)) between 3 and 240),
 opportunity_type text not null check(opportunity_type in ('Edital','Pesquisa','Parceria','Patrocínio','Expansão','Serviço','Outro')),
 stage text not null default 'mapeada' check(stage in ('mapeada','analisar','preparar','submetida','negociando','aprovada','encerrada')),
 summary text not null default '',
 deadline date,
 next_action text not null default '',
 source_url text,
 expected_result text not null default '',
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.crm_opportunities enable row level security;
create policy opportunity_read on public.crm_opportunities for select to authenticated using(public.crm_is_member(workspace_id));
create policy opportunity_insert on public.crm_opportunities for insert to authenticated with check(public.crm_can_edit(workspace_id));
create policy opportunity_update on public.crm_opportunities for update to authenticated using(public.crm_can_edit(workspace_id)) with check(public.crm_can_edit(workspace_id));
create policy opportunity_delete on public.crm_opportunities for delete to authenticated using(public.crm_can_edit(workspace_id));
grant select,insert,update,delete on public.crm_opportunities to authenticated;
create trigger crm_opportunity_updated before update on public.crm_opportunities
 for each row execute function public.crm_touch_updated_at();
create trigger crm_opportunity_audit after insert or update or delete on public.crm_opportunities
 for each row execute function public.crm_audit_change();
create index if not exists crm_opportunities_deadline on public.crm_opportunities(workspace_id,deadline,stage);

-- Material existente: lembrar que peça pronta para revisão não significa publicação.
insert into public.crm_content_items(workspace_id,title,brand,channel,stage,objective,source_url)
select w.id,v.title,v.brand,v.channel,v.stage,v.objective,v.source_url
from public.crm_workspaces w
cross join (values
('Parceria Rupestre da Lapa — Instagram','Aresta','Instagram','revisao',
 'Retomar divulgação da parceria e informar o contexto local da Lapinha.',
 'https://app.notion.com/p/4207f5b64c2c8159b366c62ef43fd9e0'),
('Parceria Rupestre da Lapa — LinkedIn','Aresta','LinkedIn','revisao',
 'Apresentar a colaboração ao público institucional e de pesquisa.',
 'https://app.notion.com/p/4207f5b64c2c81fb9298d60662b2f561'),
('Tutorial: como contribuir pelo Aresta Editor','Aresta','Instagram','ideia',
 'Demonstrar como a comunidade pode sugerir correções com informação verificável.',
 'https://arestaclimb.com/editor')
) v(title,brand,channel,stage,objective,source_url)
where w.slug='aresta'
and not exists(select 1 from public.crm_content_items i
 where i.workspace_id=w.id and i.title=v.title and i.channel=v.channel);
