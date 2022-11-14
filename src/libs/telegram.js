const TelegramBot = require('node-telegram-bot-api');
const { JokesHandler } = require('../handlers/jokes.handler');

module.exports = {
  start(token) {
    const bot = new TelegramBot(token, { polling: true });

    const jokesHandler = JokesHandler(bot);

    bot.on('message', (msg) => {
      jokesHandler(msg);
    });
  },
};
