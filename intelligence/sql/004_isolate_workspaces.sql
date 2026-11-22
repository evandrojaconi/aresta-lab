-- Fase 0: isolamento das frentes antes de convidar terceiros.
-- O conteúdo pessoal NÃO deve ficar no mesmo workspace que parceiros do Aresta.
insert into public.crm_workspaces (slug,name) values
 ('pessoal-evandro','Pessoal · Operação privada'),
 ('fememg','FEMEMG · Comunicação'),
 ('acec','ACEC · Comunicação'),
 ('igarameca','Igarameca · Comunidade')
on conflict(slug) do nothing;

update public.crm_knowledge_records r set
workspace_id = t.id
from public.crm_workspaces t, public.crm_workspaces w
where r.workspace_id=w.id and w.slug='aresta'
and (
 (t.slug='pessoal-evandro' and r.record_kind='project' and (r.area ilike '%Carreira%' or r.area ilike '%Casa%' or r.area ilike '%Acadêmico%' or r.area ilike '%Clientes%'))
 or (t.slug='fememg' and r.area='FEMEMG' and r.record_kind in ('project','editorial'))
 or (t.slug='acec' and r.area='ACEC' and r.record_kind in ('project','editorial'))
 or (t.slug='igarameca' and r.area='Igarameca' and r.record_kind in ('project','editorial'))
);
-- Não inserir pessoas ou organizações em membership automaticamente.
-- Apenas após Google Auth e aprovação individual.
