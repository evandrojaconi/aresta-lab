import test from 'node:test';
import assert from 'node:assert/strict';
import {escapeHTML, rankTasks, taskScore,buildAIPrompt} from '../src/rules.js';
test('conteúdo de usuário é escapado para HTML', () => {
  assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('prazo vencido P0 antecede tarefa sem prazo', () => {
  const past={title:'vencida',priority:'P0',status:'pronto',due_date:'2026-11-22'};
  const later={title:'outra',priority:'P1',status:'pronto',due_date:null};
  assert.equal(rankTasks([later,past],'2026-11-23')[0].title,'vencida');
  assert.ok(taskScore(past,'2026-11-23') > taskScore(later,'2026-11-23'));
});
test('concluídas não aparecem na triagem', () => {
  assert.equal(rankTasks([{title:'feito',priority:'P0',status:'concluido'}]).length,0);
});
test('prompt não envia campos sensíveis de contato', () => {
  const prompt=buildAIPrompt([{title:'LP',priority:'P0',status:'pronto',track:'Produto',email:'segredo@example.com'}]);
  assert.ok(prompt.includes('LP'));
  assert.ok(!prompt.includes('segredo@example.com'));
});
