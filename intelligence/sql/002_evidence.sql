-- Registre o resultado real antes de classificar a tarefa como "Medido".
alter table public.crm_work_items
  add column if not exists result_evidence text not null default '';

alter table public.crm_work_items
  drop constraint if exists crm_measured_has_evidence;

alter table public.crm_work_items
  add constraint crm_measured_has_evidence
  check (status <> 'medido' or length(trim(result_evidence)) >= 4);
