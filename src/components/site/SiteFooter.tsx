import { Link } from "@tanstack/react-router";
import { Mountain } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[color-mix(in_oklab,var(--background)_92%,black)] py-12">
      <div className="mx-auto grid w-[min(1120px,92%)] gap-10 md:grid-cols-[1.1fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-primary">
              <Mountain className="h-5 w-5 text-primary-foreground" />
            </span>
            <strong className="font-display text-sm text-foreground">ARESTA CLIMB</strong>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Menos incerteza. Mais parede. Croquis e informações de escalada para levar ao campo, inclusive offline depois do download.</p>
        </div>
        <nav aria-label="Links do rodapé" className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground sm:grid-cols-3">
          <Link to="/" className="hover:text-primary">Início</Link>
          <a href="https://arestaclimb.com/croquis" className="hover:text-primary">Catálogo de croquis</a>
          <Link to="/picos" className="hover:text-primary">Picos</Link>
          <Link to="/guias/croqui-de-escalada" className="hover:text-primary">Guias</Link>
          <Link to="/comunidade" className="hover:text-primary">Comunidade</Link>
          <Link to="/faq" className="hover:text-primary">Perguntas frequentes</Link>
          <a href="https://arestaclimb.com/editor" className="hover:text-primary">Editor Aresta</a>
          <a href="https://play.google.com/store/apps/details?id=app.escalada.croquis" className="hover:text-primary">Android</a>
          <a href="https://apps.apple.com/br/app/aresta-climb-guia-de-escalada/id6776467893" className="hover:text-primary">iPhone</a>
        </nav>
        <p className="text-xs text-muted-foreground md:col-span-2">© {new Date().getFullYear()} Aresta Climb. As informações de acesso e condições de escalada podem mudar. Confirme as regras locais antes de sair.</p>
      </div>
    </footer>
  );
}
