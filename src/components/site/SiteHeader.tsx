import { Link } from "@tanstack/react-router";
import { Menu, Mountain, X } from "lucide-react";
import { useState } from "react";

const CROQUIS_URL = "https://arestaclimb.com/croquis";
const EDITOR_URL = "https://arestaclimb.com/editor";

const links = [
  { href: CROQUIS_URL, label: "Croquis", external: true },
  { href: "/picos", label: "Picos", external: false },
  { href: "/guias/croqui-de-escalada", label: "Guias", external: false },
  { href: EDITOR_URL, label: "Editor", external: true },
  { href: "/comunidade", label: "Comunidade", external: false },
  { href: "/faq", label: "FAQ", external: false },
];

interface SiteHeaderProps {
  homeMode?: boolean;
}

export function SiteHeader({ homeMode: _homeMode = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[72px] w-[min(1120px,92%)] items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" aria-label="Aresta Climb — página inicial">
          <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-primary shadow-glow">
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-[15px] font-bold text-foreground">ARESTA</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-5 lg:flex">
          {links.map((item) => item.external ? (
            <a key={item.href} href={item.href} className="text-[11px] font-bold uppercase tracking-[0.10em] text-muted-foreground transition-colors hover:text-primary">{item.label}</a>
          ) : (
            <a key={item.href} href={item.href} className="text-[11px] font-bold uppercase tracking-[0.10em] text-muted-foreground transition-colors hover:text-primary">{item.label}</a>
          ))}
        </nav>

        <a href="/#testar" className="hidden min-h-11 items-center justify-center rounded-full bg-primary px-5 text-[11px] font-bold uppercase tracking-[0.10em] text-primary-foreground shadow-glow md:inline-flex">
          Baixar aplicativo
        </a>

        <button type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(!open)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground lg:hidden">
          {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Navegação móvel" className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto grid w-[min(1120px,92%)] gap-1 py-4">
            {links.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="min-h-11 content-center rounded-lg px-3 py-2 text-sm font-bold text-foreground hover:bg-card hover:text-primary">
                {item.label}
              </a>
            ))}
            <a href="/#testar" onClick={() => setOpen(false)} className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">Baixar aplicativo</a>
          </div>
        </nav>
      )}
    </header>
  );
}
