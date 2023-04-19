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

    // Master-classes sing up handler
    const masterClassSingUpPattern = `${buttons.classesSingUp.text}`;
    bot.onText(new RegExp(masterClassSingUpPattern), async (message, _) => {
      const chatId = message.chat.id;
      logger.info(`[${chatId}] Accept '${masterClassSingUpPattern}' message`);

      await bot.sendMessage(
        chatId,
        messages.classesSingUpText,
        formOf(
          [buttons.classesPayCard, buttons.classesPayCash],
          [buttons.party]
        )
      );
    });

    // Master-classes pay card handler
    const masterClassPayCashPattern = `${buttons.classesPayCash.text}`;
    bot.onText(new RegExp(masterClassPayCashPattern), async (message, _) => {
      const chatId = message.chat.id;
      logger.info(`[${chatId}] Accept '${masterClassPayCashPattern}' message`);

      await bot.sendMessage(
        chatId,
        messages.classesCashText,
        formOf([buttons.classesPayCard], [buttons.party])
      );
    });

    // Master-classes pay card handler
    const masterClassPayCardPattern = `${buttons.classesPayCard.text}`;
    bot.onText(new RegExp(masterClassPayCardPattern), async (message, _) => {
      const chatId = message.chat.id;
      logger.info(`[${chatId}] Accept '${masterClassPayCardPattern}' message`);

      await bot.sendMessage(
        chatId,
        messages.classesCardText,
        formOf(
          [buttons.classesPayCardTr, buttons.classesPayCardRu],
          [buttons.classesPayCash],
          [buttons.party]
        )
      );
    });

    // Master-classes pay card TR handler
    const masterClassPayCardTRPattern = `${buttons.classesPayCardTr.text}`;
    bot.onText(new RegExp(masterClassPayCardTRPattern), async (message, _) => {
      const chatId = message.chat.id;
      logger.info(
        `[${chatId}] Accept '${masterClassPayCardTRPattern}' message`
      );

      await bot.sendMessage(
        chatId,
        messages.classesCardTrText,
        formOf(
          [buttons.classesPayCardTr, buttons.classesPayCardRu],
          [buttons.classesPayCash],
          [buttons.party]
        )
      );
    });

    // Master-classes pay card RU handler
    const masterClassPayCardRUPattern = `${buttons.classesPayCardRu.text}`;
    bot.onText(new RegExp(masterClassPayCardRUPattern), async (message, _) => {
      const chatId = message.chat.id;
      logger.info(
        `[${chatId}] Accept '${masterClassPayCardRUPattern}' message`
      );

      await bot.sendMessage(
        chatId,
        messages.classesCardRuText,
        formOf(
          [buttons.classesPayCardTr, buttons.classesPayCardRu],
          [buttons.classesPayCash],
          [buttons.party]
        )
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
