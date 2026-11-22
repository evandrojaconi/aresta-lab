// ARESTA Intelligence — processos existentes organizados em uma operação navegável.
// Não simula integrações, autoria, revisão, publicação ou dados em tempo real.
import {rankTasks} from './rules.js';
import {renderProcessCenter} from './process-center.js';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KNOWN=['visao','colaboracao','comunicacao','territorios','produto','dados'];
const NAMES={colaboracao:'Comunidade e colaboração',comunicacao:'Comunicação e distribuição',territorios:'Territórios e parcerias',produto:'Produto e melhorias',dados:'Dados, pesquisa e fomento'};
const PHASES={
 colaboracao:['Escutar','Registrar','Revisar','Devolver'],
 comunicacao:['Pautar','Criar','Aprovar','Publicar','Medir'],
 territorios:['Conhecer','Documentar','Articular','Agir','Acompanhar'],
 produto:['Observar','Propor','Priorizar','Entregar','Medir'],
 dados:['Coletar','Qualificar','Interpretar','Decidir','Aprender']
};
const isOpen=t=>!['concluido','medido'].includes(t.status);
const isPendingContent=c=>!['publicado','medido'].includes(c.stage);
const titleHas=(o,regex)=>regex.test([o?.title,o?.summary,o?.next_action,o?.objective].filter(Boolean).join(' '));
const date=(value)=>{if(!value)return 'Sem prazo';const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));return m?m[3]+'/'+m[2]+'/'+m[1]:String(value)};
const safeHref=v=>{try{const x=new URL(v);return ['https:','http:'].includes(x.protocol)?x.href:null}catch{return null}};
const prSource='https://github.com/aresta-climb/aresta_db/pulls';
const plural=(n,one,many)=>n===1?one:many;
const action=(type,label,id,variant='secondary')=>'<button class="'+variant+'" type="button" data-mission="'+type+'"'+(id?' data-id="'+E(id)+'"':'')+'>'+E(label)+'</button>';
const metric=(value,label)=>'<div class="mission-metric"><strong>'+E(value)+'</strong><span>'+E(label)+'</span></div>';

export function buildMissionStreams(state){
 const tasks=rankTasks((state.items||[]).filter(isOpen));
 const contents=state.contents||[];
 const prs=state.editorSuggestions||{};
 const tracked=state.croquiProcesses||[];
 const contacts=state.contacts||[];
 const touchpoints=state.touchpoints||[];
 const proposals=state.proposals||[];
 const opps=state.opportunities||[];
 const readings=state.metricSnapshots||[];
 const channels=state.channels||[];
 const byTrack=regex=>tasks.filter(t=>regex.test(t.track||''));
 const areas={
  colaboracao:{
   tasks:byTrack(/Comunidade/),contents:contents.filter(c=>titleHas(c,/comunidade|contribui|editor|croqui/i)),
   notes:[
    {value:touchpoints.length,label:'interações registradas no CRM'},
    {value:prs.fetchedAt?prs.open:'—',label:'PRs abertas na última consulta pública'},
    {value:tracked.length,label:'croquis acompanhados internamente'}],
   source:prs.fetchedAt?'GitHub consultado '+new Date(prs.fetchedAt).toLocaleString('pt-BR'):'GitHub ainda não consultado nesta sessão',
   caution:'Uma conversa não vira contribuição sozinha. Interações privadas e escutas não estão automaticamente conectadas ao GitHub.',
   next:tracked.find(c=>!c.next_action?.trim())?'Definir próxima ação de um croqui acompanhado.':'Abrir o fluxo real do Editor e acompanhar uma contribuição.',
   route:'croquis'
  },
  comunicacao:{
   tasks:byTrack(/Marketing/),
   contents:contents.filter(isPendingContent).sort((a,b)=>{
    const rank={'revisao':0,'aprovado':1,'agendado':2,'rascunho':3,'ideia':4};
    return (rank[a.stage]??5)-(rank[b.stage]??5)||String(b.updated_at||'').localeCompare(String(a.updated_at||''));
   }),
   notes:[
    {value:contents.filter(c=>['ideia','rascunho','revisao','aprovado','agendado'].includes(c.stage)).length,label:'peças em preparação'},
    {value:contents.filter(c=>c.stage==='publicado').length,label:'peças marcadas como publicadas'},
    {value:contents.filter(c=>c.stage==='medido').length,label:'peças com etapa de medição concluída'}],
   source:'Pautas do Supabase · execução visual no Canva quando vinculada',
   caution:'Status “aprovado” no CRM não significa aprovação formal da entidade. Publicação fora do CRM exige ação autorizada.',
   next:contents.some(c=>c.stage==='revisao')?'Abrir uma peça em revisão e concluir a aprovação antes de publicar.':'Abrir a pauta prioritária e avançar a produção.',
   route:'marketing'
  },
  territorios:{
   tasks:tasks.filter(t=>t.track==='Território'||titleHas(t,/lapinha|rupestre|gravatá|igarap[eé]|goi[aá]s|rio de janeiro|expans[aã]o|fememg|acec/i)),
   contents:contents.filter(c=>titleHas(c,/lapinha|rupestre|gravatá|igarap[eé]/i)),
   notes:[
    {value:tasks.filter(t=>titleHas(t,/lapinha|rupestre/i)).length,label:'tarefas ligadas à Lapinha por texto'},
    {value:opps.length,label:'oportunidades cadastradas'},
    {value:contacts.length,label:'contatos cadastrados'}],
   source:'Tarefas e conteúdos existentes. Vínculo territorial ainda é heurístico, não georreferenciado.',
   caution:'Informações de concessão, autorização de uso e condições das vias exigem documento e data da autoridade responsável.',
   next:'Priorizar Lapinha, sem interromper o preparo de expansão para RJ e Goiás.',
   route:'oportunidades'
  },
  produto:{
   tasks:tasks.filter(t=>t.track==='Produto'||t.track==='Operação'),
   contents:contents.filter(c=>titleHas(c,/tutorial|editor|aplicativo/i)),
   notes:[
    {value:proposals.length,label:'propostas de produto cadastradas'},
    {value:tasks.filter(t=>t.track==='Produto'||t.track==='Operação').length,label:'tarefas de produto e operação abertas'},
    {value:tracked.length,label:'fluxos de croquis acompanhados'}],
   source:'Tarefas de produto, propostas e código em repositórios separados',
   caution:'Uma proposta cadastrada não é implementação. GitHub comprova código; o uso real depende de medição.',
   next:'Concluir a entrega da landing e conectar melhorias reais ao App e Editor.',
   route:'produto'
  },
  dados:{
   tasks:byTrack(/Dados|Growth/),contents:[],
   notes:[
    {value:readings.length,label:'leituras históricas registradas'},
    {value:state.metricSources?.length||0,label:'fontes analíticas cadastradas'},
    {value:opps.length,label:'oportunidades e editais cadastrados'}],
   source:'Snapshots e links de origem; nem toda fonte está conectada por API.',
   caution:'Sessão, consulta de via e primeira abertura não comprovam visita física, retenção, satisfação nem impacto ambiental.',
   next:'Distinguir o dado disponível do aprendizado necessário para a próxima decisão.',
   route:'dados'
  }
 };
 // Um item já está em seu processo de origem; não transferimos dados entre módulos.
 for(const key of Object.keys(areas)){
  const a=areas[key];a.id=key;a.title=NAMES[key];a.phases=PHASES[key];
  a.count=a.tasks.length+a.contents.length;
 }
 return areas;
}

function processSummary(stream,id,active=false){
 const primary=stream.tasks[0],content=stream.contents[0];
 const n=stream.notes[0];
 return '<button type="button" class="mission-stream '+(active?'selected':'')+'" data-mission="select" data-id="'+id+'">'+
   '<span class="mission-stream-index">'+String(Object.keys(NAMES).indexOf(id)+1).padStart(2,'0')+'</span>'+
   '<span class="mission-stream-copy"><strong>'+E(stream.title)+'</strong>'+
   '<small>'+E(stream.phases.join(' → '))+'</small>'+
   '<span>'+E(primary?primary.title:content?content.title:stream.next)+'</span></span>'+
   '<span class="mission-stream-signal"><b>'+E(n.value)+'</b><small>'+E(n.label)+'</small></span>'+
   '<span class="mission-chevron">›</span></button>';
}
function taskRows(tasks,limit=6){
 return tasks.length?tasks.slice(0,limit).map(t=>
  '<article class="mission-work-row"><div><span class="badge outline">'+E(t.track)+' · '+E(t.priority)+' · '+E(t.status)+'</span>'+
    '<h3>'+E(t.title)+'</h3><p>'+E(t.next_action||'Próxima ação ainda não definida')+'</p>'+
    '<small>'+E(date(t.due_date))+'</small></div>'+
    action('open-task','Executar tarefa',t.id,'primary')+'</article>').join(''):
  '<p class="mission-empty">Nenhuma tarefa deste fluxo cadastrada. Não criei trabalho fictício.</p>';
}
function contentRows(contents){
 return contents.length?contents.slice(0,6).map(c=>
  '<article class="mission-work-row"><div><span class="badge outline">'+E(c.channel)+' · '+E(c.stage)+'</span>'+
   '<h3>'+E(c.title)+'</h3><p>'+E(c.objective||'Objetivo ainda não preenchido')+'</p></div>'+
   action('open-content','Trabalhar na peça',c.id)+'</article>').join(''):
   '<p class="mission-empty">Não há peças pendentes vinculadas a este ciclo no CRM.</p>';
}
function renderMetrics(stream){
 return '<div class="mission-evidence">'+stream.notes.map(x=>metric(x.value,x.label)).join('')+'</div>';
}
function renderDetail(stream,id){
 return '<section class="mission-detail"><div class="mission-detail-head"><span class="overline">PROCESSO OPERACIONAL</span><h2>'+E(stream.title)+'</h2>'+
   '<p>'+E(stream.phases.join(' → '))+'</p>'+
   '<p>'+E(stream.next)+'</p>'+action('go','Abrir área de trabalho',stream.route,'primary')+'</div>'+
   renderMetrics(stream)+
   '<div class="mission-work-grid"><section class="panel"><h2>Tarefas com próximo passo</h2>'+taskRows(stream.tasks)+'</section>'+
   (['comunicacao','territorios','colaboracao','produto'].includes(id)?
     '<section class="panel"><h2>Pautas e conteúdos existentes</h2>'+contentRows(stream.contents)+'</section>':
     '<section class="panel"><h2>Fontes e medição</h2><p>Confira período, origem, cobertura e confiabilidade antes de concluir qualquer tendência.</p>'+
       action('go','Examinar fontes',id,'secondary')+'</section>')+'</div>'+
   '<section class="mission-source-note"><p><strong>Origem:</strong> '+E(stream.source)+'</p>'+
    '<p><strong>Limite:</strong> '+E(stream.caution)+'</p></section>'+
   '</section>';
}
export function renderMissionHub({state,readonly}){
 const streams=buildMissionStreams(state);
 const selected=KNOWN.includes(state.missionFlow)?state.missionFlow:'visao';
 const waiting=Object.values(streams).reduce((n,a)=>n+a.tasks.length,0);
 return '<section class="section-head mission-head"><div><span class="overline">FONTE → EVIDÊNCIA → AÇÃO → RESULTADO</span>'+
  '<h1>Central de processos</h1><p>O Aresta organiza conhecimento e mobiliza a comunidade para cuidar da escalada e dos territórios. Aqui cada frente aponta para um trabalho existente, sem duplicar ferramentas.</p></div>'+
  action('go','Voltar ao Hoje','hoje')+'</section>'+
  '<div class="mission-hero"><div><span class="overline">MISSÃO DO ECOSSISTEMA</span><h2>Conhecimento aberto. Comunidade ativa. Territórios cuidados.</h2>'+
  '<p>O Editor recebe contribuições; o ArestaDB preserva a fonte; o App distribui; o Intelligence coordena pessoas, comunicação, pesquisa e decisões.</p></div>'+
  '<div class="mission-mission-stat"><strong>'+E(waiting)+'</strong><small>tarefas abertas associadas aos processos (podem aparecer em mais de uma frente)</small></div></div>'+
  '<div class="mission-tabbar">'+
   action('select','Visão geral','visao',selected==='visao'?'primary':'secondary')+
   Object.keys(NAMES).map(id=>action('select',id==='colaboracao'?'Comunidade':id==='comunicacao'?'Comunicação':id==='territorios'?'Territórios':id==='produto'?'Produto':'Dados',id,selected===id?'primary':'secondary')).join('')+
   '</div>'+
  (selected==='visao'?'<div class="mission-stream-list">'+Object.keys(NAMES).map(id=>processSummary(streams[id],id)).join('')+'</div>'+
    '<div class="mission-source-note"><p>Esta visão utiliza registros reais do workspace e consulta pública ao GitHub, quando solicitada. “Sem registro” não significa que a atividade não aconteceu.</p></div>':
   selected==='colaboracao'?renderDetail(streams.colaboracao,'colaboracao')+
     '<section class="mission-source-note"><h3>Contribuições reais do Editor</h3><p>Para acompanhar uma sugestão de ponta a ponta, abra o fluxo técnico abaixo. As etapas após o merge exigem comprovação separada.</p></section>'+
     renderProcessCenter({state,readonly}):
   renderDetail(streams[selected],selected));
}
export function renderMissionToday({state}){
 const streams=buildMissionStreams(state);
 const keys=['comunicacao','territorios','colaboracao'];
 return '<section class="mission-today"><div class="mission-today-head"><div><span class="overline">TRÊS FRENTES, UMA OPERAÇÃO</span>'+
   '<h2>Continuar processos</h2><p>O trabalho já existe: abra a peça, a tarefa ou a contribuição em andamento.</p></div>'+
   action('go','Ver todos os processos','processos')+'</div><div class="mission-today-grid">'+
   keys.map(k=>{const a=streams[k],t=a.tasks[0],c=a.contents[0];return '<article><span>'+E(a.title)+'</span>'+
    '<strong>'+E(t?.title||c?.title||a.next)+'</strong>'+
    '<p>'+E(t?.next_action||c?.objective||a.next)+'</p>'+
    (t?action('open-task','Executar',t.id):c?action('open-content','Abrir peça',c.id):
      action('select-go','Abrir fluxo',k))+'</article>'}).join('')+'</div></section>';
}
export function installMissionHandlers(getCtx){
 document.addEventListener('click',event=>{
  const btn=event.target.closest('[data-mission]');
  if(!btn)return;
  const {state,render}=getCtx();
  const op=btn.dataset.mission,id=btn.dataset.id||'';
  if(op==='select'||op==='select-go'){
   if(!KNOWN.includes(id))return;
   state.missionFlow=id;state.view='processos';render();return;
  }
  if(op==='open-task'){
   if(!(state.items||[]).some(x=>x.id===id))return;
   state.focusTaskId=id;render();return;
  }
  if(op==='open-content'){
   if(!(state.contents||[]).some(x=>x.id===id))return;
   state.activeContentId=id;state.view='marketing';render();return;
  }
  if(op==='go'){
   const route=id==='croquis'?'processos':id;
   if(!['processos','marketing','produto','dados','oportunidades','hoje'].includes(route))return;
   if(id==='croquis')state.missionFlow='colaboracao';
   if(route==='processos')state.missionFlow='visao';
   state.view=route;render();
  }
 });
}
