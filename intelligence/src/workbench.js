// ARESTA Intelligence: central de execução, design e base operacional.
// Os dados são servidos pelo Supabase com RLS; integrações externas não são presumidas.
const E=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeLink=(v)=>{try{const x=new URL(v);return ['https:','http:'].includes(x.protocol)?x.href:''}catch{return ''}};
const tz='America/Sao_Paulo';
const day=()=>{const parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=t=>parts.find(x=>x.type===t)?.value||'';return get('year')+'-'+get('month')+'-'+get('day')};
const displayDate=(d)=>d?new Intl.DateTimeFormat('pt-BR',{timeZone:tz,day:'2-digit',month:'short',year:'numeric'}).format(new Date(d)):'';
const href=(url,label)=>safeLink(url)?'<a href="'+E(safeLink(url))+'" target="_blank" rel="noopener noreferrer">'+E(label)+'</a>':'';
const row=(name,value)=>'<div class="small-metric"><b>'+E(value)+'</b><span>'+E(name)+'</span></div>';
const FRAMEWORK=[
 ['Assimilar','Awareness','Atração / descoberta',null,'Sessões e origens de acesso do site, quando integradas'],
 ['Atrair','Appeal','Interesse pelo território','Croquis Abertos','Croquis consultados são sinal de interesse, não preferência validada'],
 ['Arguir','Ask','Pesquisa e comparação','Setores Visualizados','Consultas de setores aproximam a etapa de busca de informação'],
 ['Agir','Act','Uso efetivo do produto','Escaladas Consultadas','Consultas de vias NÃO comprovam escalada física nem retenção'],
 ['Advogar','Advocate','Colaboração e indicação',null,'Falta medir contribuições, indicação e retorno comunitário']
];
const AREA_VIEW={Marketing:'marketing',Produto:'produto',Dados:'dados',Growth:'oportunidades',Parcerias:'oportunidades',Comunidade:'marketing',Território:'produto',Operação:'pipeline'};

function latestMetrics(state) {
 const src=(state.metricSources||[]).find(x=>x.provider==='Looker Studio');
 const reads=(state.metricSnapshots||[]).filter(x=>x.source_id===src?.id).sort((a,b)=>new Date(b.observed_at)-new Date(a.observed_at));
 const out={};for(const r of reads){if(!out[r.metric_name])out[r.metric_name]=r}
 return out;
}
export function renderCommandHome({state,rankTasks,STATUS_LABELS}) {
 const today=day(),tasks=rankTasks(state.items||[],today);
 const due=tasks.filter(t=>t.due_date&&t.due_date<=today);
 const now=tasks.filter(t=>t.status==='fazendo');
 const queue=[...new Set([...due,...now,...tasks])].slice(0,5);
 const metrics=latestMetrics(state),mNames=['Escaladores Ativos','Croquis Abertos','Escaladas Consultadas'];
 const last=Object.values(metrics)[0],fresh=last?.period_label||'sem medição histórica';
 return '<section class="section-head"><div><span class="overline">SEU CENTRO DE EXECUÇÃO</span>'+
    '<h1>Hoje, '+new Intl.DateTimeFormat('pt-BR',{timeZone:tz,weekday:'long',day:'numeric',month:'long'}).format(new Date())+'</h1>'+
    '<p>Abra a tarefa, produza a entrega e registre a evidência. Data e prioridades vêm do seu workspace.</p></div>'+
    '<button class="secondary" data-action="refresh">Atualizar agora</button></section>'+
  '<div class="home-strip">'+row('Para fazer',tasks.length)+row('Vencidas / hoje',due.length)+
    row('Em execução',now.length)+row('Conteúdos em revisão',(state.contents||[]).filter(x=>x.stage==='revisao').length)+'</div>'+
  '<div class="section-head slim"><div><h2>Fila para executar</h2><p>Clique em qualquer item para abrir o trabalho certo, não apenas outra lista.</p></div></div>'+
  '<div class="action-queue">'+(queue.length?queue.map((t,i)=>{
   const due=t.due_date&&t.due_date<today?'Atrasada':t.due_date===today?'Vence hoje':'';
   return '<button type="button" class="queue-line" data-workbench="open-task" data-id="'+E(t.id)+'">'+
     '<span class="queue-index">'+String(i+1).padStart(2,'0')+'</span>'+
     '<span class="queue-copy"><strong>'+E(t.title)+'</strong><small>'+E(t.next_action||'Definir próximo passo')+'</small></span>'+
     '<span class="queue-meta">'+(due?'<em>'+due+'</em>':'')+'<small>'+E(t.track)+' · '+E(STATUS_LABELS[t.status]||t.status)+'</small></span>'+
     '<span aria-hidden="true" class="queue-arrow">›</span></button>';
  }).join(''):'<div class="empty">Nenhuma tarefa aberta. Aproveite para revisar os resultados e preparar a próxima ação.</div>')+'</div>'+
  '<section class="section-head slim"><div><h2>Pulso do produto</h2>'+
     '<p>Dados do relatório Aresta, registrados com fonte. Não são dados em tempo real.</p></div>'+
     '<button class="secondary" data-view="dados">Analisar dados</button></section>'+
  '<div class="pulse-grid">'+mNames.map(n=>{
    const r=metrics[n];return '<div class="pulse-card"><span>'+E(n)+'</span><b>'+(r?Number(r.metric_value).toLocaleString('pt-BR'):'—')+'</b>'+
    '<small>'+(r?E(r.period_label):'Sem valor verificado')+'</small></div>';
  }).join('')+'</div>'+
  '<div class="method-note"><b>Leitura inicial · Kotler 5As</b> '+E('Abrir croquis sugere interesse; consultas de setores e vias sugerem busca ativa por informação. Não é possível concluir retenção, satisfação, indicação ou conversão sem métricas próprias e coortes.')+
    ' <button class="text-btn" data-view="dados">Ver evidências e hipóteses</button></div>'+
  '<div class="home-actions"><button class="primary" data-view="marketing">Criar conteúdo</button>'+
    '<button class="secondary" data-view="produto">Registrar melhoria</button>'+
    '<button class="secondary" data-view="oportunidades">Mapear oportunidade</button></div>';
}

export function renderTaskDrawer({state,STATUS_LABELS,readonly}) {
 const t=(state.items||[]).find(x=>x.id===state.focusTaskId);if(!t)return '';
 const ctx=(state.taskContexts||[]).find(x=>x.work_item_id===t.id);
 const related=ctx?.target_type==='content'?(state.contents||[]).find(x=>x.id===ctx.target_id):null;
 const target=related?'marketing':AREA_VIEW[t.track]||'pipeline';
 return '<div class="workbench-overlay" role="presentation"><aside class="workbench-drawer" role="dialog" aria-modal="true" aria-label="Execução da tarefa">'+
  '<div class="drawer-top"><span class="overline">TAREFA EM EXECUÇÃO</span><button class="icon-close" data-workbench="close-task" aria-label="Fechar">×</button></div>'+
  '<h2>'+E(t.title)+'</h2><p class="micro">'+E(t.track)+' · '+E(t.priority)+' · '+E(STATUS_LABELS[t.status]||t.status)+'</p>'+
  '<div class="drawer-block"><b>Próxima ação</b><p>'+E(t.next_action||'Ainda não definida')+'</p></div>'+
  '<div class="drawer-block"><b>Concluído quando</b><p>'+E(t.definition_of_done||'Registrar uma entrega verificável')+'</p></div>'+
  (related?'<div class="drawer-block"><b>Peça vinculada</b><p>'+E(related.title)+' · '+E(related.channel)+'</p>'+
    '<span class="badge outline">'+E(related.stage)+'</span></div>':
   '<div class="drawer-block"><b>Área de trabalho</b><p>'+E(t.track)+' · '+E(target)+'</p></div>')+
  (!readonly()?'<details class="task-edit"><summary>Ajustar tarefa</summary><form id="task-edit-form" class="form-grid" data-id="'+E(t.id)+'">'+
    '<label class="span-2">Título<input name="title" value="'+E(t.title)+'" maxlength="200" required></label>'+
    '<label>Prioridade<select name="priority">'+['P0','P1','P2','P3'].map(x=>'<option value="'+x+'"'+(x===t.priority?' selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
    '<label>Prazo<input name="due_date" type="date" value="'+E(t.due_date||'')+'"></label>'+
    '<label class="span-2">Próxima ação<textarea name="next_action" rows="3">'+E(t.next_action||'')+'</textarea></label>'+
    '<label class="span-2">Definição de concluído<textarea name="definition_of_done" rows="3">'+E(t.definition_of_done||'')+'</textarea></label>'+
    '<button class="primary span-2" type="submit">Salvar tarefa</button></form></details>':'')+
  '<div class="drawer-actions"><button class="primary" data-workbench="task-continue" data-id="'+E(t.id)+'">Abrir trabalho</button>'+
    (!readonly()?'<button class="secondary" data-workbench="task-done" data-id="'+E(t.id)+'">Registrar conclusão</button>':'')+
    '</div>'+ (t.source_url?'<p class="micro">Referência histórica: '+href(t.source_url,'Consultar fonte')+'</p>':'')+
  '</aside></div>';
}

export function renderCreativeShelf({state}) {
 const arr=(state.creativeAssets||[]);
 const cats=[...new Set(arr.map(a=>a.category))];
 const folders=arr.filter(a=>a.kind==='folder');
 const designs=arr.filter(a=>a.kind==='design');
 return '<div class="panel creative-shelf"><div class="panel-title"><div><h2>Biblioteca Canva do Aresta</h2><p class="micro">Pastas e modelos já localizados na conta conectada. Abra o arquivo específico, sem começar do zero.</p></div>'+
    '<span class="badge outline">'+arr.length+' referências</span></div>'+
    '<div class="shelf-grid">'+
    (folders.length?'<div><h3>Pastas</h3><div class="shelf-pills">'+folders.map(x=>
      '<a href="https://www.canva.com/folder/'+E(x.provider_id)+'" target="_blank" rel="noopener noreferrer">'+E(x.label)+' ↗</a>').join('')+'</div></div>':'')+
    (designs.length?'<div><h3>Modelos editáveis</h3><div class="shelf-pills">'+designs.map(x=>
      '<span class="asset-choice"><a href="'+E(safeLink(x.item_url))+'" target="_blank" rel="noopener noreferrer">'+E(x.label)+' ↗</a>'+
      '<button class="text-btn" data-workbench="attach-canva" data-id="'+E(x.id)+'">Vincular à pauta</button></span>').join('')+'</div></div>':'')+
    '</div><p class="micro">O Canva continua sendo o editor visual e o Content Planner. O CRM é a central de pauta, fonte, aprovação e resultado; ainda não lê o agendamento via API.</p></div>';
}

export function renderFocusedContent({state,readonly}) {
 const x=(state.contents||[]).find(c=>c.id===state.activeContentId);if(!x)return '';
 const linked=(state.creativeAssets||[]).find(a=>a.item_url===x.asset_url);
 return '<section class="panel focus-editor" id="focus-editor"><div class="panel-title"><div><span class="overline">MESA DE PRODUÇÃO</span>'+
    '<h2>'+E(x.title)+'</h2><p>'+E(x.channel)+' · '+E(x.stage)+'</p></div>'+
    '<button class="secondary" data-workbench="close-content">Voltar às pautas</button></div>'+
   '<div class="focus-editor-grid"><div class="creative-preview"><span class="overline">CRIATIVO VINCULADO</span>'+
   (x.asset_url&&safeLink(x.asset_url)?'<div class="preview-bound"><strong>'+(linked?E(linked.label):'Design externo vinculado')+'</strong><small>Abra para editar diretamente no Canva</small>'+
     href(x.asset_url,'Editar criativo específico ↗')+'</div>':
     '<div class="preview-bound empty-preview">Sem criativo vinculado.<small>Escolha um modelo da biblioteca abaixo ou cole o link da peça.</small></div>')+
   '</div><div><form id="edit-content-form" data-id="'+E(x.id)+'" class="form-grid">'+
   '<label class="span-2">Título<input name="title" value="'+E(x.title)+'" maxlength="240" required '+(readonly()?'disabled':'')+'></label>'+
   '<label class="span-2">Objetivo<input name="objective" value="'+E(x.objective||'')+'" maxlength="500" '+(readonly()?'disabled':'')+'></label>'+
   '<label class="span-2">Legenda<textarea name="caption" rows="9" '+(readonly()?'disabled':'')+'>'+E(x.caption||'')+'</textarea></label>'+
   '<label class="span-2">URL do criativo Canva<input name="asset_url" type="url" value="'+E(x.asset_url||'')+'" placeholder="https://www.canva.com/d/..." '+(readonly()?'disabled':'')+'></label>'+
   '<label class="span-2">Fonte / documento<input name="source_url" type="url" value="'+E(x.source_url||'')+'" '+(readonly()?'disabled':'')+'></label>'+
   (readonly()?'':'<button class="primary" type="submit">Salvar edição</button>')+
   '<button class="secondary" data-workbench="copy-edit-caption" type="button">Copiar legenda</button></form>'+
   '<p class="micro">Salvar guarda no Supabase. Criativos e publicações continuam com os direitos e permissões do Canva e do canal.</p></div></div></section>';
}

const APP_SCREENSHOTS=[
 'Screenshot_20260601_073945.jpg.jpeg',
 'Screenshot_20260601_073956.jpg.jpeg',
 'Screenshot_20260601_074006.jpg.jpeg',
 'Screenshot_20260601_074027.jpg.jpeg',
 'Screenshot_20260601_074219.jpg.jpeg'
].map((name,i)=>({name:'Tela '+(i+1),url:'https://raw.githubusercontent.com/aresta-climb/aresta_app/main/frontend/assets/'+name}));
// Capturas históricas de junho de 2026, não representam necessariamente a versão instalada hoje.
const VIEWS=[
 ['landing','Landing','https://arestaclimb.com/'],
 ['editor','Aresta Editor','https://arestaclimb.com/editor'],
 ['app','App nativo','https://arestaclimb.com/app']
];
export function renderUXWorkbench({state,readonly}) {
 const choice=VIEWS.find(v=>v[0]===(state.previewView||'landing'))||VIEWS[0];
 const marks=(state.reviewMarks||[]).filter(x=>x.product_area.toLowerCase()===(choice[0]==='landing'?'landing':choice[0]==='editor'?'editor':'app'));
 const view=choice[0];
 const shot=APP_SCREENSHOTS.find(x=>x.url===state.previewScreenshot)||APP_SCREENSHOTS[0];
 return '<section class="panel lab-panel"><div class="panel-title"><div><span class="overline">LABORATÓRIO UX</span><h2>Inspecionar produto e registrar melhorias</h2>'+
    '<p class="micro">Revisão funcional de telas reais; não edita automaticamente o app ou código do Editor.</p></div>'+
    '<div class="actions">'+VIEWS.map(v=>'<button type="button" class="secondary '+(v[0]===view?'selected':'')+'" data-workbench="preview-view" data-key="'+v[0]+'">'+v[1]+'</button>').join('')+'</div></div>'+
    '<div class="ux-lab-grid"><div class="ux-frame">'+
    (view==='app'?'<div class="app-shot"><img src="'+E(shot.url)+'" alt="Captura histórica '+E(shot.name)+' do aplicativo Aresta, arquivo do repositório técnico" loading="lazy"></div>'+
    '<div class="app-screen-thumbs">'+APP_SCREENSHOTS.map((s,i)=>'<button class="'+(shot.url===s.url?'selected':'')+'" type="button" data-workbench="app-screen" data-url="'+E(s.url)+'">Tela '+(i+1)+'</button>').join('')+'</div>'+
    '<p class="micro">Capturas técnicas de junho/2026. Podem não representar a versão atual do App Store / Google Play.</p>':
      '<iframe title="Prévia do '+E(choice[1])+'" src="'+E(choice[2])+'" loading="lazy" sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer"></iframe>')+
    '<div class="lab-meta"><span>Origem: '+E(choice[2])+'</span>'+href(choice[2],'Abrir original ↗')+'</div>'+
    '<p class="micro">A incorporação pode ser bloqueada pelo site original. Não equivale a um ambiente Figma nem permite editar a aplicação externa.</p></div>'+
    '<div class="ux-notes"><h3>Notas da interface</h3>'+
    (readonly()?'<p>Acesso de editor necessário.</p>':
    '<form id="review-mark-form" class="form-grid">'+
      '<label class="span-2">Tela / captura (URL)<input type="url" name="view_url" value="'+E(view==='app'?shot.url:choice[2])+'" required></label>'+
      '<label class="span-2">O que incomodou ou pode melhorar?<input name="title" required maxlength="200" placeholder="Ex.: botão de baixar pouco visível"></label>'+
      '<label class="span-2">Observação<textarea name="observation" required rows="3" placeholder="Onde aparece, impacto, evidência e ideia de solução"></textarea></label>'+
      '<input type="hidden" name="product_area" value="'+E(choice[1].includes('Editor')?'Editor':view==='app'?'App':'Landing')+'">'+
      '<button type="submit" class="primary">Salvar nota de UX</button></form>')+
    '<div class="notes-list">'+(marks.length?marks.slice(0,6).map(m=>
     '<div class="ux-note"><strong>'+E(m.title)+'</strong><p>'+E(m.observation)+'</p>'+
     '<div>'+href(m.view_url,'Ver tela')+
     (m.stage==='capturada'&&!readonly()?'<button class="text-btn" data-workbench="ux-to-proposal" data-id="'+E(m.id)+'">Virar proposta →</button>':'')+'</div></div>').join(''):
     '<p class="micro">Nenhuma anotação nesta área. Registre a primeira observação para orientar o time.</p>')+'</div></div></div></section>';
}

export function renderStrategicPulse({state}) {
 const rows=latestMetrics(state);
 return '<section class="panel strategy-panel"><div class="panel-title"><div><span class="overline">KOTLER 5As · HIPÓTESES DE JORNADA</span>'+
   '<h2>O que os dados permitem enxergar</h2></div><span class="badge outline">Leitura exploratória, não validação</span></div>'+
   '<div class="framework-flow">'+FRAMEWORK.map(([stage,en,meaning,key,note])=>{
     const r=key?rows[key]:null;
     return '<div class="framework-item"><span class="framework-phase">'+E(stage)+' <small>'+E(en)+'</small></span>'+
       '<strong>'+E(meaning)+'</strong><p>'+E(note)+'</p>'+
       '<div class="framework-data">'+(r?'Proxy: '+Number(r.metric_value).toLocaleString('pt-BR')+' · '+E(r.period_label):'Não há métrica direta')+'</div></div>';
   }).join('')+'</div><p class="micro">Aberturas, visualizações e consultas não constituem um funil de usuários únicos. Nunca calcular conversão dividindo esses totais sem identificadores, período comparável e instrumentação.</p></section>';
}

export function renderKnowledgeLibrary({state}) {
 const records=state.knowledge||[];
 const group=state.knowledgeGroup||'all';
 const q=(state.kbQuery||'').toLocaleLowerCase('pt-BR');
 const defs=[['all','Tudo'],['project','Projetos'],['territory','Territórios'],['evidence','Pesquisa'],['editorial','Comunicação'],['partner','Parceiros'],['task','Tarefas']];
 const list=records.filter(x=>(group==='all'||x.record_kind===group)&&(!q||[x.title,x.summary,x.area,x.source_collection].join(' ').toLocaleLowerCase('pt-BR').includes(q)));
 const shown=list.slice(0,state.kbLimit||9);
 return '<section class="section-head"><div><span class="overline">FONTE → EVIDÊNCIA → DECISÃO</span><h1>Biblioteca de conhecimento</h1>'+
 '<p>Encontre o contexto aqui, sem depender de navegar por páginas do Notion. Cada registro conserva origem, data e tipo de evidência.</p></div></section>'+
 '<form id="kb-search-form" class="knowledge-toolbar"><input name="query" value="'+E(state.kbQuery||'')+'" placeholder="Buscar por área, tema, fonte..." aria-label="Pesquisar base">'+
  '<button class="secondary" type="submit">Pesquisar</button></form>'+
 '<div class="kb-tabs">'+defs.map(([val,label])=>'<button class="'+(group===val?'selected':'')+'" data-workbench="knowledge-group" data-key="'+val+'">'+label+' <small>'+records.filter(x=>x.record_kind===val).length+'</small></button>').join('')+'</div>'+
 '<div class="knowledge-grid">'+(shown.length?shown.map(x=>'<details class="knowledge-card kb-entry"><summary><span class="badge outline">'+E(x.record_kind)+'</span>'+
   '<h3>'+E(x.title)+'</h3><small>'+E(x.area||'Aresta')+' · '+E(x.source_collection)+'</small></summary>'+
   '<p>'+E(x.summary||'Sem síntese registrada')+'</p><p class="micro">Status da fonte: '+E(x.source_status||'não classificado')+
   ' · importado: '+E(displayDate(x.last_synced_at))+'</p>'+
   '<div class="item-bottom">'+href(x.source_url,'Abrir documento original ↗')+'</div></details>').join(''):
 '<div class="empty">Não existem registros para este filtro.</div>')+'</div>'+
 (list.length>shown.length?'<button class="secondary" data-workbench="more-knowledge">Mostrar mais ('+(list.length-shown.length)+')</button>':'')+
 '<p class="micro">Registros importados são cópias com proveniência, não sincronização contínua nem confirmação automática do estado atual do produto.</p>';
}

export function renderConnectionCenter({state}) {
 const providers=[
 ['Canva','Designs e pastas verificados por integração ChatGPT','Ligar OAuth Canva diretamente ao backend para sincronizar artes','https://www.canva.com'],
 ['Notion','Cópia inicial do conteúdo já importada','Configurar sincronização de leitura incremental com revisão','https://www.notion.so'],
 ['GitHub','Código e PRs do laboratório disponíveis','Autenticar GitHub App com acesso mínimo ao repositório correto','https://github.com/aresta-climb'],
 ['Discord','Sem bot do CRM habilitado','Autorizar webhook ou bot só no canal aprovado','https://discord.com/app'],
 ['Instagram / Meta','Sem API do CRM autorizada','Conectar conta profissional e permissões de publicação','https://business.facebook.com'],
 ['WhatsApp','Sem integração de grupos','Verificar canal oficial elegível; não ler grupos pessoais','https://business.whatsapp.com'],
 ['Google Calendar','Sem OAuth do CRM','Escopo de leitura e escrita por evento mediante consentimento','https://calendar.google.com'],
 ['Looker Studio','Relatório consultável, sem sync via API','Conectar origem de dados autorizada e evitar métricas sem fonte','https://datastudio.google.com']
 ];
 return '<section class="section-head"><div><span class="overline">PERMISSÕES · FONTE · AUTOMAÇÃO</span><h1>Conexões seguras</h1>'+
 '<p>O CRM utiliza Supabase Auth e RLS. Acesso pelo ChatGPT a uma ferramenta não significa que essa ferramenta autorizou o CRM.</p></div></section>'+
 '<div class="connections-safety"><strong>Regra para novos conectores</strong><p>OAuth no servidor, tokens fora do GitHub e do navegador, escopos mínimos por organização, revogação e logs. Nunca marcar “conectado” sem teste real.</p></div>'+
 '<div class="knowledge-grid">'+providers.map(([title,known,next,url])=>
   '<article class="knowledge-card"><div class="item-top"><span class="badge outline">CRM: autorização pendente</span></div>'+
   '<h3>'+E(title)+'</h3><p><strong>O que existe:</strong> '+E(known)+'</p>'+
   '<p><strong>Para conectar:</strong> '+E(next)+'</p>'+
   '<div class="item-bottom">'+href(url,'Abrir serviço ↗')+'</div></article>').join('')+'</div>'+
 '<div class="panel"><h2>Conexões já operacionais dentro do CRM</h2>'+
 '<p><strong>Supabase:</strong> tarefas, conteúdo, melhorias, métricas registradas, permissões e evidências.</p>'+
 '<p><strong>IA:</strong> análise por regras disponível. Modelo externo só com chave e política de custo no servidor.</p>'+
 '<p><strong>Umami:</strong> ponte implantada, mas coleta autenticada só após chave.</p>'+
 '<p><strong>Editor:</strong> contratos identificados; escrita, revisão e merges seguem autorização de mantenedores.</p></div>';
}

export function installWorkbenchHandlers(getCtx) {
 const rerender=()=>getCtx().render();
 document.addEventListener('click',async ev=>{
  const b=ev.target.closest('[data-workbench]');if(!b)return;
  const {state,db,ws,readonly,loadData}=getCtx(),action=b.dataset.workbench,id=b.dataset.id;
  try {
   if(action==='open-task'){state.focusTaskId=id;rerender();return}
   if(action==='close-task'){state.focusTaskId=null;rerender();return}
   if(action==='task-continue'){
    const t=state.items.find(x=>x.id===id);if(!t)return;
    const c=(state.taskContexts||[]).find(x=>x.work_item_id===id);
    if(c?.target_type==='content'&&c.target_id){state.activeContentId=c.target_id;state.view='marketing'}
    else state.view=AREA_VIEW[t.track]||'pipeline';
    state.focusTaskId=null;rerender();
    document.getElementById('focus-editor')?.scrollIntoView({behavior:'smooth',block:'start'});return;
   }
   if(action==='task-done'){
    if(readonly())return;
    const evidence=window.prompt('Qual evidência confirma a entrega? Cole URL ou descrição verificável:','');
    if(!evidence||evidence.trim().length<6)return;
    const {error}=await db.from('crm_work_items').update({status:'concluido',result_evidence:evidence.trim()}).eq('id',id).eq('workspace_id',ws());
    if(error)throw error;await loadData();state.focusTaskId=null;state.notice='Tarefa concluída com evidência registrada.';rerender();return;
   }
   if(action==='content-focus'){state.activeContentId=id;state.view='marketing';rerender();return}
   if(action==='close-content'){state.activeContentId=null;rerender();return}
   if(action==='copy-edit-caption'){
    const x=state.contents.find(c=>c.id===state.activeContentId);if(!x)return;
    await navigator.clipboard.writeText(x.caption||'');state.notice='Legenda copiada.';rerender();return;
   }
   if(action==='attach-canva'){
    if(readonly())return;const a=state.creativeAssets.find(x=>x.id===id);
    if(!a||a.kind!=='design')return;
    if(state.activeContentId){
      const {error}=await db.from('crm_content_items').update({asset_url:a.item_url}).eq('id',state.activeContentId).eq('workspace_id',ws());
      if(error)throw error;await loadData();state.notice='Modelo vinculado como referência. Confirme a arte final antes de publicar.';rerender();
    }else {await navigator.clipboard.writeText(a.item_url);state.notice='Link do modelo copiado. Abra uma pauta para vinculá-lo.';rerender()}return;
   }
   if(action==='preview-view'){state.previewView=b.dataset.key;rerender();return}
   if(action==='app-screen'){
     if(!APP_SCREENSHOTS.some(x=>x.url===b.dataset.url))return;
     state.previewScreenshot=b.dataset.url;rerender();return;
   }
   if(action==='ux-to-proposal'){
     if(readonly())return;
     const m=state.reviewMarks.find(x=>x.id===id);if(!m)return;
     const {data,error}=await db.from('crm_product_proposals').insert({
       workspace_id:ws(),product_area:m.product_area,kind:'UX/UI',title:m.title,
       problem:m.observation,hypothesis:'A investigar com evidências e responsável técnico.',
       evidence_url:m.view_url,stage:'capturada',created_by:state.session.user.id
     }).select('id').single();
     if(error)throw error;
     const update=await db.from('crm_review_marks').update({proposal_id:data.id,stage:'transformada'}).eq('id',id).eq('workspace_id',ws());
     if(update.error)throw update.error;
     await loadData();state.view='produto';state.notice='Nota convertida em proposta de Produto.';rerender();return;
   }
   if(action==='partner-prefill'){
     state.partnerPrefill=b.dataset.name||'';state.view='pessoas';rerender();
     document.getElementById('contact-form')?.scrollIntoView({behavior:'smooth',block:'center'});return;
   }
   if(action==='knowledge-group'){state.knowledgeGroup=b.dataset.key;state.kbLimit=9;rerender();return}
   if(action==='more-knowledge'){state.kbLimit=(state.kbLimit||9)+9;rerender();return}
  }catch(err){state.error=err.message||String(err);rerender()}
 });
 document.addEventListener('submit',async ev=>{
  if(!['edit-content-form','review-mark-form','kb-search-form','task-edit-form'].includes(ev.target.id))return;
  ev.preventDefault();
  const {state,db,ws,readonly,loadData}=getCtx(),f=new FormData(ev.target);
  if(ev.target.id==='kb-search-form'){state.kbQuery=String(f.get('query')||'').trim();state.kbLimit=9;rerender();return}
  if(readonly())return;
  try{
   if(ev.target.id==='task-edit-form'){
     const id=ev.target.dataset.id;
     const title=String(f.get('title')||'').trim();
     if(title.length<2)throw Error('Título da tarefa inválido.');
     const {error}=await db.from('crm_work_items').update({
        title,priority:String(f.get('priority')||'P2'),
        due_date:String(f.get('due_date')||'')||null,
        next_action:String(f.get('next_action')||'').trim(),
        definition_of_done:String(f.get('definition_of_done')||'').trim()
     }).eq('workspace_id',ws()).eq('id',id);
     if(error)throw error;await loadData();state.notice='Tarefa atualizada.';rerender();return;
   }
   if(ev.target.id==='edit-content-form'){
     const itemId=ev.target.dataset.id;
     const {error}=await db.from('crm_content_items').update({
       title:String(f.get('title')||'').trim(),objective:String(f.get('objective')||'').trim(),
       caption:String(f.get('caption')||'').trim(),asset_url:String(f.get('asset_url')||'').trim()||null,
       source_url:String(f.get('source_url')||'').trim()||null
     }).eq('workspace_id',ws()).eq('id',itemId);
     if(error)throw error;await loadData();state.notice='Pauta atualizada no CRM.';rerender();return;
   }
   if(ev.target.id==='review-mark-form'){
     const {error}=await db.from('crm_review_marks').insert({
       workspace_id:ws(),product_area:String(f.get('product_area')||'App'),
       view_url:String(f.get('view_url')||'').trim(),title:String(f.get('title')||'').trim(),
       observation:String(f.get('observation')||'').trim(),created_by:state.session.user.id
     });
     if(error)throw error;await loadData();state.notice='Nota de revisão salva.';rerender();
   }
  }catch(err){state.error=err.message||String(err);rerender()}
 });
}
