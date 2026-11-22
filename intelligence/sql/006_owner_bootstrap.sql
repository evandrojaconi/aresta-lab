-- Acesso inicial do proprietário por email VERIFICADO. O e-mail permitido fica num schema privado,
-- preenchido administrativamente (nunca no repositório público).
create schema if not exists crm_internal;
revoke all on schema crm_internal from public, anon, authenticated;
create table if not exists crm_internal.approved_owner_emails(
 email text primary key check(email=lower(trim(email))),
 created_at timestamptz not null default now()
);
revoke all on crm_internal.approved_owner_emails from public, anon, authenticated;

create or replace function public.crm_claim_owner_access()
returns integer
language plpgsql security definer set search_path=''
as $$
declare
  verified_email text;
  approved_count integer;
begin
  select lower(trim(u.email)) into verified_email
  from auth.users u
  where u.id=(select auth.uid())
    and u.email_confirmed_at is not null;
  if verified_email is null
     or not exists(select 1 from crm_internal.approved_owner_emails a where a.email=verified_email)
  then return 0; end if;
  insert into public.crm_memberships(workspace_id,user_id,role)
  select w.id,auth.uid(),'admin'
  from public.crm_workspaces w
  where w.slug in('aresta','pessoal-evandro','fememg','acec','igarameca')
  on conflict (workspace_id,user_id) do nothing;
  get diagnostics approved_count = row_count;
  return approved_count;
end;
$$;
revoke all on function public.crm_claim_owner_access() from public,anon;
grant execute on function public.crm_claim_owner_access() to authenticated;
