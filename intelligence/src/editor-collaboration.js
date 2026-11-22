// ArestaDB é fonte de verdade sobre PRs. Não há token de GitHub nem escrita remota.
// Um PR fechado sem merge NÃO é automaticamente uma rejeição do autor.
const ENDPOINT = 'https://api.github.com/repos/aresta-climb/aresta_db/pulls?state=all&per_page=100';
const DOC_EDITOR = 'https://arestaclimb.com/editor';
const isSuggestion = branch => /^(?:edicao[-_]|sugestao[-_])/i.test(String(branch||''));
const esc = value => String(value??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const date = value => value?new Date(value).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'}):'';

export function normalizeSuggestions(pulls, fetchedAt) {
 if(!Array.isArray(pulls))throw new Error('Formato de resposta inesperado.');
 const records = pulls.filter(p=>isSuggestion(p.head?.ref))
   .map(p=>{
     const number = Number(p.number);
     if(!Number.isSafeInteger(number)||number<1)return null;
     return {
       number, title:String(p.title||'Sem título').slice(0,260),
       branch:String(p.head.ref).slice(0,250),
       status:p.state==='open'?'aberta':p.merged_at?'incorporada':'fechada sem incorporação',
       updatedAt:p.updated_at||p.created_at||null,
       url:'https://github.com/aresta-climb/aresta_db/pull/'+number
     };
   }).filter(Boolean).sort((a,b)=>{
     const score=a.status==='aberta'?0:a.status==='incorporada'?1:2;
     const scoreB=b.status==='aberta'?0:b.status==='incorporada'?1:2;
     return score-scoreB || String(b.updatedAt).localeCompare(String(a.updatedAt));
   });
 return {
   records, fetchedAt,
   open:records.filter(x=>x.status==='aberta').length,
   merged:records.filter(x=>x.status==='incorporada').length,
   closed:records.filter(x=>x.status==='fechada sem incorporação').length,
   truncated:pulls.length===100,
   source:ENDPOINT
 };
}

export async function fetchArestaSuggestions(fetchFn=fetch,clock=()=>new Date().toISOString()) {
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
 try {
   const response=await fetchFn(ENDPOINT,{
     method:'GET',
     headers:{Accept:'application/vnd.github+json'},
     signal:controller.signal
   });
   if(!response.ok)throw new Error(response.status===403?'Consulta ao GitHub limitada; tente novamente mais tarde.':'GitHub indisponível (HTTP '+response.status+').');
   return normalizeSuggestions(await response.json(),clock());
 } finally {clearTimeout(timeout)}
}

export function renderEditorCollaboration({state,readonly=()=>true}) {
 const info=state.editorSuggestions||{};
 const rows=info.records||[];
 return '<section class="panel collaboration-panel">'+
   '<div class="panel-title"><div><span class="overline">APP → EDITOR → GITHUB → INTELLIGENCE</span>'+
   '<h2>Colaboração nos croquis</h2><p class="micro">Acompanhamento público das Pull Requests criadas pelo Editor. O GitHub permanece fonte oficial; o Intelligence não aprova nem mescla alterações.</p></div>'+
   '<button class="secondary" data-action="refresh-editor-prs"'+(info.loading?' disabled':'')+'>'+
     (info.loading?'Consultando…':'Atualizar sugestões')+'</button></div>'+
   (info.error?'<p class="notice">'+esc(info.error)+'</p>':'')+
   (info.fetchedAt?'<p class="micro">Consultado em '+esc(new Date(info.fetchedAt).toLocaleString('pt-BR'))+
     ' · somente leitura da API pública do GitHub. '+(info.truncated?'Consulta limitada aos 100 PRs mais recentes.':'')+'</p>':
     '<p class="micro">Ainda não consultado nesta sessão. Clique em “Atualizar sugestões” para buscar o estado atual.</p>')+
   '<div class="home-strip collaboration-stats">'+
     '<div class="small-metric"><b>'+esc(info.open??'—')+'</b><span>Em revisão</span></div>'+
     '<div class="small-metric"><b>'+esc(info.merged??'—')+'</b><span>Incorporadas</span></div>'+
     '<div class="small-metric"><b>'+esc(info.closed??'—')+'</b><span>Fechadas sem merge</span></div>'+
     '</div>'+
   (info.fetchedAt?'<div class="collaboration-list">'+
     (rows.length?rows.slice(0,15).map(x=>'<article class="collaboration-item"><div><span class="badge outline">'+esc(x.status)+'</span>'+
       '<h3>'+esc(x.title)+'</h3><p class="micro">PR #'+x.number+' · '+esc(date(x.updatedAt))+'</p></div>'+
       '<div class="actions-block"><a class="secondary" href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">Ver alteração no GitHub</a>'+
       (x.status==='aberta'&&!readonly()?'<button class="secondary" data-action="create-editor-followup" data-number="'+x.number+'">Criar acompanhamento</button>':'')+
       '</div></article>').join(''):'<div class="empty">Nenhuma sugestão de croqui encontrada nesta janela de 100 PRs.</div>')+
       '</div>':'')+
   '<div class="quick-links"><a href="'+DOC_EDITOR+'" target="_blank" rel="noopener noreferrer">Abrir Aresta Editor</a>'+
   '<a href="https://github.com/aresta-climb/aresta_db/pulls" target="_blank" rel="noopener noreferrer">Repositório de contribuições</a></div>'+
   '<p class="micro">PRs de manutenção de software e automações não entram nesta contagem. Ela não mede contribuições únicas, aprovação humana, croquis publicados no app ou qualidade da informação.</p></section>';
}
