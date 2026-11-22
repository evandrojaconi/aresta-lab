# Publicação controlada do ARESTA Intelligence

- Plataforma: GitHub Pages do laboratório, caminho `/aresta-lab/intelligence/`.
- Código e identidade próprios; não reutiliza layout, CSS, marca ou componentes da Alura.
- Supabase: projeto `fqurgrujuqcogbjrsytt`, chave de cliente publicável; dados protegidos por RLS.
- Login privado por Magic Link enviado ao e-mail aprovado. Google OAuth desativado no frontend.
- Não altera o domínio `arestaclimb.com`, nem os caminhos `/croquis`, `/editor` ou site oficial.
- O HTML/CSS/JS da interface é público por estar no GitHub Pages. Dados, credenciais e históricos são privados por RLS.
- Antes do primeiro login: Supabase Auth → URL Configuration → **Additional Redirect URLs** → `https://evandrojaconi.github.io/aresta-lab/intelligence/**`.
- Uma conta de e-mail verificada foi pré-aprovada no banco privado para ativação automática. Outros endereços não têm acesso.
- Validar: Pages deploy success, botão de Magic Link, autorização de acesso, leitura e edição de tarefas, isolamento de workspaces.
- Canais Canva, Notion, WhatsApp, Instagram e LinkedIn NÃO estão automaticamente conectados ao frontend publicado; estão catalogados para integração.
