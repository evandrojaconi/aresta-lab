export const STATUS = ['entrada','pronto','fazendo','aguardando','revisao','concluido','medido'];
export const STATUS_LABELS = {entrada:'Entrada',pronto:'Pronto',fazendo:'Em execução',aguardando:'Aguardando',revisao:'Revisão',concluido:'Concluído',medido:'Medido'};
export const PRIORITY = ['P0','P1','P2','P3'];
export const TRACKS = ['Produto','Dados','Growth','Comunidade','Marketing','Território','Parcerias','Operação'];
export const CLOSED = new Set(['concluido','medido']);
export const CHANNELS = ['WhatsApp','Instagram','LinkedIn','E-mail','Reunião','Discord','Outro'];

export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[ch]));

export function localDay(date = new Date()) {
  const y = date.getFullYear();
  return y + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
}
export function shortDate(s) {
  if (!s) return 'Sem data';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return match ? match[3]+'/'+match[2] : s;
}
export function taskScore(task, today=localDay()) {
  if (CLOSED.has(task.status)) return -999;
  const base = {P0:100,P1:70,P2:40,P3:10}[task.priority] ?? 0;
  const due = task.due_date ? Math.floor((new Date(task.due_date+'T12:00:00')-new Date(today+'T12:00:00'))/86400000) : null;
  const dateBoost = due===null ? 0 : due<0 ? 45 : due===0 ? 35 : due<=2 ? 20 : 0;
  const flowBoost = task.status === 'fazendo' ? 12 : task.status === 'revisao' ? 5 : task.status === 'aguardando' ? -12 : 0;
  return base + dateBoost + flowBoost;
}
export function rankTasks(tasks, today=localDay()) {
  return [...tasks].filter(t=>!CLOSED.has(t.status)).sort((a,b)=>taskScore(b,today)-taskScore(a,today) || (a.title??'').localeCompare(b.title??''));
}
export function buildAIPrompt(tasks, today=localDay()) {
  const selected=rankTasks(tasks,today).slice(0,10).map(t=>({
    tarefa:t.title, prioridade:t.priority, status:STATUS_LABELS[t.status]||t.status,
    area:t.track, prazo:t.due_date||'sem prazo', proxima_acao:t.next_action||'não definida',
    definicao_de_concluido:t.definition_of_done||'não definida'
  }));
  return ['Você é analista operacional do ARESTA Climb. Data local: '+today+'.',
    'Analise SOMENTE os registros fornecidos, distinguindo FATO, HIPÓTESE e RECOMENDAÇÃO.',
    'Não invente integração, prazo, aprovação ou tarefa concluída.',
    'Sugira no máximo 3 próximas ações com POR QUÊ, PARA QUÊ, COMO, responsável e definição de concluído.',
    'Considere que o fundador tem 4–6 horas por dia para Aresta e frentes associadas.',
    'Preserve publicação Rupestre 23/11 e a entrega da landing como prioridades declaradas.',
    'JSON de tarefas (sem contatos, e-mails ou credenciais):',JSON.stringify(selected,null,2)].join('\n\n');
}
