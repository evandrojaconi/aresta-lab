import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageHead } from "@/lib/seo";

const TITLE = "Comunidade de escalada | Aresta Climb";
const DESCRIPTION =
  "Como a comunidade participa: curadoria de croquis, atualização de acessos, alertas locais e boas práticas para a escalada outdoor.";

export const Route = createFileRoute("/comunidade")({
  head: () => pageHead({ title: TITLE, description: DESCRIPTION, path: "/comunidade" }),
  component: ComunidadePage,
});

function ComunidadePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="py-20 md:py-24">
        <article className="mx-auto w-[min(760px,92%)]">
          <header>
            <span className="font-display text-[11px] font-extrabold tracking-[0.22em] text-primary">
              Comunidade
            </span>
            <h1 className="mt-4 text-[clamp(34px,4.5vw,56px)] font-bold leading-[1.05] tracking-[-0.04em]">
              A informação mais importante está com quem cuida do lugar
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              O Aresta organiza informação de escalada outdoor — mas a informação confiável vem da
              comunidade local que conquista vias, mantém acesso e cuida do território.
            </p>
          </header>

          <section className="mt-10 space-y-6 text-foreground/90">
            <h2 className="text-2xl font-bold">Como funciona a colaboração</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Escaladores e conquistadores enviam croquis, fotos e correções.</li>
              <li>• Curadores locais validam o que entra no app, evitando informação errada.</li>
              <li>• Alertas de acesso e fechamentos são publicados em tempo curto.</li>
              <li>• Boas práticas circulam junto com o conteúdo do pico.</li>
            </ul>

            <h2 className="text-2xl font-bold">Quer organizar uma área?</h2>
            <p className="text-muted-foreground">
              Se você representa uma associação, coletivo ou grupo que cuida de um pico, o Aresta
              pode ser o canal estruturado para distribuir croqui, acesso e regras locais — sem
              depender de PDFs perdidos ou grupos lotados de WhatsApp.
            </p>

            <p>
              <Link
                to="/"
                hash="testar"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-xs font-extrabold uppercase tracking-[0.12em] text-primary-foreground shadow-glow hover:-translate-y-0.5"
              >
                Entrar em contato
              </Link>
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
