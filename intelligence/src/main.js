import { createClient } from '@supabase/supabase-js';
import {
  STATUS, STATUS_LABELS, PRIORITY, TRACKS, CHANNELS, CLOSED,
  escapeHTML as esc, localDay, shortDate, rankTasks, buildAIPrompt
} from './rules.js';
import './styles.css';

const app = document.getElementById('app');
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = Boolean(url && /^https:\/\//.test(url) && key && !String(key).includes('SUBSTITUIR'));
const db = configured ? createClient(url, key, { auth: {
  autoRefreshToken: true, persistSession: true, detectSessionInUrl: true
}}) : null;
const today = localDay();

const preview = [
  {id:'demo-1',title:'Publicar parceria Rupestre no Instagram',track:'Marketing',priority:'P0',status:'pronto',due_date:'2026-11-23',next_action:'Publicar peças aprovadas e registrar link.',definition_of_done:'Publicação e link registrados.'},
  {id:'demo-2',title:'Adaptar a parceria Rupestre para LinkedIn',track:'Marketing',priority:'P0',status:'pronto',due_date:'2026-11-23',next_action:'Reusar conteúdo factual com abertura institucional.',definition_of_done:'Publicação/link e aprovação registrados.'},
  {id:'demo-3',title:'Entregar landing page Aresta',track:'Produto',priority:'P0',status:'pronto',due_date:null,next_action:'Conferir páginas, links e revisão técnica.',definition_of_done:'Link de prévia, QA e aceite/pendências.'},
  {id:'demo-4',title:'Configurar CRM e autenticação Google',track:'Operação',priority:'P0',status:'fazendo',due_date:'2026-11-27',next_action:'Configurar Supabase, testar conta aprovada e fluxo.',definition_of_done:'Login e primeira tarefa sincronizados.'},
  {id:'demo-5',title:'Validar classificações das vias da Lapinha',track:'Dados',priority:'P1',status:'entrada',due_date:null,next_action:'Conciliar estado técnico e autorização de uso.',definition_of_done:'Divergências registradas com revisor.'}
];
const previewChannels = ['Instagram/Meta','Facebook','LinkedIn','WhatsApp','Discord','Notion','Google Drive','Google Calendar','Gmail','GitHub'].map(provider=>({
  id:provider,provider,status:'nao_conectado',notes:'Integração técnica ainda não verificada.'
}));
const state = {
  view:'hoje', track:'Todas', loading:true, busy:false,
  session:null, membership:null, items:[], contacts:[], touchpoints:[], channels:[], audit:[],
  notice:'', error:'', aiResult:'', aiLoading:false
};
const canEdit = () => !!state.membership && ['admin','editor'].includes(state.membership.role);
const ws = () => state.membership?.workspace_id;
const readonly = () => !db || !canEdit();

function safeUrl(value) {
  try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : '#'; }
  catch { return '#'; }
}
function link(value, label='Abrir fonte') {
  if (!value || safeUrl(value)==='#') return '';
  return '<a class="external" href="'+esc(safeUrl(value))+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>';
}
function badge(text, variant='soft') { return '<span class="badge '+variant+'">'+esc(text)+'</span>'; }
function option(value,label,selected) { return '<option value="'+esc(value)+'"'+(selected===value?' selected':'')+'>'+esc(label)+'</option>'; }
function notice() {
  return (state.notice ? '<div class="notice" role="status">'+esc(state.notice)+'</div>' : '') +
    (state.error ? '<div class="error" role="alert">'+esc(state.error)+'</div>' : '');
}
function renderSplash(message) {
  app.innerHTML='<div class="splash"><div class="mark">A</div><strong>ARESTA INTELLIGENCE</strong><p>'+esc(message)+'</p></div>';
}
function renderLogin() {
  app.innerHTML='<div class="auth-bg"><div class="auth-card"><div class="brand"><span class="brand-mark">A</span><span>ARESTA <em>INTELLIGENCE</em></span></div>'+
    '<span class="overline">CRM PRIVADO · SPRINT 0</span><h1>Menos abas.<br>Mais execução.</h1>'+
    '<p>Demandas, parceiros, canais e evidências do Aresta em um único fluxo. Acesso somente para membros autorizados.</p>'+
    notice()+
    '<button class="primary wide" data-action="login">Entrar com Google</button>'+
    '<p class="micro">O login autentica sua conta. O acesso aos dados exige liberação explícita no Supabase.</p>'+
    '</div></div>';
}
function renderNoAccess() {
  app.innerHTML='<div class="auth-bg"><div class="auth-card"><div class="brand"><span class="brand-mark">A</span><span>ARESTA <em>INTELLIGENCE</em></span></div>'+
    '<span class="overline">AUTENTICADO · ACESSO PENDENTE</span><h1>Solicitação de acesso</h1>'+
    '<p>Seu Google entrou com sucesso, mas este usuário ainda não está cadastrado como membro do workspace. Nenhum dado interno foi carregado.</p>'+
    '<div class="code-line"><small>Seu ID do Supabase Auth</small><code>'+esc(state.session?.user?.id)+'</code></div>'+
    '<button class="secondary" data-action="copy-uid">Copiar ID para liberar acesso</button> '+
    '<button class="ghost" data-action="logout">Sair</button>'+notice()+'</div></div>';
}
function stats() {
  const a=state.items;
  return [
    {label:'Abertas',val:a.filter(t=>!CLOSED.has(t.status)).length},
    {label:'Em execução',val:a.filter(t=>t.status==='fazendo').length},
    {label:'Aguardando',val:a.filter(t=>t.status==='aguardando').length},
    {label:'Para medir',val:a.filter(t=>t.status==='concluido').length}
  ];
}
function taskCard(t,compact=false) {
  const due = t.due_date && t.due_date < today && !CLOSED.has(t.status);
  const dueTag = t.due_date ? '<span class="due '+(due?'overdue':'')+'">'+(due?'Atraso · ':'')+esc(shortDate(t.due_date))+'</span>' : '';
  const controls = !compact ? '<div class="item-controls"><label>Estado<select data-change="task-status" data-id="'+esc(t.id)+'"'+(readonly()?' disabled':'')+'>'+
    STATUS.map(s=>option(s,STATUS_LABELS[s],t.status)).join('')+'</select></label></div>' : '';
  return '<article class="work-item"><div class="item-top"><span class="priority '+esc(t.priority)+'">'+esc(t.priority)+'</span>'+
    '<span class="track-tag">'+esc(t.track)+'</span>'+dueTag+'</div>'+
    '<h3>'+esc(t.title)+'</h3>'+
    (t.next_action?'<p class="next"><b>Próximo passo</b> '+esc(t.next_action)+'</p>':'')+
    (t.definition_of_done?'<p class="dod"><b>Concluído quando</b> '+esc(t.definition_of_done)+'</p>':'')+
    '<div class="item-bottom">'+(compact?badge(STATUS_LABELS[t.status]||t.status):controls)+
    (t.source_url?link(t.source_url,'Fonte'):'')+'</div></article>';
}
function renderToday() {
  const active = rankTasks(state.items);
  const selected = active.slice(0,4);
  return '<section class="section-head"><div><span class="overline">TRIAGEM OPERACIONAL</span><h1>Hoje, o que realmente move o Aresta?</h1>'+
    '<p>Prioridade declarada + prazo + estágio. Sugestão baseada em regras, não decisão automática.</p></div></section>'+
    '<div class="panel focus"><div class="focus-top"><span class="overline">SPRINT 0 · 23–27 NOV</span>'+badge('4–6h/dia disponíveis','outline')+'</div>'+
    '<h2>Workflow próprio sem parar as entregas.</h2><p>Publicar Rupestre, entregar a landing e ligar CRM + Google Auth. Novas integrações só após o fluxo básico funcionar.</p></div>'+
    '<div class="section-head slim"><div><h2>Fila recomendada</h2><p>Uma entrega profunda por vez, tarefas curtas em sequência.</p></div>'+
    '<button class="secondary" data-view="pipeline">Ver pipeline</button></div>'+
    '<div class="today-grid">'+(selected.length?selected.map(t=>taskCard(t,true)).join(''):'<div class="empty">Nenhuma demanda aberta.</div>')+'</div>'+
    '<div class="panel"><span class="overline">DEFINIÇÃO DE CONCLUÍDO DA SEMANA</span>'+
    '<div class="milestones"><div><strong>01 · Comunicação</strong><small>Posts Rupestre publicados e links registrados</small></div>'+
    '<div><strong>02 · Produto</strong><small>Landing revisada, testada e entregue</small></div>'+
    '<div><strong>03 · Sistema</strong><small>Login Google e uma tarefa sincronizada em dois dispositivos</small></div></div></div>';
}
function renderPipeline() {
  const filtered=state.track==='Todas'?state.items:state.items.filter(t=>t.track===state.track);
  return '<section class="section-head"><div><span class="overline">ENTRADA → EXECUÇÃO → EVIDÊNCIA</span><h1>Pipeline de trabalho</h1>'+
    '<p>Uma demanda tem próximo passo, responsável, prazo e critério de concluído.</p></div>'+
    '<div class="actions"><select id="track-filter">'+option('Todas','Todas as frentes',state.track)+TRACKS.map(s=>option(s,s,state.track)).join('')+'</select></div></section>'+
    '<div class="board">'+STATUS.map(s=>'<section class="lane"><header><h2>'+esc(STATUS_LABELS[s])+'</h2><span>'+filtered.filter(t=>t.status===s).length+'</span></header>'+
    '<div class="lane-body">'+(filtered.filter(t=>t.status===s).map(t=>taskCard(t)).join('') || '<p class="empty-small">Sem itens</p>')+'</div></section>').join('')+'</div>'+
    (readonly()?'': '<div class="panel form-panel"><h2>Adicionar demanda</h2><form id="task-form" class="form-grid">'+
      '<label class="span-2">Título<input required maxlength="200" name="title" placeholder="Uma entrega verificável"/></label>'+
      '<label>Frente<select name="track">'+TRACKS.map(s=>option(s,s,'Operação')).join('')+'</select></label>'+
      '<label>Prioridade<select name="priority">'+PRIORITY.map(s=>option(s,s,'P2')).join('')+'</select></label>'+
      '<label>Prazo<input type="date" name="due_date"/></label>'+
      '<label>Estado<select name="status">'+STATUS.map(s=>option(s,STATUS_LABELS[s],'entrada')).join('')+'</select></label>'+
      '<label class="span-2">Próxima ação<input name="next_action" maxlength="500" placeholder="Qual o primeiro movimento?"/></label>'+
      '<label class="span-2">Definição de concluído<input name="definition_of_done" maxlength="500" placeholder="Qual evidência encerra a tarefa?"/></label>'+
      '<button class="primary" type="submit"'+(state.busy?' disabled':'')+'>Salvar tarefa</button></form></div>');
}
function renderContacts() {
  return '<section class="section-head"><div><span class="overline">RELACIONAMENTO COM HISTÓRICO</span><h1>Parceiros e comunidade</h1>'+
    '<p>Cadastro privado, estágio do relacionamento e próxima conversa. Sem importação automática de contatos.</p></div></section>'+
    '<div class="panel"><div class="panel-title"><h2>Relacionamentos</h2>'+badge(String(state.contacts.length)+' registros','outline')+'</div>'+
    (state.contacts.length?'<div class="table-wrap"><table><thead><tr><th>Pessoa</th><th>Organização</th><th>Tipo</th><th>Etapa</th><th>Próximo contato</th></tr></thead><tbody>'+
      state.contacts.map(c=>'<tr><td><strong>'+esc(c.name)+'</strong>'+(c.role_label?'<small>'+esc(c.role_label)+'</small>':'')+'</td>'+
      '<td>'+esc(c.organization||'—')+'</td><td>'+esc(c.contact_type)+'</td><td>'+badge(c.stage,'outline')+'</td><td>'+esc(shortDate(c.next_follow_up))+'</td></tr>').join('')+'</tbody></table></div>'
      :'<div class="empty">Ainda não há contatos. O CRM não importa dados pessoais sem permissão.</div>')+'</div>'+
    (readonly()?'':'<div class="two-cols"><div class="panel form-panel"><h2>Novo relacionamento</h2><form id="contact-form" class="form-grid">'+
      '<label class="span-2">Nome<input required maxlength="200" name="name" placeholder="Nome da pessoa ou contato responsável"/></label>'+
      '<label>Organização<input name="organization" maxlength="200"/></label>'+
      '<label>Tipo<select name="contact_type">'+['Parceiro','Comunidade','Instituição','Mantenedor','Cliente','Outro'].map(x=>option(x,x,'Parceiro')).join('')+'</select></label>'+
      '<label>Etapa<select name="stage">'+['mapeado','contatado','conversa','proposta','ativo','pausado'].map(x=>option(x,x,'mapeado')).join('')+'</select></label>'+
      '<label>Retomar em<input name="next_follow_up" type="date"/></label>'+
      '<label class="span-2">Contexto<textarea name="notes" rows="2" maxlength="3000"></textarea></label>'+
      '<button type="submit" class="primary">Cadastrar</button></form></div>'+
      '<div class="panel form-panel"><h2>Registrar interação</h2><form id="touchpoint-form" class="form-grid">'+
      '<label class="span-2">Contato<select name="contact_id" required><option value="">Selecionar</option>'+
      state.contacts.map(c=>option(c.id,c.name,null)).join('')+'</select></label>'+
      '<label class="span-2">Canal<select name="channel">'+CHANNELS.map(c=>option(c,c,'WhatsApp')).join('')+'</select></label>'+
      '<label class="span-2">Resumo<textarea name="summary" required rows="4" maxlength="3000" placeholder="O que foi conversado e qual próximo compromisso?"></textarea></label>'+
      '<button type="submit" class="primary"'+(state.contacts.length?'':' disabled')+'>Registrar conversa</button></form></div></div>')+
    '<div class="panel"><h2>Interações recentes</h2>'+
    (state.touchpoints.length?state.touchpoints.map(t=>{const c=state.contacts.find(c=>c.id===t.contact_id);return '<div class="timeline-entry"><strong>'+esc(c?.name||'Contato')+'</strong> · '+esc(t.channel)+' <small>'+esc(new Date(t.happened_at).toLocaleDateString('pt-BR'))+'</small><p>'+esc(t.summary)+'</p></div>';}).join('')
      :'<p class="empty-small">Sem interações registradas.</p>')+'</div>';
}
function renderChannels() {
  return '<section class="section-head"><div><span class="overline">INTEGRAÇÕES COM PERMISSÃO</span><h1>Canais e fontes</h1>'+
    '<p>Um painel único não significa acesso automático. Cada integração precisa de permissão e teste.</p></div></section>'+
    '<div class="channel-grid">'+state.channels.map(c=>'<article class="panel channel"><div class="channel-top"><span class="channel-dot"></span>'+
      '<h2>'+esc(c.provider)+'</h2></div>'+badge(c.status==='verificado'?'Verificado':'Não conectado',c.status==='verificado'?'success':'outline')+
      '<p>'+esc(c.notes||'Aguardando validação da API.')+'</p><small>Última verificação: '+esc(c.last_verified_at?new Date(c.last_verified_at).toLocaleString('pt-BR'):'não realizada')+'</small></article>').join('')+'</div>'+
    '<div class="panel"><h2>Política de integração</h2><p>Instagram/Facebook, WhatsApp Business e LinkedIn exigem aprovação de acesso e API oficial aplicável. Publicações são rascunhos até aprovação humana. Drive, Gmail, Calendar e Notion requerem permissões próprias; o login Google não libera seus arquivos.</p></div>';
}
function renderAI() {
  const top=rankTasks(state.items).slice(0,3);
  return '<section class="section-head"><div><span class="overline">EVIDÊNCIA → HIPÓTESE → AÇÃO</span><h1>Assistente de priorização</h1>'+
    '<p>A triagem por regras funciona sem chave de IA. A análise por modelo exige Edge Function autorizada.</p></div></section>'+
    '<div class="two-cols"><div class="panel"><h2>Regras de triagem</h2><p>A prioridade declarada vem antes de ideias novas; prazos próximos elevam a urgência. Concluídos ficam fora da fila.</p>'+
    top.map((t,i)=>'<div class="recommend"><span>0'+(i+1)+'</span><div><strong>'+esc(t.title)+'</strong><small>'+esc(t.next_action||'Definir próxima ação')+'</small></div></div>').join('')+
    '<div class="actions-block"><button class="secondary" data-action="copy-prompt">Copiar contexto para IA</button>'+
    '<button class="primary" data-action="run-ai"'+(!db||!ws()||state.aiLoading?' disabled':'')+'>'+ (state.aiLoading?'Analisando...':'Analisar com IA')+'</button></div>'+
    '<p class="micro">Ao clicar em “Analisar com IA”, até 10 tarefas (sem contatos) serão enviadas para a função protegida do projeto, se ela estiver configurada.</p></div>'+
    '<div class="panel"><h2>Resultado e limites</h2>'+(state.aiResult?'<pre class="ai-result">'+esc(state.aiResult)+'</pre>':'<div class="empty">Nenhuma análise generativa executada. A triagem automática do lado esquerdo não é uma resposta de modelo.</div>')+
    '<h3>O que precisa ser medido</h3><p>Links publicados, landing entregue, tempo efetivamente gasto, tarefas que retornaram do estado de revisão e ações recebidas da comunidade.</p></div></div>'+
    '<div class="panel"><h2>Histórico verificável</h2>'+
    (state.audit.length?state.audit.slice(0,12).map(a=>'<div class="timeline-entry"><strong>'+esc(a.action)+' · '+esc(a.entity_name)+'</strong><small>'+esc(new Date(a.created_at).toLocaleString('pt-BR'))+'</small></div>').join('')
      :'<p class="empty-small">Nenhum evento auditado nesta visualização.</p>')+'</div>';
}
function renderAccess() {
  return '<section class="section-head"><div><span class="overline">SEGURANÇA E IMPLANTAÇÃO</span><h1>Configuração</h1></div></section>'+
    '<div class="panel"><h2>Estado</h2><p>Ambiente: <b>'+(db?'Supabase configurado':'Prévia sem backend')+'</b></p>'+
    '<p>Permissão: <b>'+esc(state.membership?.role||'somente demonstração')+'</b></p>'+
    (state.session?'<div class="code-line"><small>Identificador do usuário autenticado</small><code>'+esc(state.session.user.id)+'</code></div>':'')+
    '<p>Dados privados armazenados apenas no Supabase, sob RLS. Chaves privilegiadas nunca entram no frontend ou no GitHub.</p>'+
    '<div class="actions-block"><button class="secondary" data-action="refresh"'+(!db?' disabled':'')+'>Atualizar dados</button>'+
    (db?'<button class="ghost" data-action="logout">Encerrar sessão</button>':'')+'</div></div>'+
    '<div class="panel"><h2>Antes de abrir para a equipe</h2><p>Aplicar a migração SQL, ativar Google OAuth, definir URLs permitidas e conceder acesso individual no banco. Testar acesso negado a usuário externo antes da primeira publicação de dados reais.</p></div>';
}
function render() {
  if (state.loading) return renderSplash('Carregando o workspace...');
  if (db && !state.session) return renderLogin();
  if (db && !state.membership) return renderNoAccess();
  const nav=[['hoje','Visão de hoje'],['pipeline','Pipeline'],['pessoas','Relacionamentos'],['canais','Canais'],['ia','IA & Evidências'],['acesso','Configuração']];
  const body={hoje:renderToday,pipeline:renderPipeline,pessoas:renderContacts,canais:renderChannels,ia:renderAI,acesso:renderAccess}[state.view]();
  const indicators=stats().map(x=>'<div class="kpi"><strong>'+x.val+'</strong><span>'+esc(x.label)+'</span></div>').join('');
  app.innerHTML='<div class="shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">A</span><span>ARESTA <em>INTELLIGENCE</em></span></div>'+
    '<div class="sidebar-label">CENTRO DE OPERAÇÕES</div><nav>'+nav.map(([id,label])=>'<button data-view="'+id+'" class="'+(state.view===id?'active':'')+'">'+esc(label)+'</button>').join('')+'</nav>'+
    '<div class="side-bottom"><span class="online-dot"></span>'+(db?'Supabase · acesso autenticado':'Modo demonstração')+
    '<p>'+(db?'Aresta · '+esc(state.membership?.role):'Dados ilustrativos. Nenhum registro será salvo.')+'</p></div></aside>'+
    '<main class="main"><header class="topbar"><div><span class="overline">ARESTA CLIMB / INTELLIGENCE</span><p>Domingo 22/11 → Sprint 0 · 23–27/11</p></div>'+
    '<div class="top-right">'+badge(db?'Workspace autorizado':'Prévia sem conexão',db?'success':'outline')+
    (db?'<button class="ghost" data-action="logout">Sair</button>':'')+'</div></header>'+
    (!db?'<div class="demo-banner"><strong>Prévia técnica:</strong> conecte o Supabase e habilite login Google para trabalhar com dados persistentes. Botões de escrita desabilitados.</div>':'')+
    notice()+'<div class="statbar">'+indicators+'</div><div class="page">'+body+'</div></main></div>';
}
async function loadData() {
  if (!db || !ws()) return;
  const id=ws();
  const queries=await Promise.all([
    db.from('crm_work_items').select('*').eq('workspace_id',id).order('created_at',{ascending:false}).limit(300),
    db.from('crm_contacts').select('*').eq('workspace_id',id).order('created_at',{ascending:false}).limit(300),
    db.from('crm_touchpoints').select('*').eq('workspace_id',id).order('happened_at',{ascending:false}).limit(100),
    db.from('crm_channels').select('*').eq('workspace_id',id).order('provider',{ascending:true}),
    db.from('crm_audit_events').select('*').eq('workspace_id',id).order('created_at',{ascending:false}).limit(30)
  ]);
  const issue=queries.find(q=>q.error)?.error;
  if (issue) throw issue;
  [state.items,state.contacts,state.touchpoints,state.channels,state.audit]=queries.map(q=>q.data||[]);
}
async function hydrate(session) {
  state.loading=true; state.error=''; state.session=session;
  state.membership=null; render();
  if (!session) {state.loading=false;render();return;}
  const res=await db.from('crm_memberships').select('workspace_id,role').eq('user_id',session.user.id).limit(1);
  if(res.error) {state.error='Falha ao consultar permissão: '+res.error.message; state.loading=false;render();return;}
  if(res.data?.length) state.membership=res.data[0];
  if(state.membership) {
    try {await loadData();} catch(error){state.error='Falha ao carregar o CRM: '+error.message;}
  }
  state.loading=false;render();
}
function defaultPreview() {
  state.items=preview;state.contacts=[];state.channels=previewChannels;state.loading=false;render();
}
async function writeRow(table, payload) {
  if (readonly()) throw new Error('Apenas membros editores podem registrar alterações.');
  const {error}=await db.from(table).insert({...payload,workspace_id:ws()});
  if(error) throw error;
  await loadData();
}
async function changeStatus(id,status) {
  if (readonly()) return;
  state.error='';state.notice='';
  if(!STATUS.includes(status)) return;
  const {error}=await db.from('crm_work_items').update({status}).eq('id',id).eq('workspace_id',ws());
  if(error) {state.error=error.message;render();return;}
  await loadData();state.notice='Estado atualizado e registrado no histórico.';render();
}
document.addEventListener('click',async event=>{
  const btn=event.target.closest('[data-action],[data-view]');
  if(!btn) return;
  if(btn.dataset.view){state.view=btn.dataset.view;state.notice='';state.error='';render();return;}
  state.error='';state.notice='';
  const action=btn.dataset.action;
  try {
    if(action==='login'){
      const {error}=await db.auth.signInWithOAuth({provider:'google',options:{
        redirectTo:window.location.origin+window.location.pathname
      }});
      if(error)throw error;
    } else if(action==='logout') {await db.auth.signOut();await hydrate(null);}
    else if(action==='refresh') {await loadData();state.notice='Dados atualizados.';render();}
    else if(action==='copy-uid') {await navigator.clipboard.writeText(state.session?.user?.id||'');state.notice='ID copiado.';render();}
    else if(action==='copy-prompt') {await navigator.clipboard.writeText(buildAIPrompt(state.items));state.notice='Contexto copiado. Revise os dados antes de enviá-los à IA.';render();}
    else if(action==='run-ai') {
      if(!db||!ws())return;
      state.aiLoading=true;render();
      const items=rankTasks(state.items).slice(0,10).map(t=>({
        title:t.title,priority:t.priority,status:t.status,track:t.track,
        due_date:t.due_date,next_action:t.next_action,definition_of_done:t.definition_of_done
      }));
      const {data,error}=await db.functions.invoke('ai-triage',{body:{workspace_id:ws(),items}});
      if(error)throw new Error('Função de IA não disponível: '+error.message);
      state.aiResult=String(data?.recommendation||'Nenhuma recomendação retornada.');
      state.aiLoading=false;render();
    }
  } catch(error){state.error=error.message||String(error);state.aiLoading=false;render();}
});
document.addEventListener('change',async event=>{
  const el=event.target;
  if(el.id==='track-filter'){state.track=el.value;render();return;}
  if(el.dataset.change==='task-status') {
    try{await changeStatus(el.dataset.id,el.value);}
    catch(error){state.error=error.message;render();}
  }
});
document.addEventListener('submit',async event=>{
  const form=event.target;
  if(!['task-form','contact-form','touchpoint-form'].includes(form.id))return;
  event.preventDefault();if(state.busy)return;
  state.busy=true;state.notice='';state.error='';
  const fd=new FormData(form);
  try{
    if(form.id==='task-form'){
      await writeRow('crm_work_items',{
        title:String(fd.get('title')||'').trim(), track:String(fd.get('track')),
        priority:String(fd.get('priority')),status:String(fd.get('status')),
        due_date:String(fd.get('due_date')||'')||null,
        next_action:String(fd.get('next_action')||'').trim(),
        definition_of_done:String(fd.get('definition_of_done')||'').trim(),
        created_by:state.session.user.id
      });
      state.notice='Demanda salva no Supabase.';
    }else if(form.id==='contact-form'){
      await writeRow('crm_contacts',{
        name:String(fd.get('name')||'').trim(),
        organization:String(fd.get('organization')||'').trim(),
        contact_type:String(fd.get('contact_type')),
        stage:String(fd.get('stage')),
        next_follow_up:String(fd.get('next_follow_up')||'')||null,
        notes:String(fd.get('notes')||'').trim()
      }); state.notice='Contato salvo no workspace privado.';
    }else{
      await writeRow('crm_touchpoints',{
        contact_id:String(fd.get('contact_id')),
        channel:String(fd.get('channel')),summary:String(fd.get('summary')||'').trim(),
        created_by:state.session.user.id
      });state.notice='Interação registrada.';
    }
  }catch(error){state.error=error.message||String(error);}
  finally{state.busy=false;render();}
});
async function init(){
  if(!db){defaultPreview();return;}
  db.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>hydrate(session),0);});
  try{
    const {data,error}=await db.auth.getSession();
    if(error)throw error;
    await hydrate(data.session);
  }catch(error){state.error='Não foi possível autenticar: '+error.message;state.loading=false;render();}
}
renderSplash('Preparando interface...');
init();
