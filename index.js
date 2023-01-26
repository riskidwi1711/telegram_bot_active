// File index.js

const InputTim = require("./Command/inputrelawan");
const { start } = require("./Command/start");
const SurveyCommand = require("./Command/survey");
const TabulasiCommand = require("./Command/tabulasi");
const bot = require("./Config/bot");
const state = require("./State");

//declare

let botState = new state();
let commandList = ["/start", "/survey", "/input_tim", "/tabulasi", "Batal"];

//listen to new msg
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  botState.id = chatId;

  if (commandList.includes(msg.text)) {
    botState.resetStep();
    switch (msg.text) {
      case "/start":
        start(msg);
        botState.createState("/start");
        break;
      case "Batal":
        start(msg);
        botState.createState("/start");
        break;
      case "/survey":
        botState.changeState("/survey");
        let surveyCommand = new SurveyCommand(msg, botState);
        surveyCommand.survey();
        break;
      case "/input_tim":
        let input_tim = new InputTim(msg, botState);
        botState.changeState("/input_tim");
        input_tim.init();
        break;
      case "/tabulasi":
        botState.changeState("/tabulasi");
        let tabulasi = new TabulasiCommand(msg, botState);
        tabulasi.init();
        break;
    }
  } else {
    switch (botState.getState().state) {
      case "/start":
        bot.sendMessage(chatId, "akses menu start");
        break;
      case "/survey":
        let surveyCommand = new SurveyCommand(msg, botState);
        surveyCommand.survey();
        break;
      case "/input_tim":
        let input_tim = new InputTim(msg, botState);
        input_tim.init();
        break;
      case "/tabulasi":
        let tabulasi = new TabulasiCommand(msg, botState);
        tabulasi.init();
        break;
    }
  }
});

bot.on("new_chat_members", (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  const chatId = ctx.chat.id;
  newMembers.forEach((member) => {
    const name = member.first_name;
    const welcomeMessage = `Selamat datang di bot , ${name}!`;
    bot.sendMessage(chatId, welcomeMessage);
  });
});
