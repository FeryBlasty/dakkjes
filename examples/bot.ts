//BASE CODADA PELO ClassicX-O-BRABO - TODOS OS DIREITOS RESERVADOS!
//AVISO: ESTA BASE ESTÁ DESCRIPTOGRAFADA MAS AINDA SIM NÃO FOI CRIADA PRA SER EDITAVEL,SÓ EDITE SE SOUBER O QUE ESTÁ FAZENDO!
//QUALQUER ALTERAÇÃO NESTE ARQUIVO PODE QUEBRAR O BOT!
import { text } from 'stream/consumers';
import { BaileysClass } from '../lib/baileys.js';
import { Console } from 'console';
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio'); // Certifique-se de que o pacote cheerio está instalado
var axios = require("axios").default;

//////////////////////////////////////
const pixminimo = 10;
const pixmaximo = 150;
const antispamkkj = 0;
//////////////////////////////////////
const botBaileys = new BaileysClass({});

botBaileys.on('auth_failure', async (error) => console.log("ERRO BOT: ", error));
botBaileys.on('qr', (qr) => console.log("UTILIZE O QR CODE ABAIXO PARA SE CONECTAR AO BOT\n: ", qr));
botBaileys.on('ready', async () => console.log('WANTED CC STORE BOT v1 - By ClassicX-O-BRABO\n\nBOT CONECTADO COM SUCESSO!'))

let awaitingResponse = false;
function gerarSenhaAleatoria(length) {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let senha = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      senha += caracteres.charAt(randomIndex);
    }
  
    return senha;
  }

botBaileys.on('message', async (message) => {
    const useratual = `${(message.from.split('@'))[0]}`;
    const parametros = message.body.split(' ')
    const comandoprinc = parametros[0];
    const valorcomand = parametros[1];
    const comandokkj = message.body.toLowerCase().trim();
    const logsender = 'Usuário: ' + useratual;
    const logcomando = 'Comando: ' + comandokkj;
    //console.log(comandoprinc)
    //console.log(valorcomand)
    console.log('Novo Comando!\n')
    console.log(logsender)
    console.log(logcomando)
//====================FUNÇÕES BY ClassicX-O-BRABO========================//
//========================INICIO ANTI-SPAM==============================//
if (antispamkkj !== 0) {
  const remetente = message.from;
  var options = {
    method: 'GET',
    url: 'http://worldtimeapi.org/api/timezone/America/Sao_Paulo',
    params: { '': '' },
    data: {}
  };

  try {
    const response = await axios.request(options);
    const apiDatetime = response.data.datetime; // Pega o horário da resposta da API
    const formattedDatetime = new Date(apiDatetime).toISOString(); // Formata o horário

    // Abre o arquivo "spam.txt" e lê seu conteúdo
    const filePath = path.join(__dirname, 'spam.txt');
    let fileContent = '';
    if (fs.existsSync(filePath)) {
      fileContent = fs.readFileSync(filePath, 'utf-8');
    }

    // Verifica se já existe uma linha com o remetente atual
    const lines = fileContent.split('\n');
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith(remetente + '|')) {
        const savedDatetime = line.split('|')[1];
        const savedTimestamp = new Date(savedDatetime).getTime();
        const currentTimestamp = new Date(apiDatetime).getTime();

        if (currentTimestamp - savedTimestamp < 5000) {
          // Menos de 5 segundos desde a última interação, responda com erro
          await botBaileys.sendText(message.from, '*❌ANTI-SPAM❌*\n\nAguarde alguns segundos antes de enviar outro comando.');
          return; // Sai da função para evitar processamento adicional
        }

        lines[i] = remetente + '|' + formattedDatetime;
        found = true;
        break;
      }
    }

    // Se não encontrou uma linha existente, adiciona uma nova
    if (!found) {
      lines.push(remetente + '|' + formattedDatetime);
    }

    // Junta as linhas de volta em uma única string
    const updatedContent = lines.join('\n');

    // Salva as alterações de volta no arquivo
    fs.writeFileSync(filePath, updatedContent);
  } catch (error) {
    console.error(error);
    await botBaileys.sendText(message.from, 'Erro No Anti Spam! Consulte o Admin');
  }
}
//========================FIM DA FUNÇÃO ANTI-SPAM=========================//

// Função para verificar se o usuário existe no banco de dados
const verificarUsuario = async (logado) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});

    const page = await browser.newPage();

    // Navega até a URL desejada
    await page.goto('https://wanted-store.42web.io/dados/usuariosbot.json');

    // Obtém o conteúdo da página como JSON
    const content = await page.evaluate(() => {
        return fetch('https://wanted-store.42web.io/dados/usuariosbot.json')
            .then(response => response.json())
            .then(data => data);
    });

    let usuarioEncontrado = false;
    let usuarioInfo;

    // Itera pelos blocos no JSON
    for (const bloco in content) {
        if (content.hasOwnProperty(bloco)) {
            if (content[bloco].numero === logado) {
                usuarioInfo = content[bloco];
                usuarioEncontrado = true;
                break;
            }
        }
    }

    return { usuarioEncontrado, usuarioInfo };
};

// Função para enviar o menu
const enviarMenu = async (message, usuarioInfo) => {
    //console.log(`Enviando Menu!\nUsuário: ${message.from}\n`);
    
    const saldoAtual = usuarioInfo ? usuarioInfo.saldo : "Não Cadastrado";
    const codigo_d_convite = usuarioInfo ? usuarioInfo.codigo_de_convite : "Não Cadastrado"; 
    
    const menuText = `Wanted Store\n\n◆ ━━━━❪✪❫━━━━ ◆\n❖ Seu número: ${(message.from.split('@'))[0]}\n❖ Saldo Atual: R$: ${saldoAtual}\n❖ Codigo de Convite: ${codigo_d_convite}\n◆ ━━━━❪✪❫━━━━ ◆\n\n_ATENDIMENTO ON 24 HRS⏰_\n_GARANTIMOS LIVE E MELHOR PREÇO✅_\n_TODAS AS INFO SÃO TESTADAS✅_\n\n_🤖WANTED STORE A MELHOR STORE DA ATUALIDADE🤖_\n_QUALIDADE,PREÇO JUSTO E AGILIDADE_`;

    await botBaileys.sendPoll(message.from, menuText, {
        options: ['💰ADICIONAR SALDO', '💳 COMPRAR INFO CC’S', '💻COMPRAR CONSULTÁVEIS','⚙️ SUPORTE, CONSULTE AS NORMAS E GARANTIAS DE NOSSO MATERIAL AQUI !', '🤑 JUNTAR-SE A EQUIPE! VENHA LUCRAR CONOSCO!', '🤖 CONTATE O DESENVOLVEDOR !'],
        multiselect: false
    });

    awaitingResponse = true;
};
//=====================SESSÃO DE POLL&FUNÇÕES PRINCIPAIS By ClassicX-O-BRABO======================//
if (
  (comandokkj !== 'menu' && comandokkj !== '⚙️ suporte, consulte as normas e garantias de nosso material aqui !' && comandokkj !== '🤑 juntar-se a equipe! venha lucrar conosco!' && comandokkj !== 'pix' && comandokkj !== '🤖 contate o desenvolvedor !' && comandokkj !== '📦pacotes mix' && comandokkj !== '💸 resgate seu dinheiro !!' && comandokkj !== '👥 afilie-se !!' && comandokkj !== 'bin' && comandokkj !== '💳 comprar info cc’s' && comandokkj !== '💳cartões por nível' && comandokkj !== '💻comprar consultáveis' && comandokkj !== '' && comandokkj !== 'paguei o pix' && comandokkj !== '💰adicionar saldo' && comandokkj !== '💳cartões por bin' && comandokkj !== '💳cartões por banco' && comandokkj !== 'adicionar pix00' && comandokkj !== 'comprar info' && comandokkj !== 'falar com o suporte' && comandokkj !== 'sobre o bot' && comandokkj !== 'sticker' && comandokkj !== 'testezz' && !comandoprinc.startsWith('💳R$') && !comandoprinc.startsWith('registrar') && !comandokkj.startsWith('pix') && !comandokkj.startsWith('📦 pacote') && !comandokkj.startsWith('📊r$') && !comandoprinc.startsWith('bin')) ) {
    //console.log("Menu Acionado!")
    const usuario = message.from;
    const logado = usuario.split('@s.whatsapp.net')[0];

    // Verifica se o usuário existe no banco de dados
    const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);

    if (usuarioEncontrado) {
        await enviarMenu(message, usuarioInfo);
    } else {
      const convidador = valorcomand ? valorcomand : "0000";
      const usuario = message.from;
      const logado = usuario.split('@s.whatsapp.net')[0];
    
      async function realizarRegistro() {
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
          const page = await browser.newPage();
    
          // Navega até a URL desejada
          await page.goto('https://wanted-store.42web.io/dados/usuariosbot.json');
    
          // Obtém o conteúdo da página como JSON
          const content = await page.evaluate(() => {
              return fetch('https://wanted-store.42web.io/dados/usuariosbot.json')
                  .then(response => response.json())
                  .then(data => data);
          });
    
          let usuarioEncontrado = false;
    
          // Itera pelos blocos no JSON
          for (const bloco in content) {
              if (content.hasOwnProperty(bloco)) {
                  if (content[bloco].numero === logado) {
                      const usuarioInfo = content[bloco];
                      usuarioEncontrado = true;
    
                      // Armazena as informações em variáveis
                      const numero = usuarioInfo.numero;
                      const senha = usuarioInfo.senha;
                      const saldo = usuarioInfo.saldo;
                      const codigoDeConvite = usuarioInfo.codigo_de_convite;
                      const convidadoPor = usuarioInfo.convidado_por;
    
                      // Envia as informações via WhatsApp
                      await botBaileys.sendText(message.from, `*⚠️Usuário ${logado} Já Existe No Banco de Dados!⚠️*\n\nDigite *menu*`);
                      await browser.close();
                      break;
                  }
              }
          }
    
          await browser.close();
    
          // Verifica se o usuário foi encontrado antes de continuar
          if (!usuarioEncontrado) {
              // SEGUNDA ETAPA DO PUPPETEER ABAIXO
              const useratual = `${(message.from.split('@'))[0]}`;
              const senha = gerarSenhaAleatoria(8);
    
              const browser2 = await puppeteer.launch({args: ['--no-sandbox']});
              const page2 = await browser2.newPage();
    
              // Preencher o formulário
              await page2.goto('https://wanted-store.42web.io/formbotusr.php', {
                  waitUntil: 'domcontentloaded',
              });
    
              await page2.type('#email', useratual);
              await page2.type('#senha', senha);
              await page2.type('#convidado', convidador);
    
              // Enviar o formulário
              await Promise.all([
                  page2.waitForNavigation(), // Aguardar o redirecionamento
                  page2.click('button[name="enviarCadastro"]'), // Clicar no botão de envio
              ]);
    
              // Capturar o código-fonte da página redirecionada
              const response = await page2.content();
              if (response === '<html><head></head><body>Usuário salvo com sucesso!</body></html>') {
                  const confcadastro = `*🎉 Bem-Vindo a Wanted Store ! 🎉*\n\nLegal! Você já está dentro e pronto para começar. 😄\n\nComo um presente de boas-vindas, jogamos *R$5.00* de saldo na sua conta! 💰 Use-o para comprar CC’s de alta qualidade sempre que quiser.\n\nEnvie qualquer palavra para receber o menu! Agora é só explorar e aproveitar. 💳🛍️`;                                                                        
                  // Enviar a resposta ao usuário
                  await botBaileys.sendText(message.from, confcadastro);
              }
              // Fechar o navegador
              await browser2.close();
          }
      }
    
      realizarRegistro().catch((error) => {
          console.error('Erro:', error);
          botBaileys.sendText(message.from, 'Erro ao realizar o registro.');
      });}
  return;
}

if (comandokkj === '⚙️ suporte, consulte as normas e garantias de nosso material aqui !') {
  await botBaileys.sendText(message.from, '*⚠️ GARANTIA/REQUISITOS ⚠️*\n\n*Nossa Garantia: Live (Cartão de Crédito Ativo e Pronto para Uso) ✅*\n*Requisitos Importantes ⤵️*\n*(1. )* Teste apenas no site Google Pay.\n*(2. )* Se você vinculou o cartão e está ativo, parabéns, está funcionando! Se não vinculou, nós trocaremos para você.\n*(3. )* Para vincular, use o link abaixo:\n*Link do Google Pay 👇🏻*\nhttps://payments.google.com/gp/w/home/signup\n\n\n*(:Se Não Vinculou, Siga Estes Passos:)*\n\n• Tire um print exibindo os detalhes do cartão, juntamente com a mensagem que apareceu no Google Pay. ⚠️\n\n• Você tem um prazo de 10 minutos para fazer o teste. ⏳\n\nNúmero de Suporte da Store ⤵️\nWhatsApp: +5511917086876\n\nEnvie o print e aguarde uma resposta 🕰️');
  return;
}
if (comandokkj === '🤑 juntar-se a equipe! venha lucrar conosco!') {
  await botBaileys.sendPoll(message.from, '*🤑 JUNTAR-SE A EQUIPE! VENHA LUCRAR CONOSCO!*', {
    options: ['👥 AFILIE-SE !!', '💸 RESGATE SEU DINHEIRO !!', '❌VOLTAR AO MENU❌'],
    multiselect: false
  });
  return;
}
if (comandokkj === '💸 resgate seu dinheiro !!') {
  await botBaileys.sendPoll(message.from, '💸 RESGATE SEU DINHEIRO !!\n\n\n🎉 *Parabéns a Todos os Afiliados!* 🎉\n\nNós estamos felizes em ver todos vocês ganhando dinheiro com nosso programa de afiliados! Aqui estão as boas notícias:\n\n*💰 Pagamento de 10% em Pix*\n- Vocês ganham 10% de comissão em cada venda realizada. É grana direto no bolso!\n- Basta entrar em contato com o suporte (provedor do material vendido) para receber seus lucros em Pix.\n\n*🚀 Incentive suas Indicações*\n- Quanto mais você indicar, mais dinheiro você ganha! Portanto, compartilhe seu código de convite o máximo possível.\n- É uma chance de aumentar seus ganhos cada vez mais!\n\n*💡 Como Receber o Pagamento:*\n1. Clique no link abaixo para entrar em contato: [Link de Contato](link_aqui)\n2. Envie seu número do WhatsApp usado para indicar e convidar novos clientes.\n3. Forneça seu código de convite.\n4. Aguarde o suporte e receba seu pagamento diretamente no Pix.\n\nEstamos empolgados com o sucesso de todos vocês e ansiosos para vê-los ganhar ainda mais! Continue indicando, ganhando e aproveitando os benefícios do nosso programa de afiliados. 🤑✨', {
    options: ['👥 AFILIE-SE !!', '❌VOLTAR AO MENU❌'],
    multiselect: false
  });
  return;
}
if (comandokkj === '👥 afilie-se !!') {
  await botBaileys.sendPoll(message.from, '👥 AFILIE-SE !!\n\n\nVocê curte nosso bot de vendas? Quer ganhar uma graninha extra enquanto compartilha coisas incríveis com seus amigos? Junte-se ao nosso Programa de afiliado e faça isso acontecer!\n\n*💼 Fique na Boa:* Seu cadastro foi realizado automaticamente, seu código de indicação, fica sempre disponível no (MENU INICIAL).\n\n*📣 Divulga Geral:* Compartilhe seu código com quem quiser - amigos, família, seguidores, até com o cachorro se ele comprar alguma coisa!\n\n*💰 Dinheiro no Bolso:* A cada compra feita com seu código, você pega uma parte do bolo. Quanto mais, melhor!\n\n*📈 Controle na Mão:* Use o (MENU INICIAL ) para acompanhar seu saldo.\n\n*💸 Dinheiro no Bolso (de novo):* Sacar sua grana é fácil e rápido.\n\nJunte-se à nossa turma de afiliados e comece a fazer sua rede de contatos gastar dinheiro (de forma divertida, claro) e a ganhar uma graninha extra. Comece agora mesmo e faça seus amigos se perguntarem como você tá ficando rico tão rápido! 💸🌟\n\n━━━━━━━━❪❃❫━━━━━━━━\n\nSeu dinheiro ganho por indicação, será debitado em seu saldo no menu inicial, bastar contatar o suporte deste bot na opção *(💸RESGATE SEU DINHEIRO)* para realizar o seu saque e RECEBER NO PIX!!', {
    options: ['💸 RESGATE SEU DINHEIRO !!', '❌VOLTAR AO MENU❌'],
    multiselect: false
  });
  return;
}
if (comandokkj === '🤖 contate o desenvolvedor !') {
  await botBaileys.sendText(message.from, '*🤖 Fale Conosco -Dark Grup ☎️*\n\nE aí! Se você está afim de alugar esse bot ou só quer bater um papo sobre como ele funciona, chegou na área certa! Aqui estão as paradas:\n\n*1. Alugue o Bot 🤝*\n\n • Quer alugar nosso bot para suas próprias aventuras? Manda um salve para o desenvolvedor!\n • A gente pode conversar e ver como fazer isso acontecer.\n\n*2. Informações sobre o Sistema 🧐*\n\n • Se quiser saber como esse sistema é turbinado ou precisar de ajuda com detalhes técnicos, cola aqui.\n • Nosso time de suporte pode explicar tudo e tirar suas dúvidas.\n\n*3. Aviso Importante ⚠️*\n\n • Sacou que a responsa pelo material e saldo adicionado no bot não é nossa, né?\n • Isso fica na conta de quem usa o bot, então respeita a parada e mantém tudo na linha.\n\n*4. Chame o Suporte Técnico 🛠️*\n\n • Se der algum pau técnico ou precisar de ajuda técnica, fala com nosso suporte.\n • Eles tão aqui pra resolver qualquer perrengue técnico que pintar.\n\nBora trocar uma ideia sobre o bot e fazer essa navegação ser suave! 🤖☎️\n\n📲 *Contate Agora* - wa.me/5511917086876');
  return;
}

if (comandokkj === '📦pacotes mix') {
  (async () => {
    const usuario = message.from;
    const logado = usuario.split('@s.whatsapp.net')[0];
    const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
    const email_do_usuario = usuarioInfo.numero;
    const senha_do_usuario = usuarioInfo.senha;
    if (usuarioEncontrado) {
      //console.log("Dados de Usuário Capturados!")
    } else {
      // Se o usuário não existe, envia mensagem de erro
      await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
    }
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
  
    // Configurar os dados do POST
    const postData = {
      email: email_do_usuario,
      senha: senha_do_usuario
    };
  
    // Fazer a solicitação POST
    await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
      waitUntil: 'networkidle0',
    });
  
    const response = await page.evaluate(async (postData) => {
      const formData = new FormData();
      formData.append('email', postData.email);
      formData.append('senha', postData.senha);
  
      const fetchOptions = {
        method: 'POST',
        body: formData,
      };
  
      const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
      const text = await response.text();
  
      return text;
    }, postData);

    if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
      //console.log('Login bem-sucedido');
      // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
      //await botBaileys.sendText(message.from, response);

      // Crie um novo PageContext na mesma instância do navegador
      const page2 = await browser.newPage();
      await page2.goto('https://wanted-store.42web.io/loja/listaiptv.php');
      const response2 = await page2.content();

      // Extrair elementos do tipo <option> da resposta da segunda página
      const options = response2.match(/<option[^>]*>.*?<\/option>/g);
      
      if (options && options.length > 0) {
        const pollOptions = options.map((option) => {
          // Extrair o texto dentro da tag <option>
          const text = option.replace(/<[^>]*>/g, '');
          return text;
        });
      
        // Filtrar a opção "💳ESCOLHA UM CARTÃO AQUI💳" antes de enviar a enquete
        const filteredOptions = pollOptions.filter((option) => option !== '✅ESCOLHA UMA CATEGORIA AQUI!✅');
      
        if (filteredOptions.length > 2) {
          // Enviar enquete para o usuário com as opções filtradas
          await botBaileys.sendPoll(message.from, '📦 ESCOLHA O SEU PACOTE !!!', {
            options: filteredOptions,
            multiselect: false
          });
        } else {
          await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
        }
      } else {
        await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
      }
    } else {
      await botBaileys.sendText(message.from, 'Erro ao fazer login');
      // Aqui você pode enviar uma mensagem de erro
    }
    await browser.close();
  })();
  awaitingResponse = true;
}
if (comandoprinc === 'bin') {
  (async () => {
    try {
      const binescolhida = valorcomand ? valorcomand : '';

      if (binescolhida === '') {
        await botBaileys.sendText(message.from, 'Envie a Bin Para Pesquisar Junto Ao Comando!');
        return;
      }

      const usuario = message.from;
      const logado = usuario.split('@s.whatsapp.net')[0];
      const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
      const email_do_usuario = usuarioInfo.numero;
      const senha_do_usuario = usuarioInfo.senha;

      if (!usuarioEncontrado) {
        await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        return;
      }

      const browser = await puppeteer.launch({args: ['--no-sandbox']});
      const page = await browser.newPage();

      // Configurar os dados do POST para o primeiro login
      const postDataLogin = {
        email: email_do_usuario,
        senha: senha_do_usuario
      };

      // Fazer a solicitação POST para o primeiro login
      await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
        waitUntil: 'networkidle0',
      });

      const responseLogin = await page.evaluate(async (postData) => {
        const formData = new FormData();
        formData.append('email', postData.email);
        formData.append('senha', postData.senha);

        const fetchOptions = {
          method: 'POST',
          body: formData,
        };

        const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
        const text = await response.text();

        return text;
      }, postDataLogin);
      if (responseLogin.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
        // Configurar os dados do POST para a pesquisa da bin
        const postDataBin = {
          bin: binescolhida
        };

        const responseBin = await page.evaluate(async (postData) => {
          const formData = new FormData();
          formData.append('bin', postData.bin);

          const fetchOptions = {
            method: 'POST',
            body: formData,
          };

          const response = await fetch('https://wanted-store.42web.io/loja/listaloginsbin.php', fetchOptions);
          const text = await response.text();
          return text;
        }, postDataBin);
        
        // Extrair elementos do tipo <option> da resposta da segunda página
        
        const options = responseBin.match(/<option[^>]*>.*?<\/option>/g);
        if (options && options.length < 2) {
          await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Bin Solicitada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
          return;
        }
        if (options && options.length > 0) {
          const pollOptions = options.map((option) => {
            // Extrair o texto dentro da tag <option>
            const text = option.replace(/<[^>]*>/g, '');
            return text;
          });

          const maxOptionsPerPoll = 12;
          const totalOptions = pollOptions.length;

          for (let startIndex = 0; startIndex < totalOptions; startIndex += maxOptionsPerPoll) {
            const endIndex = Math.min(startIndex + maxOptionsPerPoll, totalOptions);
            const optionsSubset = pollOptions.slice(startIndex, endIndex);
            const filteredOptions = optionsSubset.filter((option) => option !== '💳ESCOLHA UM CARTÃO AQUI💳');
        

            if (optionsSubset.length > 0) {
              // Enviar enquete para o usuário com as opções do subconjunto
              await botBaileys.sendPoll(message.from, '🔍 CARTÃO POR BIN\n*💳 Escolha Seu Cartão !!!*', {
                options: filteredOptions,
                multiselect: false
              });
            }
          }
        } else {
          await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
        }
      } else {
        await botBaileys.sendText(message.from, 'Erro ao fazer login');
        // Aqui você pode enviar uma mensagem de erro
      }
      await browser.close();
    } catch (error) {
      console.error(error);
    }
  })();
  awaitingResponse = true;
}

if (comandokkj.startsWith('📦 pacote')) {
  (async () => {
    try {
      const nomeDaEnquete = message.voters.pollCreationMessage.name;
      let itemselecionado = '';

      // Concatenar todos os elementos do array parametros com espaço
      for (let i = 0; i < parametros.length; i++) {
        itemselecionado += parametros[i];
        if (i < parametros.length - 1) {
          itemselecionado += ' '; // Adicionar um espaço em branco após cada elemento, exceto o último
        }
      }

      // Remover o final indesejado "| Quantidade: 4"
      itemselecionado = itemselecionado.replace(/\| Quantidade: \d+/g, '');

      // Remover emojis, incluindo o '💳' do início
      itemselecionado = itemselecionado.replace(/[\u{1F600}-\u{1F6FF}💳]/gu, '');

      // Remover espaços em branco no final do texto
      itemselecionado = itemselecionado.trim();
      const usuario = message.from;
      const logado = usuario.split('@s.whatsapp.net')[0];
      const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
      const email_do_usuario = usuarioInfo.numero;
      const senha_do_usuario = usuarioInfo.senha;

      if (usuarioEncontrado) {
        //console.log("Dados de Usuário Capturados!");
      } else {
        // Se o usuário não existe, envia mensagem de erro
        await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        return; // Saia da função se o usuário não estiver cadastrado
      }

      const browser = await puppeteer.launch({args: ['--no-sandbox']});
      const page = await browser.newPage();

      // Configurar os dados do POST
      const postData = {
        email: email_do_usuario,
        senha: senha_do_usuario
      };

      // Fazer a solicitação POST para o login
      await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
        waitUntil: 'networkidle0',
      });

      const loginResponse = await page.evaluate(async (postData) => {
        const formData = new FormData();
        formData.append('email', postData.email);
        formData.append('senha', postData.senha);

        const fetchOptions = {
          method: 'POST',
          body: formData,
        };

        const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
        const text = await response.text();

        return text;
      }, postData);

      if (loginResponse.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
        //console.log('Login bem-sucedido');
      
        // Agora, faça a requisição POST para https://wanted-store.42web.io/func/comprarloginkk.php
        const compraData = {
          usuario: email_do_usuario,
          tipo: itemselecionado
        };
      
        const compraResponse = await page.evaluate(async (compraData) => {
          const formData = new FormData();
          formData.append('usuario', compraData.usuario);
          formData.append('tipo', compraData.tipo);
      
          const fetchOptions = {
            method: 'POST',
            body: formData,
          };
      
          const response = await fetch('https://wanted-store.42web.io/func/comprariptvkk.php', fetchOptions);
          const text = await response.text();
      
          return text;
        }, compraData);
      
        // Feche o navegador após o uso
        await browser.close();
        //await botBaileys.sendText(message.from, itemselecionado);
        //await botBaileys.sendText(message.from, email_do_usuario);
        //await botBaileys.sendText(message.from, compraResponse);
        // Use cheerio para analisar a resposta HTML
        const $ = cheerio.load(compraResponse);
        if (compraResponse.includes('Saldo insuficiente para realizar a Compra do Pacote.')) {
          await botBaileys.sendText(message.from, '*❌SALDO INSUFICIENTE PARA PROSSEGUIR COM A COMPRA DESTE PACOTE!❌*');
          return;
        }
        if (compraResponse.includes('Quantidade de Infos em Estoque Insuficiente Para Prosseguir com A Compra, Escolha um Pacote menor Ou Compre unitárias')) {
          await botBaileys.sendText(message.from, '*❌INFOS INSUFICIENTES EM ESTOQUE PRA QUANTIDADE ESCOLHIDA!❌*\n\nTente Novamente Mais Tarde Ou Escolha Outro Produto <3');
          return;
        }
        
// Use expressões regulares para separar as informações em grupos
const regex = /Numero Da Info: (\d+)<br>Numero: (.*?)<br>Bandeira: (.*?)<br>Tipo: (.*?)<br>Nível: (.*?)<br>Banco: (.*?)<br>País: (.*?)<br><br>/gs;

let match: RegExpExecArray | null;
let mensagemAoUsuario = '';
while ((match = regex.exec(compraResponse)) !== null) {
  const numeroInfo = match[1];
  const numero = match[2];
  const bandeira = match[3];
  const tipo = match[4];
  const nivel = match[5];
  const banco = match[6];
  const pais = match[7];

  // Concatenate all the information into a single message to send to the user
  mensagemAoUsuario += `*💳Numero Da Info*: ${numeroInfo}\n*💳Numero*: ${numero}\n*💳Bandeira*: ${bandeira}\n*💳Tipo*: ${tipo}\n*💳Nível*: ${nivel}\n*💳Banco*: ${banco}\n*💳País*: ${pais}\n\n`;
}

if (mensagemAoUsuario === '') {
  await botBaileys.sendText(message.from, email_do_usuario);
  await botBaileys.sendText(message.from, compraResponse);
  await botBaileys.sendText(message.from, 'Não foi possível encontrar informações de compra.');
} else {
  const variaveldefinitiva = `*✅COMPRA EFETUADA COM SUCESSO✅*\n\n` + mensagemAoUsuario + `━━━━━━━━❪❃❫━━━━━━━━`;
  await botBaileys.sendMedia(message.from, 'https://i.ibb.co/X2xgBW7/compra.jpg', '');
  await botBaileys.sendText(message.from, variaveldefinitiva); 
  //await botBaileys.sendText(message.from, mensagemAoUsuario);
}
      } else {
        await botBaileys.sendText(message.from, 'Erro!');
        //console.log('Erro ao efetuar o login');
        // Feche o navegador após o uso
        await browser.close();
      }
      } catch (error) {
      console.error('Ocorreu um erro:', error);
      }
      })();
      }
      if (comandokkj.startsWith('📊r$')) {
        (async () => {
          try {
            const nomeDaEnquete = message.voters.pollCreationMessage.name;
            let itemselecionado = '';

            // Concatenar todos os elementos do array parametros com espaço
            for (let i = 0; i < parametros.length; i++) {
              itemselecionado += parametros[i];
              if (i < parametros.length - 1) {
                itemselecionado += ' '; // Adicionar um espaço em branco após cada elemento, exceto o último
              }
            }
            
            // Remover o final indesejado "| Quantidade: 4"
            itemselecionado = itemselecionado.replace(/\| Quantidade: \d+/g, '');
            
            // Remover emojis, incluindo o '💳' do início
            itemselecionado = itemselecionado.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1F000}-\u{1F02F}]/gu, '');
            
            // Remover espaços em branco no final do texto
            itemselecionado = itemselecionado.trim();
            
            // Converter o texto para minúsculas
            itemselecionado = itemselecionado.toLowerCase();
            
            // Remover o valor e a quantidade
            itemselecionado = itemselecionado.replace(/\d+[kK]?\s*-\s*/g, '');
            
            // Remover o "r$" no início do texto
            itemselecionado = itemselecionado.replace(/^r\$/, '');

            itemselecionado = itemselecionado.replace(/^ - /, '');
                        
            const usuario = message.from;
            const logado = usuario.split('@s.whatsapp.net')[0];
            const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
            const email_do_usuario = usuarioInfo.numero;
            const senha_do_usuario = usuarioInfo.senha;
      
            if (usuarioEncontrado) {
              //console.log("Dados de Usuário Capturados!");
            } else {
              // Se o usuário não existe, envia mensagem de erro
              await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
              return; // Saia da função se o usuário não estiver cadastrado
            }
      
            const browser = await puppeteer.launch({args: ['--no-sandbox']});
            const page = await browser.newPage();
      
            // Configurar os dados do POST
            const postData = {
              email: email_do_usuario,
              senha: senha_do_usuario
            };
      
            // Fazer a solicitação POST para o login
            await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
              waitUntil: 'networkidle0',
            });
      
            const loginResponse = await page.evaluate(async (postData) => {
              const formData = new FormData();
              formData.append('email', postData.email);
              formData.append('senha', postData.senha);
      
              const fetchOptions = {
                method: 'POST',
                body: formData,
              };
      
              const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
              const text = await response.text();
      
              return text;
            }, postData);
      
            if (loginResponse.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
              //console.log('Login bem-sucedido');
            
              // Agora, faça a requisição POST para https://wanted-store.42web.io/func/comprarloginkk.php
              const compraData = {
                usuario: email_do_usuario,
                tipo: itemselecionado
              };
            
              const compraResponse = await page.evaluate(async (compraData) => {
                const formData = new FormData();
                formData.append('usuario', compraData.usuario);
                formData.append('tipo', compraData.tipo);
            
                const fetchOptions = {
                  method: 'POST',
                  body: formData,
                };
            
                const response = await fetch('https://wanted-store.42web.io/func/comprarconsulkkj.php', fetchOptions);
                const text = await response.text();
            
                return text;
              }, compraData);
            
              // Feche o navegador após o uso
              await browser.close();
              //await botBaileys.sendText(message.from, itemselecionado);
              //await botBaileys.sendText(message.from, email_do_usuario);
              //await botBaileys.sendText(message.from, compraResponse);
              // Use cheerio para analisar a resposta HTML
              const $ = cheerio.load(compraResponse);
              if (compraResponse.toLowerCase().includes('saldo insuficiente para realizar a compra')) {
                await botBaileys.sendText(message.from, '*❌SALDO INSUFICIENTE PARA PROSSEGUIR COM A COMPRA DESTA CONSULTÁVEL!❌*');
                return;
              }
              
              if (compraResponse.toLowerCase().includes('este tipo de consultável não está disponível em estoque!')) {
                await botBaileys.sendText(message.from, itemselecionado);
                await botBaileys.sendText(message.from, compraResponse);
                await botBaileys.sendText(message.from, '*❌CONSULTÁVEL ESCOLHIDA NÃO DISPONÍVEL EM ESTOQUE!❌*');
                return;
              }      
              
              if (compraResponse.toLowerCase().includes('valor do produto inválido. entre em contato com o suporte!')) {
                await botBaileys.sendText(message.from, '*❌Erro!❌*');
                return;
              }  
              
// Use expressões regulares para separar as informações em grupos
const regex = /Consul Escolhida:<br>([\s\S]*?)<br>Tipo: (.*?)<br>Saldo Restante: (\d+\.\d+)/g;

let mensagemAoUsuario = '';
let match: RegExpExecArray | null;
while ((match = regex.exec(compraResponse)) !== null) {
  const consulEscolhida = match[1].replace(/<br\s*\/?>/g, '\n').replace(/[\r\n]+/g, '\n').trim(); // Substitua quebras de linha duplicadas
  const tipo = match[2].trim();
  const saldoRestante = match[3];

  mensagemAoUsuario += `💳*Consul Escolhida*:\n${consulEscolhida}\n💳*Tipo*: ${tipo}\n💰*Saldo Restante*: ${saldoRestante}\n`;
}

      
      if (mensagemAoUsuario === '') {
        await botBaileys.sendText(message.from, email_do_usuario);
        await botBaileys.sendText(message.from, compraResponse);
        await botBaileys.sendText(message.from, 'Não foi possível encontrar informações de compra.');
      } else {
        const variaveldefinitiva = `*✅COMPRA EFETUADA COM SUCESSO✅*\n\n` + mensagemAoUsuario + `━━━━━━━━❪❃❫━━━━━━━━`;
        await botBaileys.sendMedia(message.from, 'https://i.ibb.co/X2xgBW7/compra.jpg', '');
        await botBaileys.sendText(message.from, variaveldefinitiva); 
        //await botBaileys.sendText(message.from, mensagemAoUsuario);
        return;
      }
            } else {
              await botBaileys.sendText(message.from, 'Erro!');
              //console.log('Erro ao efetuar o login');
              // Feche o navegador após o uso
              await browser.close();
            }
            } catch (error) {
            console.error('Ocorreu um erro:', error);
            }
            })();
            }
if (comandoprinc.startsWith('💳R$')) {
  (async () => {
    try {
      const nomeDaEnquete = message.voters.pollCreationMessage.name;
      //console.log(nomeDaEnquete)
      let itemselecionado = '';

      // Concatenar todos os elementos do array parametros com espaço
      for (let i = 0; i < parametros.length; i++) {
        itemselecionado += parametros[i];
        if (i < parametros.length - 1) {
          itemselecionado += ' '; // Adicionar um espaço em branco após cada elemento, exceto o último
        }
      }
      
      // Remover o final indesejado "| Quantidade: 4"
      itemselecionado = itemselecionado.replace(/\| Quantidade: \d+/g, '');
      
      // Remover emojis, incluindo o '💳' do início
      itemselecionado = itemselecionado.replace(/[\u{1F600}-\u{1F6FF}💳]/gu, '');
      
      // Converter para minúsculas
      itemselecionado = itemselecionado.toLowerCase();
      
      // Remover espaços em branco no final do texto
      itemselecionado = itemselecionado.trim();
      const usuario = message.from;
      const logado = usuario.split('@s.whatsapp.net')[0];
      const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
      const email_do_usuario = usuarioInfo.numero;
      const senha_do_usuario = usuarioInfo.senha;

      if (usuarioEncontrado) {
        //console.log("Dados de Usuário Capturados!");
      } else {
        // Se o usuário não existe, envia mensagem de erro
        await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        return; // Saia da função se o usuário não estiver cadastrado
      }

      const browser = await puppeteer.launch({args: ['--no-sandbox']});
      const page = await browser.newPage();

      // Configurar os dados do POST
      const postData = {
        email: email_do_usuario,
        senha: senha_do_usuario
      };

      // Fazer a solicitação POST para o login
      await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
        waitUntil: 'networkidle0',
      });

      const loginResponse = await page.evaluate(async (postData) => {
        const formData = new FormData();
        formData.append('email', postData.email);
        formData.append('senha', postData.senha);

        const fetchOptions = {
          method: 'POST',
          body: formData,
        };

        const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
        const text = await response.text();

        return text;
      }, postData);

      if (loginResponse.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
        //console.log('Login bem-sucedido');

        let compraUrl = ''; // Variável para armazenar a URL da compra
        
        // Definir a URL da compra com base no valor de nomeDaEnquete
        if (nomeDaEnquete.startsWith('💳 CARTÃO POR NÍVEL !!!')) {
          compraUrl = 'https://wanted-store.42web.io/func/comprarloginkk.php';
          //console.log(nomeDaEnquete)
          //console.log(compraUrl)
        } if (nomeDaEnquete.startsWith('🏦 CARTÃO POR BANCO !!!')) {
          compraUrl = 'https://wanted-store.42web.io/func/comprarloginbancokk.php';
          //console.log(nomeDaEnquete)
          //console.log(compraUrl)
        } if (nomeDaEnquete.startsWith('🔍 CARTÃO POR BIN')) {
          compraUrl = 'https://wanted-store.42web.io/func/comprarloginbinkk.php';
          //console.log(nomeDaEnquete)
          //console.log(compraUrl)
        }

        // Verificar se a URL de compra foi definida
        if (compraUrl !== '') {
          // Agora, faça a requisição POST para a URL da compra
          const compraData = {
            usuario: email_do_usuario,
            tipo: itemselecionado
          };

          const compraResponse = await page.evaluate(async (compraUrl, compraData) => {
            const formData = new FormData();
            formData.append('usuario', compraData.usuario);
            formData.append('tipo', compraData.tipo);
          
            const fetchOptions = {
              method: 'POST',
              body: formData,
            };
          
            const response = await fetch(compraUrl, fetchOptions);
            const text = await response.text();
          
            return text;
          }, compraUrl, compraData);
          
          // Feche o navegador após o uso
          await browser.close();
          
          // Use cheerio para analisar a resposta HTML
          const $ = cheerio.load(compraResponse);
          if (compraResponse.includes('Nenhuma Info Disponível No Momento...')) {
            await botBaileys.sendText(message.from, '*⚠️Nenhuma Info Deste Tipo em Estoque!⚠️*');
            return
          }

          if (compraResponse.includes('Saldo insuficiente para realizar a compra.')) {
            await botBaileys.sendText(message.from, '*⚠️Seu Saldo é Insuficiente Para Realizar a Compra⚠️*');
            return
          }
          
          // Extrair os valores usando seletores CSS
          const nome = $('th:contains("NOME:")').next().text().trim();
          const cpf = $('th:contains("CPF:")').next().text().trim();
          const numero = $('th:contains("Número:")').next().text().trim();
          const mes = $('th:contains("Mês:")').next().text().trim();
          const ano = $('th:contains("Ano:")').next().text().trim();
          const cvv = $('th:contains("CVV:")').next().text().trim();
          const banco = $('th:contains("Banco:")').next().text().trim();
          const bandeira = $('th:contains("Bandeira:")').next().text().trim();
          const tipo = $('th:contains("Tipo:")').next().text().trim();
          const nivel = $('th:contains("Nível:")').next().text().trim();
          const pais = $('th:contains("País:")').next().text().trim();
          const dataCompra = $('th:contains("Data da Compra:")').next().text().trim();
          const vendidoPara = $('th:contains("Vendido Para:")').next().text().trim();
          const saldoRestante = $('th:contains("Saldo Restante:")').next().text().trim();
          
          // Enviar uma mensagem ao usuário com os valores extraídos
          const mensagemAoUsuario = `*💳COMPRA EFETUADA COM SUCESSO!💳*
          
*👤Nome*: ${nome}
*🔏CPF*: ${cpf}
*💳Número*: ${numero}
*💳Mês*: ${mes}
*💳Ano*: ${ano}
*💳CVV*: ${cvv}
*🏦 Banco*: ${banco}
*🇳🇵Bandeira*: ${bandeira}
*🔎Tipo*: ${tipo}
*📊Nível*: ${nivel}
*🌎País*: ${pais}
━━━━━━━━❪❃❫━━━━━━━━
*📆Data da Compra*: ${dataCompra}
*📍Usuário*: ${vendidoPara}
*💰Saldo Restante*: ${saldoRestante}`;
          
          await botBaileys.sendMedia(message.from, 'https://i.ibb.co/X2xgBW7/compra.jpg' , '');
          await botBaileys.sendText(message.from, mensagemAoUsuario);
        } else {
          //console.log('URL de compra não definida');
          // Feche o navegador após o uso
          await browser.close();
        }
      } else {
        //console.log('Erro ao efetuar o login');
        // Feche o navegador após o uso
        await browser.close();
      }
    } catch (error) {
      console.error('Ocorreu um erro:', error);
    }
  })();
}

if (comandokkj.startsWith('pix')) {
  const valorkk = valorcomand;
  if (valorkk < pixminimo) {
    await botBaileys.sendText(message.from, '*⚠️VALOR BAIXO DEMAIS PARA GERAR O PAGAMENTO⚠️*\n\nO LIMITE MINÍMO É R$10');
    return;
  }
  if (valorkk > pixmaximo) {
    await botBaileys.sendText(message.from, '*⚠️VALOR ALTO DEMAIS PARA GERAR O PAGAMENTO⚠️*\n\nO LIMITE MÁXIMO É R$150');
    return;
  }
  if (valorkk === undefined) {
    await botBaileys.sendText(message.from, '*⚠️ INSIRA O VALOR DO PIX! ⚠️*\n\nExemplo: *pix 10*');
    return;
  } else {
    (async () => {
      const usuario = message.from;
      const logado = usuario.split('@s.whatsapp.net')[0];
      const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
      const email_do_usuario = usuarioInfo.numero;
      const senha_do_usuario = usuarioInfo.senha;

      if (usuarioEncontrado) {
        //console.log("Dados de Usuário Capturados!");

        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();

        // Configurar os dados do POST para fazer login
        const postData = {
          email: email_do_usuario,
          senha: senha_do_usuario
        };

        // Fazer a solicitação POST para fazer login
        await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
          waitUntil: 'networkidle0',
        });

        const response = await page.evaluate(async (postData) => {
          const formData = new FormData();
          formData.append('email', postData.email);
          formData.append('senha', postData.senha);

          const fetchOptions = {
            method: 'POST',
            body: formData,
          };

          const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
          const text = await response.text();

          return text;
        }, postData);

        if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
          //console.log('Login bem-sucedido');

          // Configurar os dados do POST para gerar o Pix
          const postData2 = {
            valor: valorkk
          };

          // Fazer a solicitação POST para gerar o Pix
          await page.goto('https://wanted-store.42web.io/func/pixgen.php', {
            waitUntil: 'networkidle0',
          });

          const response2 = await page.evaluate(async (postData2) => {
            const formData2 = new FormData();
            formData2.append('valor', postData2.valor);

            const fetchOptions2 = {
              method: 'POST',
              body: formData2,
            };

            const response2 = await fetch('https://wanted-store.42web.io/func/pixgen.php', fetchOptions2);
            const text2 = await response2.text();

            return text2;
          }, postData2);

          // Extrair dados relevantes da resposta da API
          const qrCode = response2.match(/<span id="qr-code".*?>(.*?)<\/span>/);
          const idPagamento = response2.match(/<span id="codigo-pagamento".*?>(.*?)<\/span>/);
          const valorPagamento = response2.match(/<h4 style="color: white;">Valor do Pagamento: (.*?)<\/h4>/);
          const pixGerado = response2.includes('<h1>PAGAMENTO GERADO COM SUCESSO!</h1><br>');

          if (pixGerado) {
            const dadospixkk = `*💠 Gerando PIX! Aguarde...*\n\n*😍 Você está prestes a comprar saldo para usar no bot!*\n\n‼️O saldo irá cair em até 1 minuto após o pagamento via pix. Caso ocorra algum erro após o pagamento, por favor avise o suporte do bot, que te ajudaremos.\n\n‼️ADICIONE APENAS O SALDO QUE IRÁ UTILIZAR, POIS NÃO FAZEMOS REEMBOLSO!\n\n\n━━━━━━━━❪❃❫━━━━━━━━\n\n💰 Valor: R$: ${valorPagamento ? valorPagamento[1] : 'N/A'}\n\n━━━━━━━━❪❃❫━━━━━━━━\n\n\n🗝️ O CÓDIGO PIX COPIA-E-COLA FOI ENVIADO EM UMA MENSAGEM SEPARADA *(ESSA MESMO ABAIXO)* PARA FACILITAR NA HORA DE COPIAR O CÓDIGO PARA EFETUAR O PAGAMENTO.`;

            await botBaileys.sendText(message.from, dadospixkk);
          } else {
            await botBaileys.sendText(message.from, 'Erro ao Gerar o Pix');
          }

          if (qrCode && qrCode[1]) {
            await botBaileys.sendText(message.from, qrCode[1]);
            await botBaileys.sendText(message.from, '*🖤AO EFETUAR O PAGAMENTO, MANDE QUALQUER MENSAGEM🖤*');            
          } else {
            await botBaileys.sendText(message.from, 'Erro ao Gerar o Pix Copia e Cola!');
          }
        } else {
          await botBaileys.sendText(message.from, 'Erro ao fazer login.');
        }
        await browser.close();
      } else {
        // Se o usuário não existe, envia mensagem de erro
        await botBaileys.sendText(message.from, '❌ Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
      }
    })();
  }
}
if (comandokkj === 'paguei o pix') {
  (async () => {
    const usuario = message.from;
    const logado = usuario.split('@s.whatsapp.net')[0];
    const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
    const email_do_usuario = usuarioInfo.numero;
    const senha_do_usuario = usuarioInfo.senha;
    if (usuarioEncontrado) {
      //console.log("Dados de Usuário Capturados!")
    } else {
      // Se o usuário não existe, envia mensagem de erro
      await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
    }
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
  
    // Configurar os dados do POST
    const postData = {
      email: email_do_usuario,
      senha: senha_do_usuario
    };
  
    // Fazer a solicitação POST
    await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
      waitUntil: 'networkidle0',
    });
  
    const response = await page.evaluate(async (postData) => {
      const formData = new FormData();
      formData.append('email', postData.email);
      formData.append('senha', postData.senha);
  
      const fetchOptions = {
        method: 'POST',
        body: formData,
      };
  
      const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
      const text = await response.text();
  
      return text;
    }, postData);

    if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
      //console.log('Login bem-sucedido');
      // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
      //await botBaileys.sendText(message.from, response);

      // Crie um novo PageContext na mesma instância do navegador
      const page2 = await browser.newPage();
      await page2.goto('https://wanted-store.42web.io/loja/central.php');
      const response2 = await page2.content();
      //await botBaileys.sendText(message.from, response2);
      await botBaileys.sendText(message.from, '*✅PAGAMENTOS ATUALIZADOS!✅*\n\nO STATUS DOS SEUS PAGAMENTOS PENDENTES FORAM ATUALIZADOS!,TODOS O PAGAMENTOS PENDENTES QUE CONSTAR COMO PAGO SERÁ CREDITADO AUTOMÁTICAMENTE\n\nSE VOCÊ PAGOU O PIX,E MESMO EXECUTANDO ESTE COMANDO NÃO CAIU O SALDO,AGUARDE ALGUNS SEGUNDOS E ATUALIZE NOVAMENTE OU CONTATE O SUPORTE!\n\nUTILIZE *menu* A QUALQUER MOMENTO PARA IR PARA O MENU');

    }

    await browser.close();
  })();
  awaitingResponse = true;
}
// Verifique se a mensagem é 'menu' e envie o menu se o usuário existir no banco de dados
if (comandokkj === 'menu') {
    //console.log("Menu Acionado!")
    const usuario = message.from;
    const logado = usuario.split('@s.whatsapp.net')[0];

    // Verifica se o usuário existe no banco de dados
    const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);

    if (usuarioEncontrado) {
        await enviarMenu(message, usuarioInfo);
    } else {
        // Se o usuário não existe, envia mensagem de erro
        await botBaileys.sendText(message.from, '*❌VOCÊ NÃO ESTÁ CADASTRADO!❌*\n\n_PARA UTILIZAR AS FUNÇÕES DESTE BOT O CADASTRO É OBRIGATÓRIO_\n\nREGISTRE-SE ENVIANDO A PALAVRA *registrar*');
    }
}
    if (comandokkj === '❌voltar ao menu❌') {
        const usuario = message.from;
        const logado = usuario.split('@s.whatsapp.net')[0];
    
        // Verifica se o usuário existe no banco de dados
        const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
    
        if (usuarioEncontrado) {
            await enviarMenu(message, usuarioInfo);
        } else {
            // Se o usuário não existe, envia mensagem de erro
            await botBaileys.sendText(message.from, '*❌VOCÊ NÃO ESTÁ CADASTRADO!❌*\n\n_PARA UTILIZAR AS FUNÇÕES DESTE BOT O CADASTRO É OBRIGATÓRIO_\n\nREGISTRE-SE ENVIANDO A PALAVRA *registrar*');
        }
    }   
    if (comandokkj === '💰adicionar saldo') {
        //console.log(`Indo ao menu de Adicionar Saldo...\nUsuário: ${message.from}\n`);
        const menuText = `Você está pronto para abastecer seu saldo e começar a gastar? Vamos lá!\n\n💡 Mínimo de R$10.00 para PIX neste bot! Mas você escolhe quanto quer colocar acima disso.\n\n*🚀 PIX AUTOMÁTICO - Passo a Passo 📲*\n\nVeja como é simples:\n\n *1. Escolha o Valor:* Decida quanto dinheiro quer adicionar. Por exemplo, se forem R$10.00, mande o comando ➡️\n*pix 10*\n\n *2. Aumente à Vontade:* Se preferir mais, só troque o valor! Quer R$15.00? Mande ➡️\n*pix 15*\n\n*3. Libere a Magia:* Depois disso, você vai receber um código PIX. Copie esse código e vá ao app do seu banco.\n\n*4. Cole e Pague:* Cole o código no Pix do seu banco e faça o pagamento. Pronto, você tem saldo turbinado!\n\nE aí, pronto para sair às compras? Se precisar de ajuda ou tiver alguma pergunta, estamos aqui! Bora lá! 💳💰🛍️`;
        await botBaileys.sendText(message.from, menuText);    
        awaitingResponse = true;
    }
    if (comandokkj === '💳 comprar info cc’s') {
        //console.log(`Indo ao menu de Escolher Info...\nUsuário: ${message.from}\n`);
        const menuText = `💳MENU DE INFOS\n\nTODAS AS INFOS ACOMPANHAM NOME E CPF!\n\nESCOLHA ABAIXO O TIPO DESEJADO`;
    
        await botBaileys.sendPoll(message.from, menuText, {
            options: ['💳CARTÕES POR BANCO', '💳CARTÕES POR NÍVEL', '💳CARTÕES POR BIN', '📦PACOTES MIX', '❌VOLTAR AO MENU❌'],
            multiselect: false
        });
    
        awaitingResponse = true;
    }
    if (comandokkj === '💳cartões por bin') {
        (async () => {
            const usuario = message.from;
            const logado = usuario.split('@s.whatsapp.net')[0];
            const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
            const email_do_usuario = usuarioInfo.numero;
            const senha_do_usuario = usuarioInfo.senha;
            if (usuarioEncontrado) {
              //console.log("Dados de Usuário Capturados!")
            } else {
              // Se o usuário não existe, envia mensagem de erro
              await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
            }
            const browser = await puppeteer.launch({args: ['--no-sandbox']});
            const page = await browser.newPage();
          
            // Configurar os dados do POST
            const postData = {
              email: email_do_usuario,
              senha: senha_do_usuario
            };
          
            // Fazer a solicitação POST
            await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
              waitUntil: 'networkidle0',
            });
          
            const response = await page.evaluate(async (postData) => {
              const formData = new FormData();
              formData.append('email', postData.email);
              formData.append('senha', postData.senha);
          
              const fetchOptions = {
                method: 'POST',
                body: formData,
              };
          
              const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
              const text = await response.text();
          
              return text;
            }, postData);
        
            if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
              //console.log('Login bem-sucedido');
              // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
              //await botBaileys.sendText(message.from, response);
        
              // Crie um novo PageContext na mesma instância do navegador
              const page2 = await browser.newPage();
              await page2.goto('https://wanted-store.42web.io/loja/listaloginsbin.php');
              const response2 = await page2.content();
        
              // Extrair elementos do tipo <option> da resposta da segunda página
              const options = response2.match(/<option[^>]*>.*?<\/option>/g);
              
              if (options && options.length > 0) {
                const pollOptions = options.map((option) => {
                  // Extrair o texto dentro da tag <option>
                  const text = option.replace(/<[^>]*>/g, '');
                  return text;
                });
              
                const maxOptionsPerPoll = 12;
                const totalOptions = pollOptions.length;
              
                for (let startIndex = 0; startIndex < totalOptions; startIndex += maxOptionsPerPoll) {
                  const endIndex = Math.min(startIndex + maxOptionsPerPoll, totalOptions);
                  const optionsSubset = pollOptions.slice(startIndex, endIndex);
                  const filteredOptions = optionsSubset.filter((option) => option !== '💳ESCOLHA UM CARTÃO AQUI💳');
          
              
                  if (optionsSubset.length > 0) {
                    // Enviar enquete para o usuário com as opções do subconjunto
                    await botBaileys.sendPoll(message.from, '🔍 CARTÃO POR BIN\n*💳 Escolha Seu Cartão !!!*', {
                      options: filteredOptions,
                      multiselect: false
                    });
                  }
                }
              } else {
                await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
              }    
                  } else {
              await botBaileys.sendText(message.from, 'Erro ao fazer login');
              // Aqui você pode enviar uma mensagem de erro
            }
            await botBaileys.sendText(message.from, '*🔎 Consulte uma Bin 🔍*\nUtilize o exemplo abaixo ⬇️\n\n*bin 550209*\n\nE terá o resultado em instantes…');
            await browser.close();
          })();
          awaitingResponse = true;
        }
    if (comandokkj === '💳cartões por banco') {
        (async () => {
            const usuario = message.from;
            const logado = usuario.split('@s.whatsapp.net')[0];
            const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
            const email_do_usuario = usuarioInfo.numero;
            const senha_do_usuario = usuarioInfo.senha;
            if (usuarioEncontrado) {
              //console.log("Dados de Usuário Capturados!")
            } else {
              // Se o usuário não existe, envia mensagem de erro
              await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
            }
            const browser = await puppeteer.launch({args: ['--no-sandbox']});
            const page = await browser.newPage();
          
            // Configurar os dados do POST
            const postData = {
              email: email_do_usuario,
              senha: senha_do_usuario
            };
          
            // Fazer a solicitação POST
            await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
              waitUntil: 'networkidle0',
            });
          
            const response = await page.evaluate(async (postData) => {
              const formData = new FormData();
              formData.append('email', postData.email);
              formData.append('senha', postData.senha);
          
              const fetchOptions = {
                method: 'POST',
                body: formData,
              };
          
              const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
              const text = await response.text();
          
              return text;
            }, postData);
        
            if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
              //console.log('Login bem-sucedido');
              // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
              //await botBaileys.sendText(message.from, response);
        
              // Crie um novo PageContext na mesma instância do navegador
              const page2 = await browser.newPage();
              await page2.goto('https://wanted-store.42web.io/loja/listaloginsbanco.php');
              const response2 = await page2.content();
        
              // Extrair elementos do tipo <option> da resposta da segunda página
              const options = response2.match(/<option[^>]*>.*?<\/option>/g);
              
              if (options && options.length > 0) {
                const pollOptions = options.map((option) => {
                  // Extrair o texto dentro da tag <option>
                  const text = option.replace(/<[^>]*>/g, '');
                  return text;
                });
              
                const maxOptionsPerPoll = 12;
                const totalOptions = pollOptions.length;
              
                for (let startIndex = 0; startIndex < totalOptions; startIndex += maxOptionsPerPoll) {
                  const endIndex = Math.min(startIndex + maxOptionsPerPoll, totalOptions);
                  const optionsSubset = pollOptions.slice(startIndex, endIndex);
                  const filteredOptions = optionsSubset.filter((option) => option !== '💳ESCOLHA UM CARTÃO AQUI💳');
          
              
                  if (optionsSubset.length > 0) {
                    // Enviar enquete para o usuário com as opções do subconjunto
                    await botBaileys.sendPoll(message.from, '🏦 CARTÃO POR BANCO !!!\n*💳 Escolha Seu Cartão !!!*', {
                      options: filteredOptions,
                      multiselect: false
                    });
                  }
                }
              } else {
                await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
              }    
                } else {
              await botBaileys.sendText(message.from, 'Erro ao fazer login');
              // Aqui você pode enviar uma mensagem de erro
            }
            await browser.close();
          })();
          awaitingResponse = true;
        }
    if (comandokkj === '💳cartões por nível') {
      (async () => {
        const usuario = message.from;
        const logado = usuario.split('@s.whatsapp.net')[0];
        const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
        const email_do_usuario = usuarioInfo.numero;
        const senha_do_usuario = usuarioInfo.senha;
        if (usuarioEncontrado) {
          //console.log("Dados de Usuário Capturados!")
        } else {
          // Se o usuário não existe, envia mensagem de erro
          await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        }
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
      
        // Configurar os dados do POST
        const postData = {
          email: email_do_usuario,
          senha: senha_do_usuario
        };
      
        // Fazer a solicitação POST
        await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
          waitUntil: 'networkidle0',
        });
      
        const response = await page.evaluate(async (postData) => {
          const formData = new FormData();
          formData.append('email', postData.email);
          formData.append('senha', postData.senha);
      
          const fetchOptions = {
            method: 'POST',
            body: formData,
          };
      
          const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
          const text = await response.text();
      
          return text;
        }, postData);
    
        if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
          //console.log('Login bem-sucedido');
          // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
          //await botBaileys.sendText(message.from, response);
    
          // Crie um novo PageContext na mesma instância do navegador
          const page2 = await browser.newPage();
          await page2.goto('https://wanted-store.42web.io/loja/listalogins.php');
          const response2 = await page2.content();
    
          // Extrair elementos do tipo <option> da resposta da segunda página
          const options = response2.match(/<option[^>]*>.*?<\/option>/g);
          
          if (options && options.length > 0) {
            const pollOptions = options.map((option) => {
              // Extrair o texto dentro da tag <option>
              const text = option.replace(/<[^>]*>/g, '');
              return text;
            });
          
            const maxOptionsPerPoll = 12;
            const totalOptions = pollOptions.length;
          
            for (let startIndex = 0; startIndex < totalOptions; startIndex += maxOptionsPerPoll) {
              const endIndex = Math.min(startIndex + maxOptionsPerPoll, totalOptions);
              const optionsSubset = pollOptions.slice(startIndex, endIndex);
              const filteredOptions = optionsSubset.filter((option) => option !== '💳ESCOLHA UM CARTÃO AQUI💳');
          
              if (optionsSubset.length > 0) {
                // Enviar enquete para o usuário com as opções do subconjunto
                await botBaileys.sendPoll(message.from, '💳 CARTÃO POR NÍVEL !!!\n*💳 Escolha Seu Cartão !!!*', {
                  options: filteredOptions,
                  multiselect: false
                });
              }
            }
          } else {
            await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
          }          
        } else {
          await botBaileys.sendText(message.from, 'Erro ao fazer login');
          // Aqui você pode enviar uma mensagem de erro
        }
        await browser.close();
      })();
      awaitingResponse = true;
    }
    if (comandokkj === '💻comprar consultáveis') {
      (async () => {
        const usuario = message.from;
        const logado = usuario.split('@s.whatsapp.net')[0];
        const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
        const email_do_usuario = usuarioInfo.numero;
        const senha_do_usuario = usuarioInfo.senha;
        if (usuarioEncontrado) {
          //console.log("Dados de Usuário Capturados!")
        } else {
          // Se o usuário não existe, envia mensagem de erro
          await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        }
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
      
        // Configurar os dados do POST
        const postData = {
          email: email_do_usuario,
          senha: senha_do_usuario
        };
      
        // Fazer a solicitação POST
        await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
          waitUntil: 'networkidle0',
        });
      
        const response = await page.evaluate(async (postData) => {
          const formData = new FormData();
          formData.append('email', postData.email);
          formData.append('senha', postData.senha);
      
          const fetchOptions = {
            method: 'POST',
            body: formData,
          };
      
          const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
          const text = await response.text();
      
          return text;
        }, postData);
    
        if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
          //console.log('Login bem-sucedido');
          // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
          //await botBaileys.sendText(message.from, response);
    
          // Crie um novo PageContext na mesma instância do navegador
          const page2 = await browser.newPage();
          await page2.goto('https://wanted-store.42web.io/loja/listaconsul.php');
          const response2 = await page2.content();
    
          // Extrair elementos do tipo <option> da resposta da segunda página
          const options = response2.match(/<option[^>]*>.*?<\/option>/g);
          
          if (options && options.length > 0) {
            const pollOptions = options.map((option) => {
              // Extrair o texto dentro da tag <option>
              const text = option.replace(/<[^>]*>/g, '');
              return text;
            });
          
            const maxOptionsPerPoll = 12;
            const totalOptions = pollOptions.length;
          
            for (let startIndex = 0; startIndex < totalOptions; startIndex += maxOptionsPerPoll) {
              const endIndex = Math.min(startIndex + maxOptionsPerPoll, totalOptions);
              const optionsSubset = pollOptions.slice(startIndex, endIndex);
              const filteredOptions = optionsSubset.filter((option) => option !== '📊ESCOLHA UMA CONSULTÁVEL AQUI📊');
          
              if (filteredOptions.length >= 2) {
                // Enviar enquete para o usuário com as opções do subconjunto
                await botBaileys.sendPoll(message.from, '💻 CARTÃO CONSULTÁVEL !!!\n*💻 Escolha Sua Consultável !!!*', {
                  options: filteredOptions,
                  multiselect: false
                });
              }
            }
          } else {
            await botBaileys.sendText(message.from, '*⚠️Nenhuma Consultável Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
          }          
        } else {
          await botBaileys.sendText(message.from, 'Erro ao fazer login');
          // Aqui você pode enviar uma mensagem de erro
        }
        await browser.close();
      })();
      awaitingResponse = true;
    } else {
//=====================SESSÃO DE COMANDOS ALTERNATIVOS By ClassicX-O-BRABO==========================//
        const command = message.body.toLowerCase().trim();
        //console.log(command)
        switch (command) {
            case 'adicionar pix00':
                await botBaileys.sendText(message.from, 'Obvio que é obvio ?');
                break;
            case 'comprar info':
                await botBaileys.sendText(message.from, 'Agora Sim é Um Comando ?');
                break;    
            case 'falar com o suporte':
                await botBaileys.sendMedia(message.from, 'https://github.com/Diikk55/sdgs/blob/main/imagens/compra.jpeg?raw=true', 'test');
                break;
            case 'sobre o bot':
                await botBaileys.sendFile(message.from, 'https://github.com/pedrazadixon/sample-files/raw/main/sample_pdf.pdf');
                break;
            case 'sticker':
                await botBaileys.sendSticker(message.from, 'https://gifimgs.com/animations/anime/dragon-ball-z/Goku/goku_34.gif', { pack: 'User', author: 'Me' });
                break;
                case 'testezz':
                    const usuario = message.from;
                    const logado = usuario.split('@s.whatsapp.net')[0];
                    //const logado = '5521997208858';
                    (async () => {
                      const browser = await puppeteer.launch({args: ['--no-sandbox']});
                        const page = await browser.newPage();
                
                        // Navega até a URL desejada
                        await page.goto('https://wanted-store.42web.io/dados/usuariosbot.json');
                
                        // Obtém o conteúdo da página como JSON
                        const content = await page.evaluate(() => {
                            return fetch('https://wanted-store.42web.io/dados/usuariosbot.json')
                                .then(response => response.json())
                                .then(data => data);
                        });
                
                        let usuarioEncontrado = false;
                
                        // Itera pelos blocos no JSON
                        for (const bloco in content) {
                            if (content.hasOwnProperty(bloco)) {
                                if (content[bloco].numero === logado) {
                                    const usuarioInfo = content[bloco];
                                    usuarioEncontrado = true;
                
                                    // Armazena as informações em variáveis
                                    const numero = usuarioInfo.numero;
                                    const senha = usuarioInfo.senha;
                                    const saldo = usuarioInfo.saldo;
                                    const codigoDeConvite = usuarioInfo.codigo_de_convite;
                                    const convidadoPor = usuarioInfo.convidado_por;
                
                                    // Envia as informações via WhatsApp
                                    await botBaileys.sendText(message.from, `Logado Como: ${logado}`);
                                    await botBaileys.sendText(message.from, `Número: ${numero}`);
                                    await botBaileys.sendText(message.from, `Senha: ${senha}`);
                                    await botBaileys.sendText(message.from, `Saldo: ${saldo}`);
                                    await botBaileys.sendText(message.from, `Código de Convite: ${codigoDeConvite}`);
                                    await botBaileys.sendText(message.from, `Convidado Por: ${convidadoPor}`);
                                    break;
                                }
                            }
                        }
                
                        if (!usuarioEncontrado) {
                            console.log(content);
                            // Usuário não encontrado no JSON
                            await botBaileys.sendText(message.from, `BEM VINDO A WANTED STORE\n\n⚠️Usuário ${logado} Não Cadastrado!⚠️\n\nUtilize registrar Para Se Registrar No Bot!\n\nExemplo:\n\n*registrar*\n\n✅Nosso Bot é Integrado Também Com Nossa Store Via Site,Seu Numero(com o 55) e Senha Gerada Após o Registro Podem também ser Usados para login no nosso Site!`);
                        }
                
                        await browser.close();
                    })();
                
                    break;
                    case 'registrardebugg':
                        if (command === 'registrar') {
                            const usuario = message.from;
                            const logado = usuario.split('@s.whatsapp.net')[0];
                    
                            async function realizarRegistro() {
                              const browser = await puppeteer.launch({args: ['--no-sandbox']});
                                const page = await browser.newPage();
                    
                                // Navega até a URL desejada
                                await page.goto('https://wanted-store.42web.io/dados/usuariosbot.json');
                    
                                // Obtém o conteúdo da página como JSON
                                const content = await page.evaluate(() => {
                                    return fetch('https://wanted-store.42web.io/dados/usuariosbot.json')
                                        .then(response => response.json())
                                        .then(data => data);
                                });
                    
                                let usuarioEncontrado = false;
                    
                                // Itera pelos blocos no JSON
                                for (const bloco in content) {
                                    if (content.hasOwnProperty(bloco)) {
                                        if (content[bloco].numero === logado) {
                                            const usuarioInfo = content[bloco];
                                            usuarioEncontrado = true;
                    
                                            // Armazena as informações em variáveis
                                            const numero = usuarioInfo.numero;
                                            const senha = usuarioInfo.senha;
                                            const saldo = usuarioInfo.saldo;
                                            const codigoDeConvite = usuarioInfo.codigo_de_convite;
                                            const convidadoPor = usuarioInfo.convidado_por;
                    
                                            // Envia as informações via WhatsApp
                                            await botBaileys.sendText(message.from, `*⚠️Usuário ${logado} Já Existe No Banco de Dados!⚠️*\n\nDigite *menu*`);
                                            break;
                                        }
                                    }
                                }
                    
                                await browser.close();
                    
                                // Verifica se o usuário foi encontrado antes de continuar
                                if (!usuarioEncontrado) {
                                    // SEGUNDA ETAPA DO PUPPETEER ABAIXO
                                    const useratual = `${(message.from.split('@'))[0]}`;
                                    const senha = gerarSenhaAleatoria(8);
                    
                                    const browser2 = await puppeteer.launch({args: ['--no-sandbox']});
                                    const page2 = await browser2.newPage();
                    
                                    // Preencher o formulário
                                    await page2.goto('https://wanted-store.42web.io/formbotusr.php', {
                                        waitUntil: 'domcontentloaded',
                                    });
                    
                                    await page2.type('#email', useratual);
                                    await page2.type('#senha', senha);
                                    await page2.type('#convidado', '44444');
                    
                                    // Enviar o formulário
                                    await Promise.all([
                                        page2.waitForNavigation(), // Aguardar o redirecionamento
                                        page2.click('button[name="enviarCadastro"]'), // Clicar no botão de envio
                                    ]);
                    
                                    // Capturar o código-fonte da página redirecionada
                                    const response = await page2.content();
                                    if (response === '<html><head></head><body>Usuário salvo com sucesso!</body></html>') {
                                        const confcadastro = `*✅CADASTRADO COM SUCESSO!*\n\nUsuario: ${useratual}\nSenha De Login: ${senha}\n\nO Login Neste Bot é Automático,Seu Numero(No Formato 55) e Senha Servem para acessar sua conta atráves de nossa loja via Site,Guarde Sua Senha em um Local Seguro!`;                                                                        
                                        // Enviar a resposta ao usuário
                                        await botBaileys.sendText(message.from, confcadastro);
                                    }
                                    
                    
                                    // Fechar o navegador
                                    await browser2.close();
                                }
                            }
                    
                            realizarRegistro().catch((error) => {
                                console.error('Erro:', error);
                                botBaileys.sendText(message.from, 'Erro ao realizar o registro.');
                            });
                        } else {
                            await botBaileys.sendText(message.from, 'Erro:Erro Inesperado!');
                        }
                        break;
                    }                    
        awaitingResponse = false;
    }
});



