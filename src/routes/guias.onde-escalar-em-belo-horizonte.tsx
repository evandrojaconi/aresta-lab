import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageHead, SITE_URL } from "@/lib/seo";

const TITLE = "Onde escalar perto de Belo Horizonte | Picos em MG";
const DESCRIPTION =
  "Áreas de escalada outdoor e boulder perto de Belo Horizonte, em Minas Gerais: Igarapé, Serra do Cipó, Ouro Preto e outros picos da comunidade.";
const PATH = "/guias/onde-escalar-em-belo-horizonte";

const picos = [
  { name: "Pedra Grande, Igarapé", desc: "Escalada esportiva e boulder a cerca de 1h de BH.", to: "/picos/pedra-grande-igarape" as const },
  { name: "Serra do Cipó", desc: "Conjunto de áreas com escalada e boulder ao norte de BH.", to: "/picos" as const },
  { name: "Ouro Preto e região", desc: "Picos históricos e setores variados na região central de MG.", to: "/picos" as const },
  { name: "Pedra Rachada", desc: "Área conhecida pela comunidade local mineira.", to: "/picos" as const },
];

export const Route = createFileRoute("/guias/onde-escalar-em-belo-horizonte")({
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
  component: OndeEscalar,
});

function OndeEscalar() {
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
              Descoberta
            </span>
            <h1 className="mt-4 text-[clamp(34px,4.5vw,56px)] font-bold leading-[1.05] tracking-[-0.04em]">
              Onde escalar perto de Belo Horizonte
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Minas Gerais tem uma rede de picos de escalada e boulder espalhados pela região
              metropolitana e pelo interior. Aqui está um ponto de partida — cada pico ganhará sua
              própria página com croqui, acesso e informação da comunidade.
            </p>
          </header>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {picos.map((p) => (
              <li key={p.name}>
                <Link
                  to={p.to}
                  className="block h-full rounded-2xl border border-border bg-card p-6 hover:border-border-strong"
                >
                  <h2 className="text-lg font-bold">{p.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-muted-foreground">
            Esta lista é o começo. O Aresta organiza essas áreas com informação confiável, croqui
            offline e curadoria da comunidade local.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
