-- ARESTA Intelligence: caso operacional ligado à PR real do croqui.
-- Não modifica ArestaDB nem dados do app; o status da PR é consultado da fonte.
create table if not exists public.crm_croqui_processes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  source_repo text not null default 'aresta-climb/aresta_db'
    check(source_repo = 'aresta-climb/aresta_db'),
  pr_number integer not null check(pr_number > 0),
  owner_label text not null default '',
  next_action text not null default '',
  review_note text not null default '',
  distribution_status text not null default 'nao_verificado'
    check(distribution_status in ('nao_verificado','confirmado','nao_aplicavel')),
  distribution_evidence_url text,
  communication_content_id uuid references public.crm_content_items(id) on delete set null,
  learning_note text not null default '',
  followup_task_id uuid references public.crm_work_items(id) on delete set null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id,source_repo,pr_number),
  constraint distribution_requires_evidence check(
    distribution_status <> 'confirmado' or
    (distribution_evidence_url is not null and length(trim(distribution_evidence_url)) >= 10)
  )
);
create index if not exists crm_croqui_processes_workspace
  on public.crm_croqui_processes(workspace_id,updated_at desc);
alter table public.crm_croqui_processes enable row level security;
create policy croqui_process_read on public.crm_croqui_processes
 for select to authenticated using(public.crm_is_member(workspace_id));
create policy croqui_process_insert on public.crm_croqui_processes
 for insert to authenticated with check(
  public.crm_can_edit(workspace_id) and
  (communication_content_id is null or exists(
   select 1 from public.crm_content_items c
   where c.id=communication_content_id and c.workspace_id=workspace_id
  )) and
  (followup_task_id is null or exists(
   select 1 from public.crm_work_items t
   where t.id=followup_task_id and t.workspace_id=workspace_id
  ))
 );
create policy croqui_process_update on public.crm_croqui_processes
 for update to authenticated using(public.crm_can_edit(workspace_id))
 with check(
  public.crm_can_edit(workspace_id) and
  (communication_content_id is null or exists(
   select 1 from public.crm_content_items c
   where c.id=communication_content_id and c.workspace_id=workspace_id
  )) and
  (followup_task_id is null or exists(
   select 1 from public.crm_work_items t
   where t.id=followup_task_id and t.workspace_id=workspace_id
  ))
 );
grant select,insert,update on public.crm_croqui_processes to authenticated;
create trigger crm_croqui_process_updated before update on public.crm_croqui_processes
 for each row execute function public.crm_touch_updated_at();
create trigger crm_croqui_process_audit after insert or update or delete on public.crm_croqui_processes
 for each row execute function public.crm_audit_change();
