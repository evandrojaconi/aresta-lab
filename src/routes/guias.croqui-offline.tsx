import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageHead, SITE_URL } from "@/lib/seo";

const TITLE = "Croqui de escalada offline: por que muda o rolê";
const DESCRIPTION =
  "Sinal ruim, PDF perdido, print desatualizado: por que ter croqui de escalada offline é essencial para escalada outdoor, especialmente em picos com pouco sinal.";
const PATH = "/guias/croqui-offline";

export const Route = createFileRoute("/guias/croqui-offline")({
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
  component: OfflineGuide,
});

function OfflineGuide() {
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
              Dor real
            </span>
            <h1 className="mt-4 text-[clamp(34px,4.5vw,56px)] font-bold leading-[1.05] tracking-[-0.04em]">
              Croqui de escalada offline: por que muda o rolê
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Quase todo pico de escalada outdoor tem o mesmo padrão: sinal cai antes de você
              chegar na base. E é exatamente ali, na base, que você precisa do croqui aberto.
            </p>
          </header>

          <div className="mt-10 space-y-6 text-foreground/90">
            <section>
              <h2 className="text-2xl font-bold">O ciclo da incerteza</h2>
              <p className="mt-3 text-muted-foreground">
                Você baixa um PDF antes de sair, salva uma foto no WhatsApp e tira print de um
                blog. Na hora H, abre o celular e os arquivos estão espalhados em pastas
                diferentes, alguns desatualizados, outros cortados. Já aconteceu com você.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">O que muda com croqui salvo no app</h2>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li>• Acesso instantâneo, sem depender de 4G ou Wi-Fi.</li>
                <li>• Mapa de aproximação até a base da via, mesmo sem sinal.</li>
                <li>• Croquis atualizados pela comunidade que mantém o pico.</li>
                <li>• Setores, vias, graus e observações organizados no mesmo lugar.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold">E por que o Aresta entrega isso de graça</h2>
              <p className="mt-3 text-muted-foreground">
                Offline e mapa em escalada outdoor são segurança, não recurso premium. O Aresta
                nasce com essa premissa: a base é gratuita, o app é colaborativo e a autoria de cada croqui deve ser respeitada.
              </p>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
