const bot = require("./bot");

class ButtonBot {
  constructor() {
    this.bot = bot;
  }

  createButton(text, callbackData) {
    return { text: text, callback_data: callbackData };
  }

  createMarkup(buttons, n) {
    const result = [];
    for (let i = 0; i < buttons.length; i += n) {
      result.push(buttons.slice(i, i + n));
    }
    return { inline_keyboard: result };
  }

  createKeybMarkup(buttons, n){
    const result = [];
    for (let i = 0; i < buttons.length; i += n) {
      result.push(buttons.slice(i, i + n));
    }
    return { keyboard: result };
  }

  sendMessage(chatId, message, buttons, n) {
    const markup = this.createMarkup(buttons, n);
    this.bot.sendMessage(chatId, message, { reply_markup: markup });
  }

  onButtonClick(callback) {
    this.bot.on('callback_query', (callbackQuery) => {
      callback(callbackQuery);
    });
  }
}

module.exports = ButtonBot;