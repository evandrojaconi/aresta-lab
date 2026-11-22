import { createClient } from '@supabase/supabase-js';
import {
  STATUS, STATUS_LABELS, PRIORITY, TRACKS, CHANNELS, CLOSED,
  escapeHTML as esc, localDay, shortDate, rankTasks, buildAIPrompt
} from './rules.js';
import './styles.css';
import {renderMarketing, renderProduct, renderInsights, renderOpportunities, installWorkflowHandlers} from './workflows.js';

const app = document.getElementById('app');
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = Boolean(url && /^https:\/\//.test(url) && key && !String(key).includes('SUBSTITUIR'));
const db = configured ? createClient(url, key, { auth: {
  autoRefreshToken: true, persistSession: true, detectSessionInUrl: true
}}) : null;
const today = () => localDay();

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
  session:null, membership:null, memberships:[], workspaceNames:{}, knowledge:[], extensions:[], knowledgeKind:'all', items:[], contacts:[], touchpoints:[], channels:[], audit:[],
  contents:[], proposals:[], opportunities:[], metricSources:[], metricSnapshots:[], marketingFilter:'Todos',
  selectedMetricSource:'', sourceLoading:false, analyticsNotice:'', showLooker:false,
  notice:'', error:'', aiResult:'', aiLoading:false, aiMode:''
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
    '<form id="email-login-form" class="email-login"><label for="email-login">Seu e-mail</label><input id="email-login" name="email" type="email" placeholder="voce@exemplo.com" autocomplete="email" required />'+
    '<button class="primary wide" type="submit">Receber link de acesso</button></form>'+
    '<p class="micro">Sem aplicativo Google, sem senha. Abra o link enviado para seu e-mail. Só pessoas liberadas têm acesso aos dados.</p>'+
    '</div></div>';
}
function renderNoAccess() {
  app.innerHTML='<div class="auth-bg"><div class="auth-card"><div class="brand"><span class="brand-mark">A</span><span>ARESTA <em>INTELLIGENCE</em></span></div>'+
    '<span class="overline">AUTENTICADO · ACESSO PENDENTE</span><h1>Solicitação de acesso</h1>'+
    '<p>Seu e-mail foi autenticado, mas você ainda não recebeu acesso ao workspace. Nenhum dado interno foi carregado.</p>'+
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
  const due = t.due_date && t.due_date < today() && !CLOSED.has(t.status);
  const dueTag = t.due_date ? '<span class="due '+(due?'overdue':'')+'">'+(due?'Atraso · ':'')+esc(shortDate(t.due_date))+'</span>' : '';
  const controls = !compact ? '<div class="item-controls"><label>Estado<select data-change="task-status" data-id="'+esc(t.id)+'"'+(readonly()?' disabled':'')+'>'+
    STATUS.map(s=>option(s,STATUS_LABELS[s],t.status)).join('')+'</select></label></div>' : '';
  return '<article class="work-item"><div class="item-top"><span class="priority '+esc(t.priority)+'">'+esc(t.priority)+'</span>'+
    '<span class="track-tag">'+esc(t.track)+'</span>'+dueTag+'</div>'+
    '<h3>'+esc(t.title)+'</h3>'+
    (t.next_action?'<p class="next"><b>Próximo passo</b> '+esc(t.next_action)+'</p>':'')+
    (t.definition_of_done?'<p class="dod"><b>Concluído quando</b> '+esc(t.definition_of_done)+'</p>':'')+
    (t.result_evidence?'<p class="evidence"><b>Evidência registrada</b> '+esc(t.result_evidence)+'</p>':'')+
    '<div class="item-bottom">'+(compact?badge(STATUS_LABELS[t.status]||t.status):controls)+
    (t.source_url?link(t.source_url,'Fonte'):'')+(compact||readonly()?'':'<button class="text-btn" data-action="evidence" data-id="'+esc(t.id)+'">Registrar evidência</button>')+'</div></article>';
}
function renderToday() {
  const active = rankTasks(state.items);
  const selected = active.slice(0,4);
  return '<section class="section-head"><div><span class="overline">TRIAGEM OPERACIONAL</span><h1>Hoje, o que realmente move o Aresta?</h1>'+
    '<p>Prioridade declarada + prazo + estágio. Sugestão baseada em regras, não decisão automática.</p></div></section>'+
    '<div class="panel focus"><div class="focus-top"><span class="overline">SPRINT 0 · 23–27 NOV</span>'+badge('4–6h/dia disponíveis','outline')+'</div>'+
    '<h2>Workflow próprio sem parar as entregas.</h2><p>Publicar Rupestre, entregar a landing e executar o CRM com login autorizado. Novas integrações só após o fluxo básico funcionar.</p></div>'+
    '<div class="section-head slim"><div><h2>Fila recomendada</h2><p>Uma entrega profunda por vez, tarefas curtas em sequência.</p></div>'+
    '<button class="secondary" data-view="pipeline">Ver pipeline</button></div>'+
    '<div class="today-grid">'+(selected.length?selected.map(t=>taskCard(t,true)).join(''):'<div class="empty">Nenhuma demanda aberta.</div>')+'</div>'+
    '<div class="panel"><h2>Comandos rápidos</h2><div class="actions-block"><button class="primary" data-view="marketing">Criar conteúdo</button><button class="secondary" data-view="produto">Registrar melhoria UX</button><button class="secondary" data-view="dados">Consultar métricas</button><button class="secondary" data-view="oportunidades">Mapear oportunidade</button></div><p class="micro">Tudo começa pelo CRM e mantém histórico no Supabase. Ações externas exigem autorização própria.</p></div>'+
    '<div class="panel"><span class="overline">DEFINIÇÃO DE CONCLUÍDO DA SEMANA</span>'+
    '<div class="milestones"><div><strong>01 · Comunicação</strong><small>Posts Rupestre publicados e links registrados</small></div>'+
    '<div><strong>02 · Produto</strong><small>Landing revisada, testada e entregue</small></div>'+
    '<div><strong>03 · Sistema</strong><small>Login privado por e-mail e uma tarefa sincronizada em dois dispositivos</small></div></div></div>';
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
      '<td>'+esc(c.organization||'—')+'</td><td>'+esc(c.contact_type)+'</td><td><select data-change="contact-stage" data-id="'+esc(c.id)+'"'+(readonly()?' disabled':'')+'>'+['mapeado','contatado','conversa','proposta','ativo','pausado'].map(x=>option(x,x,c.stage)).join('')+'</select></td><td>'+esc(shortDate(c.next_follow_up))+'</td></tr>').join('')+'</tbody></table></div>'
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

const KNOWLEDGE_TYPES = [
  ['all','Tudo'],['task','Ações'],['project','Projetos'],['editorial','Editorial'],
  ['territory','Territórios'],['evidence','Inteligência'],['partner','Parcerias']
];
function renderKnowledge() {
  const list=state.knowledgeKind==='all'?state.knowledge:
    state.knowledge.filter(r=>r.record_kind===state.knowledgeKind);
  const grouped=KNOWLEDGE_TYPES.slice(1).map(([id,label])=>({
    id,label,count:state.knowledge.filter(r=>r.record_kind===id).length
  }));
  const cards=list.map(r=>'<article class="knowledge-card"><div class="item-top">'+
    badge((KNOWLEDGE_TYPES.find(t=>t[0]===r.record_kind)||[])[1]||r.record_kind,'outline')+
    '<span class="track-tag">'+esc(r.area||'Aresta')+'</span>'+
    (r.source_status?badge(r.source_status):'')+'</div>'+
    '<h3>'+esc(r.title)+'</h3>'+
    (r.summary?'<p>'+esc(r.summary)+'</p>':'')+
    '<div class="knowledge-meta"><span>'+esc(r.source_collection)+' · origem: '+esc(r.source_system)+'</span>'+
    link(r.source_url,'Abrir original')+'</div></article>').join('');
  return '<section class="section-head"><div><span class="overline">ACERVO CENTRALIZADO · FONTE IDENTIFICADA</span>'+
    '<h1>Conhecimento do Aresta</h1><p>Tarefas, projetos, editorial, territórios e parceiros migrados com rastreabilidade. O Notion permanece como histórico; esta é a visualização do CRM.</p></div>'+
    '<div class="actions"><select id="knowledge-filter" aria-label="Filtrar por segmento">'+
    KNOWLEDGE_TYPES.map(([id,label])=>option(id,label,state.knowledgeKind)).join('')+'</select></div></section>'+
    '<div class="knowledge-summary">'+grouped.map(c=>'<div><b>'+c.count+'</b><span>'+esc(c.label)+'</span></div>').join('')+'</div>'+
    '<div class="knowledge-grid">'+(cards||'<div class="empty">Nenhum registro importado neste workspace.</div>')+'</div>'+
    '<div class="panel"><p class="micro">Registros importados são snapshots com link e data de sincronização. O sistema não altera dados no Notion. Cópias não provam estado de implementação de funcionalidades.</p></div>';
}
function renderExtensions() {
  const cards=state.extensions.map(e=>'<article class="panel extension-card">'+
    '<div class="item-top">'+badge(e.category,'outline')+
      badge(e.status==='connected'?'Conectado':e.status==='needs_auth'?'Autorização necessária':
        e.status==='planned'?'Planejado':'Catalogado',e.status==='connected'?'success':'outline')+'</div>'+
    '<h2>'+esc(e.display_name)+'</h2><p>'+esc(e.description)+'</p>'+
    (e.source_url?link(e.source_url,'Documentação'):'')+
    '<p class="micro">Último teste: '+esc(e.last_verified_at?new Date(e.last_verified_at).toLocaleString('pt-BR'):'nenhum')+'</p></article>').join('');
  return '<section class="section-head"><div><span class="overline">PLATAFORMA MODULAR</span><h1>Integrações e plugins</h1>'+
    '<p>O sistema já conhece os serviços e as capacidades do Editor. Cada extensão precisa de autenticação própria e teste real para ser considerada conectada.</p></div></section>'+
    '<div class="channel-grid">'+(cards||'<div class="empty">Extensões ainda não configuradas.</div>')+'</div>'+
    '<div class="panel"><h2>Modelo replicável por organização</h2><p>Workspace e permissões isoladas por equipe. Plugins declaram capacidades, escopos e origem. A ponte com o Editor usa APIs/contratos existentes, sem conceder ao CRM acesso direto ao banco público de croquis nem aos tokens do GitHub.</p></div>';
}

function renderAI() {
  const top=rankTasks(state.items).slice(0,4);
  const tasks=top.map((t,i)=>'<article class="recommend"><span>0'+(i+1)+'</span><div><strong>'+esc(t.title)+'</strong>'+
      '<small>Por quê: '+(t.priority==='P0'?'entrega crítica declarada':'benefício e dependências a confirmar')+
      ' · Próximo passo: '+esc(t.next_action||'definir primeira ação')+'</small></div></article>').join('');
  return '<section class="section-head"><div><span class="overline">DECISÃO → AÇÃO → EVIDÊNCIA</span>'+
    '<h1>Assistente & execução</h1><p>Ajuda a transformar o trabalho em próximas ações. Sem credencial de modelo, a triagem usa regras; o contexto pode ser levado ao ChatGPT.</p></div></section>'+
    '<div class="two-cols"><div class="panel"><h2>Prioridades desta organização</h2>'+
      (tasks||'<p>Nenhuma tarefa aberta no momento.</p>')+
      '<div class="actions-block"><button class="primary" data-action="run-ai"'+(state.aiLoading?' disabled':'')+'>'+
       (state.aiLoading?'Analisando…':'Gerar plano de execução')+'</button>'+
      '<button class="secondary" data-action="copy-prompt">Copiar briefing para ChatGPT</button>'+
      '<button class="secondary" data-action="open-chatgpt">Abrir ChatGPT</button></div>'+
      '<p class="micro">IA generativa exige OPENAI_API_KEY configurada no Supabase. Sem ela, o plano usa regras explícitas e não inventa execução.</p></div>'+
      '<div class="panel"><h2>Seu plano</h2>'+
      (state.aiResult?'<div class="assistant-result">'+(state.aiMode==='model'?
       '<span class="badge success">Modelo de IA</span>':'<span class="badge outline">Triagem operacional, sem modelo</span>')+
       '<pre class="ai-result">'+esc(state.aiResult)+'</pre></div>':
       '<div class="empty">Clique em “Gerar plano de execução” ou copie o briefing para continuar no ChatGPT.</div>')+
      '<p class="micro">O assistente não publica posts, acessa dados privados externos ou altera código automaticamente.</p></div></div>'+
      '<div class="panel"><h2>Decisões e evidências</h2>'+
       (state.audit.length?state.audit.slice(0,10).map(a=>'<div class="timeline-entry"><strong>'+esc(a.action)+' · '+esc(a.entity_name)+'</strong><small>'+esc(new Date(a.created_at).toLocaleString('pt-BR'))+'</small></div>').join(''):
       '<p>Sem eventos auditados nesta visualização.</p>')+'</div>';
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
  const nav=[['hoje','Visão de hoje'],['pipeline','Pipeline'],['marketing','Marketing'],['produto','Produto & UX'],['dados','Dados & Relatórios'],['oportunidades','Oportunidades'],['acervo','Conhecimento'],['extensoes','Extensões'],['pessoas','Relacionamentos'],['canais','Canais'],['ia','IA & Evidências'],['acesso','Configuração']];
  const body={hoje:renderToday,pipeline:renderPipeline,acervo:renderKnowledge,extensoes:renderExtensions,pessoas:renderContacts,canais:renderChannels,ia:renderAI,acesso:renderAccess,
    marketing:()=>renderMarketing({state,esc,readonly}),produto:()=>renderProduct({state,esc,readonly}),
    dados:()=>renderInsights({state,esc,readonly}),
    oportunidades:()=>renderOpportunities({state,esc,readonly})}[state.view]();
  const indicators=[...stats(),{label:'Acervo',val:state.knowledge.length}].map(x=>'<div class="kpi"><strong>'+x.val+'</strong><span>'+esc(x.label)+'</span></div>').join('');
  app.innerHTML='<div class="shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">A</span><span>ARESTA <em>INTELLIGENCE</em></span></div>'+
    '<div class="sidebar-label">CENTRO DE OPERAÇÕES</div><nav>'+nav.map(([id,label])=>'<button data-view="'+id+'" class="'+(state.view===id?'active':'')+'">'+esc(label)+'</button>').join('')+'</nav>'+
    '<div class="side-bottom"><span class="online-dot"></span>'+(db?'Supabase · acesso autenticado':'Modo demonstração')+
    '<p>'+(db?'Aresta · '+esc(state.membership?.role):'Dados ilustrativos. Nenhum registro será salvo.')+'</p></div></aside>'+
    '<main class="main"><header class="topbar"><div><span class="overline">ARESTA CLIMB / INTELLIGENCE</span><p>'+esc(new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'}))+' · Sprint 0 · 23–27/11</p></div>'+
    '<div class="top-right">'+(state.memberships.length>1?'<select aria-label="Organização" id="workspace-select">'+state.memberships.map(m=>option(m.workspace_id,state.workspaceNames[m.workspace_id]||m.workspace_id,m.workspace_id===ws()?m.workspace_id:null)).join('')+'</select>':'')+badge(db?'Workspace autorizado':'Prévia sem conexão',db?'success':'outline')+
    (db?'<button class="ghost" data-action="logout">Sair</button>':'')+'</div></header>'+
    (!db?'<div class="demo-banner"><strong>Prévia técnica:</strong> conecte o Supabase para trabalhar com dados persistentes. Botões de escrita desabilitados.</div>':'')+
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
    db.from('crm_audit_events').select('*').eq('workspace_id',id).order('created_at',{ascending:false}).limit(30),
    db.from('crm_knowledge_records').select('*').eq('workspace_id',id).order('last_synced_at',{ascending:false}).limit(500),
    db.from('crm_extensions').select('*').eq('workspace_id',id).order('display_name',{ascending:true}),
    db.from('crm_content_items').select('*').eq('workspace_id',id).order('updated_at',{ascending:false}).limit(300),
    db.from('crm_product_proposals').select('*').eq('workspace_id',id).order('updated_at',{ascending:false}).limit(300),
    db.from('crm_metric_sources').select('*').eq('workspace_id',id).order('provider',{ascending:true}),
    db.from('crm_metric_snapshots').select('*').eq('workspace_id',id).order('observed_at',{ascending:false}).limit(250),
    db.from('crm_opportunities').select('*').eq('workspace_id',id).order('created_at',{ascending:false}).limit(250)
  ]);
  const issue=queries.find(q=>q.error)?.error;
  if (issue) throw issue;
  [state.items,state.contacts,state.touchpoints,state.channels,state.audit,state.knowledge,state.extensions,
    state.contents,state.proposals,state.metricSources,state.metricSnapshots,state.opportunities]=queries.map(q=>q.data||[]);
}
async function hydrate(session) {
  state.loading=true; state.error=''; state.session=session;
  state.membership=null; state.memberships=[]; render();
  if (!session) {state.loading=false;render();return;}
  const res=await db.from('crm_memberships').select('workspace_id,role').eq('user_id',session.user.id).limit(30);
  if(res.error) {state.error='Falha ao consultar permissão: '+res.error.message; state.loading=false;render();return;}
  state.memberships=res.data||[];
  // O proprietário, com e-mail confirmado e previamente autorizado no
  // banco privado, recebe seus workspaces na primeira entrada. Outros usuários
  // permanecem sem acesso. O cliente não contém e-mails ou credenciais.
  if (!state.memberships.length) {
    const claim=await db.rpc('crm_claim_owner_access');
    if (claim.error) { state.error='Acesso ainda não autorizado: '+claim.error.message; }
    if (!claim.error && Number(claim.data)>0) {
      const refreshed=await db.from('crm_memberships')
        .select('workspace_id,role').eq('user_id',session.user.id).limit(30);
      if(!refreshed.error) state.memberships=refreshed.data||[];
    }
  }
  if(state.memberships.length) {
    const chosen=window.sessionStorage.getItem('aresta_intelligence_workspace');
    state.membership=state.memberships.find(m=>m.workspace_id===chosen)||state.memberships[0];
    const names=await db.from('crm_workspaces').select('id,name').in('id',state.memberships.map(m=>m.workspace_id));
    if(!names.error)state.workspaceNames=Object.fromEntries((names.data||[]).map(w=>[w.id,w.name]));
  }
  if(state.membership) {
    try {await loadData();} catch(error){state.error='Falha ao carregar o CRM: '+error.message;}
  }
  state.loading=false;render();
}
function defaultPreview() {
  state.items=preview;state.contacts=[];state.channels=previewChannels;state.knowledge=[];state.extensions=[];state.loading=false;render();
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
  const current=state.items.find(t=>t.id===id);
  if(status==='medido' && !(current?.result_evidence||'').trim()) {state.error='Registre evidência verificável antes de marcar como Medido.';render();return;}
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
    if(action==='logout') {await db.auth.signOut();await hydrate(null);}
    else if(action==='refresh') {await loadData();state.notice='Dados atualizados.';render();}
    else if(action==='copy-uid') {await navigator.clipboard.writeText(state.session?.user?.id||'');state.notice='ID copiado.';render();}
    else if(action==='copy-prompt') {await navigator.clipboard.writeText(buildAIPrompt(state.items));state.notice='Briefing copiado. Abra o ChatGPT e cole para aprofundar a análise.';render();}
    else if(action==='open-chatgpt') {await navigator.clipboard.writeText(buildAIPrompt(state.items));window.open('https://chatgpt.com/','_blank','noopener,noreferrer');state.notice='Briefing copiado; cole na conversa do ChatGPT aberta.';render();}
    else if(action==='evidence') {
      const item=state.items.find(x=>x.id===btn.dataset.id);if(!item||readonly())return;
      const result=window.prompt('Registre o link ou descrição da evidência real (não uma previsão):',item.result_evidence||'');
      if(result===null)return;
      const {error}=await db.from('crm_work_items').update({result_evidence:result.trim()}).eq('id',item.id).eq('workspace_id',ws());
      if(error)throw error;
      await loadData();state.notice='Evidência registrada e auditada.';render();
    }
    else if(action==='run-ai') {
      if(!db||!ws())return;
      state.aiLoading=true;render();
      const items=rankTasks(state.items).slice(0,10).map(t=>({
        title:t.title,priority:t.priority,status:t.status,track:t.track,
        due_date:t.due_date,next_action:t.next_action,definition_of_done:t.definition_of_done
      }));
      const {data,error}=await db.functions.invoke('ai-triage',{body:{workspace_id:ws(),items}});
      if(error)throw new Error('Serviço de análise indisponível: '+error.message);
      state.aiMode=data?.mode==='model'?'model':'rules';
      state.aiResult=String(data?.recommendation||'Nenhuma recomendação retornada.');
      state.aiLoading=false;render();
    }
  } catch(error){state.error=error.message||String(error);state.aiLoading=false;render();}
});
document.addEventListener('change',async event=>{
  const el=event.target;
  if(el.id==='track-filter'){state.track=el.value;render();return;}
  if(el.id==='knowledge-filter'){state.knowledgeKind=el.value;render();return;}
  if(el.id==='workspace-select'){
    const m=state.memberships.find(x=>x.workspace_id===el.value);if(!m)return;
    state.membership=m;window.sessionStorage.setItem('aresta_intelligence_workspace',m.workspace_id);
    state.loading=true;render();try{await loadData();state.error='';}catch(error){state.error=error.message;}
    state.loading=false;render();return;
  }
  if(el.dataset.change==='contact-stage') {
    if(readonly())return;
    const {error}=await db.from('crm_contacts').update({stage:el.value}).eq('id',el.dataset.id).eq('workspace_id',ws());
    if(error)state.error=error.message;else{await loadData();state.notice='Relacionamento atualizado.';}
    render();return;
  }
  if(el.dataset.change==='task-status') {
    try{await changeStatus(el.dataset.id,el.value);}
    catch(error){state.error=error.message;render();}
  }
});
document.addEventListener('submit',async event=>{
  const form=event.target;
  if(form.id==='email-login-form'){
    event.preventDefault();
    if(!db)return;
    const email=String(new FormData(form).get('email')||'').trim();
    if(!email)return;
    state.error=''; state.notice='';
    const {error}=await db.auth.signInWithOtp({ email, options: {
      emailRedirectTo:window.location.origin+window.location.pathname,
      shouldCreateUser:true
    }});
    if(error)state.error='Falha ao enviar link: '+error.message;
    else state.notice='Novo link enviado. Ele deve voltar ao endereço do CRM na nuvem. Se abrir localhost, ajuste Site URL e Redirect URLs em Supabase Authentication → URL Configuration e solicite outro link.';
    render();return;
  }
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
installWorkflowHandlers(()=>({db,state,ws,readonly,loadData,render}));
init();
