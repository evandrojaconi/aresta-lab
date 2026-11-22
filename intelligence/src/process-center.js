// ARESTA Intelligence | Jornada operacional do croqui
// A PR permanece fonte técnica. Etapas posteriores exigem evidência explícita.
// Este módulo organiza o trabalho, não controla o Editor ou publica no App.
const E=v=>String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
const PR_REPO='aresta-climb/aresta_db';
const uri=n=>'https://github.com/'+PR_REPO+'/pull/'+n;
const link=(value,label)=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?'<a href="'+E(u.href)+'" target="_blank" rel="noopener noreferrer">'+E(label)+'</a>':''}catch{return ''}};
const SELECTABLE=['nao_verificado','confirmado','nao_aplicavel'];
const displayStatus={aberta:'Aberta — aguarda decisão',incorporada:'PR incorporada ao ArestaDB','fechada sem incorporação':'Encerrada sem merge'};
export function processFor(state,number){
 return (state.croquiProcesses||[]).find(c=>c.pr_number===Number(number)&&c.source_repo===PR_REPO);
}
export function deriveCroquiSteps(pr,process,content){
 const merged=pr?.status==='incorporada',closed=pr?.status==='fechada sem incorporação',opened=pr?.status==='aberta';
 const hasEvidence=process?.distribution_status==='confirmado'&&Boolean(process?.distribution_evidence_url);
 const contentPublished=content&&['publicado','medido'].includes(content.stage)&&Boolean(content.published_url);
 const out=[
  {title:'1. Contribuição',status:pr?.status==='não verificado'?'referência no CRM':pr?'registrada':'sem fonte',
    detail:pr?.status==='não verificado'?'PR #'+pr.number+' tem acompanhamento no CRM; não foi localizada na janela atual do GitHub':
      pr?'PR #'+pr.number+' identificada no GitHub':'O registro não foi encontrado na consulta atual; confira a fonte'},
  {title:'2. Revisão e decisão',status:merged?'merge registrado':opened?'PR aberta':closed?'fechada sem merge':'não verificado',
    detail:merged?'Merge no GitHub é evidência técnica. Não demonstra sozinho o processo de avaliação humana.':
      opened?'Verificar responsável e discussão no Editor/GitHub.':closed?'Não tratar encerramento como rejeição justificada.':'Não inferir revisão.'},
  {title:'3. Base de conhecimento',status:merged?'incorporada':closed?'não incorporada':'pendente',
    detail:merged?'Alteração incorporada no repositório ArestaDB.':'Não afirmar que o conteúdo já mudou no ArestaDB.'},
  {title:'4. Distribuição no App',status:hasEvidence?'confirmação registrada':process?.distribution_status==='nao_aplicavel'?'não aplicável':'não verificada',
    detail:hasEvidence?'Confirmação manual acompanhada de URL; não é uma verificação automática da versão do App.':'Conferir versão do croqui distribuída no App/Serving e registrar evidência.'},
  {title:'5. Comunicação',status:contentPublished?'publicação registrada':content?'pauta em '+content.stage:'sem pauta',
    detail:contentPublished?'Postagem registrada com URL no CRM.':'Criar/revisar pauta vinculada antes de divulgar uma atualização.'},
  {title:'6. Aprendizado',status:process?.learning_note?.trim()?'registro qualitativo':'sem medição',
    detail:process?.learning_note?.trim()?'Observação registrada; não representa resultado validado por analytics.':'Registrar indicador, observação ou lição e sua origem.'}
 ];
 return out;
}
const selectStage=current=>SELECTABLE.map(v=>'<option value="'+v+'"'+(v===current?' selected':'')+'>'+({nao_verificado:'Ainda não verificado',confirmado:'Confirmado por responsável',nao_aplicavel:'Não aplicável'}[v])+'</option>').join('');
const sorted=(pr,records)=>[...pr].sort((a,b)=>Number(Boolean(processFor({croquiProcesses:records},b.number)))-Number(Boolean(processFor({croquiProcesses:records},a.number)))||
 (a.status==='aberta'?-1:b.status==='aberta'?1:0)||String(b.updatedAt).localeCompare(String(a.updatedAt)));
const note=s=>'<p class="process-note">'+E(s)+'</p>';
function renderProcessCard(pr,process,content,task,readonly){
 const steps=deriveCroquiSteps(pr,process,content),open=steps.filter(x=>['pendente','não verificada','sem pauta','sem medição'].includes(x.status)).length;
 return '<article class="process-card"><div class="process-card-header"><div>'+
  '<div class="process-tags"><span class="badge outline">'+E(displayStatus[pr.status]||pr.status)+'</span>'+
   (process?'<span class="badge outline">Acompanhado</span>':'<span class="badge outline">Origem GitHub</span>')+'</div>'+
  '<h3>'+E(pr.title)+'</h3><p class="micro">PR #'+pr.number+' · '+E(process?.owner_label||'Responsável interno a definir')+'</p></div>'+
  '<div>'+link(pr.url,'Ver PR oficial')+'</div></div>'+
  '<div class="process-steps">'+steps.map(x=>'<div class="process-step"><strong>'+E(x.title)+'</strong>'+
  '<span>'+E(x.status)+'</span><small>'+E(x.detail)+'</small></div>').join('')+'</div>'+
  (!process?'<div class="process-actions">'+(!readonly?'<button class="primary" data-process="track" data-number="'+pr.number+'">Acompanhar este fluxo</button>':'')+
    '</div>':
   '<div class="process-details">'+
    '<div class="process-status"><strong>Próxima ação:</strong> '+E(process.next_action||'Definir responsável e próximo passo')+
    (task?' · <span class="track-tag">Tarefa '+E(task.status)+'</span>':'')+'</div>'+
    '<details><summary>Executar e registrar etapas</summary>'+
    '<form class="process-edit-form" data-process-form="'+pr.number+'">'+
    '<label>Responsável operacional<input name="owner_label" maxlength="160" value="'+E(process.owner_label||'')+'" '+(readonly?'disabled':'')+' placeholder="Pessoa ou equipe"></label>'+
    '<label>Próxima ação<textarea name="next_action" rows="2" maxlength="2000" '+(readonly?'disabled':'')+'>'+E(process.next_action||'')+'</textarea></label>'+
    '<label>Contexto da revisão (não altera a PR)<textarea name="review_note" rows="2" maxlength="2000" '+(readonly?'disabled':'')+'>'+E(process.review_note||'')+'</textarea></label>'+
    '<label>Distribuição no aplicativo<select name="distribution_status" '+(readonly?'disabled':'')+'>'+selectStage(process.distribution_status)+'</select></label>'+
    '<label>URL que comprova a distribuição<input type="url" name="distribution_evidence_url" value="'+E(process.distribution_evidence_url||'')+'" placeholder="https://... (obrigatório quando confirmado)" '+(readonly?'disabled':'')+'></label>'+
    '<label>Aprendizado / evidência observada<textarea name="learning_note" rows="3" maxlength="4000" '+(readonly?'disabled':'')+'>'+E(process.learning_note||'')+'</textarea></label>'+
    (!readonly?'<button class="primary" type="submit">Salvar acompanhamento</button>':'')+
    '</form></details>'+
   '<div class="process-actions">'+
    (!readonly&&!task?'<button class="secondary" data-process="create-task" data-number="'+pr.number+'">Criar ação no Hoje</button>':'')+
    (!readonly&&!content?'<button class="secondary" data-process="create-content" data-number="'+pr.number+'">Preparar comunicação</button>':'')+
    (content?'<button class="secondary" data-process="open-content" data-number="'+pr.number+'">Abrir pauta vinculada</button>':'')+
    '<button class="secondary" data-process="copy-brief" data-number="'+pr.number+'">Copiar contexto</button>'+
    '</div></div>')+
 '</article>';
}
export function renderProcessCenter({state,readonly=()=>true}){
 const info=state.editorSuggestions||{};
 const known=info.records||[];
 // Casos do CRM permanecem visíveis se saírem da página de 100 PRs consultadas.
 const missing=(state.croquiProcesses||[]).filter(c=>!known.some(p=>p.number===c.pr_number))
   .map(c=>({number:c.pr_number,title:'Contribuição #'+c.pr_number+' — consultar GitHub',
     status:'não verificado',updatedAt:c.updated_at,url:uri(c.pr_number)}));
 const prs=sorted([...known,...missing],state.croquiProcesses||[]);
 const selected=state.processFilter||'todos';
 const displayed=selected==='acompanhados'?prs.filter(p=>processFor(state,p.number)):
   selected==='abertos'?prs.filter(p=>p.status==='aberta'):prs;
 const cases=state.croquiProcesses||[], tracked=cases.length;
 const content=state.contents||[], reported=state.metricSnapshots||[];
 const editorCount=info.fetchedAt?known.length:'—';
 return '<section class="section-head process-heading"><div><span class="overline">CONHECIMENTO → REVISÃO → DISTRIBUIÇÃO → APRENDIZADO</span>'+
  '<h1>Processos do Aresta</h1>'+
  '<p>Execute uma jornada inteira usando Editor, ArestaDB, App e Comunicação — sem recriar os sistemas existentes.</p></div>'+
  '<button class="secondary" data-action="refresh-editor-prs"'+(info.loading?' disabled':'')+'>'+(info.loading?'Consultando…':'Sincronizar PRs')+'</button></section>'+
  '<div class="process-flow-top"><div><strong>Editor e GitHub</strong><small>Origem e decisão técnica</small></div>'+
    '<span>→</span><div><strong>App / Serving</strong><small>Distribuição a verificar</small></div>'+
    '<span>→</span><div><strong>Intelligence</strong><small>Operação, comunicação e evidências</small></div></div>'+
  '<div class="process-overview"><div><b>'+editorCount+'</b><span>PRs de croquis na consulta atual</span></div>'+
   '<div><b>'+tracked+'</b><span>Fluxos acompanhados neste workspace</span></div>'+
   '<div><b>'+content.filter(c=>['rascunho','revisao','aprovado'].includes(c.stage)).length+'</b><span>Peças em preparação</span></div>'+
   '<div><b>'+reported.length+'</b><span>Leituras registradas, não necessariamente em tempo real</span></div></div>'+
  (info.error?'<p class="notice">'+E(info.error)+'</p>':'')+
  '<div class="process-models"><button class="process-model active" data-process="filter" data-key="todos">'+
  '<strong>1. Atualização de croquis</strong><span>Do envio da contribuição ao aprendizado</span></button>'+
  '<button class="process-model" data-view="marketing"><strong>2. Comunicação e comunidade</strong><span>Pautas, revisão, publicação e resultados</span></button>'+
  '<button class="process-model" data-view="dados"><strong>3. Dados e decisões</strong><span>Fontes, interpretação e melhoria</span></button></div>'+
  '<div class="process-toolbar"><div><h2>Fluxos de croquis</h2><p class="micro">Status de PR vem do GitHub; etapas após merge exigem comprovação. Nenhum merge é feito aqui.</p></div>'+
   '<div class="process-pills">'+[['todos','Todos'],['acompanhados','Acompanhados'],['abertos','PRs abertas']].map(([k,v])=>
    '<button class="secondary '+(selected===k?'selected':'')+'" data-process="filter" data-key="'+k+'">'+v+'</button>').join('')+'</div></div>'+
  (info.fetchedAt?'<p class="micro">Consulta à API GitHub em '+E(new Date(info.fetchedAt).toLocaleString('pt-BR'))+
    (info.truncated?' · apenas as últimas 100 PRs consultadas':'')+'. Nenhum status abaixo é atualizado automaticamente no banco do CRM.</p>':
   '<div class="empty">Ainda não consultamos o GitHub nesta sessão. Clique em “Sincronizar PRs” para listar as contribuições reais.</div>')+
  '<div class="process-layout"><div class="process-list" aria-label="Contribuições">'+
   (displayed.length?displayed.slice(0,state.processLimit||12).map(x=>{
     const tracked=processFor(state,x.number),focused=Number(state.focusProcessPr||displayed[0]?.number)===x.number;
     return '<button type="button" class="process-list-item '+(focused?'selected':'')+'" data-process="focus" data-number="'+x.number+'">'+
       '<strong>PR #'+x.number+' · '+E(x.title)+'</strong>'+
       '<span>'+E(displayStatus[x.status]||'Estado não verificado')+(tracked?' · acompanhado':'')+'</span></button>';
   }).join(''):info.fetchedAt?'<p class="micro">Nenhuma contribuição neste filtro.</p>':'')+
   (displayed.length>(state.processLimit||12)?'<button class="secondary" data-process="more">Mostrar mais ('+(displayed.length-(state.processLimit||12))+')</button>':'')+
   '</div><div class="process-active">'+
   (displayed.length?(()=>{
     const pr=displayed.find(x=>x.number===Number(state.focusProcessPr))||displayed[0];
     const c=processFor(state,pr.number);
     const item=(state.contents||[]).find(x=>x.id===c?.communication_content_id);
     const task=(state.items||[]).find(x=>x.id===c?.followup_task_id);
     return renderProcessCard(pr,c,item,task,readonly());
   })():'<div class="empty">Selecione um filtro ou sincronize o GitHub.</div>')+
   '</div></div>'+
  '<p class="micro">Casos acompanhados cujas PRs saíram da janela de consulta permanecem no banco. A ausência na lista não significa exclusão do GitHub.</p>';
}
export function renderProcessToday({state}){
 const tracked=state.croquiProcesses||[];
 const tasks=tracked.filter(c=>!c.next_action?.trim());
 const prs=state.editorSuggestions||{},open=prs.fetchedAt?prs.open:'—';
 return '<section class="process-today"><div><div><span class="overline">PROCESSOS VIVOS</span><h2>O que precisa avançar</h2>'+
  '<p>O Intelligence acompanha o ciclo dos croquis, não apenas tarefas isoladas.</p></div>'+
  '<button class="primary" data-view="processos">Abrir processos</button></div>'+
  '<div class="process-today-stats"><span><b>'+E(open)+'</b> PRs abertas na consulta GitHub'+(prs.fetchedAt?' · última consulta '+E(new Date(prs.fetchedAt).toLocaleDateString('pt-BR')):' · ainda não consultado')+'</span>'+
  '<span><b>'+tracked.length+'</b> acompanhamentos</span>'+
  '<span><b>'+tasks.length+'</b> sem próxima ação registrada</span></div></section>';
}
export function installProcessHandlers(getCtx){
 document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-process]');
  if(!button)return;
  const {state,db,ws,readonly,loadData,render}=getCtx();
  const action=button.dataset.process,key=button.dataset.key,n=Number(button.dataset.number);
  const info=state.editorSuggestions||{},pr=(info.records||[]).find(x=>x.number===n);
  const row=processFor(state,n);
  try{
   if(action==='focus'){state.focusProcessPr=n;render();return}
   if(action==='filter'){state.processFilter=key;state.processLimit=12;render();return}
   if(action==='more'){state.processLimit=(state.processLimit||12)+12;render();return}
   if(!db||!pr)return;
   if(action==='open-content'){
     if(!row?.communication_content_id)return;
     state.activeContentId=row.communication_content_id;state.view='marketing';render();
     document.getElementById('focus-editor')?.scrollIntoView({behavior:'smooth',block:'start'});return;
   }
   if(action==='copy-brief'&&row){
     const content=(state.contents||[]).find(x=>x.id===row.communication_content_id);
     const task=(state.items||[]).find(x=>x.id===row.followup_task_id);
     const status=deriveCroquiSteps(pr,row,content);
     const brief=['PROCESSO ARESTA — PR #'+n,pr.title,'Origem: '+uri(n),
       ...status.map(x=>x.title+': '+x.status+' | '+x.detail),
       'Responsável operacional: '+(row.owner_label||'a definir'),
       'Próxima ação: '+(row.next_action||'a definir'),
       'Tarefa: '+(task?.title||'não vinculada'),
       'Notas: '+(row.learning_note||'nenhuma'),
       'Separar fatos, hipóteses e recomendações; não alegar atualização no app sem confirmação.'].join('\n\n');
     await navigator.clipboard.writeText(brief);
     state.notice='Contexto da jornada copiado, com origem e lacunas.';render();return;
   }
   if(readonly())return;
   if(action==='track'){
     if(row){state.notice='Este fluxo já está sendo acompanhado.';render();return}
     const {error}=await db.from('crm_croqui_processes').insert({
       workspace_id:ws(),source_repo:PR_REPO,pr_number:n,
       owner_label:'',next_action:pr.status==='aberta'?'Verificar revisão e mantenedor da PR.':'Verificar distribuição no App e preparar comunicação.',
       created_by:state.session.user.id
     });
     if(error)throw error;
     await loadData();state.notice='Fluxo cadastrado: agora você pode registrar responsável, ação e evidências.';render();return;
   }
   if(!row)return;
   if(action==='create-task'){
     if(row.followup_task_id){state.notice='Já existe tarefa vinculada.';render();return}
     const source=uri(n);
     const existing=await db.from('crm_work_items').select('id').eq('workspace_id',ws()).eq('source_url',source).limit(1);
     if(existing.error)throw existing.error;
     let id=existing.data?.[0]?.id;
     if(!id){
      const result=await db.from('crm_work_items').insert({
        workspace_id:ws(),title:'Acompanhar croqui: '+pr.title.slice(0,150),
        track:'Produto',priority:'P2',status:'entrada',owner_label:row.owner_label,
        next_action:row.next_action||'Definir responsável e verificar o estado da PR #'+n,
        definition_of_done:'Origem, decisão, distribuição e próximos passos documentados com evidências.',
        source_url:source,source_kind:'manual',created_by:state.session.user.id
      }).select('id').single();
      if(result.error)throw result.error;
      id=result.data.id;
     }
     const result=await db.from('crm_croqui_processes').update({followup_task_id:id}).eq('id',row.id).eq('workspace_id',ws());
     if(result.error)throw result.error;
     await loadData();state.notice='Ação vinculada ao Hoje e ao processo.';render();return;
   }
   if(action==='create-content'){
     if(row.communication_content_id){state.notice='Já existe pauta vinculada.';render();return}
     const source=uri(n);
     const existing=await db.from('crm_content_items').select('id').eq('workspace_id',ws()).eq('source_url',source).limit(1);
     if(existing.error)throw existing.error;
     let id=existing.data?.[0]?.id;
     if(!id){
      const content=await db.from('crm_content_items').insert({
        workspace_id:ws(),title:'Comunicação do croqui: '+pr.title.slice(0,170),brand:'Aresta',
        channel:'Instagram',stage:'rascunho',
        objective:pr.status==='incorporada'?'Explicar mudança incorporada ao ArestaDB; confirmar disponibilidade no App antes de divulgar.':'Acompanhar informação em revisão sem anunciar uma atualização concluída.',
        caption:'Fonte: '+source+'\n\nO que mudou (confirmar na PR):\n\nO que ainda falta verificar (App, autoria e distribuição):\n\nCréditos e autorização:\n\nConvite à comunidade:',
        source_url:source,created_by:state.session.user.id
      }).select('id').single();
      if(content.error)throw content.error;
      id=content.data.id;
     }
     const {error}=await db.from('crm_croqui_processes').update({communication_content_id:id})
       .eq('id',row.id).eq('workspace_id',ws());
     if(error)throw error;
     await loadData();state.notice='Pauta vinculada ao processo. Abra Marketing para editar.';render();return;
   }
  }catch(error){state.error=String(error?.message||error);render();}
 });
 document.addEventListener('submit',async event=>{
  if(!event.target.matches('.process-edit-form'))return;
  event.preventDefault();
  const {state,db,ws,readonly,loadData,render}=getCtx();
  if(!db||readonly())return;
  const n=Number(event.target.dataset.processForm);
  const row=processFor(state,n);
  if(!row)return;
  const f=new FormData(event.target);
  const status=String(f.get('distribution_status')||'nao_verificado');
  const evidence=String(f.get('distribution_evidence_url')||'').trim();
  if(!SELECTABLE.includes(status)){state.error='Estado inválido.';render();return}
  if(status==='confirmado'&&(!/^https:\/\//.test(evidence)||!link(evidence,'ver'))){
    state.error='Para confirmar a distribuição, informe uma URL https válida.';render();return;
  }
  const {error}=await db.from('crm_croqui_processes').update({
    owner_label:String(f.get('owner_label')||'').trim(),
    next_action:String(f.get('next_action')||'').trim(),
    review_note:String(f.get('review_note')||'').trim(),
    distribution_status:status,
    distribution_evidence_url:evidence||null,
    learning_note:String(f.get('learning_note')||'').trim()
  }).eq('id',row.id).eq('workspace_id',ws());
  if(error){state.error=error.message;render();return}
  await loadData();state.notice='Etapas registradas com rastreabilidade. A PR oficial não foi modificada.';render();
 });
}
