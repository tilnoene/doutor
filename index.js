const Discord = require('discord.js');
const client = new Discord.Client();
const Database = require("@replit/database");
const db = new Database();

const keepAlive = require('./server');
const cron = require('cron');
const moment = require('moment');

const getSiteData = require('./getSiteData');
const getStatusEncomenda = require('./getStatusEncomenda');
const checkEncomenda = require('./checkEncomenda');
const sleep = require('./scripts/sleep');

// 13:50
const pc1 = new cron.CronJob('50 16 * * 2,4', () => {
  sendMessageToAllUsers('Mashup/Aula de PC1!');
});

// 21:00
const guardioesDaSaude = new cron.CronJob('0 0 * * *', () => {
  sendMessageToAllUsers('Guardiões da Saúde + Gatos e Sopas + Samsung Health + Duolingo');
});

const checarSite = new cron.CronJob('*/1 * * * *', () => {
  const user_id = process.env.TILNOENE_ID;

  client.users.fetch(user_id, false)
    .then((user) => {
      //getSiteData(user);
      checkEncomenda(user, process.env.ENCOMENDAS.split(' ')[0]);
    });
});

const sendMessageToAllUsers = (message) => {
  users_ids = process.env.USER_IDS.split(',');
  console.log(`[${(new Date(Date.now())).toISOString()}] Opa, deu a hora de enviar as mensagens!`);

  for (const user_id of users_ids) {
    client.users.fetch(user_id, false)
      .then((user) => {
        user.send(message);
        console.log(`Enviei a mensagem para ${user.username}`);
      });
  }
}

const sendMessageToUser = (message, user_id) => {
  client.users.fetch(user_id, false)
    .then((user) => {
      user.send(message);
    });
}

const sendMessageEncomendas = async (user) => {
  const encomendas = process.env.ENCOMENDAS.split(',');
  
  if (encomendas.length > 0) {
    let message = `${encomendas.length} encomenda(s) cadastrada(s)\n\n`;

    for (let i = 0; i < encomendas.length; i++) {
      let status = await getStatusEncomenda(encomendas[i]);
      // sleep(1100);

      message += status + '\n';
    }

    user.send(message);
  } else {
    user.send('Não existem encomendas cadastradas.');
  }
}

client.on('message', (message) => {
  if (!message.author.bot && !message.guild) {
    let text = message.content.toLowerCase();

    const fimDeSemestre = ['faltam', 'dias', 'vir', 'nathalia', 'nathália', 'natalia', 'vir', 'casa', 'bahia', 'amor', 'viajar', 'viagem', 'falta', 'tempo'];

    const palavrasChaveEncomenda = ['carta', 'encomenda', 'rastreio', 'rastreamento', 'status']

    const obrigado = ['obrigada', 'obrigado', 'thanks',' thank', 'obg']

    const chata = ['diagnostico', 'victor', 'chato', 'remedio', 'remédio', 'diagnóstico', 'parar']

    if (chata.some((e) => text.includes(e))) {
      message.reply(`manda fotinha, é simples`);
    } else if (fimDeSemestre.some((e) => text.includes(e))) {
      const now = moment(new Date());
      const fim = moment('2021-12-06');
      const duration = moment.duration(fim.diff(now));

      message.reply(`Faltam ${Math.ceil(duration.asDays())+1} dias para o amor da minha vida me visitar s2`);
    } else if (palavrasChaveEncomenda.some((e) => text.includes(e))) {
      if (message.author.id == process.env.TILNOENE_ID)
        sendMessageEncomendas(message.author);
    } else if (obrigado.some((e) => text.includes(e))) {
      message.reply('de nada arrombada');
    }else
      message.reply('Desculpa não sei falar sou só um gatinho :)');

    console.log(`[${(new Date(Date.now())).toISOString()}] Recebi uma mensagem!`);
    console.log(`[${message.author.username}]: ${message.content}\n`);
  }
});

client.on('ready', () => {
  console.log('Meow!');
  client.user.setActivity('sempre que sorri sou rei (rei)', { type: 'CUSTOM_STATUS' }); // STREAMING, WATCHING, CUSTOM_STATUS, PLAYING, COMPETING
  
});

keepAlive();
client.login(process.env.DISCORD_TOKEN);
checarSite.start();
guardioesDaSaude.start();
pc1.start();
