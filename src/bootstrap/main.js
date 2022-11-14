const logger = require('../libs/logger');
const config = require('../libs/config');
const telegram = require('../libs/telegram');

function main() {
  const token = config.get('BOT_TOKEN');

  telegram.start(token);

  logger.info('Telegram started');
}

main();
