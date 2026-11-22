# ARESTA Intelligence — Central de execução

CRM independente, publicado em **https://evandrojaconi.github.io/aresta-lab/intelligence/**. O GitHub hospeda a interface, enquanto tarefas, contatos, propostas, relatórios, autenticação e permissões estão no Supabase `aresta-lab`.

## Para o proprietário

1. Abra o link acima. Se já estiver autenticado, clique em **Ajustes → Gerar e ativar minha senha**.
2. Copie a senha forte apresentada **uma única vez** e guarde no gerenciador de senhas do seu dispositivo.
3. Nos próximos acessos, entre diretamente com **e-mail e senha**. Se estiver desconectado e ainda não souber sua senha, utilize `Primeiro acesso` por link apenas uma vez.
4. Nenhuma credencial é versionada no GitHub ou inserida em tabelas de tarefas. Supabase Auth armazena apenas hash criptográfico.

Para detalhes: [COMECE_AQUI.md](COMECE_AQUI.md).

## O sistema

- **Hoje:** execução por prioridade, tarefa clicável, prazos e evidências.
- **Marketing:** pauta, legenda, modelos e referências Canva, fluxo de revisão e publicação.
- **Produto:** sugestões de UX e laboratório com capturas de tela históricas do app.
- **Dados:** fontes Umami/Looker, registros com período e interpretação cautelosa via Kotler 5As.
- **Oportunidades:** pesquisa, editais, parcerias e expansão.
- **Conhecimento:** biblioteca importada com rastreabilidade de origem.
- **Pessoas:** contatos por organização, com permissões de workspace.
- **Conexões:** catálogo e autorizações — **não** implica API conectada automaticamente.

O app Aresta, Editor e ArestaDB permanecem fontes distintas. A instalação de GitHub App, redes sociais, editor e outras fontes exige autorização específica. Informações privadas ficam em Supabase sob RLS; apenas UI, migrations e código ficam no repositório público.

## Desenvolvimento

A pasta `intelligence` contém um projeto Vite. Para desenvolvimento local, use Node.js e `npm install && npm run dev`; use `.env.example` como base para as variáveis públicas. Nunca inserir `service_role`, tokens pessoais, segredos OAuth ou senhas em `VITE_*`.

Testes: `npm run test` e `npm run build`. Deploy de homologação via GitHub Actions da branch principal.

## Autenticação

- Supabase Auth e-mail/senha: `signInWithPassword`.
- Troca de senha: `auth.updateUser({password})` sob sessão autenticada.
- Recuperação inicial: Magic Link restrito a usuário existente (`shouldCreateUser:false`).
- Senha aleatória gerada por Web Crypto local com 28 caracteres; exibida só após alteração confirmada.
- O navegador/gerenciador de senhas do usuário é o único local apropriado para guardar a senha em forma recuperável.
- O login do CRM não libera repositórios GitHub privados nem escreve nos sistemas de escalada automaticamente.
