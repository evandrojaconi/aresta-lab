-- Alinhar ações operacionais da antiga base Notion ao pipeline executável.
-- Não criar tarefas duplicadas: reaproveitar seeds de Rupestre, landing e CRM.
update public.crm_work_items i set source_kind='notion',
 source_url=case i.external_key
 when 's0-rupestre-ig' then 'https://app.notion.com/p/4207f5b64c2c81e793e9d6bfcd7f2efa'
 when 's0-rupestre-linkedin' then 'https://app.notion.com/p/4207f5b64c2c813aaa23f2e207e14fbc'
 when 's0-landing' then 'https://app.notion.com/p/4207f5b64c2c81ca9ca0f1c372eb73c1'
 when 's0-crm' then 'https://app.notion.com/p/4207f5b64c2c8116b6b5e0fc25e2cd66' end
where i.external_key in ('s0-rupestre-ig','s0-rupestre-linkedin','s0-landing','s0-crm')
and exists(select 1 from public.crm_workspaces w where w.id=i.workspace_id and w.slug='aresta');

insert into public.crm_work_items(
workspace_id,external_key,title,track,priority,status,next_action,definition_of_done,due_date,source_kind,source_url)
select w.id, v.key,v.title,v.track,v.priority,'pronto',v.next_action,v.dod,v.due,'notion',v.url
from public.crm_workspaces w cross join (values
 ('aresta','notion-canva-planner','Conectar operação ao Canva Content Planner','Marketing','P2',
 'Verificar contas vinculadas ao Content Planner e preparar conteúdo autorizado.','Agendamento real confirmado e URL ou identificação registrada.','2026-11-26'::date,
 'https://app.notion.com/p/4207f5b64c2c819db2b2d137d5c161a6'),
 ('aresta','notion-sync-crm','Conciliar o Notion com o CRM Intelligence','Operação','P2',
 'Preservar origem dos 44 registros importados e desenhar sincronização idempotente com autorização.','Uma atualização de origem refletida no CRM sem duplicatas.','2026-11-26'::date,
 'https://app.notion.com/p/4207f5b64c2c814d97caf1cf03dfd37c'),
 ('aresta','notion-pedreira-croqui','Pedreira Dr. Gravatá: consolidar croqui para revisão','Território','P2',
 'Inventariar imagens, textos, setores e acesso; separar informações verificadas e pendências.','Versão para revisão com fontes, direitos e responsáveis.',null::date,
 'https://app.notion.com/p/3f77f5b64c2c81c4a50bf509ec87f818'),
 ('fememg','notion-fememg-identidade','FEMEMG: direção visual v1','Marketing','P2',
 'Sintetizar Brand Discovery e apresentar três direções para discussão.','Proposta visual e retorno institucional registrados.',null::date,
 'https://app.notion.com/p/3f77f5b64c2c81dc88aac7bd3dd491be'),
 ('aresta','notion-expansao-baseline','Revalidar baseline territorial de expansão','Growth','P1',
 'Cruzar estado atual dos territórios e preparar RJ/GO sem duplicar estudos anteriores.','Tabela com fonte, qualidade, contatos e decisão de piloto.',null::date,
 'https://app.notion.com/p/3f77f5b64c2c81f99125d4e157592bf3')
) v(slug,key,title,track,priority,next_action,dod,due,url)
where w.slug=v.slug
on conflict(workspace_id,external_key) do nothing;
