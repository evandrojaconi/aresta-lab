import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCroquiStatus,renderTerritoryDashboard,lapinhaEvidence,PRODUCTS,HISTORICAL_REPORT} from '../src/territory-dashboard.js';

const cols=Array.from({length:30},(_,i)=>'Campo '+i);
cols[0]='Croqui';cols[1]='Publicado (31/52)';cols[2]='Pronto Publicar (1/52)';
cols[15]='2.1 Coords Setores (5/52)';cols[16]='2.2 Trilhas (0/52)';
const row=Array(30).fill('❌');
row[0]='br_mg_lagoa_santa_gruta_da_lapinha';row[1]='✅';row[2]='✅';
row[9]='✅ (1/1)';row[11]='✅ (10/10)';row[12]='✅ (132/132)';
row[15]='❌ (0/10)';row[16]='❌ (0/10)';row[23]='✅ (130/132)';
const markdown='# Estado de Saúde dos Croquis\n\nRelatório gerado em: 10/11/2026 23:20:01\n\n| '+cols.join(' | ')+' |\n| '+cols.map(()=> '---').join(' | ')+' |\n| '+row.join(' | ')+' |';

test('transforma relatório de croquis em leitura documental com data, sem visitas inventadas',()=>{
 const x=parseCroquiStatus(markdown);
 assert.equal(x.total,52);
 assert.equal(x.published,31);
 assert.equal(x.ready,1);
 assert.equal(x.reportDate,'10/11/2026');
 assert.deepEqual(x.coordsAll,{done:5,total:52});
 assert.deepEqual(x.trailsAll,{done:0,total:52});
 assert.deepEqual(x.lapinha.routes,{done:132,total:132});
 assert.deepEqual(x.lapinha.coordinates,{done:0,total:10});
 assert.deepEqual(x.lapinha.trails,{done:0,total:10});
 assert.deepEqual(x.lapinha.credits,{done:130,total:132});
});
test('se o relatório mudar de estrutura, recusa inventar dados',()=>{
 assert.throws(()=>parseCroquiStatus('file not found'),/sem estrutura reconhecida/);
});
test('sete produtos são derivados de uma única coleção de evidências privadas',()=>{
 assert.equal(PRODUCTS.length,7);
 const known={record_kind:'evidence',title:'Registro',summary:'Observação',properties:{
  territory_id:'br_mg_lagoa_santa_gruta_da_lapinha',evidence_kind:'socioambiental'
 }};
 assert.equal(lapinhaEvidence({knowledge:[known,{...known,properties:{...known.properties,territory_id:'outro'}},{record_kind:'project',properties:known.properties}]}).length,1);
 const html=renderTerritoryDashboard({state:{knowledge:[known],territoryEvidenceType:'socioambiental'},readonly:()=>true});
 assert.match(html,/Observatório socioambiental/);
 assert.match(html,/1 registro/);
 assert.match(html,/132\/132/);
 assert.match(html,/10\/11\/2026/);
 assert.doesNotMatch(html,/id="territory-evidence-form"/);
});
test('não expõe HTML de fontes, relatos ou scripts inseridos no banco',()=>{
 const rec={record_kind:'evidence',title:'<script>teste</script>',summary:'<img src=x onerror=alert(1)>',
  source_url:'javascript:alert(1)',properties:{territory_id:'br_mg_lagoa_santa_gruta_da_lapinha',evidence_kind:'atlas'}};
 const html=renderTerritoryDashboard({state:{knowledge:[rec]},readonly:()=>false});
 assert.match(html,/&lt;script&gt;/);
 assert.doesNotMatch(html,/<script>|<img src=x|href="javascript:/);
 assert.match(html,/id="territory-evidence-form"/);
});
test('diferencia linha de base histórica de dado ao vivo',()=>{
 assert.match(HISTORICAL_REPORT.origin,/histórico/);
 const html=renderTerritoryDashboard({state:{knowledge:[],territoryReport:{error:'Sem rede'}}});
 assert.match(html,/linha de base histórica/);
 assert.doesNotMatch(html,/visitação confirmada/i);
});
