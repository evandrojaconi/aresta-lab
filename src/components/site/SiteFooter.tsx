import { Link } from "@tanstack/react-router";
import { Mountain } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[color-mix(in_oklab,var(--background)_92%,black)] py-12">
      <div className="mx-auto flex w-[min(1120px,92%)] flex-wrap items-start justify-between gap-8">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 place-items-center rounded-xl bg-primary"
          >
            <Mountain className="h-5 w-5 text-primary-foreground" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-foreground">ARESTA CLIMB</p>
            <p className="mt-1 text-sm text-muted-foreground">Menos incerteza. Mais parede.</p>
          </div>
        </div>

        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-muted-foreground sm:grid-cols-3">
          <Link to="/picos" className="hover:text-foreground">Picos</Link>
          <Link to="/guias/croqui-de-escalada" className="hover:text-foreground">Guias</Link>
          <Link to="/comunidade" className="hover:text-foreground">Comunidade</Link>
          <Link to="/faq" className="hover:text-foreground">FAQ</Link>
          <a href="/#testar" className="hover:text-foreground">Entrar na lista</a>
          <a href="#top" className="hover:text-foreground">Voltar ao topo</a>
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aresta Climb
        </p>
      </div>
    </footer>
  );
}
