import { Link } from "@tanstack/react-router";
import { Menu, X, Mountain } from "lucide-react";
import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

const defaultLinks: NavLink[] = [
  { href: "/picos", label: "Picos" },
  { href: "/guias/croqui-de-escalada", label: "Guias" },
  { href: "/comunidade", label: "Comunidade" },
  { href: "/faq", label: "FAQ" },
];

interface SiteHeaderProps {
  /** Quando true, usa âncoras da home no lugar dos links de navegação. */
  homeMode?: boolean;
}

export function SiteHeader({ homeMode = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  const links: NavLink[] = homeMode
    ? [
        { href: "/#duvida", label: "A dúvida" },
        { href: "/#como-resolve", label: "Como resolve" },
        { href: "/#jornada", label: "Jornada" },
        { href: "/#comunidade", label: "Comunidade" },
        { href: "/#faq", label: "FAQ" },
      ]
    : defaultLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[68px] w-[min(1120px,92%)] items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3" aria-label="Aresta Climb — Home">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 place-items-center rounded-xl bg-primary shadow-glow"
          >
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-[15px] font-bold text-foreground">ARESTA</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 md:flex">
          {links.map((l) =>
            l.href.startsWith("/#") || l.external ? (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={homeMode ? "/#como-resolve" : "/#como-resolve"}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/[0.04] px-4 text-[11px] font-bold uppercase tracking-[0.11em] text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Ver como funciona
          </a>
          <a
            href={homeMode ? "/#testar" : "/#testar"}
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-[11px] font-bold uppercase tracking-[0.11em] text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            Quero testar
          </a>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background/98 md:hidden"
        >
          <nav aria-label="Navegação móvel" className="mx-auto grid w-[min(1120px,92%)] gap-3 py-5">
            {links.map((l) =>
              l.href.startsWith("/#") ? (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
                >
                  {l.label}
                </Link>
              ),
            )}
            <div className="mt-2 grid gap-2">
              <a
                href="/#como-resolve"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-border px-4 text-[11px] font-bold uppercase tracking-[0.11em]"
              >
                Ver como funciona
              </a>
              <a
                href="/#testar"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-[11px] font-bold uppercase tracking-[0.11em] text-primary-foreground"
              >
                Quero testar
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
