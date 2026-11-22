import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeSuggestions,fetchArestaSuggestions,renderEditorCollaboration} from '../src/editor-collaboration.js';

const pr=(number,branch,state='closed',merged_at=null,title='Croqui atualizado')=>({
 number,title,head:{ref:branch},state,merged_at,updated_at:'2026-11-08T22:52:44Z'
});
test('PRs do Editor são distinguidas de automações de código',()=>{
 const result=normalizeSuggestions([
   pr(106,'ai-fix/issue-104','open'),
   pr(88,'edicao-br_mg_lagoa_santa_gruta_da_lapinha-f9b609d0','closed','2026-11-08T22:52:44Z'),
   pr(57,'edicao-br_mg_betim_pedreira_dr_gravata-6193d2b0','open'),
   pr(23,'edicao-br_mg_igarape_pedra_grande-0ed2b78e','closed')
 ],'2026-11-22T19:20:00Z');
 assert.equal(result.records.length,3);
 assert.equal(result.open,1);
 assert.equal(result.merged,1);
 assert.equal(result.closed,1);
 assert.equal(result.records[0].number,57);
 assert.equal(result.records[2].status,'fechada sem incorporação');
});
test('Títulos de PR são escapados, URLs são derivadas do número e sem token',()=>{
 const obj=normalizeSuggestions([pr(88,'edicao-lapinha','open',null,'<script>alert(1)</script>')],'2026-11-22T19:20:00Z');
 const html=renderEditorCollaboration({state:{editorSuggestions:obj},readonly:()=>false});
 assert.match(html,/&lt;script&gt;/);
 assert.doesNotMatch(html,/<script>/);
 assert.match(html,/https:\/\/github.com\/aresta-climb\/aresta_db\/pull\/88/);
 assert.match(html,/data-action="create-editor-followup"/);
 assert.doesNotMatch(html,/data-action="merge"/);
});
test('Consulta do GitHub em modo leitura não envia credenciais',async()=>{
 let call;
 const request=async(url,options)=>{
   call={url,options};return {ok:true,json:async()=>[pr(88,'edicao-lapinha','open')]};
 };
 const data=await fetchArestaSuggestions(request,()=> '2026-11-22T19:20:00Z');
 assert.equal(call.options.method,'GET');
 assert.ok(!Object.keys(call.options.headers).some(x=>x.toLowerCase()==='authorization'));
 assert.ok(call.url.includes('api.github.com'));
 assert.equal(data.open,1);
});
test('Não inventa dados antes de consultar',()=>{
 const html=renderEditorCollaboration({state:{editorSuggestions:{records:[],loading:false}}});
 assert.match(html,/Ainda não consultado/);
 assert.match(html,/—/);
});
