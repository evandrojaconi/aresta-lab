import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveCroquiSteps,processFor,renderProcessCenter,renderProcessToday} from '../src/process-center.js';

const pr={number:88,title:'Lapinha',status:'incorporada',url:'https://github.com/aresta-climb/aresta_db/pull/88',updatedAt:'2026-11-08T22:52:44Z'};
const process={id:'c1',pr_number:88,source_repo:'aresta-climb/aresta_db',owner_label:'Equipe Aresta',
  next_action:'Confirmar distribuição',distribution_status:'nao_verificado',
  communication_content_id:null,followup_task_id:null,learning_note:'',review_note:''};
const base=()=>({editorSuggestions:{records:[pr],fetchedAt:'2026-11-22T16:30:00Z',open:0},
  croquiProcesses:[{...process}],contents:[],items:[],metricSnapshots:[],processFilter:'todos',processLimit:12});

test('Merge em GitHub não prova distribuição no App nem comunicação',()=>{
 const steps=deriveCroquiSteps(pr,process,null);
 assert.equal(steps[2].status,'incorporada');
 assert.equal(steps[3].status,'não verificada');
 assert.equal(steps[4].status,'sem pauta');
 assert.equal(steps[5].status,'sem medição');
});
test('Somente evidência explícita e pauta publicada mudam a leitura operacional',()=>{
 const caseReady={...process,distribution_status:'confirmado',distribution_evidence_url:'https://arestaclimb.com/croquis/lapinha',learning_note:'Relatório em avaliação'};
 const steps=deriveCroquiSteps(pr,caseReady,{stage:'publicado',published_url:'https://instagram.com/p/xxxx'});
 assert.equal(steps[3].status,'confirmação registrada');
 assert.equal(steps[4].status,'publicação registrada');
 assert.equal(steps[5].status,'registro qualitativo');
});
test('PR fechada sem merge não vira rejeição comprovada',()=>{
 const steps=deriveCroquiSteps({...pr,status:'fechada sem incorporação'},process,null);
 assert.equal(steps[1].status,'fechada sem merge');
 assert.match(steps[1].detail,/Não tratar encerramento como rejeição/);
 assert.equal(steps[2].status,'não incorporada');
});
test('CRM só vincula um processo ao workspace e repositório certo',()=>{
 const state=base();
 assert.equal(processFor(state,88)?.id,'c1');
 assert.equal(processFor(state,57),undefined);
 state.croquiProcesses[0].source_repo='other/repo';
 assert.equal(processFor(state,88),undefined);
});
test('Hub de processo é compacto e mantém o detalhe da contribuição escolhida',()=>{
 const html=renderProcessCenter({state:base(),readonly:()=>false});
 assert.match(html,/data-process="focus"/);
 assert.match(html,/data-process-form="88"/);
 assert.match(html,/Registrar etapas|Executar e registrar etapas/);
 assert.match(html,/Acompanhar|acompanhado/);
 assert.match(html,/não verificada/);
});
test('Títulos vindos do GitHub não executam HTML',()=>{
 const state=base();
 state.editorSuggestions.records[0]={...pr,title:'<img src=x onerror=alert(1)>'};
 const html=renderProcessCenter({state,readonly:()=>false});
 assert.doesNotMatch(html,/<img src=x/);
 assert.match(html,/&lt;img/);
});
test('Tela Hoje exibe estado com data de consulta e abre Processos',()=>{
 const html=renderProcessToday({state:base()});
 assert.match(html,/data-view="processos"/);
 assert.match(html,/Processos vivos|PROCESSOS VIVOS/);
});
test('PR fora da janela de 100 não apaga processo acompanhado',()=>{
 const state=base();state.editorSuggestions.records=[];
 const html=renderProcessCenter({state,readonly:()=>false});
 assert.match(html,/PR #88/);
 assert.match(html,/consultar GitHub/);
});
