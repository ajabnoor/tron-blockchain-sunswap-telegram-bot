const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '7553876036:AAG4rh8cmjYRIgg3LweIwJTFB5tuTjusAmI';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
  
    if (messageText === '/start') {
      bot.sendMessage(chatId, 'Welcome to the bot!');
    }
  });