import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mountain } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageHead, SITE_URL } from "@/lib/seo";

const TITLE = "Picos de escalada em Minas Gerais | Aresta Climb";
const DESCRIPTION =
  "Hub de picos de escalada em Minas Gerais: croquis, acesso, setores e informações da comunidade local — começando por Pedra Grande, em Igarapé.";

const picos = [
  {
    slug: "pedra-grande-igarape",
    name: "Pedra Grande",
    place: "Igarapé · MG",
    summary:
      "Área de boulder e escalada esportiva em Igarapé, com setores variados e acesso por estrada de terra.",
    live: true,
  },
  { slug: "pedra-rachada", name: "Pedra Rachada", place: "MG", summary: "Em construção.", live: false },
  { slug: "serra-do-cipo", name: "Serra do Cipó", place: "MG", summary: "Em construção.", live: false },
  { slug: "ouro-preto", name: "Ouro Preto", place: "MG", summary: "Em construção.", live: false },
];

export const Route = createFileRoute("/picos/")({
  head: () => {
    const base = pageHead({ title: TITLE, description: DESCRIPTION, path: "/picos" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Picos", item: `${SITE_URL}/picos` },
            ],
          }),
        },
      ],
    };
  },
  component: PicosIndex,
});

function PicosIndex() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="py-20 md:py-24">
        <div className="mx-auto w-[min(1120px,92%)]">
          <nav aria-label="Trilha" className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="text-foreground">Picos</span>
          </nav>

          <header className="mt-6 max-w-3xl">
            <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
              Hub de picos
            </span>
            <h1 className="mt-4 text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-0.04em]">
              Picos de escalada em Minas Gerais
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              O Aresta organiza croqui, acesso, setores e informações locais por pico. Começamos
              pela Pedra Grande, em Igarapé, e vamos abrindo novas páginas com a comunidade.
            </p>
          </header>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {picos.map((p) => {
              const inner = (
                <>
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
                  <h2 className="mt-5 text-xl font-bold">{p.name}</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {p.place}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
                  {p.live && (
                    <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      Ver pico <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </>
              );

              return (
                <li key={p.slug}>
                  {p.live ? (
                    <Link
                      to="/picos/pedra-grande-igarape"
                      className="block h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border-strong"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div
                      aria-disabled="true"
                      className="block h-full rounded-2xl border border-border bg-card p-6 opacity-80"
                    >
                      {inner}
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
