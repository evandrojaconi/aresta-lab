const journeyLabels = {
  user: "Quero conhecer os croquis",
  author: "Quero revisar um croqui",
  beginner: "Estou começando na rocha",
  partner: "Quero apoiar o Aresta",
  contributor: "Quero contribuir com o Aresta",
};

const fieldLabels = {
  journey: "Caminho escolhido", name: "Nome", city: "Cidade / Estado", contact: "E-mail ou WhatsApp", message: "Mensagem",
  peak: "Pico ou croqui", found: "Encontrou no Aresta?", downloaded: "Conseguiu baixar?", offline: "Conseguiu abrir offline?",
  relation: "Relação com a obra ou o local", author_request: "Tipo de pedido", experience: "Experiência atual",
  intended_place: "Local que pretende conhecer", main_question: "Principal dúvida", organization: "Organização",
  support_type: "Forma de apoio", alignment: "O que conecta você ao Aresta", contribution: "Como quer contribuir", availability: "Disponibilidade real",
};

const conditionalTemplates = {
  user: `<div class="conditional-fields" aria-label="Perguntas para quem quer conhecer os croquis"><label><span>Pico procurado</span><input name="peak" placeholder="Qual pico você procura?"></label><div class="field-row three"><label><span>Encontrou no Aresta?</span><select name="found"><option value="">Selecione</option><option>Sim</option><option>Não</option><option>Ainda não procurei</option></select></label><label><span>Conseguiu baixar?</span><select name="downloaded"><option value="">Selecione</option><option>Sim</option><option>Não</option><option>Ainda não tentei</option></select></label><label><span>Abriu offline?</span><select name="offline"><option value="">Selecione</option><option>Sim</option><option>Não</option><option>Ainda não tentei</option></select></label></div></div>`,
  author: `<div class="conditional-fields" aria-label="Perguntas para autores e mantenedores"><label><span>Pico ou croqui</span><input name="peak" required placeholder="Qual conteúdo precisamos conferir?"></label><label><span>Sua relação com a obra ou o local</span><input name="relation" required placeholder="Autor, conquistador, mantenedor, associação..."></label><label><span>O que você precisa?</span><select name="author_request" required><option value="">Selecione</option><option>Correção</option><option>Revisão</option><option>Consentimento</option><option>Retirada</option><option>Outro</option></select></label></div>`,
  beginner: `<div class="conditional-fields" aria-label="Perguntas para quem está começando na rocha"><label><span>Experiência atual</span><select name="experience" required><option value="">Selecione</option><option>Nunca escalei na rocha</option><option>Já fui acompanhado</option><option>Escalo em academia</option><option>Já escalo na rocha</option></select></label><label><span>Local que pretende conhecer</span><input name="intended_place" placeholder="Se já tiver um local em mente"></label><label><span>Principal dúvida</span><input name="main_question" placeholder="O que você precisa entender primeiro?"></label></div>`,
  partner: `<div class="conditional-fields" aria-label="Perguntas para investidores e patrocinadores"><label><span>Empresa, instituição ou fundo</span><input name="organization" required placeholder="Quem você representa?"></label><label><span>Como imagina apoiar?</span><select name="support_type" required><option value="">Selecione</option><option>Investimento</option><option>Patrocínio</option><option>Apoio institucional</option><option>Apoio a um território ou evento</option><option>Quero entender as possibilidades</option></select></label><label><span>O que conecta você ao Aresta?</span><input name="alignment" required placeholder="Conte o interesse, propósito ou oportunidade que percebe"></label></div>`,
  contributor: `<div class="conditional-fields" aria-label="Perguntas para contribuidores"><label><span>Como quer contribuir?</span><select name="contribution" required><option value="">Selecione</option><option>Testar o aplicativo</option><option>Revisar informação</option><option>Design ou comunicação</option><option>Desenvolvimento</option><option>Apoiar um pico</option><option>Outra forma</option></select></label><label><span>Disponibilidade real</span><input name="availability" placeholder="Ex.: 1 hora por semana, uma revisão pontual..."></label></div>`,
};

const form = document.querySelector("#beta-form");
const journeySelect = document.querySelector("#journey");
const conditionalFields = document.querySelector("#conditional-fields");
const formStatus = document.querySelector("#form-status");

function selectJourney(journey) {
  if (!journeyLabels[journey]) return;
  journeySelect.value = journey;
  form.dataset.journey = journey;
  conditionalFields.innerHTML = conditionalTemplates[journey] || "";
  formStatus.textContent = "";
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-journey]");
  if (trigger) selectJourney(trigger.dataset.journey);
});

journeySelect.addEventListener("change", (event) => {
  const journey = event.target.value;
  form.dataset.journey = journey || "unselected";
  conditionalFields.innerHTML = conditionalTemplates[journey] || "";
  formStatus.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const journey = data.get("journey");
  const name = data.get("name");
  const details = [];
  for (const [key, value] of data.entries()) {
    if (key === "consent" || !String(value).trim()) continue;
    details.push(`${fieldLabels[key] || key}: ${key === "journey" ? journeyLabels[journey] : String(value)}`);
  }
  const subject = encodeURIComponent(`Contato ARESTA — ${journeyLabels[journey]} — ${name}`);
  const body = encodeURIComponent(["Olá, equipe ARESTA!", "", "Quero seguir pelo caminho abaixo:", "", ...details, "", "Autorizo o Aresta a usar estes dados somente para responder a este contato."].join("\n"));
  formStatus.textContent = "Mensagem preparada. Confirme o envio no seu aplicativo de e-mail para concluir.";
  window.location.href = `mailto:contato@arestaclimb.com?subject=${subject}&body=${body}`;
});
