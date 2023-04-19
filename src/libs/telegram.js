const TelegramBot = require("node-telegram-bot-api");
const logger = require("../libs/logger");
const messages = require("../data/messages.json");
const buttons = require("../data/buttons.json");
const fs = require("fs");

module.exports = {
  start(token) {
    const partyPictureBuffer = fs.readFileSync("src/data/party-min.jpg");
    const classesPictureBuffer = fs.readFileSync("src/data/classes-min.jpg");

    const bot = new TelegramBot(token, {
      polling: true,
    });

    bot.on("polling_error", (err) => {
      logger.error(err);
    });

    // Start handler
    const startHandlerPattern = "/start";
    bot.onText(new RegExp(startHandlerPattern), async (msg, _) => {
      const chatId = msg.chat.id;
      logger.info(`[${chatId}] Accept ${startHandlerPattern} message`);

      await bot.sendMessage(
        chatId,
        messages.startText,
        formOf(buttons.classes, buttons.party)
      );
    });

    // Master-classes handler
    const masterClassPattern = `${buttons.classes.text}`;
    bot.onText(new RegExp(masterClassPattern), async (message, _) => {
      const chatId = message.chat.id;
      logger.info(`[${chatId}] Accept '${masterClassPattern}' message`);

      await bot.sendPhoto(chatId, classesPictureBuffer);

      await bot.sendMessage(
        chatId,
        messages.classesText,
        formOf([buttons.classesSingUp], [buttons.party])
      );
    });

    const formOf = (...buttons) => {
      if (buttons[0] instanceof Array) {
        return {
          reply_markup: {
            keyboard: buttons,
            resize_keyboard: true,
          },
        };
      } else {
        return {
          reply_markup: {
            keyboard: [buttons],
            resize_keyboard: true,
          },
        };
      }
    };
  },
};
