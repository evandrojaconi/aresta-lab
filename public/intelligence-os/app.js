/**
 * ARESTA INTELLIGENCE OS — Protótipo isolado e sem serviços externos.
 * Tudo aqui é SIMULAÇÃO. Não carregar dados financeiros ou pessoais reais.
 *
 * Contrato futuro:
 * - aresta_db: croquis / setores / vias / versões (leitura autorizada)
 * - GitHub: issues e PRs públicas com proveniência
 * - Supabase: permissões, CRM e evidências restritas (via backend com RLS)
 * - observatorio: relatos voluntários, método e anonimização
 */
const DEMO = Object.freeze({
  territories: [
    { id:"lapinha", name:"Gruta da Lapinha", region:"Lagoa Santa · MG", type:"documentado", steward:"Curadoria a definir", rights:"Regras de gestão a verificar", records:4, overview:"Estudo demonstrativo de curadoria comunitária em território de relevância ambiental e cultural." },
    { id:"cipo", name:"Serra do Cipó", region:"Santana do Riacho · MG", type:"inventario", steward:"Curadoria a definir", rights:"Acesso e zonas sensíveis a verificar", records:1, overview:"Polo ilustrativo para um inventário descentralizado. A cobertura não representa levantamento oficial." },
    { id:"ouro", name:"Ouro Preto", region:"Ouro Preto · MG", type:"inventario", steward:"Curadoria a definir", rights:"Autorizações a verificar", records:1, overview:"Território ilustrativo para documentação cultural e ambiental." },
    { id:"arcos", name:"Arcos", region:"Centro-Oeste · MG", type:"documentado", steward:"Curadoria a definir", rights:"Revisão local pendente", records:2, overview:"Exemplo de catalogação técnica conectada a dados socioambientais." },
    { id:"araxa", name:"Araxá", region:"Triângulo/Alto Paranaíba · MG", type:"inventario", steward:"Curadoria a definir", rights:"Fontes e autoria a verificar", records:1, overview:"Exemplo de inventário sem informações técnicas validadas." },
  ],
  reviews: [
    {id:"d01",territoryId:"lapinha",title:"Ajustar uma marca no croqui",description:"A marca foi deslocada para corresponder ao início indicado na foto do setor fictício.",category:"croqui",field:"tracado",beforePosition:44,position:60,status:"pendente",date:"2026-11-21",origin:"simulado",author:"Colaborador fictício"},
    {id:"d02",territoryId:"lapinha",title:"Atualização ilustrativa de sinalização",description:"Relato demonstrativo sobre alteração hipotética em informações de acesso, sem coordenadas sensíveis.",category:"acesso",status:"pendente",date:"2026-11-20",origin:"simulado",author:"Colaborador fictício"},
    {id:"d03",territoryId:"cipo",title:"Crédito editorial de imagem",description:"Ajuste fictício de autoria em uma imagem de croqui.",category:"croqui",status:"pendente",date:"2026-11-19",origin:"simulado",author:"Colaborador fictício"},
    {id:"d04",territoryId:"arcos",title:"Descrição ilustrativa revisada",description:"Exemplo de sugestão que recebeu decisão de curadoria na simulação.",category:"croqui",status:"aprovada",date:"2026-11-18",origin:"simulado",author:"Colaborador fictício"},
    {id:"d05",territoryId:"lapinha",title:"Referência geográfica sem fonte",description:"Exemplo de proposta não incorporada porque não possuía documento de origem.",category:"ambiental",status:"rejeitada",date:"2026-11-17",origin:"simulado",author:"Colaborador fictício"},
  ],
  observations: [
    {id:"o01",territoryId:"lapinha",category:"croqui",description:"Relato ilustrativo de revisão técnica do croqui.",validated:false,date:"2026-11-21",origin:"simulado"},
    {id:"o02",territoryId:"arcos",category:"ambiental",description:"Registro fictício sobre necessidade de verificar sinalização.",validated:true,date:"2026-11-18",origin:"simulado"},
    {id:"o03",territoryId:"cipo",category:"comunidade",description:"Exemplo de contribuição para a memória do território.",validated:false,date:"2026-11-17",origin:"simulado"},
  ],
  projects: [
    {id:"p01",name:"Projeto de demonstração — Educação territorial",stage:"Proposta",authorized:null,raised:null,spent:null,source:null},
    {id:"p02",name:"Projeto de demonstração — Monitoramento colaborativo",stage:"Em análise (simulado)",authorized:null,raised:null,spent:null,source:null},
    {id:"p03",name:"Projeto de demonstração — Memória do montanhismo",stage:"Não submetido",authorized:null,raised:null,spent:null,source:null},
  ],
});
const state = {
  section:"visao-geral", territoryFilter:"todos", reviewFilter:"todos",
  alerts:[], lastSubmission:null, activeReview:null, draft:null, diffMode:"sobrepor",
  search:"", selectedTerritory:"lapinha",
  territories:structuredClone(DEMO.territories),
  reviews:structuredClone(DEMO.reviews),
  observations:structuredClone(DEMO.observations),
  projects:structuredClone(DEMO.projects),
};
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const byId=id=>document.getElementById(id);
const esc=(v)=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const territoryName=id=>state.territories.find(t=>t.id===id)?.name??"Não identificado";
const dateBR=d=>{const [y,m,day]=d.split("-");return `${day}/${m}/${y}`};
const labelStatus=s=>({pendente:"Pendente de curadoria",aprovada:"Aprovada na simulação",rejeitada:"Não incorporada",inventario:"Inventário",documentado:"Documentado (simulado)"})[s]||s;
const matches=q=>String(q||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(state.search.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase());
const countStatus=status=>state.reviews.filter(r=>r.status===status).length;

const fields = {
 inicio:{label:"Referência de início da via", benefit:"Ajuda quem chega à parede a encontrar a via e dá ao mantenedor um ponto de referência para revisar o croqui.", before:"Início sem referência no croqui demonstrativo."},
 tracado:{label:"Posição de uma marca no croqui", benefit:"Uma marca bem posicionada ajuda a comparar o desenho com a parede e facilita a conferência pelo mantenedor.", before:"Marca na posição original do desenho."},
 acesso:{label:"Caminho de acesso", benefit:"Ajuda a comunidade a seguir o acesso indicado e dá ao mantenedor contexto para atualizar as orientações do pico.", before:"Acesso sem a atualização proposta."},
 ambiental:{label:"Condição ambiental", benefit:"Ajuda quem cuida do pico a identificar mudanças e orientar o uso do setor.", before:"Sem observação ambiental registrada sobre este ponto."},
 comunidade:{label:"Memória do pico", benefit:"Preserva a história local e ajuda o mantenedor a conferir créditos e fontes.", before:"Sem o registro comunitário proposto."}
};
const fieldFor = item => fields[item.field] || fields[item.category] || fields.inicio;
const idFor = () => "demo-" + (state.reviews.length + 1);
const submissionStatus = {
 pendente:"Sugestão recebida pela curadoria.",
 aprovada:"Sugestão validada no teste.",
 rejeitada:"Sugestão encerrada sem incorporação no teste."
};

function triage(item){
 return item.field==="tracado"
  ? {label:"Alta",reason:"A proposta altera uma referência visual do croqui."}
  : {label:"Normal",reason:"A proposta complementa a informação do território."};
}

function renderAlerts(){
 const unread=state.alerts.filter(alert=>alert.status==="novo").length;
 byId("unreadCount").textContent=unread+" "+(unread===1?"novo":"novos");
 byId("alertItems").innerHTML=state.alerts.length?state.alerts.map(alert=>{
   const status={novo:"Novo",lido:"Lido",encerrado:"Encerrado"}[alert.status];
   const item=state.reviews.find(review=>review.id===alert.id);
   return '<article class="alert-entry"><div><strong>'+esc(item.title)+'</strong> <span class="tag">'+status+'</span>'+
    '<p>'+esc(territoryName(item.territoryId))+' · '+esc(alert.priority.label)+' · '+esc(alert.priority.reason)+'</p>'+
    '<small>Mantenedor de teste · '+esc(alert.channels.join(" + "))+' · '+esc(alert.mode)+'</small></div>'+
    '<button type="button" class="btn btn-quiet" data-open-review="'+esc(item.id)+'">Abrir revisão</button></article>';
 }).join(""):'<p class="footnote">As sugestões confirmadas nesta sessão aparecem aqui para o mantenedor do território.</p>';
}

function notifyMaintainer(item){
 const form=byId("alertPreferences");
 const priority=triage(item);
 const mode=form.elements.frequency.value;
 const channels=["Caixa de entrada"];
 if(mode!=="high"||priority.label==="Alta"){
   if(form.elements.email.checked)channels.push("E-mail");
   if(form.elements.discord.checked)channels.push("Discord");
 }
 state.alerts.unshift({id:item.id,status:"novo",priority,channels,
  mode:mode==="daily"&&channels.length>1?"Resumo diário simulado":"Prévia de alerta"});
}

function renderSubmissionStatus(){
 const item=state.reviews.find(review=>review.id===state.lastSubmission);
 const status=byId("contributionStatus");
 status.hidden=!item;
 status.textContent=item?submissionStatus[item.status]+" "+(item.status==="rejeitada"?"":fieldFor(item).benefit):"";
}

function toast(msg){
 const node=byId("toast");node.textContent=msg;node.classList.add("visible");
 clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>node.classList.remove("visible"),3400);
}
function navigate(section,updateHash=true){
 const allowed=["visao-geral","territorios","colaboracao","transparencia","impacto"];
 if(!allowed.includes(section))section="visao-geral";
 state.section=section;
 $$(".screen").forEach(el=>el.classList.toggle("active",el.id===`section-${section}`));
 $$(".nav-link").forEach(el=>{
   const on=el.dataset.section===section; el.classList.toggle("active",on);
   if(on)el.setAttribute("aria-current","page"); else el.removeAttribute("aria-current");
 });
 byId("breadcrumbCurrent").textContent=({"visao-geral":"Visão geral",territorios:"Territórios",colaboracao:"Colaboração",transparencia:"Transparência",impacto:"Impacto"})[section];
 byId("shell").classList.remove("menu-open");
 byId("menuBtn").setAttribute("aria-expanded","false");
 if(updateHash && location.hash.slice(1)!==section)history.replaceState(null,"",`#${section}`);
 render();
 window.scrollTo({top:0,behavior:"smooth"});
}
function metric(label,n,foot){
 return `<article class="metric"><span class="metric-label">${esc(label)}</span><span class="metric-number">${esc(n)}</span><span class="metric-foot">${esc(foot)}</span></article>`;
}
function renderOverview(){
 byId("overviewMetrics").innerHTML=[
   metric("Territórios na amostra",state.territories.length,"Todos os cadastros são simulados"),
   metric("Sugestões para curadoria",countStatus("pendente"),"Não enviadas ao GitHub"),
   metric("Observações demonstrativas",state.observations.length,"Não representam visitas"),
   metric("Decisões registradas",state.reviews.length-countStatus("pendente"),"Apenas nesta sessão")
 ].join("");
 const rows=[...state.reviews].slice().reverse().slice(0,4).reverse();
 byId("activityList").innerHTML=rows.map(r=>`
  <div class="timeline-item"><span class="timeline-symbol ${r.status==="pendente"?"orange":""}"></span>
  <div><p><strong>${esc(r.title)}</strong> · ${esc(territoryName(r.territoryId))}</p>
  <small>${esc(labelStatus(r.status))} · ${esc(dateBR(r.date))} · Fonte simulada</small></div></div>`).join("");
}
function renderTerritories(){
 const areas=state.territories.filter(t=>(state.territoryFilter==="todos"||state.territoryFilter===t.type)&&matches(`${t.name} ${t.region} ${t.overview}`));
 byId("territoryCards").innerHTML=areas.length?areas.map(t=>`
  <button class="territory-card ${state.selectedTerritory===t.id?"selected":""}" data-territory="${esc(t.id)}" aria-pressed="${state.selectedTerritory===t.id}">
  <small>INTELIGÊNCIA / MG</small><h3>${esc(t.name)}</h3><p>${esc(t.region)}</p>
  <div class="card-bottom"><span class="tag ${t.type==="documentado"?"green":""}">${esc(labelStatus(t.type))}</span><span aria-hidden="true">↗</span></div></button>`).join(""):`<div class="empty-state">Nenhum território encontrado para esse filtro.</div>`;
 let t=state.territories.find(t=>t.id===state.selectedTerritory);
 if(t&&!areas.some(x=>x.id===t.id))t=areas[0];
 byId("territoryDetails").innerHTML=t?`
  <div class="eyebrow">DETALHE TERRITORIAL / EXEMPLO</div>
  <h3>${esc(t.name)}</h3><p>${esc(t.overview)}</p>
  <div class="detail-meta"><span class="tag">${esc(t.region)}</span><span class="tag orange">Dados demonstrativos</span></div>
  <div class="detail-data">
    <div><span>ESTADO DE CURADORIA</span><strong>${esc(labelStatus(t.type))}</strong></div>
    <div><span>REFERÊNCIA DE RESPONSÁVEL</span><strong>${esc(t.steward)}</strong></div>
    <div><span>REGRAS DE PUBLICAÇÃO</span><strong>${esc(t.rights)}</strong></div>
  </div><button type="button" class="btn btn-quiet" data-contribute="${esc(t.id)}">Sugerir atualização</button>
  `:`<p>Nenhum território selecionado.</p>`;
}
function renderReviews(){
 byId("navCount").textContent=countStatus("pendente");
 const list=state.reviews.filter(r=>(state.reviewFilter==="todos"||r.status===state.reviewFilter)&&matches(`${r.title} ${r.description} ${territoryName(r.territoryId)} ${r.category}`));
 byId("reviewItems").innerHTML=list.length?list.map(r=>`
   <article class="review-card">
      <div class="review-content"><span class="tag ${r.status==="aprovada"?"green":r.status==="rejeitada"?"":"orange"}">${esc(labelStatus(r.status))}</span>
      <h3>${esc(r.title)}</h3><p>${esc(r.description)}</p>
      <div class="review-meta">${esc(territoryName(r.territoryId))} · ${esc(r.category)} · ${esc(dateBR(r.date))} · ${esc(r.author)} · <strong>simulado</strong></div></div>
      <div class="review-actions"><button type="button" class="btn ${r.status==="pendente"?"btn-primary":"btn-quiet"}" data-open-review="${esc(r.id)}">${r.status==="pendente"?"Revisar sugestão":"Ver devolutiva"}</button></div>
   </article>`).join(""):`<div class="empty-state">Nenhuma sugestão nessa visualização.</div>`;
}
function renderProjects(){
 byId("projectsBody").innerHTML=state.projects.filter(p=>matches(`${p.name} ${p.stage}`)).map(p=>`
  <tr><td>${esc(p.name)}</td><td><span class="tag">${esc(p.stage)}</span></td>
  <td>Não informado</td><td>Não informado</td><td>Não informado</td>
  <td><span class="tag orange">Sem fonte oficial</span></td></tr>`).join("")||`<tr><td colspan="6">Nenhum projeto encontrado.</td></tr>`;
}
function renderImpact(){
 const validated=state.observations.filter(o=>o.validated).length, total=state.observations.length;
 const decided=state.reviews.filter(r=>r.status!=="pendente").length;
 byId("impactMetrics").innerHTML=[
   metric("Taxa de decisão de sugestões",`${Math.round(100*decided/Math.max(1,state.reviews.length))}%`,"Sobre amostra simulada"),
   metric("Observações curadas",validated,"Não há medição de visitação"),
   metric("Sugestões com decisão",decided,"Decisões locais de demonstração"),
   metric("Fontes financeiras oficiais","0","Nenhuma fonte real carregada")
 ].join("");
 const bars=[
   ["Observações validadas",validated,total],
   ["Sugestões decididas",decided,state.reviews.length],
   ["Projetos com fonte verificável",0,state.projects.length],
 ];
 byId("qualityBars").innerHTML=bars.map(([title,n,d])=>`
  <div class="quality-row"><div class="quality-label"><span>${esc(title)}</span><span>${n}/${d}</span></div>
  <div class="bar" role="progressbar" aria-label="${esc(title)}" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="${d}"><span style="width:${Math.round(100*n/Math.max(1,d))}%"></span></div></div>`).join("");
}
function render(){
 renderOverview();renderTerritories();renderReviews();renderProjects();renderImpact();renderAlerts();renderSubmissionStatus();
}
function renderSuggestionFields(){
 const category=byId("obsCategory").value;
 const field=fields[category==="croqui"?byId("croquiField").value:category];
 const moving=category==="croqui"&&byId("croquiField").value==="tracado";
 byId("croquiFields").hidden=category!=="croqui";
 byId("editPosition").hidden=!moving;
 byId("draftMarker").style.setProperty("--point",byId("obsPosition").value+"%");
 byId("fieldBenefit").textContent=field.benefit;
 byId("descriptionLabel").textContent=moving?"Motivo da correção":field.label;
 byId("obsDescription").placeholder=moving?"Indique o que você conferiu na imagem da via.":"Inclua uma referência do local ou da fonte.";
 byId("obsDescription").setCustomValidity("");
}

function showVerification(visible){
 byId("suggestionFields").hidden=visible;
 byId("verificationForm").hidden=!visible;
 byId("verificationError").textContent="";
 byId("observation-title").textContent=visible?"Confirme o envio":"Enviar sugestão";
 if(visible){byId("verificationForm").reset();byId("verificationCode").focus();}
 else byId("obsCategory").focus();
}

function openContribution(territoryId){
 byId("observationForm").reset();
 byId("obsTerritory").value=territoryId||state.selectedTerritory;
 state.draft=null;
 renderSuggestionFields();
 byId("observationDialog").showModal();
 showVerification(false);
}

function openReview(id){
 const item=state.reviews.find(review=>review.id===id);
 if(!item)return;
 const alert=state.alerts.find(entry=>entry.id===id);
 if(alert?.status==="novo") {
   alert.status="lido";
   const status=byId("alertItems").querySelector('[data-alert-status="'+id+'"]');
   if(status)status.textContent="Lido";
   const unread=state.alerts.filter(entry=>entry.status==="novo").length;
   byId("unreadCount").textContent=unread+" "+(unread===1?"novo":"novos");
 }
 state.activeReview=id;
 state.diffMode="sobrepor";
 renderReviewDetail();
 byId("reviewDialog").showModal();
 byId("review-title").focus();
}

function renderReviewDetail(){
 const item=state.reviews.find(review=>review.id===state.activeReview);
 if(!item)return;
 const field=fieldFor(item), priority=triage(item);
 const modes=[["antes","Antes"],["depois","Depois"],["sobrepor","Sobrepor"]];
 let diff="";
 if(Number.isFinite(item.position)){
   const positionText=state.diffMode==="antes"?"Original na posição "+item.beforePosition+"%":
     state.diffMode==="depois"?"Proposta na posição "+item.position+"%":
     "Original na posição "+item.beforePosition+"%. Proposta na posição "+item.position+"%.";
   diff='<div class="segmented" role="group" aria-label="Visualização do croqui">'+modes.map(([mode,label])=>
    '<button type="button" class="seg '+(mode===state.diffMode?"active":"")+'" aria-pressed="'+(mode===state.diffMode)+'" data-diff-mode="'+mode+'">'+label+'</button>').join("")+'</div>'+
    '<div class="diff-wall" role="img" aria-label="'+esc(positionText)+'">'+
    (state.diffMode!=="depois"?'<span class="diff-marker original" style="--point:'+item.beforePosition+'%"></span>':"")+
    (state.diffMode!=="antes"?'<span class="diff-marker proposed" style="--point:'+item.position+'%"></span>':"")+
    '</div><div class="diff-legend"><span class="old">● Original</span><span class="new">◆ Proposta</span></div>';
 }
 byId("reviewDetail").innerHTML='<p><strong>'+esc(item.title)+'</strong> · '+esc(territoryName(item.territoryId))+'</p>'+
  '<p class="review-meta">'+esc(priority.label)+" · "+esc(priority.reason)+'</p>'+
  diff+'<div class="diff-text"><div><strong>Antes</strong><p>'+esc(item.before||field.before)+'</p></div>'+
  '<div><strong>Proposta</strong><p>'+esc(item.description)+'</p></div></div>'+
  '<p class="field-benefit">'+esc(field.benefit)+'</p>'+
  (item.status==="pendente"?'<p class="dialog-note">Prévia da revisão do mantenedor no Editor. Decisões de teste ficam nesta sessão.</p>'+
  '<div class="dialog-actions"><button type="button" class="btn btn-quiet" data-decision="rejeitada">Não incorporar</button>'+
  '<button type="button" class="btn btn-primary" data-decision="aprovada">Aprovar no teste</button></div>':
  '<p class="tag">'+esc(labelStatus(item.status))+'</p>');
}

function saveDecision(decision){
 const item=state.reviews.find(review=>review.id===state.activeReview);
 if(item?.status!=="pendente"||!["aprovada","rejeitada"].includes(decision))return;
 item.status=decision;
 const observation=state.observations.find(entry=>entry.id===item.id);
 if(observation)observation.validated=decision==="aprovada";
 const alert=state.alerts.find(entry=>entry.id===item.id);
 if(alert)alert.status="encerrado";
 byId("reviewDialog").close();
 render();
 byId("reviewItems").querySelector('[data-open-review="'+item.id+'"]')?.focus();
 toast(submissionStatus[decision]);
}

function init(){
 $$("[data-section]").forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.section)));
 document.addEventListener("click",ev=>{
   const nav=ev.target.closest("[data-navigate]");if(nav)navigate(nav.dataset.navigate);
   const card=ev.target.closest("[data-territory]");
   if(card){state.selectedTerritory=card.dataset.territory;renderTerritories();}
   const contribute=ev.target.closest("[data-contribute]");
   if(contribute)openContribution(contribute.dataset.contribute);
   const review=ev.target.closest("[data-open-review]");
   if(review)openReview(review.dataset.openReview);
   const mode=ev.target.closest("[data-diff-mode]");
   if(mode){
     state.diffMode=mode.dataset.diffMode;
     renderReviewDetail();
     byId("reviewDetail").querySelector('[data-diff-mode="'+state.diffMode+'"]').focus();
   }
   const decision=ev.target.closest("[data-decision]");
   if(decision)saveDecision(decision.dataset.decision);
   const close=ev.target.closest("[data-close]");
   if(close){const d=byId(close.dataset.close);if(d?.open)d.close();}
 });
 $$("[data-territory-filter]").forEach(btn=>btn.addEventListener("click",()=>{
   state.territoryFilter=btn.dataset.territoryFilter;
   $$("[data-territory-filter]").forEach(b=>{const on=b===btn;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));});
   renderTerritories();
 }));
 $$("[data-review-filter]").forEach(btn=>btn.addEventListener("click",()=>{
   state.reviewFilter=btn.dataset.reviewFilter;
   $$("[data-review-filter]").forEach(b=>{const on=b===btn;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));});
   renderReviews();
 }));
 const search=byId("searchInput");
 search.addEventListener("input",()=>{state.search=search.value.trim();if(state.search&&state.section==="visao-geral")navigate("territorios");render();});
 document.addEventListener("keydown",ev=>{
   if(ev.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)){ev.preventDefault();search.focus();}
   if(ev.key==="Escape")byId("shell").classList.remove("menu-open");
 });
 byId("menuBtn").addEventListener("click",()=>{
   const open=byId("shell").classList.toggle("menu-open");
   byId("menuBtn").setAttribute("aria-expanded",String(open));
 });
 const obsTerritory=byId("obsTerritory");
 obsTerritory.innerHTML=state.territories.map(t=>`<option value="${esc(t.id)}">${esc(t.name)}</option>`).join("");
 byId("newObservationBtn").addEventListener("click",()=>openContribution());
 byId("addTerritoryBtn").addEventListener("click",()=>toast("Cadastro de territórios requer integração e curadoria. Esta demonstração é somente leitura nessa seção."));
 byId("openMethodBtn").addEventListener("click",()=>byId("methodDialog").showModal());
 for(const id of ["obsCategory","croquiField","obsPosition"])
   byId(id).addEventListener(id==="obsPosition"?"input":"change",renderSuggestionFields);
 byId("obsDescription").addEventListener("input",()=>byId("obsDescription").setCustomValidity(""));
 byId("backToSuggestion").addEventListener("click",()=>showVerification(false));
 byId("observationForm").addEventListener("submit",ev=>{
   ev.preventDefault();
   const input=byId("obsDescription"),description=input.value.trim();
   if(description.length<10){
     input.setCustomValidity("Inclua pelo menos 10 caracteres para contextualizar a sugestão.");
     input.reportValidity();
     return;
   }
   const category=byId("obsCategory").value;
   const field=category==="croqui"?byId("croquiField").value:category;
   const position=field==="tracado"?Number(byId("obsPosition").value):null;
   if(position===44){
     toast("Escolha uma posição diferente da original para comparar as marcas.");
     byId("obsPosition").focus();
     return;
   }
   state.draft={territoryId:obsTerritory.value,description,category,field,position};
   showVerification(true);
 });
 byId("verificationForm").addEventListener("submit",ev=>{
   ev.preventDefault();
   if(!state.draft)return;
   if(byId("verificationCode").value!=="123456"){
     byId("verificationError").textContent="Confira o código de teste: 123456.";
     return;
   }
   const draft=state.draft;
   const duplicate=state.reviews.find(item=>item.territoryId===draft.territoryId&&item.field===draft.field&&
     item.position===draft.position&&item.description===draft.description);
   if(!duplicate){
     const item={...draft,id:idFor(),title:fields[draft.field].label,status:"pendente",date:new Date().toISOString().slice(0,10),
       origin:"simulado",author:"Colaborador demonstrativo",before:fields[draft.field].before,beforePosition:44};
     state.reviews.unshift(item);
     state.observations.unshift({id:item.id,territoryId:item.territoryId,category:item.category,description:item.description,
       validated:false,date:item.date,origin:"simulado"});
     notifyMaintainer(item);
     state.lastSubmission=item.id;
   }else state.lastSubmission=duplicate.id;
   state.draft=null;
   byId("observationDialog").close();
   byId("searchInput").value="";
   state.search="";
   $("[data-review-filter='todos']").click();
   navigate("colaboracao");
   byId("collaboration-title").setAttribute("tabindex","-1");
   byId("collaboration-title").focus();
   toast(duplicate?"Esta sugestão já consta na fila.":"Sugestão confirmada. A curadoria já pode revisar nesta sessão.");
 });
 byId("exportBtn").addEventListener("click",()=>{
   const data={_warning:"DADOS TOTALMENTE SIMULADOS; sem conexão com sistemas reais.",_schema:"aresta-intelligence-os-demo-v0.2",exportedAt:new Date().toISOString(),territories:state.territories,reviews:state.reviews,observations:state.observations,projects:state.projects,alerts:state.alerts};
   const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
   const url=URL.createObjectURL(blob);const a=document.createElement("a");
   a.href=url;a.download="aresta-intelligence-os-DADOS-SIMULADOS.json";
   document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
   toast("Exportação de dados SIMULADOS concluída.");
 });
 window.addEventListener("hashchange",()=>navigate(location.hash.slice(1),false));
 navigate(location.hash.slice(1)||"visao-geral",false);
}
init();
