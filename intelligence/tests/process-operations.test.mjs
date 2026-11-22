import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMissionStreams,renderMissionHub,renderMissionToday} from '../src/process-operations.js';
const t=(id,title,track,priority='P1',status='pronto')=>({id,title,track,priority,status,next_action:'Realizar ação com fonte e responsável.',due_date:'2026-11-23'});
const c=(id,title,stage='revisao')=>({id,title,stage,channel:'Instagram',brand:'Aresta',objective:'Convidar a comunidade'});
const state={
 items:[t('l1','Conciliar estados informacionais da Lapinha','Dados'),
        t('m1','Publicar parceria Rupestre no Instagram','Marketing','P0'),
        t('p1','Entregar landing page Aresta','Produto','P0')],
 contents:[c('c1','Parceria Rupestre da Lapa — Instagram'),c('c2','Tutorial: como contribuir pelo Editor','aprovado')],
 contacts:[],touchpoints:[],proposals:[],opportunities:[],metricSnapshots:[],metricSources:[],
 editorSuggestions:{records:[],fetchedAt:null,loading:false},croquiProcesses:[],missionFlow:'visao'
};
test('processos agrupam as tarefas originais sem inventar conexões',()=>{
 const streams=buildMissionStreams(state);
 assert.equal(streams.comunicacao.tasks.length,1);
 assert.equal(streams.territorios.tasks[0].id,'l1');
 assert.equal(streams.produto.tasks.length,1);
 assert.equal(streams.dados.tasks.length,1);
 assert.equal(streams.colaboracao.notes[1].value,'—');
 assert.equal(streams.territorios.notes[1].value,0);
});
test('resumo aponta para tarefas e peças já existentes',()=>{
 const html=renderMissionToday({state});
 assert.match(html,/data-mission="open-task" data-id="m1"/);
 assert.match(html,/data-mission="open-task" data-id="l1"/);
 assert.match(html,/data-mission="open-content" data-id="c2"/);
 assert.doesNotMatch(html,/dados em tempo real/);
});
test('abertura de comunicação mostra peça exata sem fazer publicação',()=>{
 const html=renderMissionHub({state:{...state,missionFlow:'comunicacao'},readonly:()=>false});
 assert.match(html,/data-mission="open-content" data-id="c1"/);
 assert.match(html,/data-mission="open-task" data-id="m1"/);
 assert.match(html,/Status “aprovado” no CRM/);
 assert.doesNotMatch(html,/data-action="publish"/);
});
test('renderizações escapam nomes externos, sem executar texto HTML',()=>{
 const hostile={...state,items:[t('x1','<script>alert(1)</script>','Território')]};
 const html=renderMissionHub({state:{...hostile,missionFlow:'territorios'},readonly:()=>false});
 assert.match(html,/&lt;script&gt;/);
 assert.doesNotMatch(html,/<script>/);
});
test('estado vazio não simula relatórios ou organizações',()=>{
 const empty={items:[],contents:[],contacts:[],touchpoints:[],metricSnapshots:[],metricSources:[],
   editorSuggestions:{records:[],fetchedAt:null},croquiProcesses:[],proposals:[],opportunities:[],missionFlow:'visao'};
 const html=renderMissionHub({state:empty,readonly:()=>true});
 assert.match(html,/Nenhuma tarefa deste fluxo cadastrada|Nenhuma tarefa/);
 assert.match(html,/Central de processos/);
 assert.doesNotMatch(html,/API conectada/);
});
