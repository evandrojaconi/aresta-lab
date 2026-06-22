import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageHead } from "@/lib/seo";

const TITLE = "Perguntas frequentes | Aresta Climb";
const DESCRIPTION =
  "Dúvidas sobre croqui de escalada offline, condição da rocha, comunidade local e o aplicativo Aresta Climb.";

const items = [
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
  {
    q: "O app já está disponível?",
    a: "Está em fase de lançamento e testes fechados. Entre na lista de espera pela home para ser chamado quando o teste fizer sentido na sua região.",
  },
  {
    q: "Posso usar o Aresta em qualquer pico?",
    a: "A ideia é cobrir cada vez mais regiões com apoio da comunidade local. No começo, o foco é em picos de Minas Gerais, começando por Pedra Grande, em Igarapé.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => {
    const base = pageHead({ title: TITLE, description: DESCRIPTION, path: "/faq" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="py-20 md:py-24">
        <div className="mx-auto w-[min(820px,92%)]">
          <header className="max-w-2xl">
            <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
              FAQ
            </span>
            <h1 className="mt-4 text-[clamp(34px,4.5vw,56px)] font-bold leading-[1.05] tracking-[-0.04em]">
              Perguntas frequentes
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Tudo o que escaladores e comunidades costumam perguntar antes de testar o Aresta.
            </p>
          </header>

          <ul className="mt-10 grid gap-3">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faqp-panel-${i}`}
                    id={`faqp-trigger-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    data-event="faq_open"
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
                      id={`faqp-panel-${i}`}
                      role="region"
                      aria-labelledby={`faqp-trigger-${i}`}
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
      </main>
      <SiteFooter />
    </div>
  );
}
