// Aresta Intelligence — território como entidade, sete saídas da mesma base.
// Fonte dos dados técnicos: ArestaDB/STATUS_CROQUIS.md; registros internos: Supabase sob RLS.
// NÃO equivale a controle de visitação, fiscalização, autorização de acesso ou dados em tempo real.
export const LAPINHA_ID='br_mg_lagoa_santa_gruta_da_lapinha';
export const STATUS_URL='https://github.com/aresta-climb/aresta_db/blob/main/STATUS_CROQUIS.md';
const RAW_URL='https://raw.githubusercontent.com/aresta-climb/aresta_db/main/STATUS_CROQUIS.md';
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=x=>{try{const u=new URL(x);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}};
const shortDate=value=>{if(!value)return 'Data não informada';const p=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));return p?p[3]+'/'+p[2]+'/'+p[1]:String(value)};
const count=(s)=>{const m=String(s||'').match(/(\d+)\s*\/\s*(\d+)/);return m?{done:Number(m[1]),total:Number(m[2])}:null};

export const PRODUCTS=[
 {id:'atlas',title:'Atlas digital',description:'Picos, setores, vias, acesso público autorizado, versões e autoria',success:'Croquis revisados por autores e curadores',state:'Fonte técnica existente; permissões e validações separadas'},
 {id:'uso',title:'Observatório de uso',description:'Consultas agregadas e observações voluntárias com método amostral',success:'Séries com período, cobertura e limitações explícitas',state:'Não confundir consultas digitais com visitação física'},
 {id:'socioambiental',title:'Observatório socioambiental',description:'Ocorrências verificáveis de trilhas, resíduos, erosão e conservação',success:'Problemas documentados e encaminhamentos registrados',state:'Coleta territorial estruturada ainda não comprovada'},
 {id:'memoria',title:'Memória territorial',description:'Histórias de conquistadores e moradores, fotos e documentos autorizados',success:'Acervo datado e com créditos e autorização',state:'Direitos autorais devem ser documentados por item'},
 {id:'governanca',title:'Governança',description:'Atas públicas, decisões, responsáveis e acompanhamento de encaminhamentos',success:'Decisão com fonte, data e devolutiva verificável',state:'Não representa decisões oficiais do IEF ou conselho'},
 {id:'socioeconomia',title:'Indicadores socioeconômicos',description:'Pesquisa de campo com moradores, serviços e comércio',success:'Linha de base amostral e análise de benefícios e custos',state:'Não há base quantitativa suficiente nesta integração'},
 {id:'impacto',title:'Relatório de impacto',description:'Método, resultados, lacunas e plano de continuidade',success:'Relatório reprodutível, rastreável e comparável',state:'Depende das demais categorias; não inferir impacto'}
];
const RESPONSIBILITIES=[
 ['IEF / PESU','Regras de acesso, pesquisa, intervenções e publicação institucional','Articulação proposta; autorização não presumida'],
 ['Concessionária e operação','Interface com visitação e informações autorizadas','Contrato e atribuições precisam ser confirmados'],
 ['Rupestre e mantenedores locais','Conhecimento prático, observações e curadoria territorial','Cooperação relatada; alcance das atribuições a documentar'],
 ['ACEC / FEMEMG','Memória esportiva, participação e curadoria comunitária','Apoio não transfere poder de gestão pública'],
 ['Moradores e pesquisadores','Pesquisa, memória, efeitos locais e método amostral','Participação e autorizações de uso a organizar']
];

export const HISTORICAL_REPORT={
 reportDate:'10/11/2026',
 total:52,published:31,ready:1,
 coordsAll:{done:5,total:52},trailsAll:{done:0,total:52},
 lapinha:{published:true,ready:true,routes:{done:132,total:132},sectorMaps:{done:10,total:10},
  coordinates:{done:0,total:10},trails:{done:0,total:10},access:{done:1,total:1},
  credits:{done:130,total:132}},
 origin:'snapshot histórico verificado no ArestaDB; atualização automática ainda não consultada'
};
export function parseCroquiStatus(raw){
 const lines=String(raw||'').split(/\r?\n/);
 const m=String(raw).match(/Relat[oó]rio gerado em:\s*(\d{2}\/\d{2}\/\d{4})/i);
 const header=lines.find(x=>/^\|\s*Croqui\s*\|/.test(x))||'';
 const published=count((header.split('|')[2]||'')),ready=count((header.split('|')[3]||''));
 const all=lines.filter(x=>/^\|\s*br_[a-z0-9_]+\s*\|/i.test(x));
 const lap=all.find(x=>new RegExp('^\\|\\s*'+LAPINHA_ID+'\\s*\\|').test(x));
 if(!m||!published||!ready||!lap)throw new Error('Arquivo ArestaDB sem estrutura reconhecida; conservar linha de base anterior.');
 const cells=lap.split('|').slice(1,-1).map(x=>x.trim());
 const data={reportDate:m[1],total:published.total,published:published.done,ready:ready.done,
  coordsAll:count(header.split('|')[16]),trailsAll:count(header.split('|')[17]),
  lapinha:{
    published:cells[1]?.includes('✅')||false,ready:cells[2]?.includes('✅')||false,
    routes:count(cells[12]),sectorMaps:count(cells[11]),coordinates:count(cells[15]),
    trails:count(cells[16]),access:count(cells[9]),credits:count(cells[23])
  },origin:'arquivo público do ArestaDB consultado sob demanda'};
 // As colunas de totais no cabeçalho vêm depois de "1.6 ..."; separar por nome,
 // para evitar assumir que qualquer número representa visitantes.
 const cols=header.split('|').slice(1,-1).map(x=>x.trim());
 const find=(name)=>count(cols.find(x=>x.includes(name)));
 data.coordsAll=find('2.1 Coords Setores');
 data.trailsAll=find('2.2 Trilhas');
 return data;
}
export async function fetchCroquiStatus(fetchFn=fetch){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
 try{
   const response=await fetchFn(RAW_URL,{method:'GET',signal:controller.signal});
   if(!response.ok)throw new Error('Não foi possível consultar o relatório do ArestaDB (HTTP '+response.status+').');
   return parseCroquiStatus(await response.text());
 }finally{clearTimeout(timeout)}
}
export function lapinhaEvidence(state){
 return (state.knowledge||[]).filter(r=>r.record_kind==='evidence'&&
   r.properties?.territory_id===LAPINHA_ID&&PRODUCTS.some(p=>p.id===r.properties.evidence_kind));
}
const countText=x=>x?x.done+'/'+x.total:'Sem campo documentado';
const stat=(label,value,help)=>'<div class="territory-stat"><b>'+E(value)+'</b><span>'+E(label)+'</span><small>'+E(help)+'</small></div>';
const button=(label,action,extra='')=>'<button class="secondary" data-territory="'+action+'" '+extra+'>'+E(label)+'</button>';
function renderProductCards(records,selected){
 return '<div class="territory-outcomes">'+PRODUCTS.map(p=>{
 const n=records.filter(r=>r.properties?.evidence_kind===p.id).length;
 return '<button class="territory-outcome '+(selected===p.id?'active':'')+'" data-territory="filter" data-type="'+p.id+'">'+
  '<span class="territory-index">'+String(PRODUCTS.indexOf(p)+1).padStart(2,'0')+'</span>'+
  '<strong>'+E(p.title)+'</strong><span>'+E(p.description)+'</span>'+
  '<small>'+n+' '+(n===1?'registro':'registros')+' no CRM · '+E(p.state)+'</small></button>';
 }).join('')+'</div>';
}
function renderEvidenceList(records,selected){
 const data=records.filter(r=>selected==='todos'||r.properties?.evidence_kind===selected);
 return '<section class="panel territory-evidence-list"><div class="panel-title"><h2>Registros da base única</h2><span class="badge outline">'+data.length+' na seleção</span></div>'+
 (data.length?data.slice(0,30).map(r=>{
 const p=PRODUCTS.find(p=>p.id===r.properties?.evidence_kind);
 return '<div class="territory-evidence-row"><div><small>'+E(p?.title||'Sem categoria')+' · '+E(r.source_status||'Sem revisão')+
    ' · observação: '+E(shortDate(r.properties?.observed_date))+'</small>'+
   '<h3>'+E(r.title)+'</h3><p>'+E(r.summary)+'</p>'+
   (safe(r.source_url)?'<a href="'+E(safe(r.source_url))+'" target="_blank" rel="noopener noreferrer">Abrir fonte</a>':'<small>Fonte externa não anexada — relato interno</small>')+
   '</div><small>Visibilidade: interna</small></div>';
 }).join(''):'<p class="territory-empty">Nenhuma evidência nesta categoria. Não significa ausência de ocorrências ou impactos.</p>')+'</section>';
}
function renderEntryForm(readonly,selected){
 if(readonly())return '<p class="territory-empty">Seu perfil tem acesso de leitura. Registros são feitos por operadores autorizados.</p>';
 return '<details class="territory-capture" id="territory-capture"><summary>Registrar observação ou documento</summary>'+
  '<form id="territory-evidence-form" class="form-grid">'+
  '<label>Produto relacionado<select name="evidence_kind" required>'+
  PRODUCTS.map(p=>'<option value="'+p.id+'"'+(selected===p.id?' selected':'')+'>'+E(p.title)+'</option>').join('')+
  '</select></label>'+
  '<label>Data da observação<input type="date" name="observed_date" required></label>'+
  '<label class="span-2">Título<input name="title" maxlength="140" minlength="5" placeholder="O que foi observado?" required></label>'+
  '<label class="span-2">Descrição / contexto<textarea rows="4" name="summary" minlength="12" maxlength="2500" placeholder="O que ocorreu, como sabemos e o que ainda falta confirmar?" required></textarea></label>'+
  '<label class="span-2">Fonte pública (opcional)<input type="url" name="source_url" placeholder="https://..."></label>'+
  '<p class="span-2 micro">Dados restritos ao workspace. Não inclua nomes privados, coordenadas ambientais sensíveis ou acusações não verificadas. Todo registro inicia como <b>não verificado</b>; não é publicado automaticamente no App.</p>'+
  '<button class="primary span-2" type="submit">Guardar na base territorial</button></form></details>';
}
export function renderTerritoryDashboard({state,readonly=()=>true}){
 const data=state.territoryReport?.data||HISTORICAL_REPORT;
 const s=data.lapinha,records=lapinhaEvidence(state);
 const selected=state.territoryEvidenceType||'todos';
 return '<section class="section-head"><div><span class="overline">ARESTA / INTELIGÊNCIA TERRITORIAL / PILOTO</span>'+
  '<h1>Gruta da Lapinha</h1>'+
  '<p>Parque Estadual do Sumidouro · Lagoa Santa, MG. Atlas, observatórios, memória, governança e impacto usando a mesma base de evidências.</p></div>'+
  button('Atualizar cadastro do ArestaDB','refresh')+'</section>'+
  '<div class="territory-hero"><div><span class="overline">VISÃO DO TERRITÓRIO</span>'+
  '<h2>Conhecimento compartilhado. Evidências rastreáveis. Devolutiva para a comunidade.</h2>'+
  '<p>O Aresta apoia documentação e participação — não autoriza intervenções, não substitui o IEF e não controla visitantes.</p></div>'+
  '<div><b>01</b><small>piloto territorial</small></div></div>'+
  '<section class="territory-status"><div class="territory-title"><div><h2>Atlas · estado documental</h2>'+
  '<p>Relatório do ArestaDB: '+E(data.reportDate)+' · '+E(data.origin)+'. Não equivale a dados de campo atualizados.</p></div>'+
  '<a href="'+STATUS_URL+'" target="_blank" rel="noopener noreferrer">Consultar fonte</a></div>'+
  '<div class="territory-kpis">'+
   stat('Escaladas no mapa · Lapinha',countText(s.routes),'Cobertura documental do arquivo, não segurança da via')+
   stat('Mapas dos setores · Lapinha',countText(s.sectorMaps),'Cobertura documental')+
   stat('Coordenadas de setores',countText(s.coordinates),'Lacuna técnica; acesso restrito pode ser intencional')+
   stat('Trilhas documentadas',countText(s.trails),'Não representa trilhas autorizadas')+'</div>'+
  '<p class="territory-footnote">Na mesma geração de relatório: '+E(data.published)+' de '+E(data.total)+
  ' croquis marcados como publicados e '+E(data.ready)+' prontos para publicação. São registros auditados pelo script, não um censo nacional.</p>'+
  (state.territoryReport?.error?'<p class="notice">A consulta mais recente não funcionou. Exibindo linha de base histórica: '+E(state.territoryReport.error)+'</p>':'')+
  '</section>'+
  '<section class="territory-layer"><div class="territory-title"><div><span class="overline">UMA BASE → SETE ENTREGAS</span>'+
  '<h2>Produtos de informação</h2><p>Cada categoria representa uma saída, não um aplicativo separado. Clique para ver suas evidências.</p></div>'+
  button('Mostrar todos','all')+'</div>'+
  renderProductCards(records,selected)+
  '<div class="territory-actions">'+
  '<a href="https://arestaclimb.com/editor" target="_blank" rel="noopener noreferrer">Abrir Editor · cadastro e revisão de vias</a>'+
  '<a href="https://github.com/aresta-climb/aresta_db/pulls" target="_blank" rel="noopener noreferrer">Consultar contribuições no ArestaDB</a></div>'+
  '</section>'+
  '<section class="territory-records">'+renderEvidenceList(records,selected)+renderEntryForm(readonly,selected)+'</section>'+
  '<section class="territory-governance"><div class="territory-title"><div><h2>Cooperação e responsabilidades</h2><p>Proposta para articulação — não são autorizações ou termos firmados.</p></div></div>'+
  '<div class="territory-actors">'+RESPONSIBILITIES.map(r=>'<article><b>'+E(r[0])+'</b><p>'+E(r[1])+'</p><small>'+E(r[2])+'</small></article>').join('')+'</div></section>'+
  '<section class="territory-method"><h2>Replicação: inventariar → documentar → monitorar</h2>'+
  '<p><b>Identificado:</b> referência de pico e fonte. <b>Documentado:</b> acesso/autoria e conteúdos autorizados com curadoria. <b>Monitorado:</b> observações, encaminhamentos, datas e evidências verificadas. Nenhum nível deve ser atribuído automaticamente somente por visualizações do app.</p>'+
  '<p class="micro">Privacidade: esta versão mantém os registros internos. Compartilhamento público, acesso institucional por UC/APA, localização sensível, pesquisa de uso e dados pessoais exigem políticas e permissões próprias.</p></section>';
}
export function installTerritoryHandlers(getCtx){
 document.addEventListener('click',async event=>{
  const btn=event.target.closest('[data-territory]');if(!btn)return;
  const {db,state,readonly,loadData,render}=getCtx();
  const action=btn.dataset.territory;
  if(action==='filter'){
   const v=btn.dataset.type;
   if(!PRODUCTS.some(p=>p.id===v))return;
   state.territoryEvidenceType=v;render();return;
  }
  if(action==='all'){state.territoryEvidenceType='todos';render();return;}
  if(action==='refresh'){
   if(state.territoryReport?.loading)return;
   state.territoryReport={...(state.territoryReport||{}),loading:true,error:null};render();
   try{
    const data=await fetchCroquiStatus();
    state.territoryReport={data,fetchedAt:new Date().toISOString(),loading:false,error:null};
   }catch(e){
    state.territoryReport={...(state.territoryReport||{}),loading:false,
      error:String(e.message||e)};
   }
   render();
  }
 });
 document.addEventListener('submit',async event=>{
  if(event.target.id!=='territory-evidence-form')return;
  event.preventDefault();
  const {db,state,ws,readonly,loadData,render}=getCtx();
  if(readonly()||!db||!ws()||!state.session?.user?.id)return;
  const fd=new FormData(event.target);
  const kind=String(fd.get('evidence_kind')||'');
  const title=String(fd.get('title')||'').trim();
  const summary=String(fd.get('summary')||'').trim();
  const date=String(fd.get('observed_date')||'');
  const source=String(fd.get('source_url')||'').trim();
  if(!PRODUCTS.some(p=>p.id===kind)||title.length<5||summary.length<12||!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
  if(source&&!safe(source)){state.error='Link de fonte inválido.';render();return;}
  if(!globalThis.crypto?.randomUUID){state.error='Gerador seguro de identificadores indisponível.';render();return;}
  const payload={
   workspace_id:ws(),source_system:'manual',source_collection:'Territórios / Lapinha',
   source_id:'lapinha-evidence-'+crypto.randomUUID(),source_url:source||null,
   record_kind:'evidence',title,summary,area:'Territórios',
   source_status:'NÃO VERIFICADO · REGISTRO INTERNO',
   properties:{territory_id:LAPINHA_ID,evidence_kind:kind,observed_date:date,
    recorded_at:new Date().toISOString(),recorded_by:state.session.user.id,
    verification:'unverified',visibility:'workspace_only'}
  };
  const {error}=await db.from('crm_knowledge_records').insert(payload);
  if(error){state.error='Não foi possível registrar evidência: '+error.message;render();return;}
  await loadData();state.notice='Registro salvo na base privada. A curadoria e a autorização de divulgação ainda são necessárias.';render();
 });
}
