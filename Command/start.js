const bot = require("../Config/bot");

const start = function (msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Selamat datang, silahkan pilih menu ", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "/start",
          },
          {
            text: "/survey",
          },
        ],
        [
          {
            text: "/input_tim",
          },
          {
            text: "/tabulasi",
          },
        ],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
};

module.exports = {
  start,
};
