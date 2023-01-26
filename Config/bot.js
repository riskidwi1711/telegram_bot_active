// File index.js

const TelegramBot = require("node-telegram-bot-api");
const config = require("../config");
const bot = new TelegramBot(config.botToken, { polling: true });

module.exports = bot


