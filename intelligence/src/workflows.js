import {renderCreativeShelf,renderFocusedContent,renderUXWorkbench,renderStrategicPulse} from './workbench.js';
// ARESTA Intelligence — operações editoriais, melhorias de produto e dados.
// UI e operações internas; publicação externa só após consentimento e API específica.
const CONTENT_STAGES=['ideia','rascunho','revisao','aprovado','agendado','publicado','medido'];
const PRODUCT_STAGES=['capturada','investigar','proposta','priorizada','implementando','entregue','medida'];
const BRANDS=['Aresta','FEMEMG','ACEC','Igarameca','Parceiro'];
const CHANNELS=['Instagram','LinkedIn','Facebook','WhatsApp','Discord','Site','Outro'];
const AREAS=['App','Editor','Landing','Intelligence','API','ArestaDB','Outro'];
const KINDS=['Bug','UX/UI','Funcionalidade','Dados','Pesquisa','Experimento'];

function opt(x,selected){return '<option value="'+x+'"'+(x===selected?' selected':'')+'>'+x+'</option>';}
function blank(msg){return '<div class="empty">'+msg+'</div>';}
function date(s){return s?new Date(s).toLocaleDateString('pt-BR'):'Sem agendamento';}
function asUrl(v){try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
function buttonAction(id,action,label,disabled=false){return '<button class="secondary" data-workflow="'+action+'" data-id="'+id+'"'+(disabled?' disabled':'')+'>'+label+'</button>';}
function statusTag(s){return '<span class="badge outline">'+s+'</span>';}
function intro(kicker,title,description,actions=''){return '<section class="section-head"><div><span class="overline">'+kicker+'</span><h1>'+title+'</h1><p>'+description+'</p></div>'+actions+'</section>';}

export function renderMarketing({state,esc,readonly}) {
 const items=state.contents||[];
 const current=state.marketingFilter||'Todos';
 const selected=current==='Todos'?items:items.filter(x=>x.brand===current);
 const stats=CONTENT_STAGES.map(st=>({name:st,n:items.filter(x=>x.stage===st).length})).filter(x=>x.n);
 return renderFocusedContent({state,readonly})+intro('PLANEJAR → CRIAR → REVISAR → PUBLICAR → MEDIR','Marketing & Conteúdo',
   'Crie e revise conteúdo aqui. A publicação externa permanece manual até uma conexão autorizada; os estados e resultados ficam no CRM.',
   '<select id="marketing-filter" aria-label="Filtrar marca">'+['Todos',...BRANDS].map(x=>opt(x,current)).join('')+'</select>')+
  '<div class="knowledge-summary">'+(stats.map(x=>'<div><b>'+x.n+'</b><span>'+x.name+'</span></div>').join('')||'<div><b>0</b><span>Publicações</span></div>')+'</div>'+
  '<div class="two-cols"><div class="panel form-panel"><h2>Nova pauta ou peça</h2>'+
    (readonly()?'<p>Necessário acesso de editor.</p>':
    '<form id="content-form" class="form-grid">'+
    '<label class="span-2">Tema / entrega<input name="title" required maxlength="240" placeholder="Ex.: História da escalada na Lapinha"></label>'+
    '<label>Marca<select name="brand">'+BRANDS.map(x=>opt(x,'Aresta')).join('')+'</select></label>'+
    '<label>Canal<select name="channel">'+CHANNELS.map(x=>opt(x,'Instagram')).join('')+'</select></label>'+
    '<label class="span-2">Objetivo<input name="objective" maxlength="300" placeholder="O que este conteúdo deve gerar?"></label>'+
    '<label class="span-2">Legenda<textarea id="caption-draft" name="caption" rows="6" placeholder="Escreva aqui. Use o botão Gerar estrutura ou adapte com o assistente."></textarea></label>'+
    '<label class="span-2">Link do criativo Canva ou arquivo<input name="asset_url" type="url" placeholder="https://www.canva.com/design/..."></label>'+
    '<label class="span-2">Fonte, pesquisa ou documento<input name="source_url" type="url" placeholder="Link para a evidência original"></label>'+
    '<button type="button" class="secondary" data-workflow="template-caption">Gerar estrutura</button>'+
    '<button type="submit" class="primary">Salvar rascunho</button></form>')+
    '<p class="micro">Gerar estrutura é uma automação de texto, não IA generativa. Nunca publica automaticamente.</p></div>'+
  '<div class="panel"><h2>Fluxo de execução</h2><div class="milestones vertical-flow">'+
    '<div><strong>1. Pauta e evidência</strong><small>O que, para quem, fonte e resultado desejado</small></div>'+
    '<div><strong>2. Criativo e adaptação</strong><small>Canva + texto específico por canal</small></div>'+
    '<div><strong>3. Aprovação</strong><small>Marcar aprovado após revisão, inclusive em parcerias</small></div>'+
    '<div><strong>4. Programação e resultado</strong><small>Registrar URL real, data e métricas</small></div></div>'+
    '<div class="quick-links"><a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer">Abrir Canva</a>'+
    '<a href="https://www.canva.com/pt_br/help/content-planner/" target="_blank" rel="noopener noreferrer">Planejador de Conteúdo</a></div>'+
    '<p class="micro">Integração Canva/Instagram/LinkedIn depende de OAuth e permissões no serviço correspondente.</p></div></div>'+
  '<div class="section-head slim"><div><h2>Peças no fluxo</h2><p>Copie legendas, altere estágio, registre publicação confirmada e reutilize conteúdo.</p></div></div>'+
  '<div class="knowledge-grid">'+(selected.length?selected.map(x=>'<article class="knowledge-card"><div class="item-top">'+
    statusTag(esc(x.stage))+'<span class="track-tag">'+esc(x.brand)+' · '+esc(x.channel)+'</span></div>'+
    '<h3>'+esc(x.title)+'</h3><p>'+esc(x.objective||'Sem objetivo registrado')+'</p>'+
    (x.caption?'<div class="caption-preview">'+esc(x.caption.slice(0,320))+(x.caption.length>320?'…':'')+'</div>':'<p class="micro">Ainda sem legenda.</p>')+
    (x.asset_url&&asUrl(x.asset_url)?'<a class="external" href="'+esc(x.asset_url)+'" target="_blank" rel="noopener noreferrer">Criativo</a> ':'')+
    (x.published_url&&asUrl(x.published_url)?'<a class="external" href="'+esc(x.published_url)+'" target="_blank" rel="noopener noreferrer">Post publicado</a> ':'')+
    '<div class="actions-block">'+'<button class="secondary" data-workbench="content-focus" data-id="'+esc(x.id)+'">Editar pauta</button>'+buttonAction(x.id,'copy-caption','Copiar legenda',!x.caption)+
    buttonAction(x.id,'advance-content',x.stage==='aprovado'?'Programar':x.stage==='agendado'?'Registrar publicação':'Próxima etapa',
       readonly()||x.stage==='medido')+
    buttonAction(x.id,'clone-content','Reaproveitar',readonly())+'</div>'+
    '<p class="micro">Atualizado em '+date(x.updated_at)+'</p></article>').join(''):blank('Nenhum conteúdo salvo nesta marca. Comece por uma pauta.'))+'</div>'+renderCreativeShelf({state});
}

export function renderProduct({state,esc,readonly}) {
 const items=state.proposals||[];
 return renderUXWorkbench({state,readonly})+intro('EVIDÊNCIA → PROBLEMA → PROPOSTA → IMPLEMENTAÇÃO','Produto & UX',
   'Capture melhorias do aplicativo, Editor, landing e Intelligence. O CRM registra a proposta e prepara a especificação para o time; não altera código automaticamente.')+
  '<div class="two-cols"><div class="panel form-panel"><h2>Registrar melhoria ou problema</h2>'+
    (readonly()?'<p>Acesso de edição necessário.</p>':
    '<form id="proposal-form" class="form-grid">'+
    '<label>Produto<select name="product_area">'+AREAS.map(x=>opt(x,'App')).join('')+'</select></label>'+
    '<label>Tipo<select name="kind">'+KINDS.map(x=>opt(x,'UX/UI')).join('')+'</select></label>'+
    '<label class="span-2">Título<input name="title" required maxlength="240" placeholder="Ex.: reduzir passos para enviar sugestão"></label>'+
    '<label class="span-2">Problema observado<textarea name="problem" rows="3" placeholder="Qual dificuldade, para quem e em qual contexto?"></textarea></label>'+
    '<label class="span-2">Hipótese de solução<textarea name="hypothesis" rows="3" placeholder="O que poderíamos mudar? (hipótese, não fato)"></textarea></label>'+
    '<label class="span-2">Evidência / print / pesquisa<input type="url" name="evidence_url" placeholder="https://..."></label>'+
    '<label>Impacto<select name="impact">'+['Baixo','Médio','Alto'].map(x=>opt(x,'Médio')).join('')+'</select></label>'+
    '<label>Esforço<select name="effort">'+['A avaliar','Baixo','Médio','Alto'].map(x=>opt(x,'A avaliar')).join('')+'</select></label>'+
    '<button class="primary span-2" type="submit">Registrar proposta</button></form>')+'</div>'+
  '<div class="panel"><h2>Onde as propostas se conectam</h2>'+
   '<div class="milestones vertical-flow">'+
   '<div><strong>App</strong><small>Uso offline, navegação, jornada e retenção</small></div>'+
   '<div><strong>Editor</strong><small>Criação de croquis, contribuições e revisão por curadores</small></div>'+
   '<div><strong>Intelligence</strong><small>Dados, relatórios, pesquisa, fomento e comunidade</small></div>'+
   '<div><strong>Landing e API</strong><small>Distribuição, integração e infraestrutura</small></div></div>'+
   '<div class="quick-links"><a href="https://arestaclimb.com/editor" target="_blank" rel="noopener noreferrer">Abrir Aresta Editor</a><a href="https://github.com/aresta-climb/aresta_app" target="_blank" rel="noopener noreferrer">Código do App</a><a href="https://github.com/aresta-climb/aresta_db" target="_blank" rel="noopener noreferrer">Base e Editor</a></div><p class="micro">A implementação e aprovação seguem com mantenedores autorizados. O CRM organiza propostas; não faz merge automaticamente.</p></div></div>'+
  '<div class="section-head slim"><div><h2>Backlog de melhorias</h2><p>Revisável com Renato e os responsáveis por cada repositório.</p></div></div>'+
  '<div class="knowledge-grid">'+(items.length?items.map(x=>'<article class="knowledge-card"><div class="item-top">'+
   statusTag(esc(x.stage))+'<span class="track-tag">'+esc(x.product_area)+' · '+esc(x.kind)+'</span></div>'+
   '<h3>'+esc(x.title)+'</h3><p><b>Problema:</b> '+esc(x.problem||'Ainda não detalhado')+'</p>'+
   '<p><b>Hipótese:</b> '+esc(x.hypothesis||'A formular')+'</p>'+
   '<div class="item-top"><span class="track-tag">Impacto: '+esc(x.impact)+'</span><span class="track-tag">Esforço: '+esc(x.effort)+'</span></div>'+
   (x.evidence_url&&asUrl(x.evidence_url)?'<a class="external" href="'+esc(x.evidence_url)+'" target="_blank" rel="noopener noreferrer">Evidência</a> ':'')+
   (x.github_issue_url&&asUrl(x.github_issue_url)?'<a class="external" href="'+esc(x.github_issue_url)+'" target="_blank" rel="noopener noreferrer">Issue</a> ':'')+
   '<div class="actions-block">'+buttonAction(x.id,'copy-proposal','Copiar especificação')+
   buttonAction(x.id,'proposal-next','Próximo estado',readonly()||x.stage==='medida')+
   buttonAction(x.id,'proposal-task','Criar tarefa',readonly())+'</div></article>').join(''):blank('Nenhuma proposta ainda. Cadastre um problema observado para começar.'))+'</div>';
}

export function renderInsights({state,esc,readonly}) {
 const sources=state.metricSources||[], readings=state.metricSnapshots||[];
 const umami=sources.find(x=>x.provider==='Umami'),looker=sources.find(x=>x.provider==='Looker Studio');
 const current=state.selectedMetricSource||sources[0]?.id||'';
 const snapshots=readings.filter(x=>!current||x.source_id===current);
 return intro('FONTES → MÉTRICAS → RELATÓRIO → DECISÃO','Dados & Relatórios',
   'Umami e Looker identificados como fontes. Dados só aparecem como medição quando recebidos por API autorizada ou registrados com origem verificável.')+
   '<div class="two-cols"><div class="panel"><h2>Fontes de analytics</h2>'+
   sources.map(x=>'<div class="source-status"><strong>'+esc(x.display_name)+'</strong>'+
    statusTag(x.connection_status==='connected'?'API conectada':x.connection_status==='error'?'Erro de conexão':'Link disponível · API pendente')+
    '<p>'+esc(x.provider)+(x.last_fetched_at?' · Coleta: '+date(x.last_fetched_at):' · Sem coleta automática confirmada')+'</p>'+
    '<a class="external" href="'+esc(x.source_url)+'" target="_blank" rel="noopener noreferrer">Abrir painel original</a></div>').join('')+
   (umami?'<div class="actions-block"><button class="primary" data-workflow="refresh-umami"'+(state.sourceLoading?' disabled':'')+'>'+(state.sourceLoading?'Consultando…':'Atualizar Umami via API')+'</button></div>':'')+
   (state.analyticsNotice?'<p class="notice inline-notice">'+esc(state.analyticsNotice)+'</p>':'')+
   '<p class="micro">Atualização Umami exige API key no servidor; não colocamos credenciais no navegador. O Looker depende de compartilhamento ou da API autorizada.</p></div>'+
   '<div class="panel"><h2>Painel Looker Studio</h2><p>É possível usar o relatório original sem recriar gráficos. A exibição abaixo funciona somente se o proprietário liberar incorporação e acesso.</p>'+
   (looker?'<div class="actions-block"><button class="secondary" data-workflow="toggle-looker">'+(state.showLooker?'Ocultar incorporação':'Tentar visualizar aqui')+'</button></div>'+
   (state.showLooker?'<iframe class="looker-frame" title="Looker Studio — painel de produto" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" referrerpolicy="strict-origin-when-cross-origin" src="https://lookerstudio.google.com/embed/reporting/'+esc(looker.source_ref)+'/page/sSF8F"></iframe>':''):'')+
   '<p class="micro">Se o relatório não carregar, utilize “Abrir painel original” e ajuste as permissões no Looker.</p></div></div>'+
   '<div class="panel"><div class="panel-title"><h2>Leituras com proveniência</h2>'+statusTag(readings.length+' registros')+'</div>'+
   (readonly()?'': '<form id="metric-form" class="metric-form">'+
     '<label>Fonte<select name="source_id" required>'+sources.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.provider)+'</option>').join('')+'</select></label>'+
     '<label>Métrica<input name="metric_name" required placeholder="Ex.: visitas / sessões"></label>'+
     '<label>Valor<input name="metric_value" type="number" step="any" required></label>'+
     '<label>Período<input name="period_label" placeholder="Ex.: 01–22/11"></label>'+
     '<label>Unidade<input name="metric_unit" placeholder="visitas, usuários…"></label>'+
     '<label>Origem<select name="provenance">'+['manual','verified_report','csv'].map(x=>opt(x,'manual')).join('')+'</select></label>'+
     '<label class="span-2">Notas de interpretação<input name="source_note" maxlength="500" placeholder="Qual fonte, cobertura e limitação?"></label>'+
     '<button class="primary" type="submit">Registrar medição</button></form>')+
   '<div class="metric-toolbar"><select id="metric-filter" aria-label="Fonte da série">'+sources.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===current?' selected':'')+'>'+esc(x.provider)+'</option>').join('')+'</select></div>'+
   (snapshots.length?'<div class="table-wrap"><table><thead><tr><th>Métrica</th><th>Valor</th><th>Período</th><th>Tipo</th><th>Coleta</th></tr></thead><tbody>'+
   snapshots.slice(0,35).map(r=>'<tr><td>'+esc(r.metric_name)+'</td><td><strong>'+esc(r.metric_value)+' '+esc(r.metric_unit)+'</strong></td><td>'+esc(r.period_label)+'</td><td>'+esc(r.provenance)+'</td><td>'+date(r.observed_at)+'</td><td>'+buttonAction(r.id,'metric-to-content','Criar pauta',readonly())+'</td></tr>').join('')+'</tbody></table></div>':blank('Nenhum valor conferido. Abra as fontes ou conecte a API antes de interpretar resultados.'))+'</div>';
}

// Binding funcional no CRM, usando apenas acesso com membership + RLS.
// Cada ação é explícita e deve devolver estado audível ao usuário.

const OPPORTUNITY_STAGES=['mapeada','analisar','preparar','submetida','negociando','aprovada','encerrada'];
const OPPORTUNITY_TYPES=['Edital','Pesquisa','Parceria','Patrocínio','Expansão','Serviço','Outro'];
export function renderOpportunities({state,esc,readonly}) {
  const list=state.opportunities||[];
  return intro('MAPEAR → AVALIAR → PROPOR → ACOMPANHAR','Oportunidades & Fomento',
    'Projetos, editais, pesquisa, parcerias e caminhos de receita. Cada oportunidade precisa de fonte, prazo e próxima ação, sem confundir elegibilidade com aprovação.')+
    '<div class="two-cols"><div class="panel form-panel"><h2>Registrar oportunidade</h2>'+
    (readonly()?'<p>Você não tem permissão de edição neste workspace.</p>':
    '<form id="opportunity-form" class="form-grid">'+
     '<label class="span-2">Oportunidade<input name="title" maxlength="240" required placeholder="Ex.: pesquisa aplicada e monitoramento Lapinha"></label>'+
     '<label>Tipo<select name="opportunity_type">'+OPPORTUNITY_TYPES.map(x=>opt(x,'Pesquisa')).join('')+'</select></label>'+
     '<label>Prazo<input type="date" name="deadline"></label>'+
     '<label class="span-2">Contexto<textarea rows="3" name="summary" placeholder="Problema, organização, edital ou público."></textarea></label>'+
     '<label class="span-2">Próxima ação<input name="next_action" maxlength="500" placeholder="Qual é o primeiro movimento?"></label>'+
     '<label class="span-2">Resultado pretendido<input name="expected_result" maxlength="500" placeholder="O que queremos conseguir?"></label>'+
     '<label class="span-2">Fonte verificável<input type="url" name="source_url" placeholder="https://..."></label>'+
     '<button type="submit" class="primary">Salvar oportunidade</button></form>')+'</div>'+
    '<div class="panel"><h2>Critérios de decisão</h2>'+
      '<div class="milestones vertical-flow"><div><strong>1. Problema e público</strong><small>Quem se beneficia e qual problema está documentado?</small></div>'+
      '<div><strong>2. Critérios e elegibilidade</strong><small>Regra oficial, prazo, proponente e dependências.</small></div>'+
      '<div><strong>3. Esforço e reversibilidade</strong><small>O teste menor que produz aprendizado suficiente.</small></div>'+
      '<div><strong>4. Evidência e retorno</strong><small>Valor social, territorial, financeiro ou científico.</small></div></div>'+
      '<p class="micro">Esta área funciona para associações e instituições, com acesso controlado por workspace.</p></div></div>'+
    '<div class="section-head slim"><div><h2>Pipeline de oportunidades</h2><p>Transforme análise em ação, sem documentos desnecessários.</p></div></div>'+
    '<div class="knowledge-grid">'+(list.length?list.map(x=>'<article class="knowledge-card"><div class="item-top">'+
     statusTag(esc(x.stage))+'<span class="track-tag">'+esc(x.opportunity_type)+'</span>'+
     (x.deadline?'<span class="due">Até '+esc(x.deadline.split('-').reverse().join('/'))+'</span>':'')+'</div>'+
     '<h3>'+esc(x.title)+'</h3><p>'+esc(x.summary||'Sem contexto ainda')+'</p>'+
     '<p><b>Próxima ação:</b> '+esc(x.next_action||'definir')+'</p>'+
     (x.source_url&&asUrl(x.source_url)?'<a href="'+esc(x.source_url)+'" class="external" target="_blank" rel="noopener noreferrer">Fonte</a>':'')+
     '<div class="actions-block">'+buttonAction(x.id,'opportunity-next','Próximo estágio',readonly()||x.stage==='encerrada')+
     buttonAction(x.id,'opportunity-task','Criar ação',readonly())+'</div></article>').join(''):blank('Sem oportunidades cadastradas neste workspace.'))+'</div>';
}

export function installWorkflowHandlers(getCtx) {
 const update=async (table,id,values)=>{
   const {db,state,ws,loadData,render}=getCtx();
   const {error}=await db.from(table).update(values).eq('id',id).eq('workspace_id',ws());
   if(error)throw error;
   await loadData();state.notice='Alteração registrada no CRM.';render();
 };
 const copy=async text=>{await navigator.clipboard.writeText(text)};
 document.addEventListener('submit',async e=>{
   if(!['content-form','proposal-form','metric-form','opportunity-form'].includes(e.target.id))return;
   e.preventDefault();const {db,state,ws,readonly,loadData,render}=getCtx();
   if(!db||readonly())return;
   const f=new FormData(e.target);let table,values;
   if(e.target.id==='content-form'){
     table='crm_content_items';values={
       title:String(f.get('title')||'').trim(), brand:String(f.get('brand')||'Aresta'),
       channel:String(f.get('channel')||'Instagram'),objective:String(f.get('objective')||'').trim(),
       caption:String(f.get('caption')||'').trim(),asset_url:f.get('asset_url')||null,
       source_url:f.get('source_url')||null,stage:'rascunho',created_by:state.session.user.id};
   } else if(e.target.id==='proposal-form'){
     table='crm_product_proposals'; values={
       title:String(f.get('title')||'').trim(), product_area:String(f.get('product_area')||'App'),
       kind:String(f.get('kind')||'UX/UI'),problem:String(f.get('problem')||'').trim(),
       hypothesis:String(f.get('hypothesis')||'').trim(),evidence_url:f.get('evidence_url')||null,
       impact:String(f.get('impact')||'Médio'),effort:String(f.get('effort')||'A avaliar'),
       stage:'capturada',created_by:state.session.user.id};
   } else if(e.target.id==='opportunity-form') {
     table='crm_opportunities';values={
       title:String(f.get('title')||'').trim(),opportunity_type:String(f.get('opportunity_type')||'Outro'),
       summary:String(f.get('summary')||'').trim(),next_action:String(f.get('next_action')||'').trim(),
       expected_result:String(f.get('expected_result')||'').trim(),
       source_url:f.get('source_url')||null,deadline:f.get('deadline')||null,
       stage:'mapeada',created_by:state.session.user.id};
   } else {
     table='crm_metric_snapshots';values={
       source_id:String(f.get('source_id')||''),metric_name:String(f.get('metric_name')||'').trim(),
       metric_value:Number(f.get('metric_value')),metric_unit:String(f.get('metric_unit')||'').trim(),
       period_label:String(f.get('period_label')||'').trim(),provenance:String(f.get('provenance')||'manual'),
       source_note:String(f.get('source_note')||'').trim(),created_by:state.session.user.id};
   }
   const {error}=await db.from(table).insert({...values,workspace_id:ws()});
   if(error)state.error=error.message;else{await loadData();state.notice='Registro salvo com rastreabilidade.';}
   render();
 });
 document.addEventListener('change',e=>{
   const {state,render}=getCtx();
   if(e.target.id==='marketing-filter'){state.marketingFilter=e.target.value;render();}
   if(e.target.id==='metric-filter'){state.selectedMetricSource=e.target.value;render();}
 });
 document.addEventListener('click',async e=>{
   const b=e.target.closest('[data-workflow]');if(!b)return;
   const {db,state,ws,readonly,loadData,render}=getCtx();
   const action=b.dataset.workflow,id=b.dataset.id;
   state.error='';state.notice='';
   try{
     if(action==='toggle-looker'){state.showLooker=!state.showLooker;render();return;}
     if(action==='template-caption'){
       const form=document.getElementById('content-form');
       if(!form)return;
       const fd=new FormData(form), title=String(fd.get('title')||'').trim(), objective=String(fd.get('objective')||'').trim(),channel=fd.get('channel');
       if(!title){state.error='Informe o tema antes de gerar uma estrutura.';render();return;}
       const text=channel==='LinkedIn'?
         title+'\n\nContexto e problema:\n\nO que estamos desenvolvendo:\n\nPor que isso importa para o território e a comunidade:\n\n'+(objective?'Objetivo: '+objective+'\n\n':'')+'Fonte e créditos:\n\nConvite à participação:':
         title+'\n\nO que você precisa saber:\n\nInformação útil para quem escala:\n\n'+(objective?'Objetivo: '+objective+'\n\n':'')+'Créditos e fontes:\n\nParticipe / saiba mais:';
       const field=form.querySelector('[name=caption]');if(field)field.value=text;
       state.notice='Estrutura criada. Confira os fatos antes de publicar.';return;
     }
     if(action==='copy-caption'){
       const x=state.contents.find(i=>i.id===id);if(!x)return;
       await copy(x.caption);state.notice='Legenda copiada. Revise antes de enviar ao Canva ou à rede.';render();return;
     }
     if(action==='clone-content'){
       if(readonly())return;const x=state.contents.find(i=>i.id===id);if(!x)return;
       const next=CHANNELS.filter(c=>c!==x.channel).join(', ');
       const channel=window.prompt('Novo canal: '+next,'LinkedIn');if(!CHANNELS.includes(channel)||channel===x.channel)return;
       const {error}=await db.from('crm_content_items').insert({
         workspace_id:ws(),title:x.title,brand:x.brand,channel,stage:'rascunho',
         objective:x.objective,caption:x.caption,asset_url:x.asset_url,source_url:x.source_url,
         created_by:state.session.user.id});
       if(error)throw error;await loadData();state.notice='Versão criada para '+channel+'. Adapte antes de publicar.';render();return;
     }
     if(action==='advance-content'){
       if(readonly())return;const x=state.contents.find(i=>i.id===id);if(!x)return;
       if(x.stage==='agendado'){
         const url=window.prompt('URL pública da postagem já realizada (obrigatória):',x.published_url||'');
         if(!url)return;if(!asUrl(url)){state.error='Informe URL completa https://...';render();return;}
         await update('crm_content_items',id,{stage:'publicado',published_url:url});return;
       }
       if(x.stage==='aprovado'){
         const time=window.prompt('Data/hora de agendamento (AAAA-MM-DD HH:MM). Não agenda no Canva automaticamente:','');
         if(!time)return;
         const iso=new Date(time.replace(' ','T'));
         if(isNaN(iso.getTime())){state.error='Data inválida.';render();return;}
         await update('crm_content_items',id,{stage:'agendado',scheduled_at:iso.toISOString()});return;
       }
       const next=CONTENT_STAGES[CONTENT_STAGES.indexOf(x.stage)+1];
       if(next==='aprovado'&&!window.confirm('Este conteúdo foi revisado e está aprovado para preparar publicação?'))return;
       if(next==='medido'){
         const note=window.prompt('Informe o resultado observado e a fonte. Não invente métricas:',x.result_notes||'');
         if(!note||note.trim().length<4)return;
         await update('crm_content_items',id,{stage:'medido',result_notes:note.trim()});return;
       }
       await update('crm_content_items',id,{stage:next});return;
     }
     if(action==='copy-proposal'){
       const x=state.proposals.find(i=>i.id===id);if(!x)return;
       const text=['# '+x.title,'**Área:** '+x.product_area,'**Tipo:** '+x.kind,'**Problema observado:** '+x.problem,
         '**Hipótese:** '+x.hypothesis,'**Impacto:** '+x.impact,'**Esforço:** '+x.effort,
         '**Fonte/evidência:** '+(x.evidence_url||'a coletar'), '**Critério de aceite:** a definir com responsável técnico',
         'Estado: proposta de avaliação; não representa implementação.'].join('\n\n');
       await copy(text);state.notice='Especificação copiada para discutir e criar issue no repositório correto.';render();return;
     }
     if(action==='proposal-next'){
       if(readonly())return;const x=state.proposals.find(i=>i.id===id);if(!x)return;
       const next=PRODUCT_STAGES[PRODUCT_STAGES.indexOf(x.stage)+1];
       if(next==='implementando'&&!window.confirm('Há responsável técnico e trabalho realmente iniciado?'))return;
       if(next==='entregue'&&!window.confirm('A implementação foi verificada na fonte técnica?'))return;
       await update('crm_product_proposals',id,{stage:next});return;
     }
     if(action==='proposal-task'){
       if(readonly())return;const x=state.proposals.find(i=>i.id===id);if(!x)return;
       const {error}=await db.from('crm_work_items').insert({
         workspace_id:ws(),title:'Avaliar: '+x.title,track:'Produto',priority:'P2',status:'entrada',
         next_action:'Reunir evidência e avaliar com responsável técnico. '+x.next_action,
         definition_of_done:'Decisão registrada, responsável e próxima etapa definidos.',
         source_kind:'manual',source_url:x.evidence_url||null,created_by:state.session.user.id
       });
       if(error)throw error;await loadData();state.notice='Tarefa vinculada ao backlog operacional.';render();return;
     }
     if(action==='metric-to-content'){
       if(readonly())return;
       const record=state.metricSnapshots.find(x=>x.id===id);if(!record)return;
       const source=state.metricSources.find(x=>x.id===record.source_id);
       const title='Indicador: '+record.metric_name+' · '+(record.period_label||'período a conferir');
       const body='Dado observado: '+record.metric_value+' '+(record.metric_unit||'')+
         '\nPeríodo: '+(record.period_label||'não definido')+
         '\nFonte: '+(source?.display_name||'fonte a identificar')+
         '\nNota metodológica: '+(record.source_note||'Conferir cobertura e interpretação')+
         '\n\nContexto para a comunidade:\n\nCréditos e autorização de divulgação:';
       const {error}=await db.from('crm_content_items').insert({
         workspace_id:ws(),title,brand:'Aresta',channel:'Site',stage:'rascunho',
         objective:'Transformar um indicador rastreável em informação útil, após revisão.',
         caption:body,source_url:source?.source_url||null,created_by:state.session.user.id
       });
       if(error)throw error;await loadData();state.view='marketing';state.notice='Rascunho criado a partir de medição. Revise antes de divulgar.';render();return;
     }
     if(action==='opportunity-next'){
       if(readonly())return;const x=state.opportunities.find(i=>i.id===id);if(!x)return;
       const next=OPPORTUNITY_STAGES[OPPORTUNITY_STAGES.indexOf(x.stage)+1];
       if(next==='aprovada'&&!window.confirm('Esta oportunidade foi de fato aprovada pelo responsável?'))return;
       await update('crm_opportunities',id,{stage:next});return;
     }
     if(action==='opportunity-task'){
       if(readonly())return;const x=state.opportunities.find(i=>i.id===id);if(!x)return;
       const {error}=await db.from('crm_work_items').insert({
         workspace_id:ws(),title:'Oportunidade: '+x.title,track:'Parcerias',priority:'P2',status:'entrada',
         next_action:x.next_action||'Verificar elegibilidade, prazos e contrapartidas.',
         definition_of_done:x.expected_result||'Decisão registrada com fonte e responsável.',
         due_date:x.deadline,source_url:x.source_url,source_kind:'manual',created_by:state.session.user.id});
       if(error)throw error;await loadData();state.notice='Ação registrada no pipeline de execução.';render();return;
     }
     if(action==='refresh-umami'){
       if(!db||readonly())return;
       state.sourceLoading=true;render();
       const {data,error}=await db.functions.invoke('aresta-analytics',{body:{workspace_id:ws(),period:'7d'}});
       state.sourceLoading=false;
       if(error){state.analyticsNotice='API ainda não acessível: '+error.message;render();return;}
       if(data?.status==='needs_key'){state.analyticsNotice='Umami identificado, mas falta configurar UMAMI_API_KEY no Supabase para coleta automática.';render();return;}
       if(data?.status==='ok'){await loadData();state.analyticsNotice='Umami atualizado em '+new Date().toLocaleString('pt-BR')+'.';render();return;}
       state.analyticsNotice=data?.message||'Fonte indisponível.';render();return;
     }
   }catch(err){state.error=String(err.message||err);render();}
 });
}
