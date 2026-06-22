import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Cloud,
  Map,
  MapPin,
  Mountain,
  Plus,
  ShieldCheck,
  Users,
  WifiOff,
} from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageHead, SITE_URL, OG_IMAGE } from "@/lib/seo";

const TITLE = "Aresta Climb | Croquis e guias de escalada offline";
const DESCRIPTION =
  "Encontre croquis, acessos, previsão do tempo, setores e boas práticas para escalar com menos incerteza. Guias de escalada offline feitos com a comunidade.";

const faqItems = [
  {
    q: "Onde encontrar croqui de escalada?",
    a: "Croquis costumam circular em PDFs, imagens, grupos e guias locais. O problema é que muitas vezes ficam espalhados ou desatualizados. O Aresta nasce para organizar essas informações com foco em uso offline e colaboração da comunidade.",
  },
  {
    q: "Por que usar croqui offline?",
    a: "Muitos picos de escalada têm pouco ou nenhum sinal de celular. Ter croqui, acesso e informações básicas salvas antes de chegar na rocha reduz incerteza e melhora a segurança do rolê.",
  },
  {
    q: "Como saber se a rocha está boa para escalar?",
    a: "Clima, chuva recente, umidade, incidência de sol e vento influenciam a condição da rocha. Por isso, a ideia do Aresta é reunir previsão do tempo e informações locais para apoiar a decisão.",
  },
  {
    q: "Onde escalar perto de Belo Horizonte?",
    a: "Minas Gerais tem diferentes áreas de escalada e boulder, como Igarapé, Serra do Cipó, Ouro Preto e outros picos conhecidos pela comunidade. O Aresta pretende organizar essas informações por região, pico e setor.",
  },
  {
    q: "O Aresta já substitui um curso ou guia profissional?",
    a: "Não. O Aresta é uma ferramenta de informação e organização. Ele não substitui instrução técnica, curso de escalada, guia profissional ou avaliação de risco no local.",
  },
  {
    q: "A comunidade pode atualizar informações?",
    a: "A proposta é que croquis, acessos, setores e observações possam ser construídos com apoio da comunidade local, com curadoria para evitar informação errada.",
  },
];

export const Route = createFileRoute("/")({
  head: () => {
    const base = pageHead({ title: TITLE, description: DESCRIPTION, path: "/" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Aresta Climb",
            applicationCategory: "SportsApplication",
            operatingSystem: "Android, iOS",
            inLanguage: "pt-BR",
            url: `${SITE_URL}/`,
            image: OG_IMAGE,
            description:
              "Aplicativo de croquis de escalada com uso offline, informações de acesso, setores e contribuição da comunidade. Em fase de lançamento e testes.",
            releaseNotes: "Em fase de lançamento e testes fechados.",
            creator: { "@type": "Organization", name: "Aresta Climb" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  return (
    <div id="top" className="min-h-dvh bg-background text-foreground">
      <SiteHeader homeMode />
      <main>
        <Hero />
        <SearchQuestions />
        <PainSection />
        <SearchIntent />
        <Solution />
        <Flow />
        <PicosPreview />
        <AudienceTabs />
        <Trust />
        <Waitlist />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero py-24 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="container relative mx-auto grid w-[min(1120px,92%)] items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <div>
          <span className="font-display mb-5 inline-flex items-center gap-3 text-[11px] font-extrabold tracking-[0.22em] text-primary">
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
            Messy Middle da escalada
          </span>
          <h1 className="text-balance text-[clamp(44px,7vw,86px)] font-bold leading-[0.96] tracking-[-0.05em]">
            Menos incerteza. <span className="text-primary">Mais parede.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            Antes de ir para a rocha, todo escalador procura as mesmas respostas: croqui, acesso,
            clima, setor, segurança e informação confiável. O Aresta organiza isso em um só lugar.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#testar"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Quero testar <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#duvida"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-foreground/[0.04] px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Ver se esse problema é meu
            </a>
          </div>

          <p className="mt-5 max-w-md text-[13px] text-muted-foreground/80">
            Primeiro a dor. Depois a solução. Produto empurrado antes da hora é igual sapatilha
            apertada: até funciona, mas ninguém aguenta muito tempo.
          </p>
        </div>

        <aside
          aria-label="Decisão travada antes do rolê"
          className="rounded-[28px] border border-border bg-card/85 p-6 shadow-elegant backdrop-blur"
        >
          <header className="mb-5 flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
              Antes do rolê
            </span>
            <span className="rounded-full border border-border-strong bg-primary/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.09em] text-primary">
              Decisão travada
            </span>
          </header>

          <div className="mb-4 rounded-2xl border border-border bg-surface p-5">
            <strong className="block text-xl leading-tight">
              "Será que vale ir nesse pico?"
            </strong>
            <p className="mt-2 text-sm text-muted-foreground">
              A resposta hoje costuma estar espalhada entre WhatsApp, Google, Instagram, PDF
              antigo, clima e opinião da galera.
            </p>
          </div>

          <ol className="grid gap-2.5">
            {[
              ["1. Interesse", "vídeo / academia"],
              ["2. Procura", "dúvida"],
              ["3. Consideração", "risco"],
              ["4. Uso", "planejamento"],
            ].map(([title, hint], i) => {
              const active = i === 1;
              return (
                <li
                  key={title}
                  className={
                    "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm " +
                    (active
                      ? "border-border-strong bg-primary/10 text-foreground"
                      : "border-border bg-foreground/[0.04] text-muted-foreground")
                  }
                >
                  <span className="font-extrabold">{title}</span>
                  <span className={active ? "font-black text-primary" : "text-muted-foreground"}>
                    {hint}
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </section>
  );
}

/* ---------------- "Antes do app, a dúvida" ---------------- */

function SearchQuestions() {
  const questions = [
    "Tem croqui desse pico?",
    "A rocha está seca?",
    "Onde estaciona?",
    "Qual setor é melhor para começar?",
    "O croqui está atualizado?",
    "Dá para acessar offline?",
    "Tem sinal lá?",
  ];

  return (
    <section id="duvida" className="border-y border-border bg-surface py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <header className="max-w-2xl">
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            Antes do app, a dúvida
          </span>
          <h2 className="mt-4 text-[clamp(30px,4vw,52px)] font-bold leading-[1.05]">
            O escalador chega no Google com perguntas — não com produto na cabeça.
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            São as mesmas buscas, repetidas semana após semana, espalhadas em grupos de WhatsApp,
            stories antigos e PDFs perdidos no Drive.
          </p>
        </header>

        <ul className="mt-10 flex flex-wrap gap-3">
          {questions.map((q) => (
            <li
              key={q}
              className="rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground transition-colors hover:border-border-strong"
            >
              <span aria-hidden="true" className="mr-2 text-primary">”</span>
              {q}
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-2xl text-lg text-foreground">
          O Aresta nasce para organizar essas respostas em um só lugar — com croqui, acesso, clima,
          setores e informação da comunidade local.
        </p>
      </div>
    </section>
  );
}

/* ---------------- O problema real ---------------- */

function PainSection() {
  const pains = [
    "Perguntar no grupo",
    "Caçar PDF de croqui",
    "Ver print antigo",
    "Confirmar clima e rocha",
    "Torcer para o acesso estar certo",
  ];
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <header className="max-w-2xl">
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            O problema real
          </span>
          <h2 className="mt-4 text-[clamp(30px,4vw,52px)] font-bold leading-[1.05]">
            Hoje, para escalar em um pico novo, você junta pedaços de informação.
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Informação espalhada aumenta a dúvida. E dúvida vira rolê cancelado, decisão insegura
            ou aquela ida frustrada na rocha errada.
          </p>
        </header>

        <ol className="mt-10 grid gap-3 md:grid-cols-3 lg:grid-cols-5">
          {pains.map((p, i) => (
            <li
              key={p}
              className="min-h-[156px] rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-border-strong"
            >
              <span className="font-display text-[11px] font-black tracking-[0.16em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <strong className="mt-3 block text-[17px] font-bold leading-tight">{p}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- 5 cards de busca real (SEO intent) ---------------- */

function SearchIntent() {
  const items = [
    {
      icon: Map,
      title: "Croqui do pico",
      text: "PDF, print, guia antigo ou link perdido. A primeira busca quase sempre é pelo croqui.",
    },
    {
      icon: Cloud,
      title: "Condição do tempo",
      text: "Chuva, umidade, sol, vento e rocha molhada mudam completamente o rolê.",
    },
    {
      icon: MapPin,
      title: "Acesso e logística",
      text: "Como chegar, onde parar, qual trilha seguir e o que evitar.",
    },
    {
      icon: Mountain,
      title: "Setores e níveis",
      text: "Nem todo pico é óbvio para quem chega pela primeira vez.",
    },
    {
      icon: Users,
      title: "Comunidade local",
      text: "A informação mais importante quase sempre está com quem cuida do lugar.",
    },
  ];

  return (
    <section className="border-y border-border bg-surface py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <header className="max-w-2xl">
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            Busca real
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.6vw,48px)] font-bold leading-[1.08]">
            O que o escalador procura antes de sair de casa
          </h2>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border-strong"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary"
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <a
            href="#como-resolve"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-foreground hover:border-primary hover:text-primary"
          >
            Ver como o Aresta organiza isso <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Como resolve ---------------- */

function Solution() {
  const features = [
    { n: "1", title: "Picos e setores organizados", text: "Menos busca solta. Mais contexto para decidir." },
    { n: "2", title: "Croquis offline", text: "Informação útil mesmo quando o sinal some." },
    { n: "3", title: "Acesso e estacionamento", text: "Chegada mais clara, menos tempo perdido." },
    { n: "4", title: "Alertas locais", text: "Condições, acesso sensível e avisos importantes." },
    { n: "5", title: "Contribuição da comunidade", text: "Informação viva, validada por quem usa o território." },
    { n: "6", title: "Boas práticas", text: "Escalar melhor também é impactar menos." },
  ];
  return (
    <section id="como-resolve" className="py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)] grid gap-7 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="flex flex-col justify-between rounded-[28px] border border-border bg-card p-8">
          <div>
            <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
              Como resolve
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.4vw,42px)] font-bold leading-[1.1]">
              Tudo que você precisa antes e durante o rolê.
            </h2>
            <p className="mt-4 text-muted-foreground">
              O Aresta organiza a decisão. Não promete coragem, não substitui experiência e não faz
              milagre com rocha molhada. Ele reduz a fricção entre <em>querer ir</em> e{" "}
              <em>saber se vale ir</em>.
            </p>
          </div>
          <a
            href="#jornada"
            className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-primary px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:-translate-y-0.5"
          >
            Entender a jornada <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li
              key={f.title}
              className="rounded-2xl border border-border bg-foreground/[0.04] p-5"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 font-display text-sm font-black text-primary">
                {f.n}
              </span>
              <h3 className="mt-4 text-base font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Da dúvida ao pico ---------------- */

function Flow() {
  const steps = [
    ["01", "Descubra um pico"],
    ["02", "Veja setores"],
    ["03", "Salve offline"],
    ["04", "Consulte o croqui"],
    ["05", "Escale com mais clareza"],
    ["06", "Contribua depois"],
  ];
  return (
    <section id="jornada" className="border-y border-border bg-surface py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <header className="max-w-2xl">
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            Da dúvida ao pico
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08]">
            O site conduz a decisão, não despeja funcionalidade.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A lógica é sair do Messy Middle: reconhecer a dúvida, ganhar confiança, planejar e
            testar.
          </p>
        </header>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map(([n, label]) => (
            <li
              key={n}
              className="min-h-[120px] rounded-2xl border border-border bg-card p-5"
            >
              <span className="font-display text-[11px] font-black tracking-[0.14em] text-primary">
                {n}
              </span>
              <strong className="mt-3 block text-sm font-bold leading-snug">{label}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Picos preview ---------------- */

function PicosPreview() {
  const picos = [
    {
      to: "/picos/pedra-grande-igarape" as const,
      name: "Pedra Grande",
      place: "Igarapé · MG",
      live: true,
    },
    { to: "/picos" as const, name: "Pedra Rachada", place: "MG", live: false },
    { to: "/picos" as const, name: "Serra do Cipó", place: "MG", live: false },
    { to: "/picos" as const, name: "Ouro Preto", place: "MG", live: false },
  ];

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <header className="max-w-2xl">
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            Picos
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08]">
            Picos que já fazem parte da conversa
          </h2>
          <p className="mt-4 text-muted-foreground">
            Croquis, acesso, clima, setores e informações da comunidade em um só lugar.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picos.map((p) => (
            <li key={p.name}>
              <Link
                to={p.to}
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center justify-between">
                  <Mountain className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span
                    className={
                      "rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] " +
                      (p.live
                        ? "bg-primary/15 text-primary"
                        : "border border-border text-muted-foreground")
                    }
                  >
                    {p.live ? "Página ativa" : "Em construção"}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{p.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {p.place}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                  Ver pico <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Duas jornadas (toggle) ---------------- */

function AudienceTabs() {
  const [tab, setTab] = useState<"escalador" | "comunidade">("escalador");

  const data = {
    escalador: {
      quote: "Quero escalar mais, mas dá muito trabalho descobrir tudo.",
      desc: "Para o escalador progressivo, a barreira não é falta de vontade. É falta de clareza para decidir sem depender de alguém responder no grupo.",
      needs: [
        "Informação clara sobre croqui, acesso e vias",
        "Autonomia para decidir se vale ir",
        "Mais segurança e menos improviso",
        "Pertencimento à comunidade",
      ],
    },
    comunidade: {
      quote: "Quero proteger o pico e organizar quem chega.",
      desc: "Para quem cuida do território, o problema é manter informação correta circulando e canalizar a chegada de novos escaladores com responsabilidade.",
      needs: [
        "Curadoria de croquis e acessos",
        "Canal direto para alertas e fechamentos",
        "Boas práticas visíveis para quem chega",
        "Ponte para filiação e apoio local",
      ],
    },
  } as const;

  const active = data[tab];

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <header className="max-w-2xl">
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            Duas jornadas
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08]">
            Para quem quer escalar melhor. E para quem organiza o território.
          </h2>
        </header>

        <div role="tablist" aria-label="Jornadas" className="mt-8 flex flex-wrap gap-2">
          {(
            [
              ["escalador", "Quero escalar melhor"],
              ["comunidade", "Quero organizar uma comunidade"],
            ] as const
          ).map(([key, label]) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(key)}
                className={
                  "rounded-full border px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] transition-colors " +
                  (isActive
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border bg-foreground/[0.04] text-muted-foreground hover:text-foreground")
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-border bg-card p-8">
            <blockquote className="border-l-2 border-primary pl-4 text-2xl font-bold leading-tight tracking-tight">
              "{active.quote}"
            </blockquote>
            <p className="mt-5 text-muted-foreground">{active.desc}</p>
          </div>
          <div className="rounded-[28px] border border-border bg-card p-8">
            <h3 className="text-xl font-bold">O que essa pessoa precisa?</h3>
            <ul className="mt-5 grid gap-2.5">
              {active.needs.map((n) => (
                <li key={n} className="flex gap-3 text-muted-foreground">
                  <span aria-hidden="true" className="mt-1 text-primary">
                    •
                  </span>
                  <span className="text-foreground/90">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Trust ---------------- */

function Trust() {
  const items = [
    {
      icon: Users,
      title: "Comunidade",
      text: "Informações conectadas a pessoas que vivem o território.",
    },
    {
      icon: WifiOff,
      title: "Offline",
      text: "Uso pensado para a base da rocha, onde o sinal não costuma ajudar.",
    },
    {
      icon: ShieldCheck,
      title: "Responsabilidade",
      text: "Informação não substitui instrução, supervisão e decisão consciente.",
    },
  ];
  return (
    <section id="comunidade" className="border-y border-border bg-surface py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <header className="max-w-2xl">
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            Confiança
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08]">
            Construído com quem escala.
          </h2>
          <p className="mt-4 text-muted-foreground">
            O Aresta nasce a partir de comunidades reais, croquis existentes, grupos de escalada,
            demandas de campo e organização territorial.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-border bg-card p-6">
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary"
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Waitlist ---------------- */

function Waitlist() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section
      id="testar"
      className="border-y border-border py-20 md:py-24"
      style={{
        backgroundImage:
          "radial-gradient(circle at 40% 0%, color-mix(in oklab, var(--primary) 16%, transparent), transparent 32%)",
      }}
    >
      <div className="mx-auto w-[min(1120px,92%)] grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            Primeiros testadores
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08]">
            Entre na lista antes do próximo rolê.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Poucos campos. O suficiente para entender onde você escala e te chamar quando o teste
            fizer sentido.
          </p>
        </div>

        <div className="rounded-[28px] border border-border bg-card p-7 md:p-8">
          <h3 className="text-xl font-bold">Quero testar o Aresta</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastro de interesse para MVP, croquis, QR Codes e testes com a comunidade.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-6 grid gap-3.5"
            data-event="waitlist_submit"
            data-source="landing_home"
            data-project="aresta_climb"
            noValidate
          >
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Nome" id="name" name="name" required />
              <Field label="Cidade" id="city" name="city" required />
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="WhatsApp" id="whatsapp" name="whatsapp" inputMode="tel" />
              <Field label="E-mail" id="email" name="email" type="email" required />
            </div>
            <div>
              <label
                htmlFor="climbing_spot"
                className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground"
              >
                Onde você costuma escalar?
              </label>
              <input
                id="climbing_spot"
                name="climbing_spot"
                placeholder="Ex.: Pedra Grande, Cipó, ginásio em BH…"
                className="min-h-[48px] w-full rounded-2xl border border-border bg-background/70 px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:-translate-y-0.5"
            >
              Enviar interesse
            </button>

            <p className="text-xs text-muted-foreground/80">
              Modelo visual. Os dados ainda não são enviados — o formulário será conectado a um CRM
              em seguida.
            </p>

            {sent && (
              <p
                role="status"
                className="mt-2 rounded-2xl border border-[color-mix(in_oklab,var(--accent-sage)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent-sage)_18%,transparent)] p-4 text-sm text-foreground"
              >
                Interesse registrado neste modelo. Próximo passo: conectar o formulário ao CRM.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field(props: {
  label: string;
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  inputMode?: "tel" | "email" | "text";
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground"
      >
        {props.label}
      </label>
      <input
        id={props.id}
        name={props.name}
        type={props.type ?? "text"}
        required={props.required}
        inputMode={props.inputMode}
        className="min-h-[48px] w-full rounded-2xl border border-border bg-background/70 px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}

/* ---------------- FAQ ---------------- */

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 md:py-24">
      <div className="mx-auto w-[min(1120px,92%)]">
        <header className="max-w-2xl">
          <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
            Perguntas de quem está avaliando
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.08]">
            Antes de testar, faz sentido perguntar.
          </h2>
        </header>

        <ul className="mt-10 grid gap-3">
          {faqItems.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold text-foreground"
                >
                  <span>{f.q}</span>
                  <Plus
                    aria-hidden="true"
                    className={
                      "h-4 w-4 shrink-0 text-primary transition-transform " +
                      (isOpen ? "rotate-45" : "")
                    }
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    className="px-6 pb-6 text-sm text-muted-foreground"
                  >
                    {f.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
