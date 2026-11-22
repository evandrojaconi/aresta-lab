-- ARESTA Intelligence CRM — Sprint 0 (estrutura isolada)
-- Execute apenas no projeto Supabase escolhido para o CRM.
-- Nenhuma credencial, usuário real ou contato pessoal é incluído neste arquivo.
create extension if not exists pgcrypto;

create table if not exists public.crm_workspaces (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_memberships (
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','editor','viewer')) default 'viewer',
  created_at timestamptz not null default now(),
  primary key (workspace_id,user_id)
);

-- Evita recursão de políticas de membership. O owner da função deve ser o
-- role de migração do Supabase; não conceder CREATE no schema public a anônimos.
create or replace function public.crm_is_member(p_workspace uuid)
returns boolean language sql stable security invoker set search_path = ''
as $$
  select exists (
    select 1 from public.crm_memberships m
    where m.workspace_id = p_workspace and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.crm_can_edit(p_workspace uuid)
returns boolean language sql stable security invoker set search_path = ''
as $$
  select exists (
    select 1 from public.crm_memberships m
    where m.workspace_id = p_workspace
      and m.user_id = (select auth.uid())
      and m.role in ('admin','editor')
  );
$$;

create table if not exists public.crm_work_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  external_key text,
  title text not null check (length(trim(title)) between 2 and 200),
  details text not null default '',
  track text not null default 'Operação' check (track in
    ('Produto','Dados','Growth','Comunidade','Marketing','Território','Parcerias','Operação')),
  priority text not null default 'P2' check (priority in ('P0','P1','P2','P3')),
  status text not null default 'entrada' check (status in
    ('entrada','pronto','fazendo','aguardando','revisao','concluido','medido')),
  owner_label text not null default '',
  next_action text not null default '',
  definition_of_done text not null default '',
  due_date date,
  source_url text,
  source_kind text not null default 'manual' check (source_kind in
    ('manual','notion','github','drive','comunidade','relato')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, external_key)
);

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  name text not null check (length(trim(name)) between 2 and 200),
  organization text not null default '',
  role_label text not null default '',
  email text,
  phone text,
  contact_type text not null default 'Parceiro' check
    (contact_type in ('Parceiro','Comunidade','Instituição','Mantenedor','Cliente','Outro')),
  stage text not null default 'mapeado' check
    (stage in ('mapeado','contatado','conversa','proposta','ativo','pausado')),
  next_follow_up date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_touchpoints (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  channel text not null check (channel in
    ('WhatsApp','Instagram','LinkedIn','E-mail','Reunião','Discord','Outro')),
  summary text not null check (length(trim(summary)) between 3 and 3000),
  happened_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- Somente metadados de conexão. NUNCA armazenar OAuth tokens aqui no navegador.
create table if not exists public.crm_channels (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  provider text not null,
  status text not null default 'nao_conectado' check
    (status in ('nao_conectado','configuracao','verificado','falha')),
  last_verified_at timestamptz,
  notes text not null default '',
  unique (workspace_id,provider)
);

create table if not exists public.crm_audit_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.crm_workspaces(id) on delete cascade,
  entity_name text not null,
  entity_id uuid not null,
  action text not null,
  actor_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.crm_touch_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists crm_items_updated on public.crm_work_items;
create trigger crm_items_updated before update on public.crm_work_items
for each row execute function public.crm_touch_updated_at();

drop trigger if exists crm_contacts_updated on public.crm_contacts;
create trigger crm_contacts_updated before update on public.crm_contacts
for each row execute function public.crm_touch_updated_at();

create or replace function public.crm_audit_change()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  r record;
begin
  if tg_op = 'DELETE' then r := old; else r := new; end if;
  insert into public.crm_audit_events
    (workspace_id,entity_name,entity_id,action,actor_id,before_state,after_state)
  values (
    r.workspace_id, tg_table_name, r.id, tg_op, auth.uid(),
    case when tg_op in ('UPDATE','DELETE') then
      to_jsonb(old) - array['name','title','email','phone','notes','details','next_action','definition_of_done','result_evidence','source_url','external_key','owner_label','created_by']
    else null end,
    case when tg_op in ('UPDATE','INSERT') then
      to_jsonb(new) - array['name','title','email','phone','notes','details','next_action','definition_of_done','result_evidence','source_url','external_key','owner_label','created_by']
    else null end
  );
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists crm_items_audit on public.crm_work_items;
create trigger crm_items_audit after insert or update or delete on public.crm_work_items
for each row execute function public.crm_audit_change();

drop trigger if exists crm_contacts_audit on public.crm_contacts;
create trigger crm_contacts_audit after insert or update or delete on public.crm_contacts
for each row execute function public.crm_audit_change();

-- RLS obrigatória em todas as tabelas com conteúdo do CRM.
alter table public.crm_workspaces enable row level security;
alter table public.crm_memberships enable row level security;
alter table public.crm_work_items enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_touchpoints enable row level security;
alter table public.crm_channels enable row level security;
alter table public.crm_audit_events enable row level security;

drop policy if exists "crm_workspaces_select" on public.crm_workspaces;
create policy "crm_workspaces_select" on public.crm_workspaces
for select to authenticated using (public.crm_is_member(id));

drop policy if exists "crm_memberships_select_own" on public.crm_memberships;
create policy "crm_memberships_select_own" on public.crm_memberships
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "crm_items_read" on public.crm_work_items;
create policy "crm_items_read" on public.crm_work_items
for select to authenticated using (public.crm_is_member(workspace_id));
drop policy if exists "crm_items_insert" on public.crm_work_items;
create policy "crm_items_insert" on public.crm_work_items
for insert to authenticated with check (public.crm_can_edit(workspace_id));
drop policy if exists "crm_items_update" on public.crm_work_items;
create policy "crm_items_update" on public.crm_work_items
for update to authenticated using (public.crm_can_edit(workspace_id))
with check (public.crm_can_edit(workspace_id));
drop policy if exists "crm_items_delete" on public.crm_work_items;
create policy "crm_items_delete" on public.crm_work_items
for delete to authenticated using (public.crm_can_edit(workspace_id));

drop policy if exists "crm_contacts_read" on public.crm_contacts;
create policy "crm_contacts_read" on public.crm_contacts
for select to authenticated using (public.crm_is_member(workspace_id));
drop policy if exists "crm_contacts_insert" on public.crm_contacts;
create policy "crm_contacts_insert" on public.crm_contacts
for insert to authenticated with check (public.crm_can_edit(workspace_id));
drop policy if exists "crm_contacts_update" on public.crm_contacts;
create policy "crm_contacts_update" on public.crm_contacts
for update to authenticated using (public.crm_can_edit(workspace_id))
with check (public.crm_can_edit(workspace_id));
drop policy if exists "crm_contacts_delete" on public.crm_contacts;
create policy "crm_contacts_delete" on public.crm_contacts
for delete to authenticated using (public.crm_can_edit(workspace_id));

drop policy if exists "crm_touchpoints_read" on public.crm_touchpoints;
create policy "crm_touchpoints_read" on public.crm_touchpoints
for select to authenticated using (public.crm_is_member(workspace_id));
drop policy if exists "crm_touchpoints_insert" on public.crm_touchpoints;
create policy "crm_touchpoints_insert" on public.crm_touchpoints
for insert to authenticated with check (
  public.crm_can_edit(workspace_id) and exists (
    select 1 from public.crm_contacts c
    where c.id = contact_id and c.workspace_id = crm_touchpoints.workspace_id
  )
);

drop policy if exists "crm_channels_read" on public.crm_channels;
create policy "crm_channels_read" on public.crm_channels
for select to authenticated using (public.crm_is_member(workspace_id));

drop policy if exists "crm_audit_read" on public.crm_audit_events;
create policy "crm_audit_read" on public.crm_audit_events
for select to authenticated using (public.crm_is_member(workspace_id));

create index if not exists crm_items_workspace_status on public.crm_work_items(workspace_id,status,priority);
create index if not exists crm_items_due on public.crm_work_items(workspace_id,due_date);
create index if not exists crm_contacts_follow_up on public.crm_contacts(workspace_id,next_follow_up);
create index if not exists crm_touchpoints_contact on public.crm_touchpoints(contact_id,happened_at desc);
create index if not exists crm_audit_workspace on public.crm_audit_events(workspace_id,created_at desc);

-- Escopo Aresta; não importar dados pessoais nem converter ideias em execução.
insert into public.crm_workspaces (slug,name) values ('aresta','ARESTA Intelligence')
on conflict (slug) do nothing;

insert into public.crm_channels (workspace_id, provider, notes)
select w.id,p.provider,p.notes from public.crm_workspaces w
cross join (values
 ('Instagram/Meta','Publicação exige Meta Business, ativos e permissões da conta.'),
 ('Facebook','Aproveitar peça aprovada; verificar API e vínculo de página.'),
 ('LinkedIn','Adaptação para canal institucional, aprovação antes do envio.'),
 ('WhatsApp','WhatsApp Business tem Groups API; verificar elegibilidade, sem presumir acesso a grupos pessoais existentes.'),
 ('Discord','Webhook/bot com escopo e consentimento.'),
 ('Notion','Fonte operacional existente; conexão ainda sem sincronização.'),
 ('Google Drive','Fonte documental; OAuth adicional e permissão explícita.'),
 ('Google Calendar','Disponibilidade e blocos; OAuth adicional.'),
 ('Gmail','Mensagens e follow-up; OAuth adicional.'),
 ('GitHub','Fonte técnica; conexão do backend ainda a construir.')
) p(provider,notes) where w.slug='aresta'
on conflict (workspace_id,provider) do nothing;

-- As cinco entradas abaixo são demandas do Sprint 0, NÃO entregas realizadas.
insert into public.crm_work_items
 (workspace_id,external_key,title,track,priority,status,next_action,definition_of_done,due_date,source_kind,source_url)
select w.id,s.key,s.title,s.track,s.priority,s.status,s.next_action,s.dod,s.due_date,s.source_kind,s.source_url
from public.crm_workspaces w
cross join (values
 ('s0-rupestre-ig','Publicar parceria Rupestre no Instagram','Marketing','P0','pronto',
  'Publicar amanhã cedo usando as peças já aprovadas.','Link da publicação e hora registrados.','2026-11-23'::date,'relato',null),
 ('s0-rupestre-linkedin','Adaptar publicação Rupestre para LinkedIn','Marketing','P0','pronto',
  'Reutilizar conteúdo factual, ajustando abertura e CTA para público institucional.','Link publicado e responsável pela aprovação registrados.','2026-11-23'::date,'relato',null),
 ('s0-landing','Entregar landing page Aresta','Produto','P0','pronto',
  'Revisar a V2, links, responsividade e entrega para revisão técnica.','Link da versão revisada + checklist de QA + aceite/pendências. ',null::date,'github','https://github.com/evandrojaconi/aresta-lab'),
 ('s0-crm','Implantar workflow CRM Aresta Intelligence','Operação','P0','fazendo',
  'Revisar PR, conectar Supabase, configurar Google OAuth e validar usuário aprovado.','Login Google + primeira tarefa salva/lida por dois dispositivos.','2026-11-27'::date,'relato',null),
 ('s0-lapinha','Conciliar estados informacionais da Lapinha','Dados','P1','entrada',
  'Conferir fonte, data, autor e classificação de acesso/condição técnica antes de divulgar.','Tabela de divergências com responsáveis e decisão de publicação.',null::date,'drive','https://docs.google.com/document/d/1GMnIcu992T5k7W9Cy-I6u2_KreMYfQi_rKJ4Qjuquis/edit')
) s(key,title,track,priority,status,next_action,dod,due_date,source_kind,source_url)
where w.slug='aresta'
on conflict (workspace_id,external_key) do nothing;

-- APÓS o primeiro login Google, conceder explicitamente acesso no SQL Editor:
-- insert into public.crm_memberships(workspace_id,user_id,role)
-- select id, '<UUID_DE_AUTH_USERS>'::uuid, 'admin'
-- from public.crm_workspaces where slug='aresta'
-- on conflict (workspace_id,user_id) do update set role='admin';
-- Não liberar por domínio ou e-mail sem aprovação; OAuth autentica, RLS autoriza.

-- A autorização é determinada por RLS; conceder privilegio SQL não torna dados públicos.
grant usage on schema public to authenticated;
grant select on public.crm_workspaces,public.crm_memberships,public.crm_work_items,public.crm_contacts,public.crm_touchpoints,public.crm_channels,public.crm_audit_events to authenticated;
grant insert, update, delete on public.crm_work_items,public.crm_contacts to authenticated;
grant insert on public.crm_touchpoints to authenticated;
revoke execute on function public.crm_is_member(uuid), public.crm_can_edit(uuid) from anon;
grant execute on function public.crm_is_member(uuid), public.crm_can_edit(uuid) to authenticated;
