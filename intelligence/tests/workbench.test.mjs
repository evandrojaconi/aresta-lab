import test from 'node:test';
import assert from 'node:assert/strict';
import {rankTasks,STATUS_LABELS} from '../src/rules.js';
import {renderCommandHome,renderTaskDrawer,renderCreativeShelf,renderFocusedContent,renderUXWorkbench,renderStrategicPulse,renderKnowledgeLibrary,renderConnectionCenter} from '../src/workbench.js';
const task={id:'task-1',title:'Adaptar publicação Rupestre para LinkedIn',next_action:'Abrir a pauta existente',status:'pronto',priority:'P0',track:'Marketing',due_date:'2026-11-23'};
const content={id:'content-1',title:'Parceria Rupestre — LinkedIn',stage:'revisao',channel:'LinkedIn',asset_url:'',caption:'Texto em edição',objective:'Apresentar parceria'};
const base=()=>({items:[task],contents:[content],taskContexts:[{work_item_id:'task-1',target_type:'content',target_id:'content-1'}],
 creativeAssets:[],reviewMarks:[],knowledge:[],metricSources:[],metricSnapshots:[],activeContentId:null,focusTaskId:null,previewView:'app'});
test('Hoje abre a fila como ação clicável',()=>{
 const html=renderCommandHome({state:base(),rankTasks,STATUS_LABELS});
 assert.match(html,/data-workbench="open-task"/);assert.match(html,/Adaptar publicação Rupestre/);
 assert.match(html,/Pulso do produto/);assert.doesNotMatch(html,/Sprint 0 · 23–27\/11/);
});
test('Tarefa traz caminho da pauta correta e conclusão rastreável',()=>{
 const s=base();s.focusTaskId='task-1';
 const html=renderTaskDrawer({state:s,STATUS_LABELS,readonly:()=>false});
 assert.match(html,/data-workbench="task-continue"/);assert.match(html,/Parceria Rupestre — LinkedIn/);
 assert.match(html,/data-workbench="task-done"/);
});
test('Pauta pode ser editada localmente e salva no CRM',()=>{
 const s=base();s.activeContentId='content-1';
 const html=renderFocusedContent({state:s,readonly:()=>false});
 assert.match(html,/id="edit-content-form"/);assert.match(html,/name="caption"/);assert.match(html,/Salvar edição/);
});
test('Catálogo organiza design validado sem alegar integração publicadora',()=>{
 const s=base();s.creativeAssets=[{id:'creative',kind:'design',label:'Feed Aresta',item_url:'https://www.canva.com/d/-ieTm-BrthtFrL7',category:'Instagram',provider_id:'DAHTZTPR9GI'}];
 const html=renderCreativeShelf({state:s});
 assert.match(html,/Feed Aresta/);assert.match(html,/data-workbench="attach-canva"/);
});
test('Produto usa screenshot histórica e não declara edição real do app',()=>{
 const html=renderUXWorkbench({state:base(),readonly:()=>false});
 assert.match(html,/Screenshot_20260601_073945/);assert.match(html,/Junho|junho/);assert.match(html,/data-workbench="mark-screen"/);assert.match(html,/id="review-mark-form"/);
});
test('Indicadores sem fonte não viram conversões inventadas',()=>{
 const html=renderStrategicPulse({state:base()});
 assert.match(html,/Kotler|KOTLER/);assert.match(html,/não constituem um funil/);
});
test('Biblioteca preserva origem e escapa conteúdo vindo de fonte externa',()=>{
 const s=base();s.knowledge=[{record_kind:'project',title:'<script>alert(1)</script>',summary:'Pesquisa',area:'Aresta',source_collection:'Portfólio',source_url:'https://notion.so/page'}];
 const html=renderKnowledgeLibrary({state:s});
 assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);assert.match(html,/notion.so/);
});
test('Conexões deixam claro limites de permissão',()=>{
 const html=renderConnectionCenter({state:base()});
 assert.match(html,/OAuth no servidor/);assert.match(html,/CRM: autorização pendente/);
});


test('GitHub usa liberação explícita de email Google, conta e repositório por admin',()=>{
  const state={...base(),membership:{role:'admin'},session:{user:{email:'owner@example.com',app_metadata:{providers:['email']}}},
    githubApprovals:[]};
  const html=renderConnectionCenter({state});
  assert.match(html,/id="github-approval-form"/);
  assert.match(html,/name="google_email"/);
  assert.match(html,/name="github_login"/);
  assert.match(html,/name="repository"/);
  assert.match(html,/Nenhuma conta ou repositório liberado/);
  assert.match(html,/API do GitHub automaticamente/);
});
test('Um membro não administrador não consegue gerenciar autorizações GitHub na UI',()=>{
  const state={...base(),membership:{role:'viewer'},session:{user:{email:'member@example.com',app_metadata:{providers:['google']}}},
    githubApprovals:[]};
  const html=renderConnectionCenter({state});
  assert.doesNotMatch(html,/id="github-approval-form"/);
  assert.match(html,/Somente administradores/);
});
