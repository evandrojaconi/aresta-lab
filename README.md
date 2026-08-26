# Aresta Climb: Navegue e Escalar

Quero criar uma landing page para o lançamento do meu produto. Um aplicativo para escaladores. 

Segue o código HTML que gerei no chatgpt para e ajudar no design. Quero que mantenha a ideia de um dos meus projetos aqui no lovable também, o projeto: Aresta: Guia de Minas - Entranto, o nome é ARESTA CLIMB.

SEGUE O HTML DE EXEMPLO E EM SEGUIDA A PROPOSTA DE APLICATIVO:

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Aresta Climb — Menos incerteza. Mais parede.</title>
  <meta name="description" content="O Aresta Climb organiza croquis, acessos e informações de escalada para reduzir a incerteza antes do rolê." />
  <link rel="canonical" href="https://arestaclimb.com" />

  <meta property="og:title" content="Aresta Climb — Menos incerteza. Mais parede." />
  <meta property="og:description" content="Organize o rolê antes de sair: croquis, acesso, setores e informações confiáveis em uma jornada mais clara." />
  <meta property="og:url" content="https://arestaclimb.com" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#E95624" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Orbitron:wght@600;700&display=swap" rel="stylesheet" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aresta Climb",
    "alternateName": "Aresta",
    "url": "https://arestaclimb.com",
    "description": "O Aresta Climb organiza croquis, acessos e informações de escalada para reduzir a incerteza antes do rolê."
  }
  </script>

  <style>
    :root {
      --preto: #08090D;
      --preto-2: #0D0F13;
      --grafite: #12151A;
      --grafite-2: #191D23;
      --branco: #F7F5F2;
      --cinza: #A6A6A6;
      --cinza-2: #696D73;
      --laranja: #E95624;
      --laranja-2: #CD6436;
      --verde: #879874;
      --azul: #4C5E71;
      --borda: rgba(247, 245, 242, 0.12);
      --borda-2: rgba(233, 86, 36, 0.35);
      --sombra: 0 30px 90px rgba(0, 0, 0, 0.42);
      --radius-lg: 32px;
      --radius-md: 22px;
      --radius-sm: 14px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: 'Montserrat', sans-serif;
      background: var(--preto);
      color: var(--branco);
      line-height: 1.6;
      overflow-x: hidden;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button,
    input,
    textarea {
      font-family: inherit;
    }

    .container {
      width: min(1120px, 92%);
      margin: 0 auto;
    }

    .nav {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(8, 9, 13, 0.86);
      border-bottom: 1px solid var(--borda);
      backdrop-filter: blur(18px);
    }

    .nav-inner {
      min-height: 76px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .brand-mark {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 13px;
      background: var(--laranja);
      box-shadow: 0 0 36px rgba(233, 86, 36, 0.28);
    }

    .brand-mark svg {
      width: 30px;
      height: 30px;
    }

    .brand-name {
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 0.28em;
      font-size: 19px;
      font-weight: 700;
    }

    .menu {
      display: flex;
      align-items: center;
      gap: 24px;
      color: var(--cinza);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
    }

    .menu a:hover {
      color: var(--laranja);
    }

    .nav-cta {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .mobile-btn {
      display: none;
      color: var(--branco);
      background: transparent;
      border: 1px solid var(--borda);
      border-radius: 999px;
      padding: 9px 14px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
      cursor: pointer;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 44px;
      border-radius: 999px;
      padding: 0 20px;
      border: 1px solid transparent;
      cursor: pointer;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.11em;
      transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
      white-space: nowrap;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn-primary {
      color: var(--branco);
      background: var(--laranja);
      box-shadow: 0 16px 42px rgba(233, 86, 36, 0.24);
    }

    .btn-primary:hover {
      background: #ff6530;
    }

    .btn-secondary {
      color: var(--branco);
      background: rgba(247, 245, 242, 0.04);
      border-color: var(--borda);
    }

    .btn-secondary:hover {
      color: var(--laranja);
      border-color: var(--laranja);
    }

    .btn-ghost {
      color: var(--cinza);
      border-color: transparent;
      padding-left: 0;
      padding-right: 0;
    }

    .btn-ghost:hover {
      color: var(--branco);
      transform: none;
    }

    .hero {
      position: relative;
      padding: 112px 0 88px;
      overflow: hidden;
      background:
        radial-gradient(circle at 80% 0%, rgba(233, 86, 36, 0.20), transparent 34%),
        radial-gradient(circle at 5% 80%, rgba(76, 94, 113, 0.18), transparent 34%),
        linear-gradient(180deg, #08090D 0%, #0D0F13 100%);
    }

    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(247, 245, 242, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(247, 245, 242, 0.035) 1px, transparent 1px);
      background-size: 72px 72px;
      mask-image: linear-gradient(to bottom, black, transparent 78%);
    }

    .hero-grid {
      position: relative;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 56px;
      align-items: center;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--laranja);
      font-size: 12px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 800;
      margin-bottom: 18px;
    }

    .eyebrow::before {
      content: "";
      width: 34px;
      height: 2px;
      background: var(--laranja);
    }

    h1 {
      max-width: 760px;
      font-size: clamp(44px, 7vw, 86px);
      line-height: 0.96;
      letter-spacing: -0.06em;
      margin-bottom: 24px;
    }

    h1 span {
      color: var(--laranja);
    }

    .hero-text {
      max-width: 620px;
      color: var(--cinza);
      font-size: 18px;
      margin-bottom: 30px;
    }

    .micro-copy {
      color: var(--cinza-2);
      font-size: 13px;
      margin-top: 14px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }

    .messy-card {
      background: rgba(18, 21, 26, 0.88);
      border: 1px solid var(--borda);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--sombra);
      backdrop-filter: blur(16px);
    }

    .messy-top {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: center;
      margin-bottom: 22px;
    }

    .messy-title {
      font-size: 14px;
      color: var(--cinza);
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-weight: 800;
    }

    .status-pill {
      background: rgba(233, 86, 36, 0.13);
      color: var(--laranja);
      border: 1px solid rgba(233, 86, 36, 0.28);
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.09em;
    }

    .messy-question {
      background: var(--preto-2);
      border: 1px solid var(--borda);
      border-radius: 24px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .messy-question strong {
      display: block;
      font-size: 22px;
      line-height: 1.2;
      margin-bottom: 10px;
    }

    .messy-question p {
      color: var(--cinza);
      font-size: 14px;
    }

    .mini-journey {
      display: grid;
      gap: 10px;
    }

    .mini-step {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: rgba(247, 245, 242, 0.04);
      border: 1px solid var(--borda);
      border-radius: 16px;
      padding: 14px;
      color: var(--cinza);
      font-size: 13px;
    }

    .mini-step.active {
      border-color: var(--borda-2);
      color: var(--branco);
      background: rgba(233, 86, 36, 0.09);
    }

    .mini-step span:first-child {
      font-weight: 800;
    }

    .mini-step span:last-child {
      color: var(--laranja);
      font-weight: 900;
    }

    .section {
      padding: 92px 0;
    }

    .section.muted {
      background: var(--preto-2);
      border-top: 1px solid var(--borda);
      border-bottom: 1px solid var(--borda);
    }

    .section-header {
      max-width: 760px;
      margin-bottom: 40px;
    }

    .section-header.center {
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }

    .section-header h2 {
      font-size: clamp(32px, 4vw, 56px);
      line-height: 1.05;
      letter-spacing: -0.05em;
      margin-bottom: 16px;
    }

    .section-header p {
      color: var(--cinza);
      font-size: 17px;
    }

    .pain-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 14px;
    }

    .pain-card {
      min-height: 156px;
      background: var(--grafite);
      border: 1px solid var(--borda);
      border-radius: var(--radius-md);
      padding: 22px;
      transition: 0.2s ease;
    }

    .pain-card:hover {
      transform: translateY(-4px);
      border-color: var(--borda-2);
    }

    .pain-card small {
      display: block;
      color: var(--laranja);
      font-weight: 900;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .pain-card strong {
      display: block;
      font-size: 17px;
      line-height: 1.25;
    }

    .solution-grid {
      display: grid;
      grid-template-columns: 0.86fr 1.14fr;
      gap: 28px;
      align-items: stretch;
    }

    .quiet-card,
    .journey-card,
    .trust-card,
    .form-card,
    .faq-item {
      background: var(--grafite);
      border: 1px solid var(--borda);
      border-radius: var(--radius-lg);
      padding: 30px;
    }

    .quiet-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 420px;
    }

    .quiet-card h3,
    .journey-card h3,
    .trust-card h3,
    .form-card h3 {
      font-size: 30px;
      line-height: 1.1;
      letter-spacing: -0.04em;
      margin-bottom: 14px;
    }

    .quiet-card p,
    .journey-card p,
    .trust-card p,
    .form-card p {
      color: var(--cinza);
    }

    .feature-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .feature-item {
      background: rgba(247, 245, 242, 0.04);
      border: 1px solid var(--borda);
      border-radius: 18px;
      padding: 16px;
    }

    .feature-item span {
      display: inline-flex;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: rgba(233, 86, 36, 0.12);
      color: var(--laranja);
      font-weight: 900;
      margin-bottom: 12px;
    }

    .feature-item strong {
      display: block;
      margin-bottom: 6px;
      font-size: 15px;
    }

    .feature-item p {
      font-size: 13px;
      color: var(--cinza);
    }

    .flow {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 12px;
      margin-top: 22px;
    }

    .flow-step {
      position: relative;
      min-height: 136px;
      border-radius: var(--radius-md);
      background: var(--grafite);
      border: 1px solid var(--borda);
      padding: 20px;
    }

    .flow-step:not(:last-child)::after {
      content: "→";
      position: absolute;
      right: -13px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--laranja);
      font-weight: 900;
      z-index: 2;
    }

    .flow-step small {
      color: var(--laranja);
      font-weight: 900;
      letter-spacing: 0.14em;
    }

    .flow-step strong {
      display: block;
      margin-top: 14px;
      line-height: 1.2;
    }

    .audience-toggle {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 22px;
    }

    .toggle-btn {
      border: 1px solid var(--borda);
      background: rgba(247, 245, 242, 0.04);
      color: var(--cinza);
      border-radius: 999px;
      padding: 12px 16px;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      font-weight: 800;
      cursor: pointer;
    }

    .toggle-btn.active {
      color: var(--branco);
      border-color: var(--laranja);
      background: rgba(233, 86, 36, 0.12);
    }

    .audience-panel {
      display: grid;
      grid-template-columns: 0.95fr 1.05fr;
      gap: 26px;
      align-items: start;
    }

    .quote-box {
      border-left: 3px solid var(--laranja);
      padding-left: 18px;
      color: var(--branco);
      font-size: 24px;
      line-height: 1.28;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }

    .need-list {
      display: grid;
      gap: 10px;
      margin-top: 18px;
    }

    .need-list li {
      list-style: none;
      display: flex;
      gap: 10px;
      color: var(--cinza);
      align-items: flex-start;
    }

    .need-list li::before {
      content: "•";
      color: var(--laranja);
      font-weight: 900;
      font-size: 20px;
      line-height: 1;
    }

    .trust-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 22px;
    }

    .trust-mini {
      background: rgba(247, 245, 242, 0.04);
      border: 1px solid var(--borda);
      border-radius: 20px;
      padding: 18px;
    }

    .trust-mini strong {
      display: block;
      color: var(--laranja);
      margin-bottom: 8px;
    }

    .trust-mini p {
      font-size: 13px;
      color: var(--cinza);
    }

    .form-section {
      background:
        radial-gradient(circle at 40% 0%, rgba(233, 86, 36, 0.18), transparent 32%),
        var(--grafite);
      border-top: 1px solid var(--borda);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 28px;
      align-items: start;
    }

    form {
      display: grid;
      gap: 14px;
      margin-top: 20px;
    }

    .input-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    label {
      display: block;
      font-size: 12px;
      color: var(--cinza);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 800;
      margin-bottom: 7px;
    }

    input,
    textarea {
      width: 100%;
      min-height: 48px;
      border-radius: 14px;
      border: 1px solid var(--borda);
      background: rgba(8, 9, 13, 0.68);
      color: var(--branco);
      padding: 12px 14px;
      outline: none;
      font-size: 14px;
    }

    textarea {
      min-height: 104px;
      resize: vertical;
    }

    input:focus,
    textarea:focus {
      border-color: var(--laranja);
    }

    .privacy-note {
      color: var(--cinza-2);
      font-size: 12px;
    }

    .success-box {
      display: none;
      margin-top: 16px;
      border-radius: 18px;
      background: rgba(135, 152, 116, 0.12);
      border: 1px solid rgba(135, 152, 116, 0.34);
      padding: 16px;
      color: var(--branco);
    }

    .faq-grid {
      display: grid;
      gap: 12px;
    }

    .faq-item {
      padding: 0;
      overflow: hidden;
    }

    .faq-question {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      text-align: left;
      padding: 22px 24px;
      color: var(--branco);
      background: transparent;
      border: 0;
      cursor: pointer;
      font-weight: 800;
      font-size: 16px;
    }

    .faq-answer {
      display: none;
      padding: 0 24px 24px;
      color: var(--cinza);
      font-size: 14px;
    }

    .faq-item.open .faq-answer {
      display: block;
    }

    .faq-item.open .faq-question span:last-child {
      transform: rotate(45deg);
    }

    .footer {
      border-top: 1px solid var(--borda);
      background: #06070A;
      padding: 44px 0;
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 22px;
      flex-wrap: wrap;
      color: var(--cinza-2);
      font-size: 13px;
    }

    .footer-links {
      display: flex;
      gap: 18px;
      flex-wrap: wrap;
    }

    .footer-links a:hover {
      color: var(--branco);
    }

    @media (max-width: 1040px) {
      .pain-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .flow {
        grid-template-columns: repeat(3, 1fr);
      }

      .flow-step:not(:last-child)::after {
        display: none;
      }
    }

    @media (max-width: 900px) {
      .menu,
      .nav-cta {
        display: none;
      }

      .mobile-btn {
        display: inline-flex;
      }

      .menu.mobile-open {
        position: absolute;
        top: 76px;
        left: 0;
        right: 0;
        display: grid;
        gap: 18px;
        padding: 22px 4%;
        background: rgba(8, 9, 13, 0.98);
        border-bottom: 1px solid var(--borda);
      }

      .hero-grid,
      .solution-grid,
      .audience-panel,
      .form-grid {
        grid-template-columns: 1fr;
      }

      .hero {
        padding: 76px 0 60px;
      }

      .pain-grid,
      .feature-list,
      .trust-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 620px) {
      .brand-name {
        font-size: 16px;
        letter-spacing: 0.22em;
      }

      .section {
        padding: 70px 0;
      }

      .hero-actions,
      .btn {
        width: 100%;
      }

      .input-row,
      .flow {
        grid-template-columns: 1fr;
      }

      .quiet-card,
      .journey-card,
      .trust-card,
      .form-card {
        padding: 24px;
      }
    }
  



  


    


      
        
          
            
            
          
        
        ARESTA
      

      
        A dúvida
        Como resolve
        Jornada
        Comunidade
        Testar
      

      


        Ver como funciona
        Quero testar
      



      Menu
    



  
    


      


        


          

Messy Middle da escalada


          

Menos incerteza. Mais parede.


          


            Você quer escalar mais, mas perde tempo tentando descobrir onde ir, como chegar, se tem croqui confiável e se a rocha vai estar boa.
          



          


            Quero testar o Aresta
            Ver se esse problema é meu
          



          


            Primeiro a dor. Depois a solução. Produto empurrado antes da hora é igual sapatilha apertada: até funciona, mas ninguém aguenta muito tempo.
          


        



        


          


            

Antes do rolê


            

Decisão travada


          



          


            “Será que vale ir nesse pico?”
            

A resposta hoje costuma estar espalhada entre WhatsApp, Google, Instagram, PDF antigo, clima e opinião da galera.


          



          


            

1. Interessevídeo / academia


            

2. Procuradúvida


            

3. Consideraçãorisco


            

4. Usoplanejamento


          


        


      


    



    


      


        


          

O problema real


          

Hoje, para escalar em um pico novo, você precisa juntar pedaços de informação.


          


            O lead não precisa ouvir “baixe nosso app” logo de cara. Ele precisa se reconhecer no problema: informação espalhada, decisão insegura e risco de perder o rolê.
          


        



        


          


            01
            Perguntar no grupo
          


          


            02
            Caçar PDF de croqui
          


          


            03
            Ver print antigo
          


          


            04
            Confirmar clima e rocha
          


          


            05
            Torcer para o acesso estar certo
          


        


      


    



    


      


        


          


            


              

Como resolve


              

Tudo que você precisa antes e durante o rolê.


              


                O Aresta organiza a decisão. Não promete coragem, não substitui experiência e não faz milagre com rocha molhada. Ele reduz a fricção entre querer ir e saber se vale ir.
              


            



            


              Ver jornada simples
            


          



          


            


              1
              Picos e setores organizados
              

Menos busca solta. Mais contexto para decidir.


            


            


              2
              Croquis offline
              

Informação útil mesmo quando o sinal some.


            


            


              3
              Acesso e estacionamento
              

Chegada mais clara, menos tempo perdido.


            


            


              4
              Alertas locais
              

Condições, acesso sensível e avisos importantes.


            


            


              5
              Contribuição da comunidade
              

Informação viva, validada por quem usa o território.


            


            


              6
              Boas práticas
              

Escalar melhor também é impactar menos.


            


          


        


      


    



    


      


        


          

Da dúvida ao pico


          

O site conduz a decisão, não despeja funcionalidade.


          


            A lógica é sair do Messy Middle: reconhecer a dúvida, ganhar confiança, planejar e testar.
          


        



        


          


            

01Descubra um pico


            

02Veja setores


            

03Salve offline


            

04Consulte o croqui


            

05Escale com mais clareza


            

06Contribua depois


          


        


      


    



    


      


        


          

Duas jornadas


          

Para quem quer escalar melhor. E para quem precisa organizar o território.


          


            O foco do lançamento é o escalador que busca autonomia. A camada institucional entra como ponte para associações, comunidades e parceiros.
          


        



        


          Quero escalar melhor
          Quero organizar uma comunidade
        



        


          


            


              “Quero escalar mais, mas dá muito trabalho descobrir tudo.”
            


            


              Para o escalador progressivo, a barreira não é falta de vontade. É falta de clareza para decidir sem depender de alguém responder no grupo.
            


          



          


            

O que essa pessoa precisa?


            


              

Informação clara sobre croqui, acesso e vias


              

Autonomia para decidir se vale ir


              

Mais segurança e menos improviso


              

Pertencimento à comunidade


            


          


        


      


    



    


      


        


          

Confiança


          

Construído com quem escala.


          


            O Aresta nasce a partir de comunidades reais, croquis existentes, grupos de escalada, demandas de campo e organização territorial.
          


        



        


          


            Comunidade
            

Informações conectadas a pessoas que vivem o território.


          


          


            Offline
            

Uso pensado para a base da rocha, onde o sinal não costuma ajudar.


          


          


            Responsabilidade
            

Informação não substitui instrução, supervisão e decisão consciente.


          


        


      


    



    


      


        


          

Primeiros testadores


          


            Entre na lista antes do próximo rolê.
          


          


            Poucos campos. O suficiente para entender onde você escala e te chamar quando o teste fizer sentido. Nada de formulário com cara de matrícula em cartório.
          


        



        


          

Quero testar o Aresta


          

Cadastro de interesse para MVP, croquis, QR Codes e testes com comunidade.



          


            


              


                Nome
                
              


              


                Cidade
                
              


            



            


              


                WhatsApp
                
              


              


                E-mail
                @email.com" required />
              
            

            


              Onde você costuma escalar?
              
            



            
            
            
            

            Enviar interesse
            

Modelo visual. Conecte este formulário ao HubSpot, Forms ou outro CRM depois.


          

          


            Interesse registrado neste modelo. Próximo passo: conectar o formulário ao CRM.
          


        
      
    

    


      


        


          

Perguntas de quem está avaliando


          

Antes de testar, faz sentido perguntar.


        



        


          


            
              O Aresta substitui guia, curso ou experiência?
              +
            
            


              Não. O Aresta organiza informação para ajudar no planejamento. Decisão de segurança, técnica e risco continua sendo responsabilidade de quem escala, de instrutores, guias e parceiros de confiança.
            


          



          


            
              Por que o foco é offline?
              +
            
            


              Porque a dúvida geralmente aparece antes de sair, mas o uso crítico acontece no pico. E no pico, o sinal costuma ter a mesma estabilidade de um reglete molhado.
            


          



          


            
              Como a comunidade participa?
              +
            
            


              Enviando correções, informações de acesso, fotos, alertas, boas práticas e contribuições que podem ser revisadas por curadores locais.
            


          


        


      


    


  

  


    


      


        
          
            
            
          
        
        
          Aresta Climb

          Menos incerteza. Mais parede.
        
      



      


        arestaclimb.com
        Testar
        FAQ
        Voltar ao topo
      

PROPOSTA APP PARA     



  

Proposta de Produto: App de Croquis de Escalada Com Acesso Offline

(Para Diretoria e Conselho da ACEC, escaladores e associados)

Autor: Renato Utsch Gonçalves, Presidente ACEC-MG

Data: Março de 2026

Status: Proposto

1. Visão Geral e Filosofia

A ACEC-MG propõe a criação de um aplicativo móvel para distribuir croquis digitais de escalada, com foco de uso para as regiões cársticas de Minas Gerais e arredores, mas aberto para outras regiões no Brasil. Como o sinal de celular é quase inexistente na maioria dos picos e falésias locais, o aplicativo deve ser fundamentalmente offline.

Além disso, como somos uma organização sem fins lucrativos, precisamos minimizar os custos recorrentes de infraestrutura. O objetivo dessa arquitetura é construir um aplicativo colaborativo (crowdsourced) baseado em repositórios abertos no GitHub, com dados altamente compactados, navegação offline e com custos mensais de servidor próximos a zero.

1.1 Filosofia e Posicionamento (App Comunitário vs. Plataformas Comerciais)

Diferente de plataformas comerciais de escalada (SaaS) que restringem recursos de segurança — como navegação GPS offline e croquis detalhados — por trás de assinaturas premium (paywalls) e mantêm o monopólio do banco de dados, este aplicativo é estritamente uma ferramenta de utilidade pública. Nossa arquitetura é guiada por três pilares inegociáveis:

Acesso Universal: 100% das funcionalidades de navegação e leitura offline devem ser gratuitas, priorizando a segurança do escalador.

Descentralização Financeira (Fricção Zero): O sistema rejeita intermediários; toda monetização ou doação flui diretamente do usuário para a conta da associação ou do mantenedor local responsável pela via.

Soberania dos Dados (Open Source): A comunidade é a detentora definitiva do seu próprio trabalho. O repositório atua como um arquivo público em formato legível por humanos, garantindo que a história e a topografia da escalada local nunca fiquem reféns de uma única empresa de tecnologia (evitando o vendor lock-in). O objetivo não é ser uma rede social de performance esportiva, mas sim uma ferramenta de sobrevivência digital e fomento na base da rocha.

2. A Experiência do Escalador (App)

100% Offline: O usuário baixa o pacote de um pico (ex: Gruta da Lapinha) em casa. Na rocha, ele tem acesso a todas as vias, mapas, fotos de setores e vídeos de beta, tudo sem precisar de internet.

Croqui atualizado: O croqui se auto-atualiza com quaisquer melhorias, permitindo melhorias incrementais e constantes nos croquis por parte da equipe que mantém o pico.

Navegação de Aproximação: O aplicativo exibe um mapa topográfico offline com uma linha vermelha mostrando a trilha exata do estacionamento até a base da via, junto com a localização GPS do usuário (o "ponto azul").

Mídia Sob Demanda: Para economizar espaço no celular, fotos dos setores são altamente compactadas. Vídeos de beta só são baixados se o usuário solicitar explicitamente enquanto estiver no Wi-Fi.

Descoberta de outros picos: O escalador pode procurar por croquis de picos próximos a onde está em um mapa, facilitando a descoberta de novos locais para escalada.

3. Gestão Colaborativa (Como adicionar vias)

Para manter o aplicativo atualizado, adotamos um sistema colaborativo amigável:

Database colaborativa: O aplicativo e a database serão colaborativos e de código aberto, armazenados em repositórios GitHub controlados pela ACEC-MG e que permitem a qualquer pessoa contribuir com melhoria dos croquis e adição de novos picos de escalada.

Revisão por curadores: Toda sugestão de nova via ou correção cai em um painel de "Revisão". Um curador da ACEC-MG lê, aprova com um clique, e o aplicativo de todos os usuários é atualizado automaticamente.

Carga Inicial (Bootstrap): O app não nascerá vazio. Com a permissão dos autores, faremos a importação automatizada de dados de sites existentes e PDFs (usando Inteligência Artificial) para garantir que o app já seja útil no dia do lançamento.

Painel Administrativo Visual: Voluntários e conquistadores não precisam saber programar. Eles acessam um site da associação com uma interface simples (semelhante ao WordPress), onde preenchem os dados das vias (grau, nome, beta) e fazem upload de fotos.

4. Estratégia de Monetização e Sustentabilidade

Para garantir que o aplicativo consiga cobrir seus custos de infraestrutura e, ao mesmo tempo, retornar valor financeiro real para a comunidade de escalada, o sistema adotará um modelo de monetização nativa e direta, rejeitando explicitamente redes de anúncios convencionais.

Rejeição de Ad Networks (Anti-Meta): A integração de SDKs de anúncios tradicionais (como Google AdMob ou Meta Audience Network) está fora do escopo arquitetural. Esse tipo de anúncio exige comunicação constante com a internet, não teríamos volume de impressões suficiente para gerar receita significativa e SDKs de terceiros consomem bateria processando rastreadores em segundo plano e exigem pop-ups complexos de consentimento de privacidade (LGPD).

Patrocínios Nativos Embarcados: Para gerar receita para manter o aplicativo e para a escalada local, o aplicativo suportará espaços de patrocínio fixos e vendidos diretamente. Um ginásio local pode patrocinar um pico específico, e sua marca aparecerá nativamente no croqui offline.

Botão Pix Direto: As vias terão um botão "Apoie a manutenção". O escalador clica, copia a chave Pix do mantenedor daquele pico específico e faz a doação direta, fomentando o suporte ao mantenedor local do pico, descentralizando o financiamento da escalada local e sem taxas de 30% das lojas de aplicativos.

Incentivo à Filiação: O app lembrará ativamente os usuários sobre a importância de se transformar de frequentadores casuais em membros oficiais (filiados) das associações locais que mantém o pico em que escalam através de um padrão de "Interação Salva" (Deferred Deep Link). Se o usuário clicar no botão offline, o app salva essa ação e, assim que o aparelho detectar uma conexão Wi-Fi/4G, exibe uma notificação amigável lembrando-o de concluir sua filiação. Esta funcionalidade cria uma máquina de aquisição de novos membros com custo de marketing zero, aproveitando o momento em que o escalador está com o maior nível de gratidão e engajamento: exatamente enquanto desfruta da rocha que a associação protege.

5. Estratégia de Lançamento (Rollout)

Para garantir que o aplicativo chegue rápido às mãos dos escaladores e seja testado em condições reais na rocha, o lançamento será dividido em duas fases principais:

Fase 1 (Alpha Fechado): Testes do Aplicativo. O aplicativo será lançado para um grupo seleto de testadores e conquistadores locais. O objetivo é testar exaustivamente a navegação GPS offline e a leitura dos croquis. Nesta fase, a adição de novas vias será feita internamente pela equipe técnica (sem o painel visual).

Fase 2 (Beta Público): Abertura para a Comunidade. Após validar que o aplicativo não trava na rocha e os mapas funcionam sem internet, o Painel Administrativo Visual (CMS) será oficialmente lançado. A partir deste momento, qualquer escalador poderá sugerir correções e adicionar picos de forma amigável pelo site da associação.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c700f3b4-d8dc-4244-8c12-c7c4e35c2b7e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
