-- Permissão explícita por conta Google + identidade GitHub + repositório.
-- Este registro NÃO substitui autenticação OAuth do Google nem autorização da API GitHub.
-- Por padrão, nenhum repositório é autorizado.
create table if not exists public.crm_github_approvals (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
 google_email text not null check(google_email = lower(trim(google_email))),
 github_login text not null check(length(github_login) between 1 and 39 and github_login ~ '^[A-Za-z0-9][A-Za-z0-9-]*$'),
 repository text not null check(length(repository) between 3 and 150 and repository ~ '^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$'),
 access_level text not null default 'read' check(access_level in ('read','propose')),
 status text not null default 'approved' check(status in ('approved','revoked')),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(workspace_id,google_email,repository)
);
alter table public.crm_github_approvals enable row level security;
create policy crm_github_approvals_admin_read on public.crm_github_approvals
 for select to authenticated
 using (exists(select 1 from public.crm_memberships m
   where m.workspace_id=crm_github_approvals.workspace_id
   and m.user_id=(select auth.uid()) and m.role='admin'));
create policy crm_github_approvals_admin_insert on public.crm_github_approvals
 for insert to authenticated
 with check (
   created_by=(select auth.uid())
   and exists(select 1 from public.crm_memberships m
     where m.workspace_id=crm_github_approvals.workspace_id
     and m.user_id=(select auth.uid()) and m.role='admin')
 );
create policy crm_github_approvals_admin_update on public.crm_github_approvals
 for update to authenticated
 using (exists(select 1 from public.crm_memberships m
   where m.workspace_id=crm_github_approvals.workspace_id
   and m.user_id=(select auth.uid()) and m.role='admin'))
 with check (exists(select 1 from public.crm_memberships m
   where m.workspace_id=crm_github_approvals.workspace_id
   and m.user_id=(select auth.uid()) and m.role='admin'));
create trigger crm_github_approval_updated before update on public.crm_github_approvals
 for each row execute function public.crm_touch_updated_at();
create trigger crm_github_approval_audit after insert or update or delete on public.crm_github_approvals
 for each row execute function public.crm_audit_change();
grant select,insert,update on public.crm_github_approvals to authenticated;
revoke delete on public.crm_github_approvals from authenticated;
create index if not exists crm_github_approvals_workspace on public.crm_github_approvals(workspace_id,status);
