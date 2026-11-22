import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMarketing,renderProduct,renderInsights,renderOpportunities} from '../src/workflows.js';
import {escapeHTML} from '../src/rules.js';

const base={contents:[],proposals:[],opportunities:[],metricSources:[],metricSnapshots:[]};
const ctx=(state={})=>({state:{...base,...state},esc:escapeHTML,readonly:()=>false});

test('Marketing permite criação e fluxo sem declarar publicação automática',()=>{
 const html=renderMarketing(ctx());
 assert.match(html,/id="content-form"/);
 assert.match(html,/Gerar estrutura/);
 assert.match(html,/Nunca publica automaticamente/);
});
test('Uma pauta externa deve ser escapada',()=>{
 const html=renderMarketing(ctx({contents:[{id:'x',title:'<script>alert(1)</script>',brand:'Aresta',channel:'Instagram',stage:'rascunho',caption:'teste',objective:'contexto',updated_at:'2026-11-22T12:00:00Z'}]}));
 assert.ok(!html.includes('<script>alert(1)</script>'));
 assert.ok(html.includes('&lt;script&gt;'));
});
test('Produto registra problemas e hipóteses sem auto merge',()=>{
 const html=renderProduct(ctx());
 assert.match(html,/id="proposal-form"/);
 assert.match(html,/Abrir Aresta Editor/);
});
test('Dados mostram ausência de medições sem inventar números',()=>{
 const html=renderInsights(ctx());
 assert.match(html,/Nenhum valor conferido/);
 assert.match(html,/id="metric-form"/);
});
test('Oportunidades têm coleta de fonte e podem virar tarefa',()=>{
 const html=renderOpportunities(ctx());
 assert.match(html,/id="opportunity-form"/);
 assert.match(html,/Pipeline de oportunidades/);
});
