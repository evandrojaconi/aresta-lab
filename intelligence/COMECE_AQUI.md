# ARESTA Intelligence — acesso pessoal simplificado

**Abrir o CRM:** https://evandrojaconi.github.io/aresta-lab/intelligence/

## Acesso de agora em diante
- O e-mail do proprietário **já existe** em Supabase Auth, com confirmação e memberships. Não duplicar cadastro.
- Login principal: **e-mail + senha**; sessão persistida pelo Supabase Auth e senhas do usuário salvas apenas no gerenciador de senhas, se ele escolher.
- **Gerar uma senha:** estando conectado ao CRM, abra **Ajustes → Gerar e ativar minha senha**. O navegador cria senha criptograficamente aleatória de 28 caracteres e usa `supabase.auth.updateUser({password})` para substituição na **mesma conta**.
- A senha aparece **uma vez**, depois do sucesso, para copiar e salvar em um gerenciador. Ela nunca fica no GitHub, Notion, CRM, log ou localStorage.
- Se você não estiver conectado e ainda não souber sua senha, a opção **Primeiro acesso** permite solicitar um link **uma única vez**, entrar e gerar a senha. `shouldCreateUser:false` evita cadastro automático de terceiros.
- Em futuros acessos, use e-mail e senha, sem link e sem Google OAuth. A autorização de leitura/escrita continua por workspace com RLS.
- Não podemos salvar automaticamente uma senha no gerenciador pessoal do Google/Chrome por meio do GitHub ou Supabase; use a solicitação nativa do navegador ou [Gerenciador de Senhas do Google](https://passwords.google.com).

**Cuidado:** gerar novamente substitui a senha anterior. Copie antes de sair da página; se perder, volte pelo mecanismo de recuperação.

## Estado e limites

Backend: Supabase `fqurgrujuqcogbjrsytt` (banco, autenticação e RLS). UI: GitHub Pages isolada da landing. As integrações externas Canva, Instagram, WhatsApp e repositórios GitHub privados exigem permissões individuais. Login do CRM **não** autoriza acesso a código privado automaticamente. Nunca enviar senhas ou segredos na conversa ou incluí-los no repositório público.
