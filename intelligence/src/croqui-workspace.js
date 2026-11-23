// Aresta Intelligence | núcleo operacional do croqui.
// ArestaDB (público) = leitura técnica; Supabase (RLS) = solicitações/planejamento.
// Escrita direta no Editor desktop NÃO é simulada. MCP somente na instância local autorizada.
export const CROQUI_ID='br_mg_lagoa_santa_gruta_da_lapinha';
export const CROQUI_PATH='database/'+CROQUI_ID;
export const CROQUI_REPO='https://github.com/aresta-climb/aresta_db/tree/main/'+CROQUI_PATH;
export const CROQUI_ROOT='https://raw.githubusercontent.com/aresta-climb/aresta_db/main/'+CROQUI_PATH+'/';
export const CROQUI_YAML='https://github.com/aresta-climb/aresta_db/blob/main/'+CROQUI_PATH+'/croqui.yaml';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=v=>String(v??'').replace(/^['"]|['"]$/g,'').trim();
const linkSafe=x=>{try{let u=new URL(x);return u.protocol==='https:'?u.href:null}catch{return null}};
const orderSector=(a,b)=>Number(a.file.match(/_(\d+)\./)?.[1]||0)-Number(b.file.match(/_(\d+)\./)?.[1]||0);
export function parseCroquiIndex(raw){
 const id=/^id:\s*(.+)$/m.exec(raw)?.[1]?.trim();
 const name=/^nome:\s*(.+)$/m.exec(raw)?.[1]?.trim();
 if(id!==CROQUI_ID||!name)throw new Error('Identificador da Lapinha não corresponde ao cadastro oficial.');
 const files=[...new Set([...raw.matchAll(/^\s+caminho:\s*(setor_mapa_\d+\.md)\s*$/gm)].map(m=>m[1]))].sort((a,b)=>Number(a.match(/\d+/)?.[0]||0)-Number(b.match(/\d+/)?.[0]||0));
 if(!files.length)throw new Error('Nenhum setor reconhecido no YAML do croqui.');
 return {id,name,files,published:/^publicar_croqui:\s*true\s*$/m.test(raw)};
}
export function parseCroquiSector(file,raw){
 const body=String(raw).split(/\n---\s*\n/)[0];
 const name=clean(body.match(/^nome:\s*(.+)$/m)?.[1]||file);
 const image=body.match(/^- caminho_imagem_mapa:\s*(imagens\/[A-Za-z0-9._/-]+\.webp)\s*$/m)?.[1]||null;
 const mapFile=image&&!image.includes('..')?image:null;
 const pos=body.search(/^escaladas:\s*$/m);
 if(pos<0)return {file,name,mapFile,vias:[],parseWarning:'Sem lista de escaladas no arquivo'};
 const section=body.slice(pos).split(/\r?\n/).slice(1);
 const vias=[];
 let current=null,buffer=[];
 const complete=()=>{if(current&&current.uid&&current.name){current.restricted=/\bINTERDITADA\b|\bINTERDITADO\b/i.test(buffer.join('\n'));vias.push(current)}};
 for(const line of section){
  if(/^[^\s#][\w-]*:/.test(line))break;
  const uid=/^- uid:\s*(\S+)/.exec(line);
  if(uid){complete();current={uid:uid[1],name:'',grade:'Não informado',type:'Não especificado',file};buffer=[];continue}
  if(!current)continue;
  buffer.push(line);
  const type=/^  (via_esportiva|via_movel|boulder|via_tradicional|via_artificial):\s*$/.exec(line);
  if(type){current.type=type[1].replace(/_/g,' ');continue}
  const nameLine=/^    nome:\s*(.+)$/.exec(line);
  if(nameLine&&!current.name){current.name=clean(nameLine[1]);continue}
  const grade=/^    dificuldade:\s*(.+)$/.exec(line);
  if(grade)current.grade=clean(grade[1]).replace(/^BR_/,'').replace(/_/g,' ');
  const description=/^    descricao:\s*(.*)$/.exec(line);
  if(description)current.hasDescription=!/^(?:null|~)?$/i.test(clean(description[1]));
 }
 complete();
 return {file,name,mapFile,vias};
}
export async function fetchLapinhaCatalog(fetcher=fetch){
 const abort=new AbortController();
 const timer=setTimeout(()=>abort.abort(),16000);
 try{
  const res=await fetcher(CROQUI_ROOT+'croqui.yaml',{signal:abort.signal});
  if(!res.ok)throw Error('Não foi possível ler croqui.yaml (HTTP '+res.status+').');
  const index=parseCroquiIndex(await res.text());
  const responses=await Promise.allSettled(index.files.map(async file=>{
   const response=await fetcher(CROQUI_ROOT+file,{signal:abort.signal});
   if(!response.ok)throw new Error(file+': HTTP '+response.status);
   return parseCroquiSector(file,await response.text());
  }));
  const setores=responses.filter(x=>x.status==='fulfilled').map(x=>x.value).sort(orderSector);
  const errors=responses.filter(x=>x.status==='rejected').map(x=>String(x.reason?.message||x.reason));
  if(!setores.length)throw Error('Nenhum setor pôde ser consultado.');
  return {name:index.name,id:index.id,published:index.published,files:index.files,
   setores,vias:setores.flatMap(s=>s.vias.map(v=>({...v,sector:s.name}))),errors,
   fetchedAt:new Date().toISOString()};
 }finally{clearTimeout(timer)}
}
const button=(action,label,extra='',style='secondary')=>'<button type="button" class="'+style+' croqui-btn" data-croqui="'+action+'" '+extra+'>'+E(label)+'</button>';
const tab=(id,title,active)=>button('tab',title,'data-tab="'+id+'" '+(active===id?'aria-current="page"':''),active===id?'primary':'secondary');
const status=x=>({entrada:'Recebida',pronto:'Pronta',fazendo:'Em execução',aguardando:'Aguardando',concluido:'Concluída',medido:'Medido'})[x]||x;
const nameFromFile=(file)=>file?.replace(/^setor_mapa_(\d+)\.md$/,'Setor $1')||'Setor';
const isLapinhaTask=t=>String(t.external_key||'').startsWith('croqui:lapinha:');
const isLapinhaContent=c=>/lapinha|rupestre/i.test([c.title,c.objective,c.source_url].filter(Boolean).join(' '))||
  String(c.source_url||'').includes(CROQUI_ID);
const sourceUrl=v=>v?.file?'https://github.com/aresta-climb/aresta_db/blob/main/'+CROQUI_PATH+'/'+v.file:CROQUI_YAML;
const editorLink='<a class="croqui-link" href="https://arestaclimb.com/editor" target="_blank" rel="noopener noreferrer">Abrir Editor Aresta ↗</a>';

function nextMissingField(via){
 if(!via || via.restricted)return null;
 if(via.grade==='Não informado')return {
  kind:'graduacao',title:'Completar a graduação',benefit:'Ajuda quem chega ao setor a escolher uma via para o seu nível e dá ao mantenedor uma referência para revisar o grau.'
 };
 if(via.hasDescription!==true && via.type!=='Não especificado')return {
  kind:'descricao',title:'Adicionar uma descrição',benefit:'Uma referência do início da via ajuda quem chega à base e preserva esse beta no croqui do setor.'
 };
 return null;
}

function renderFieldSuggestion(via,readonly){
 const suggestion=nextMissingField(via);
 if(!suggestion)return '';
 return '<div class="croqui-reference"><strong>'+suggestion.title+'</strong><p>'+suggestion.benefit+'</p>'+
  '<div class="croqui-button-line">'+editorLink+
  (readonly()?'':button('edit-selected','Preparar para o Editor','data-kind="'+suggestion.kind+'"','primary'))+
  '</div></div>';
}

function renderCatalog(state,readonly){
 const cat=state.croquiCatalog;const loading=state.croquiLoading;
 if(!cat)return '<div class="croqui-empty"><h2>Escolha um setor</h2><p>Veja as vias e os mapas do croqui oficial.</p>'+
  button('refresh',loading?'Consultando cadastro…':'Carregar setores e vias','','primary')+'</div>';
 const selected=cat.setores.find(s=>s.file===state.croquiSector)||cat.setores[0];
 const query=String(state.croquiSearch||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const vias=selected.vias.filter(v=>[v.name,v.grade,v.uid].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query));
 const current=cat.vias.find(v=>v.uid===state.croquiViaUid);
 return '<div class="croqui-catalog-grid"><section class="croqui-sector-list"><div class="croqui-panel-head"><h2>Setores</h2><small>'+cat.setores.length+'/'+cat.files.length+' carregados</small></div>'+
   cat.setores.map(s=>button('sector',s.name+' · '+s.vias.length,'data-file="'+E(s.file)+'" aria-pressed="'+(selected.file===s.file)+'"',selected.file===s.file?'primary':'secondary')).join('')+'</section>'+
  '<section class="croqui-via-list"><div class="croqui-panel-head"><h2>'+E(selected.name)+'</h2><a href="'+E(sourceUrl(selected))+'" target="_blank" rel="noopener noreferrer">Fonte</a></div>'+
   (selected.mapFile?'<div class="croqui-map-preview"><img loading="lazy" src="'+E(CROQUI_ROOT+selected.mapFile)+'" alt="Mapa oficial do '+E(selected.name)+' no ArestaDB, sem edição de imagem"/><small>Imagem original publicada no ArestaDB, sem alterações. Verifique revisão e regras do local.</small></div>':'')+
   '<div class="croqui-search-wrap"><label for="croqui-search">Buscar via, grau ou UID</label><input id="croqui-search" type="search" value="'+E(state.croquiSearch||'')+'" placeholder="Ex.: Castelinho, BR_6..." autocomplete="off"></div>'+
   '<div class="croqui-via-scroll">'+(vias.length?vias.map(v=>
     '<button type="button" class="croqui-route '+(state.croquiViaUid===v.uid?'active':'')+'" data-croqui="via" data-uid="'+E(v.uid)+'">'+
      '<span><b>'+E(v.name)+'</b><small>'+E(v.type)+' · '+E(v.uid)+'</small></span><span class="croqui-grade">'+E(v.grade)+(v.restricted?' · INTERDITADA*':'')+'</span></button>').join(''):
    '<p class="croqui-empty-tiny">Nenhuma via corresponde à busca neste setor.</p>')+'</div>'+
   '<small class="croqui-caution">*Indicação presente no arquivo técnico consultado; confirme regras e condições atuais com os responsáveis antes de qualquer prática.</small>'+
  '</section></div>'+
  (current?'<div class="croqui-selected"><div><span class="overline">VIA SELECIONADA</span><h3>'+E(current.name)+'</h3>'+
   '<p>'+E(current.sector)+' · '+E(current.type)+' · '+E(current.grade)+' · UID '+E(current.uid)+'</p></div>'+
   '<div class="croqui-button-line">'+button('edit-selected','Sugerir correção')+
   '<a class="croqui-link" href="'+E(sourceUrl(current))+'" target="_blank" rel="noopener noreferrer">Ver arquivo</a></div></div>'+renderFieldSuggestion(current,readonly):
   '<p class="croqui-empty-tiny">Selecione uma via para preparar uma atualização.</p>')+
  (cat.errors.length?'<p class="croqui-warning">'+cat.errors.length+' arquivos indisponíveis. Resultado parcial; atualize novamente.</p>':'')+
  '<p class="croqui-caution">Leitura do repositório público em '+E(new Date(cat.fetchedAt).toLocaleString('pt-BR'))+'. '+
  'Não é telemetria do aplicativo nem confirma autorização de intervenção.</p>';
}
function renderReviewQueue(state){
 const info=state.editorSuggestions||{};
 const pending=(info.records||[]).filter(record=>record.status==='aberta');
 return '<div class="croqui-reference"><h3>Aguardando revisão</h3>'+
  '<p>Fila geral do ArestaDB. Para comparar o antes e o depois, abra <strong>Revisar Sugestões</strong> no Editor com sua conta de mantenedor.</p>'+
  '<div class="croqui-button-line">'+editorLink+
   '<button type="button" class="secondary" data-action="refresh-editor-prs"'+(info.loading?' disabled':'')+'>'+
   (info.loading?'Consultando…':'Atualizar fila')+'</button></div>'+
  (info.error?'<p role="status">'+E(info.error)+(info.fetchedAt?' Exibindo a última consulta.':'')+'</p>':'')+
  (info.fetchedAt?'<p class="micro">'+pending.length+' em aberto na última consulta'+
   (info.truncated?' · consulta limitada aos 100 registros mais recentes':'')+'.</p>':'')+
  (pending.length?'<ul>'+pending.slice(0,5).map(record=>
   '<li><a href="https://github.com/aresta-climb/aresta_db/pull/'+E(record.number)+'" target="_blank" rel="noopener noreferrer">'+
    E(record.title)+'</a> <small>#'+E(record.number)+'</small></li>').join('')+'</ul>':'')+
  (pending.length>5?'<button type="button" class="secondary" data-view="processos">Ver fila em Processos</button>':'')+
 '</div>';
}
function renderUpdate(state,readonly){
 const cat=state.croquiCatalog;
 const current=cat?.vias.find(v=>v.uid===state.croquiViaUid);
 const requests=(state.items||[]).filter(isLapinhaTask);
 const suggestion=nextMissingField(current);
 return '<div class="croqui-two"><section class="croqui-panel"><div class="croqui-panel-head"><h2>Colaborar no croqui</h2></div>'+
  '<p>No Editor, faça o ajuste na via e clique em <strong>Enviar Sugestão</strong>. Confirme seu e-mail com o código de seis dígitos.</p>'+editorLink+
  (suggestion && suggestion.kind===state.croquiChangeKind?'<p><strong>'+suggestion.title+' · '+E(current.name)+'</strong><br>'+suggestion.benefit+'</p>':'')+
  (current?'<div class="croqui-reference">'+button('copy-mcp','Copiar contexto para o Editor')+'</div>':'')+
  (!cat?button('refresh','Carregar vias','', 'primary'):
   (readonly()?'':
    '<details'+(current?' open':'')+'><summary>Preparar ajuste para o Editor</summary><form id="croqui-update-form" class="croqui-form">'+
      '<label>Setor / via<select name="via_uid" required><option value="">Selecionar via…</option>'+
        cat.vias.map(v=>'<option value="'+E(v.uid)+'"'+(v.uid===current?.uid?' selected':'')+'>'+E(v.sector)+' · '+E(v.name)+'</option>').join('')+'</select></label>'+
      '<label>Tipo de alteração<select name="change_kind" required>'+
        [['graduacao','Graduação'],['descricao','Descrição ou beta'],['nome','Nome da via'],['autoria','Autoria e créditos'],['seguranca','Condição técnica / alerta'],['outro','Outro ajuste']].map(([id,name])=>'<option value="'+id+'"'+(id===state.croquiChangeKind?' selected':'')+'>'+name+'</option>').join('')+'</select></label>'+
      '<label>O que deve ser alterado?<textarea name="change_text" minlength="12" maxlength="1400" rows="4" required placeholder="Descreva a informação atual e a correção sugerida, com contexto."></textarea></label>'+
      '<label>Fonte da correção (quando houver)<input name="evidence_url" type="url" placeholder="https://..."></label>'+
      '<button class="primary croqui-btn" type="submit">Salvar na fila interna</button></form></details>'))+
  '</section><section class="croqui-panel"><div class="croqui-panel-head"><h2>Curadoria</h2></div>'+
  renderReviewQueue(state)+
  '<details><summary>Ajustes internos da Lapinha ('+requests.length+')</summary>'+
  (requests.length?requests.slice().sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))).slice(0,10).map(t=>
   '<button class="croqui-task" type="button" data-croqui="open-task" data-id="'+E(t.id)+'">'+
   '<span><b>'+E(t.title)+'</b><small>'+E(status(t.status))+' · '+E(t.next_action)+'</small></span><span>›</span></button>').join(''):
   '<p class="croqui-empty-tiny">Nenhum ajuste preparado neste workspace.</p>')+
  '</details></section></div>';
}
function renderCreate(state,readonly){
 const items=(state.items||[]).filter(t=>String(t.external_key||'').startsWith('croqui:new:'));
 return '<div class="croqui-two"><section class="croqui-panel"><h2>Criar novo croqui</h2>'+
  '<p>Prepare a entrada de um novo pico com dados mínimos. A criação do arquivo real acontece no Editor Aresta, após atribuição de responsáveis e direitos de publicação.</p>'+
  (readonly()?'<p>Apenas editores do workspace podem registrar uma solicitação.</p>':
   '<form id="croqui-create-form" class="croqui-form"><label>Nome do pico<input name="name" maxlength="100" minlength="3" required placeholder="Nome conhecido localmente"></label>'+
   '<div class="croqui-form-grid"><label>Cidade<input name="city" maxlength="90" required></label><label>UF<input name="uf" maxlength="2" minlength="2" required placeholder="MG"></label></div>'+
   '<label>Responsável / fonte da documentação<textarea name="context" rows="3" maxlength="900" minlength="12" required placeholder="Quem conhece o pico? Há croqui autoral, licença ou autorização?"></textarea></label>'+
   '<button class="primary croqui-btn" type="submit">Preparar criação no Editor</button></form>')+
 '</section><section class="croqui-panel"><h2>Processo de autoria e publicação</h2>'+
  '<ol class="croqui-steps"><li>Identificar pico, fontes e direitos de uso</li><li>Criar estrutura no Editor desktop</li><li>Revisar com autores/curadores</li><li>Compilar e submeter pelo processo oficial</li><li>Confirmar publicação e sincronização no App</li></ol>'+
  '<p class="croqui-caution">Nenhum clique neste painel cadastra uma via no ArestaDB ou publica um croqui automaticamente.</p>'+
  '<h3>Solicitações de criação</h3>'+
  (items.length?items.slice(0,6).map(t=>'<button type="button" class="croqui-task" data-croqui="open-task" data-id="'+E(t.id)+'"><b>'+E(t.title)+'</b><small>'+E(status(t.status))+'</small></button>').join(''):'<p class="croqui-empty-tiny">Sem novas solicitações neste workspace.</p>')+
  '</section></div>';
}
function renderContent(state,readonly){
 const contents=(state.contents||[]).filter(isLapinhaContent);
 return '<div class="croqui-two"><section class="croqui-panel"><div class="croqui-panel-head"><h2>Comunicação do território</h2><small>Aresta + parceiros</small></div>'+
   '<p>Pautas, peças, canais e aprovações mantidos no CRM de Marketing. Cada comunicação fica ligada ao croqui oficial como fonte.</p>'+
   (readonly()?'<p>Você tem acesso somente de leitura.</p>':
   '<form id="croqui-content-form" class="croqui-form">'+
    '<label>Tema<input name="title" maxlength="160" minlength="5" required placeholder="Ex.: Atualização do Setor Castelinho"></label>'+
    '<div class="croqui-form-grid"><label>Organização<select name="brand">'+
     ['Aresta','FEMEMG','ACEC','Parceiro'].map(x=>'<option>'+x+'</option>').join('')+'</select></label>'+
    '<label>Canal<select name="channel">'+['Instagram','LinkedIn','Facebook','WhatsApp','Site','Discord'].map(x=>'<option>'+x+'</option>').join('')+'</select></label></div>'+
    '<label>Objetivo<textarea name="objective" minlength="8" maxlength="300" rows="2" required placeholder="O que este conteúdo deve gerar para a comunidade?"></textarea></label>'+
    '<button class="primary croqui-btn" type="submit">Criar pauta vinculada</button></form>')+
   '<p class="croqui-caution">Criação de pauta não publica em redes. A aprovação institucional continua obrigatória quando aplicável.</p>'+
   '</section><section class="croqui-panel"><div class="croqui-panel-head"><h2>Pautas existentes</h2><small>'+contents.length+' vinculadas por título ou fonte</small></div>'+
   (contents.length?contents.map(c=>'<button type="button" class="croqui-task" data-croqui="open-content" data-id="'+E(c.id)+'">'+
    '<span><b>'+E(c.title)+'</b><small>'+E(c.brand)+' · '+E(c.channel)+' · '+E(c.stage)+'</small></span><span>›</span></button>').join(''):
    '<p class="croqui-empty-tiny">Sem pautas reconhecidas para Lapinha neste workspace.</p>')+
   '<div class="croqui-reference"><p>Depois de abrir uma pauta, é possível adicionar legenda, criativo Canva, agendamento e link publicado no módulo de Marketing.</p></div>'+
   '</section></div>';
}
export function renderCroquiWorkspace({state,readonly}){
 const active=['catalogo','atualizacoes','criar','comunicacao'].includes(state.croquiViewTab)?state.croquiViewTab:'catalogo';
 return '<section class="section-head croqui-heading"><div><h1>Croquis & Vias</h1>'+
   '<p>Gruta da Lapinha · Lagoa Santa, MG</p></div>'+editorLink+'</section>'+
  '<div class="croqui-tabbar" role="navigation" aria-label="Ações do croqui">'+
   tab('catalogo','Vias',active)+tab('atualizacoes','Colaborar',active)+
   '<details'+(['criar','comunicacao'].includes(active)?' open':'')+'><summary>Mais</summary>'+
   tab('criar','Novo croqui',active)+tab('comunicacao','Comunicação',active)+
   button('go-territory','Território')+'</details></div>'+
  (active==='catalogo'?renderCatalog(state,readonly):active==='atualizacoes'?renderUpdate(state,readonly):
  active==='criar'?renderCreate(state,readonly):renderContent(state,readonly))+
  '<div class="croqui-bottom"><a href="'+CROQUI_REPO+'" target="_blank" rel="noopener noreferrer">Arquivos e histórico do croqui</a></div>';
}
export function buildMcpInstructions(state){
 const cat=state.croquiCatalog,v=cat?.vias.find(v=>v.uid===state.croquiViaUid);
 const request=state.croquiMcpRequest?.uid===v?.uid?state.croquiMcpRequest:null;
 const field=nextMissingField(v);
 return [
  'ARESTA EDITOR — CONTEXTO PARA AGENTE MCP LOCAL',
  'Território: Gruta da Lapinha (Lagoa Santa, MG)',
  'ID do croqui: '+CROQUI_ID,
  'Fonte: '+CROQUI_YAML,
  v?'Via: '+v.name+' | Setor: '+v.sector+' | UID: '+v.uid+' | arquivo: '+v.file:'Via não selecionada. Localizar manualmente no Editor antes de editar.',
  request?'Solicitação interna: '+request.kind+' | '+request.change+' | fonte complementar: '+(request.evidence||'não informada'):field?'Campo sugerido: '+field.kind+' | '+field.benefit:'Não há correção estruturada selecionada nesta sessão.',
  '1. Conectar ao servidor MCP do Editor Aresta no computador do operador (127.0.0.1:27378/mcp).',
  '2. Chamar aresta_listar_croquis e abrir o croqui correto, confirmando ID e autoria.',
  '3. Inspecionar a árvore com aresta_obter_arvore e conferir UID antes de propor qualquer alteração.',
  '4. Solicitar confirmação humana da mudança e verificar direitos, regras locais e riscos.',
  '5. Somente após aprovação explícita, alterar com aresta_alterar_campo. Compilar e salvar no fluxo do Editor.',
  '6. Registrar PR e a evidência de sincronização no App separadamente; não afirmar publicação antes do retorno real.',
  'Não executar alterações automaticamente com este texto.'
 ].join('\n');
}
export function installCroquiHandlers(getCtx){
 document.addEventListener('click',async e=>{
  const el=e.target.closest('[data-croqui]');
  if(!el)return;
  const {state,db,ws,readonly,loadData,render,refreshEditorSuggestions}=getCtx();
  const action=el.dataset.croqui;
  if(action==='tab'){
   state.croquiViewTab=el.dataset.tab;render();return;
  }
  if(action==='sector'){
   state.croquiSector=el.dataset.file;state.croquiViaUid=null;state.croquiChangeKind='';state.croquiSearch='';render();return;
  }
  if(action==='via'){state.croquiViaUid=el.dataset.uid;state.croquiChangeKind='';render();return;}
  if(action==='edit-selected'){state.croquiChangeKind=el.dataset.kind||'';state.croquiViewTab='atualizacoes';render();
   document.querySelector('#croqui-update-form [name="change_text"]')?.focus();return;}
  if(action==='go-territory'){state.view='territorio';render();return;}
  if(action==='open-task'){
   if(!(state.items||[]).some(t=>t.id===el.dataset.id))return;
   state.focusTaskId=el.dataset.id;render();return;
  }
  if(action==='open-content'){
   if(!(state.contents||[]).some(t=>t.id===el.dataset.id))return;
   state.activeContentId=el.dataset.id;state.view='marketing';render();return;
  }
  if(action==='copy-mcp'){
   const value=buildMcpInstructions(state);
   try{await navigator.clipboard.writeText(value);state.notice='Contexto da via copiado para o Editor.';}
   catch{state.error='O navegador bloqueou a cópia. Conceda permissão de área de transferência.';}
   render();return;
  }
  if(action==='refresh'){
   if(state.croquiLoading)return;
   state.croquiLoading=true;state.croquiError=null;render();
   try{
    state.croquiCatalog=await fetchLapinhaCatalog();state.croquiSector=state.croquiCatalog.setores[0]?.file;
    state.croquiViaUid=null;state.croquiChangeKind='';state.croquiSearch='';
    state.notice=state.croquiCatalog.errors.length?'Cadastro parcialmente carregado; verifique arquivos ausentes.':'Setores e vias consultados no ArestaDB público.';
   }catch(err){state.croquiError=String(err?.message||err);state.error='Falha ao consultar cadastro: '+state.croquiError;}
   finally{state.croquiLoading=false;render();}
  }
 });
 document.addEventListener('change',e=>{
  if(e.target?.name!=='via_uid')return;
  const {state}=getCtx();
  if(state.croquiCatalog?.vias.some(x=>x.uid===e.target.value))state.croquiViaUid=e.target.value;
  state.croquiChangeKind='';
 });
 document.addEventListener('input',e=>{
  if(e.target?.id!=='croqui-search')return;
  const {state}=getCtx();
  state.croquiSearch=e.target.value;
  // Não redesenhar o campo com foco a cada tecla; atualizar apenas as vias visíveis.
  const selected=state.croquiCatalog?.setores.find(s=>s.file===state.croquiSector);
  const list=document.querySelector('.croqui-via-scroll');
  if(!selected||!list)return;
  const norm=v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  list.querySelectorAll('[data-uid]').forEach(el=>{
   const via=selected.vias.find(v=>v.uid===el.dataset.uid);
   if(via)el.hidden=!norm(via.name+' '+via.grade+' '+via.uid).includes(norm(state.croquiSearch));
  });
 });
 document.addEventListener('submit',async e=>{
  if(!['croqui-update-form','croqui-create-form','croqui-content-form'].includes(e.target?.id))return;
  e.preventDefault();
  const {state,db,ws,readonly,loadData,render}=getCtx();
  if(readonly()||!db||!ws()||!state.session?.user?.id){state.error='Seu perfil não tem permissão para salvar neste workspace.';render();return;}
  const fd=new FormData(e.target),form=e.target.id;
  const all=state.croquiCatalog?.vias||[];
  const random=globalThis.crypto?.randomUUID?.();
  if(!random){state.error='Identificador seguro indisponível.';render();return;}
  try{
   if(form==='croqui-update-form'){
    const via=all.find(v=>v.uid===fd.get('via_uid'));
    const kind=String(fd.get('change_kind')||'');
    const details=String(fd.get('change_text')||'').trim();
    const source=String(fd.get('evidence_url')||'').trim();
    const K=['graduacao','descricao','nome','autoria','seguranca','outro'];
    if(!via||!K.includes(kind)||details.length<12||source&&!linkSafe(source))throw Error('Selecione uma via e descreva uma correção com fonte válida.');
    const payload={workspace_id:ws(),external_key:'croqui:lapinha:'+via.uid+':'+random,
     title:'Atualizar croqui · '+via.name,track:'Produto',priority:'P2',status:'entrada',
     details:'Território: '+CROQUI_ID+'\nSetor: '+via.sector+'\nUID: '+via.uid+
      '\nCampo: '+kind+'\nMudança solicitada: '+details+'\nFonte complementar: '+(source||'não informada'),
     next_action:'Curadoria: conferir UID '+via.uid+', evidência, autorização e corrigir no Editor; registrar PR.',
     definition_of_done:'Alteração conferida por curador/autor, incorporada ao ArestaDB e sincronização no App verificada com evidências.',
     source_url:sourceUrl(via),source_kind:'manual',created_by:state.session.user.id};
    const {error}=await db.from('crm_work_items').insert(payload);
    if(error)throw error;
    state.croquiViaUid=via.uid;
    state.croquiMcpRequest={uid:via.uid,kind,change:details,evidence:source};
    const learned=nextMissingField(via);
    state.croquiChangeKind='';
    state.notice='Ajuste preparado para a curadoria. O próximo passo é conferir a via no Editor.'+
     (learned?.kind===kind?' '+learned.benefit:'');
    state.croquiViewTab='atualizacoes';
   }else if(form==='croqui-create-form'){
    const name=String(fd.get('name')||'').trim(),city=String(fd.get('city')||'').trim();
    const uf=String(fd.get('uf')||'').trim().toUpperCase(),context=String(fd.get('context')||'').trim();
    if(name.length<3||!city||!/^[A-Z]{2}$/.test(uf)||context.length<12)throw Error('Preencha nome, cidade, UF e origem dos dados.');
    const {error}=await db.from('crm_work_items').insert({
      workspace_id:ws(),external_key:'croqui:new:'+random,title:'Criar croqui · '+name,
      track:'Produto',priority:'P2',status:'entrada',details:'Novo pico: '+name+'\nCidade: '+city+'\nUF: '+uf+'\nFontes/contatos: '+context,
      next_action:'Conferir direitos, fontes e responsável. No Editor local usar aresta_criar_novo_croqui; submeter à curadoria oficial.',
      definition_of_done:'Croqui criado no Editor, compilado, revisado pelos responsáveis e publicado com evidência no ArestaDB/App.',
      source_url:'https://github.com/aresta-climb/aresta_db/tree/main/database',
      source_kind:'manual',created_by:state.session.user.id});
    if(error)throw error;
    state.notice='Preparação registrada. Abra o Editor desktop para criar o croqui real.';
   }else{
    const title=String(fd.get('title')||'').trim(),objective=String(fd.get('objective')||'').trim();
    const brand=String(fd.get('brand')||'Aresta'),channel=String(fd.get('channel')||'Instagram');
    if(title.length<5||objective.length<8)throw Error('Informe tema e objetivo para a comunidade.');
    if(!['Aresta','FEMEMG','ACEC','Parceiro'].includes(brand)||!['Instagram','LinkedIn','Facebook','WhatsApp','Site','Discord'].includes(channel))throw Error('Marca ou canal inválido.');
    const {error}=await db.from('crm_content_items').insert({
     workspace_id:ws(),title:'Lapinha · '+title,brand,channel,stage:'rascunho',objective,
     caption:'',source_url:CROQUI_YAML,created_by:state.session.user.id});
    if(error)throw error;
    state.notice='Pauta vinculada à Lapinha criada. A publicação depende de aprovação e execução externa.';
   }
   await loadData();render();
  }catch(err){state.error=String(err.message||err);render();}
 });
}
