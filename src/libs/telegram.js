const TelegramBot = require("node-telegram-bot-api");
const logger = require("../libs/logger");
const messages = require("../data/messages.json");
const buttons = require("../data/buttons.json");
const fs = require("fs");

module.exports = {
  start(token) {
    const id = 5963645279;
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

      await sendMessage(
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

      await sendMessage(
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

      const reply = await sendMessage(chatId, messages.classesSingUpText, {
        reply_markup: {
          resize_keyboard: true,
          force_reply: true,
        },
      });

      bot.onReplyToMessage(
        reply.chat.id,
        reply.message_id,
        async (replyCallBack) => {
          sendMessage(
            chatId,
            messages.classesCashDoneText,
            formOf(
              [buttons.classesPayCard, buttons.classesPayCash],
              [buttons.party]
            )
          );
          logger.info(
            `[${chatId}] CLIENT WANT TO CLASSES ${replyCallBack.text}`
          );
          fs.appendFileSync(
            "src/data/classes-peoples.txt",
            `${replyCallBack.text}\n`
          );
          await sendMessage(id, `CLIENT WANT TO CLASSES ${replyCallBack.text}`);
        }
      );
    });

    // Master-classes pay cash handler
    const masterClassPayCashPattern = `${buttons.classesPayCash.text}`;
    bot.onText(new RegExp(masterClassPayCashPattern), async (message, _) => {
      const chatId = message.chat.id;
      logger.info(`[${chatId}] Accept '${masterClassPayCashPattern}' message`);

      const reply = await sendMessage(
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

      await sendMessage(
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

      await sendMessage(
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

      await sendMessage(
        chatId,
        messages.classesCardRuText,
        formOf(
          [buttons.classesPayCardTr, buttons.classesPayCardRu],
          [buttons.classesPayCash],
          [buttons.party]
        )
      );
    });

    // Party handler
    const partyHandlerPattern = `${buttons.party.text}`;
    bot.onText(new RegExp(partyHandlerPattern), async (msg, _) => {
      const chatId = msg.chat.id;
      logger.info(`[${chatId}] Accept ${partyHandlerPattern} message`);

      await bot.sendPhoto(chatId, partyPictureBuffer);

      await sendMessage(
        chatId,
        messages.partyText,
        formOf([buttons.partySignUp], [buttons.classes])
      );
    });

    // Party sign up handler
    const partySingUpHandlerPattern = `${buttons.partySignUp.text}`;
    bot.onText(new RegExp(partySingUpHandlerPattern), async (msg, _) => {
      const chatId = msg.chat.id;
      logger.info(`[${chatId}] Accept ${partySingUpHandlerPattern} message`);

      const reply = await sendMessage(chatId, messages.partySignUpText, {
        reply_markup: {
          // keyboard: [[buttons.partySignUp], [buttons.classes]],
          resize_keyboard: true,
          force_reply: true,
        },
      });

      bot.onReplyToMessage(
        reply.chat.id,
        reply.message_id,
        async (replyCallBack) => {
          sendMessage(
            chatId,
            messages.partySignUpResultText,
            formOf(
              [buttons.partyPayCash],
              [buttons.partyCardTr],
              [buttons.partyCardRu]
            )
          );
          logger.info(`[${chatId}] CLIENT WANT TO PARTY ${replyCallBack.text}`);
          fs.appendFileSync(
            "src/data/party-peoples.txt",
            `${replyCallBack.text}\n`
          );
          await sendMessage(id, `CLIENT WANT TO PARTY ${replyCallBack.text}`);
        }
      );
    });

    // Party pay cash handler
    const partyPayCashHandlerPattern = `${buttons.partyPayCash.text}`;
    bot.onText(new RegExp(partyPayCashHandlerPattern), async (msg, _) => {
      const chatId = msg.chat.id;
      logger.info(`[${chatId}] Accept ${partyPayCashHandlerPattern} message`);

      await sendMessage(
        chatId,
        messages.partyCashText,
        formOf([buttons.partyCardRu, buttons.partyCardTr], [buttons.classes])
      );
    });

    // Party pay card TR handler
    const partyPayCardTrHandlerPattern = `${buttons.partyCardTr.text}`;
    bot.onText(new RegExp(partyPayCardTrHandlerPattern), async (msg, _) => {
      const chatId = msg.chat.id;
      logger.info(`[${chatId}] Accept ${partyPayCardTrHandlerPattern} message`);

      await sendMessage(
        chatId,
        messages.partyCardTrText,
        formOf([buttons.partyCardRu, buttons.partyPayCash], [buttons.classes])
      );
    });

    // Party pay card RU handler
    const partyPayCardRuHandlerPattern = `${buttons.partyCardRu.text}`;
    bot.onText(new RegExp(partyPayCardRuHandlerPattern), async (msg, _) => {
      const chatId = msg.chat.id;
      logger.info(`[${chatId}] Accept ${partyPayCardRuHandlerPattern} message`);

      await sendMessage(
        chatId,
        messages.partyCardRuText,
        formOf([buttons.partyCardTr, buttons.partyPayCash], [buttons.classes])
      );
    });

    const sendMessage = async (chatId, message, form) => {
      try {
        return await bot.sendMessage(chatId, message, form);
      } catch (e) {
        logger.error(`[${chatId}] Error while sending a message: ${e}`);
      }
    };

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
