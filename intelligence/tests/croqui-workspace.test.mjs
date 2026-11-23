import test from 'node:test';
import assert from 'node:assert/strict';
import {
 CROQUI_ID,parseCroquiIndex,parseCroquiSector,fetchLapinhaCatalog,renderCroquiWorkspace,buildMcpInstructions
} from '../src/croqui-workspace.js';
const main='# SPDX-License-Identifier: ODbL-1.0\nuid: 9jDSsMY9R5bPSY\nid: '+CROQUI_ID+
 '\nnome: Gruta da Lapinha\npicos:\n- nome: Gruta da Lapinha\n  setores_ou_grupos:\n  - setor:\n      caminho: setor_mapa_1.md\n  - setor:\n      caminho: setor_mapa_2.md\npublicar_croqui: true\n';
const sector1='---\nuid: pcQfnDIAUZk99g\nnome: Setor Castelinho\nmapas:\n- caminho_imagem_mapa: imagens/foto.webp\n  pontos_de_interesse:\n  - uid: POI1\nescaladas:\n- uid: GwiarHNNEXnfly\n  via_movel:\n    nome: Sai que é vaca\n    dificuldade: BR_6\n- uid: YJo7r0hFIoOXTZ\n  via_esportiva:\n    nome: Perrengue total\n    dificuldade: PROJETO\n    descricao: "**INTERDITADA:** Via inacabada"\n---\n';
const sector2='---\nuid: aa\nnome: Setor Mapa 2\nescaladas:\n- uid: VzHgiUIINvtKec\n  via_esportiva:\n    nome: O Exibicionista\n    dificuldade: BR_5\n    descricao: |-\n      **INTERDITADA:** parada precisa de revisão\n---\n';
test('YAML é aceito só para o croqui oficial e lista setores reais',()=>{
 const index=parseCroquiIndex(main);
 assert.equal(index.id,CROQUI_ID); assert.equal(index.name,'Gruta da Lapinha');
 assert.deepEqual(index.files,['setor_mapa_1.md','setor_mapa_2.md']);
 assert.equal(index.published,true);
 assert.throws(()=>parseCroquiIndex(main.replace(CROQUI_ID,'outro')),/não corresponde/);
});
test('setores retornam vias, UID estável, grau e avisos do arquivo',()=>{
 const out=parseCroquiSector('setor_mapa_1.md',sector1);
 assert.equal(out.name,'Setor Castelinho'); assert.equal(out.vias.length,2);
 assert.equal(out.vias[0].uid,'GwiarHNNEXnfly');
 assert.equal(out.vias[0].grade,'6');assert.equal(out.vias[0].restricted,false);
 assert.equal(out.vias[1].restricted,true);
 assert.equal(parseCroquiSector('setor_mapa_2.md',sector2).vias[0].restricted,true);
});
test('busca pública lê setor 1 e 2 e não inventa métricas de visitação',async()=>{
 const get=async(url)=>({
  ok:true,status:200,text:async()=>url.endsWith('croqui.yaml')?main:
   url.endsWith('setor_mapa_1.md')?sector1:sector2
 });
 const cat=await fetchLapinhaCatalog(get);
 assert.equal(cat.setores.length,2);assert.equal(cat.vias.length,3);
 assert.deepEqual(cat.errors,[]);assert.ok(cat.fetchedAt);
});
test('erro parcial no arquivo não vira catálogo completo',async()=>{
 const get=async url=>url.endsWith('setor_mapa_2.md')?{ok:false,status:503,text:async()=>''}:
  {ok:true,status:200,text:async()=>url.endsWith('croqui.yaml')?main:sector1};
 const cat=await fetchLapinhaCatalog(get);
 assert.equal(cat.setores.length,1);assert.equal(cat.files.length,2);
 assert.equal(cat.errors.length,1);
});
test('botões e filas usam dados do workspace e respeitam leitura',()=>{
 const cat={...parseCroquiIndex(main),setores:[parseCroquiSector('setor_mapa_1.md',sector1)],vias:parseCroquiSector('setor_mapa_1.md',sector1).vias.map(x=>({...x,sector:'Setor Castelinho'})),fetchedAt:'2026-11-22T20:00:00Z',errors:[]};
 const state={croquiCatalog:cat,croquiViewTab:'catalogo',croquiSector:'setor_mapa_1.md',items:[],contents:[]};
 const html=renderCroquiWorkspace({state,readonly:()=>true});
 assert.match(html,/Setor Castelinho/);assert.match(html,/Perrengue total/);
 assert.match(html,/data-croqui="via"/);assert.match(html,/Novo croqui/);
 const readonly=renderCroquiWorkspace({state:{...state,croquiViewTab:'atualizacoes'},readonly:()=>true});
 assert.doesNotMatch(readonly,/id="croqui-update-form"/);
 const edit=renderCroquiWorkspace({state:{...state,croquiViewTab:'atualizacoes'},readonly:()=>false});
 assert.match(edit,/id="croqui-update-form"/);assert.match(edit,/name="via_uid"/);
});
test('não insere HTML de título vindo de fonte externa no DOM',()=>{
 const bad=parseCroquiSector('setor_mapa_1.md',sector1.replace('Sai que é vaca','<script>alert(1)</script>'));
 const html=renderCroquiWorkspace({state:{croquiCatalog:{name:'Lapinha',files:['setor_mapa_1.md'],setores:[bad],vias:bad.vias.map(v=>({...v,sector:bad.name})),fetchedAt:new Date().toISOString(),errors:[]},croquiSector:'setor_mapa_1.md',croquiViewTab:'catalogo',items:[],contents:[]},readonly:()=>false});
 assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);
});
test('instrução MCP jamais executa alteração automaticamente',()=>{
 const text=buildMcpInstructions({croquiCatalog:null});
 assert.match(text,/aresta_abrir_croqui_existente|aresta_listar_croquis/);
 assert.match(text,/aprovação explícita/);assert.match(text,/Não executar alterações automaticamente/);
});
