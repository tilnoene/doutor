//const keepAlive = require('./server.js');

const Discord = require('discord.js');
const client = new Discord.Client();

const cron = require('cron');

const everyEightHours = new cron.CronJob('*/10 * * * *', () => {
  console.log('De oito em oito horas...');

  client.users.fetch('334685428596604939', false).then((user) => {
    //user.send('hello world');
    console.log('oi');
  });
});

client.on('ready', () => {
  console.log('BOT is online!');
});

//keepAlive();
//everyEightHours.start();
client.login(process.env.DISCORD_TOKEN);