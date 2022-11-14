const jokes = require('../data/jokes.json');

function JokesHandler(bot) {
  let msgCounter = 0;
  let randomNum = getRandomNumber();
  let indexOfJokes = 0;

  const jokesListLength = jokes.length;

  console.log('Random Num ', randomNum);

  return function (msg) {
    msgCounter += 1;
    console.log('Message Counter ', msgCounter);
    if (msgCounter === randomNum && indexOfJokes < jokesListLength) {
      randomNum = getRandomNumber();
      console.log('Random Num ', randomNum);
      msgCounter = 0;
      bot.sendMessage(msg.chat.id, jokes[indexOfJokes]);
      indexOfJokes += 1;
    }
  };
}

function getRandomNumber() {
  const min = 10;
  const max = 31;
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = {
  JokesHandler,
};
