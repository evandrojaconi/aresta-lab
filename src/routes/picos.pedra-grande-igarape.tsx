import { createFileRoute, Link } from "@tanstack/react-router";
import { Cloud, MapPin, Mountain, Users, WifiOff } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageHead, SITE_URL } from "@/lib/seo";

const TITLE = "Pedra Grande, Igarapé MG | Croqui, acesso e setores";
const DESCRIPTION =
  "Guia da Pedra Grande, em Igarapé MG: croqui, trilha de acesso, estacionamento, setores, boas práticas e informações da comunidade local de escalada.";
const PATH = "/picos/pedra-grande-igarape";

export const Route = createFileRoute("/picos/pedra-grande-igarape")({
  head: () => {
    const base = pageHead({ title: TITLE, description: DESCRIPTION, path: PATH });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            name: "Pedra Grande de Igarapé",
            description:
              "Área de escalada outdoor e boulder próxima a Belo Horizonte, em Igarapé, Minas Gerais.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Igarapé",
              addressRegion: "MG",
              addressCountry: "BR",
            },
            url: `${SITE_URL}${PATH}`,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Picos", item: `${SITE_URL}/picos` },
              { "@type": "ListItem", position: 3, name: "Pedra Grande, Igarapé", item: `${SITE_URL}${PATH}` },
            ],
          }),
        },
      ],
    };
  },
  component: PedraGrandePage,
});

function PedraGrandePage() {
  const cards = [
    { icon: Mountain, title: "Croqui", text: "Explore o catálogo oficial para verificar o croqui, a versão publicada e o conteúdo disponível para download no aplicativo." },
    { icon: MapPin, title: "Acesso e estacionamento", text: "Aproximação a partir de Igarapé MG, com trecho final em estrada de terra. Detalhes de trilha e ponto de estacionamento na página do pico no app." },
    { icon: Cloud, title: "Condições e clima", text: "Atenção à chuva recente e umidade. Em dias muito úmidos, a rocha pode demorar a secar — sempre confirme antes de subir." },
    { icon: Users, title: "Comunidade local", text: "A Pedra Grande tem grupos e iniciativas que cuidam do acesso, das vias e da boa convivência. Apoiar essas associações é parte da escalada." },
    { icon: WifiOff, title: "Sinal de celular", text: "Sinal pode falhar próximo à base. Por isso o foco do Aresta em croqui e mapa offline." },
  ];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="py-20 md:py-24">
        <div className="mx-auto w-[min(1120px,92%)]">
          <nav aria-label="Trilha" className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <Link to="/picos" className="hover:text-foreground">Picos</Link>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="text-foreground">Pedra Grande</span>
          </nav>

          <header className="mt-6 max-w-3xl">
            <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
              Pico · Igarapé MG
            </span>
            <h1 className="mt-4 text-[clamp(36px,5vw,64px)] font-bold leading-[1.02] tracking-[-0.04em]">
              Pedra Grande, Igarapé
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Informações sobre a Pedra Grande, seus acessos e cuidados locais. Confira os croquis e detalhes publicados no aplicativo.
              Esta página é o ponto de partida — os detalhes completos chegam com o app, pensados
              para uso offline na base da rocha.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://arestaclimb.com/croquis"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:-translate-y-0.5"
              >
                Ver catálogo de croquis
              </a>
              <Link
                to="/comunidade"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-foreground/[0.04] px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-foreground hover:border-primary hover:text-primary"
              >
                Conhecer a comunidade
              </Link>
            </div>
          </header>

          <section aria-labelledby="o-que-encontra" className="mt-14">
            <h2 id="o-que-encontra" className="text-2xl font-bold md:text-3xl">
              O que você encontra aqui
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-2xl border border-border bg-card p-6">
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
          </section>

          <section
            aria-labelledby="boas-praticas"
            className="mt-14 rounded-[28px] border border-border bg-card p-7 md:p-10"
          >
            <h2 id="boas-praticas" className="text-2xl font-bold md:text-3xl">
              Boas práticas para escalar em Igarapé
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Pedra Grande é um pico vivo, mantido por escaladores locais. Algumas atitudes ajudam
              a manter o acesso aberto e a área preservada.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Evite escalar com a rocha molhada — preserva as vias e reduz risco.",
                "Leve seu lixo de volta, inclusive resíduos pequenos.",
                "Respeite o entorno e quem vive na região do acesso.",
                "Apoie associações locais que cuidam do pico.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-muted-foreground">
                  <span aria-hidden="true" className="mt-1 text-primary">•</span>
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
