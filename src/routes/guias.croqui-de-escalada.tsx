import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageHead, SITE_URL } from "@/lib/seo";

const TITLE = "O que é croqui de escalada e como usar | Aresta Climb";
const DESCRIPTION =
  "Croqui de escalada explicado: para que serve, como ler, por que precisa estar atualizado e como o uso offline reduz incerteza na rocha.";
const PATH = "/guias/croqui-de-escalada";

export const Route = createFileRoute("/guias/croqui-de-escalada")({
  head: () => {
    const base = pageHead({ title: TITLE, description: DESCRIPTION, path: PATH, ogType: "article" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: TITLE,
            description: DESCRIPTION,
            inLanguage: "pt-BR",
            url: `${SITE_URL}${PATH}`,
            author: { "@type": "Organization", name: "Aresta Climb" },
          }),
        },
      ],
    };
  },
  component: CroquiGuide,
});

function CroquiGuide() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="py-20 md:py-24">
        <article className="mx-auto w-[min(760px,92%)]">
          <nav aria-label="Trilha" className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="text-foreground">Guias</span>
          </nav>

          <header className="mt-6">
            <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
              Guia
            </span>
            <h1 className="mt-4 text-[clamp(34px,4.5vw,56px)] font-bold leading-[1.05] tracking-[-0.04em]">
              O que é croqui de escalada e como usar
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Croqui é a representação visual das vias de um pico: desenho da parede, linha das
              vias, grau, nome, pontos de proteção e informações de acesso. É o documento mais
              consultado antes de qualquer escalada outdoor.
            </p>
          </header>

          <div className="prose-aresta mt-10 space-y-6 text-foreground/90">
            <section>
              <h2 className="text-2xl font-bold">Para que serve um croqui</h2>
              <p className="mt-3 text-muted-foreground">
                O croqui responde, em segundos, o que um escalador precisa saber antes de subir:
                qual via está olhando, qual o grau, onde está cada parafuso ou ponto natural, e
                como descer com segurança. Sem croqui, a leitura da parede vira tentativa e erro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Por que ter o croqui atualizado importa</h2>
              <p className="mt-3 text-muted-foreground">
                Picos mudam. Conquistas novas, manutenção de chapas, fechamento de setores, mudança
                no acesso — tudo isso some quando o croqui circula apenas como PDF antigo ou print
                de WhatsApp. Informação desatualizada vira risco.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Croqui offline: por que é essencial</h2>
              <p className="mt-3 text-muted-foreground">
                Na base da rocha geralmente não há sinal de celular. Croqui offline significa
                poder consultar tudo sem internet — exatamente o que a maior parte dos apps de
                escalada cobra como recurso premium e o Aresta entrega como base.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Leituras relacionadas</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link to="/guias/croqui-offline" className="text-primary hover:underline">
                    Por que croqui offline muda o rolê
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guias/onde-escalar-em-belo-horizonte"
                    className="text-primary hover:underline"
                  >
                    Onde escalar perto de Belo Horizonte
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
