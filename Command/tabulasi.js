const bot = require("../Config/bot");
const ButtonBot = require("../Config/Button");
const connection = require("../Config/database");
const Dpd = require("../Model/Tabulasi/DPD");
const Dprpro = require("../Model/Tabulasi/DPRPRO");
const Dprri = require("../Model/Tabulasi/DPRRI");
const PresidenModel = require("../Model/Tabulasi/Presiden");

class TabulasiCommand {
  constructor(msg, state) {
    this.msg = msg;
    this.state = state;
    this.username = msg.from.username;
    this.chatId = msg.chat.id;
    this.ButtonBot = new ButtonBot();
    this.presidenModel = new PresidenModel();
    this.dpdModel = new Dpd();
    this.dprriModel = new Dprri();
    this.dprdModel = new Dprpro();
  }

  init() {
    this.presidenModel.getValidation(this.username, (err, res) => {
      if (err) {
        bot.sendMessage(this.chatId, "Akses dilarang");
      } else {
        if (res.length >= 1) {
          let type = ["Presiden", "DPD", "DPR-RI", "DPRD-PRO"];
          this.state.createState("/tabulasi");
          if (type.includes(this.msg.text)) {
            this.state.changeType(this.msg.text);
            this.state.resetStep();
          }
          if (
            this.state.getType() === "Presiden" ||
            this.msg.text === "Presiden"
          ) {
            this.presiden();
          } else if (
            this.state.getType() === "DPD" ||
            this.msg.text === "DPD"
          ) {
            this.DPD();
          } else if (
            this.state.getType() === "DPR-RI" ||
            this.msg.text === "DPR-RI"
          ) {
            this.DPRRI();
          } else if (
            this.state.getType() === "DPRD-PRO" ||
            this.msg.text === "DPRD-PRO"
          ) {
            this.DPRDPRO();
          } else {
            this.conversation();
          }
        } else {
          bot.sendMessage(this.chatId, "Akses dilarang");
        }
      }
    });
  }

  validateInput(input) {
    let regex = /^[0-9\n\r]+$/;
    let exec = regex.test(input);
    return exec;
  }

  conversation() {
    switch (this.state.getStep()) {
      case 0:
        bot.sendMessage(this.chatId, "Silahkan pilih kategori", {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Presiden",
                },
                {
                  text: "DPR-RI",
                },
              ],
              [
                {
                  text: "DPD",
                },
                {
                  text: "DPRD-PRO",
                },
              ],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        break;
    }
  }

  presiden() {
    switch (this.state.getStep()) {
      case 0:
        bot.sendMessage(this.chatId, "Input suara presiden").then((e) => {
          this.presidenModel.getPresiden((err, res) => {
            bot.sendMessage(
              this.chatId,
              "Silahkan masukan suara calon dengan format urutan suara \n\n" +
                res.map((es) => `${es.nama}`).join("\n")
            );
          });
        });
        this.state.goToNext();
        break;
      case 1:
        const seprated = this.msg.text.split("\n");

        if (this.validateInput(this.msg.text)) {
          this.state.setInputTabulasi(seprated);
          bot.sendMessage(
            this.chatId,
            `Apakah data yang di inputkan sudah benar ?\n\n${seprated
              .map((e) => `➡️ ` + e)
              .join("\n")}`,
            {
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "Benar",
                    },
                    {
                      text: "Ulangi",
                    },
                  ],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
              },
            }
          );
          this.state.goToNext();
        } else {
          bot.sendMessage(
            this.chatId,
            "❗Pastikan format yang dikirimkan benar"
          );
        }

        break;
      case 2:
        let data = {
          tps_id: 1,
          text: this.state.getTabulasiInput(),
          username: this.username,
        };
        if (this.msg.text === "Benar") {
          bot
            .sendMessage(this.chatId, "❕Sedang menyimpan data")
            .then((sent) => {
              this.presidenModel.savePresiden(data, (err, res) => {
                if (err) {
                  console.log(err);
                  bot
                    .editMessageText("❗Tidak berhasil menyimpan data", {
                      chat_id: this.chatId,
                      message_id: sent.message_id,
                    })
                    .then(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Input gagal, silahkan pilih ulangi atau pilih perintah yang tersedia",
                        {
                          reply_markup: {
                            keyboard: [
                              [
                                {
                                  text: "Ulangi",
                                },
                              ],
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
                        }
                      );
                    });
                } else {
                  bot
                    .editMessageText("✅ Berhasil menyimpan data", {
                      chat_id: this.chatId,
                      message_id: sent.message_id,
                    })
                    .then(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Input selesai, silahkan pilih pilih perintah yang tersedia",
                        {
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
                        }
                      );
                    })
                    .then(() => this.state.reset());
                }
              });
            });
        } else if (this.msg.text === "Ulangi") {
          this.state.goToStep(0);
          this.presiden();
        } else {
          bot.sendMessage(this.chatId, "Pilih benar atau ulangi input");
        }
        break;
    }
  }

  DPD() {
    switch (this.state.getStep()) {
      case 0:
        this.state.resetTabulasi();
        this.dpdModel.getDpd((err, res) => {
          if (err) {
            console.log(err);
          } else {
            res.map((e) => {
              this.state.setDpdId(e.id);
            });

            bot.sendMessage(
              this.chatId,
              "Silahkan masukan suara calon dengan format urutan suara \n\n" +
                res.map((es) => `${es.nama_calon}`).join("\n")
            );
          }
        });

        this.state.goToNext();
        break;
      case 1:
        const seprated = this.msg.text.split("\n");
        if (this.validateInput(this.msg.text)) {
          this.state.setInputTabulasi(seprated);
          bot.sendMessage(
            this.chatId,
            `Apakah data yang di inputkan sudah benar ?\n\n${seprated
              .map((e) => `➡️ ` + e)
              .join("\n")}`,
            {
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "Benar",
                    },
                    {
                      text: "Ulangi",
                    },
                  ],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
              },
            }
          );
          this.state.goToNext();
        } else {
          bot.sendMessage(
            this.chatId,
            "❗Pastikan format yang dikirimkan benar"
          );
        }
        break;
      case 2:
        let data = {
          tps_id: 1,
          list_id: this.state.getDpd(),
          text: this.state.getTabulasiInput(),
          username: this.username,
        };
        if (this.msg.text === "Benar") {
          bot
            .sendMessage(this.chatId, "❕Sedang menyimpan data")
            .then((sent) => {
              this.dpdModel.saveDPD(data, (err, res) => {
                if (err) {
                  console.log(err);
                  bot
                    .editMessageText("❗Tidak berhasil menyimpan data", {
                      chat_id: this.chatId,
                      message_id: sent.message_id,
                    })
                    .then(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Input gagal, silahkan pilih ulangi atau pilih perintah yang tersedia",
                        {
                          reply_markup: {
                            keyboard: [
                              [
                                {
                                  text: "Ulangi",
                                },
                              ],
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
                        }
                      );
                    });
                } else {
                  this.state.resetTabulasi();
                  this.state.reset();
                  bot
                    .editMessageText("✅ Berhasil menyimpan data", {
                      chat_id: this.chatId,
                      message_id: sent.message_id,
                    })
                    .then(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Input selesai, silahkan pilih pilih perintah yang tersedia",
                        {
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
                        }
                      );
                    });
                }
              });
            });
        } else if (this.msg.text === "Ulangi") {
          this.state.goToStep(0);
          this.DPD();
        } else {
          bot.sendMessage(this.chatId, "Pilih benar atau ulangi input");
        }
        break;
      default:
        bot.sendMessage(this.chatId, "Silahkan masukan input sesuai urutan");
        break;
    }
  }

  DPRRI() {
    switch (this.state.getStep()) {
      case 0:
        this.state.resetTabulasi();
        this.dprriModel.getPartai((err, res) => {
          if (err) {
          } else {
            let keyb = [];
            res.map((e) => {
              keyb.push({ text: e.nama_partai });
            });
            bot.sendMessage(this.chatId, "Silahkan pilih partai", {
              reply_markup: this.ButtonBot.createKeybMarkup(keyb, 2),
            });
          }
        });
        this.state.goToNext();
        break;
      case 1:
        this.dprriModel.getPartaiId(this.msg.text, (err, res) => {
          if (err) {
          } else {
            this.state.setSelectedPartai(res.id);
          }
        });
        this.dprriModel.getCalegByNamaPartai(this.msg.text, (err, res) => {
          if (err) {
            bot.sendMessage(this.chatId, "Belum ada calon");
          } else {
            if (res.length < 1) {
              bot.sendMessage(this.chatId, "Belum ada calon");
            } else {
              res.map((e) => {
                this.state.setInputDprri(e.id);
              });
              bot.sendMessage(
                this.chatId,
                "Silahkan masukan suara calon dengan format urutan suara \n\n" +
                  res
                    .map((es) => {
                      return `${es.nama_calon}`;
                    })
                    .join("\n")
              );
              this.state.goToNext();
            }
          }
        });
        break;
      case 2:
        const seprated = this.msg.text.split("\n");
        if (this.validateInput(this.msg.text)) {
          this.state.setInputTabulasi(seprated);
          bot.sendMessage(
            this.chatId,
            `Apakah data yang di inputkan sudah benar ?\n\n${seprated
              .map((e) => `➡️ ` + e)
              .join("\n")}`,
            {
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "Benar",
                    },
                    {
                      text: "Ulangi",
                    },
                  ],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
              },
            }
          );
          this.state.goToNext();
        } else {
          bot.sendMessage(
            this.chatId,
            "❗Pastikan format yang dikirimkan benar"
          );
        }
        break;
      case 3:
        let data = {
          tps_id: 1,
          selectedPartai: this.state.getSelectedPartai(),
          text: this.state.getTabulasiInput(),
          list_id: this.state.getInputDprri(),
          username: this.username,
        };
        if (this.msg.text === "Benar") {
          bot
            .sendMessage(this.chatId, "❕Sedang menyimpan data")
            .then((sent) => {
              this.dprriModel.saveInput(data, (err, res) => {
                if (err) {
                  console.log(err);
                  bot
                    .editMessageText("❗Tidak berhasil menyimpan data", {
                      chat_id: this.chatId,
                      message_id: sent.message_id,
                    })
                    .then(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Input gagal, silahkan pilih ulangi atau pilih perintah yang tersedia",
                        {
                          reply_markup: {
                            keyboard: [
                              [
                                {
                                  text: "Ulangi",
                                },
                              ],
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
                        }
                      );
                    });
                } else {
                  this.state.resetTabulasi();
                  this.state.reset();
                  bot
                    .editMessageText("✅ Berhasil menyimpan data", {
                      chat_id: this.chatId,
                      message_id: sent.message_id,
                    })
                    .then(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Input selesai, silahkan pilih perintah yang tersedia",
                        {
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
                        }
                      );
                    });
                }
              });
            });
        } else if (this.msg.text === "Ulangi") {
          this.state.goToStep(0);
          this.DPRRI();
        } else {
          bot.sendMessage(
            this.chatId,
            "Silahkan pilih benar atau ulangi input"
          );
        }
        break;
      case 4:
        bot.sendMessage(this.chatId, "end");
        break;
    }
  }

  DPRDPRO() {
    switch (this.state.getStep()) {
      case 0:
        this.state.resetTabulasi();
        this.dprdModel.getPartai((err, res) => {
          if (err) {
          } else {
            let keyb = [];
            res.map((e) => {
              keyb.push({ text: e.nama_partai });
            });
            bot.sendMessage(this.chatId, "Silahkan pilih partai", {
              reply_markup: this.ButtonBot.createKeybMarkup(keyb, 2),
            });
          }
        });
        this.state.goToNext();
        break;
      case 1:
        this.dprdModel.getPartaiId(this.msg.text, (err, res) => {
          if (err) {
          } else {
            this.state.setSelectedPartai(res.id);
          }
        });
        this.dprdModel.getCalegByNamaPartai(this.msg.text, (err, res) => {
          if (err) {
            bot.sendMessage(this.chatId, "Belum ada calon");
          } else {
            if (res.length < 1) {
              bot.sendMessage(this.chatId, "Belum ada calon");
            } else {
              res.map((e) => {
                this.state.setInputDprri(e.id);
              });
              bot.sendMessage(
                this.chatId,
                "Silahkan masukan suara calon dengan format urutan suara \n\n" +
                  res
                    .map((es) => {
                      return `${es.nama_calon}`;
                    })
                    .join("\n")
              );
              this.state.goToNext();
            }
          }
        });
        break;
      case 2:
        const seprated = this.msg.text.split("\n");
        if (this.validateInput(this.msg.text)) {
          this.state.setInputTabulasi(seprated);
          bot.sendMessage(
            this.chatId,
            `Apakah data yang di inputkan sudah benar ?\n\n${seprated
              .map((e) => `➡️ ` + e)
              .join("\n")}`,
            {
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "Benar",
                    },
                    {
                      text: "Ulangi",
                    },
                  ],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
              },
            }
          );
          this.state.goToNext();
        } else {
          bot.sendMessage(
            this.chatId,
            "❗Pastikan format yang dikirimkan benar"
          );
        }
        break;
      case 3:
        let data = {
          tps_id: 1,
          selectedPartai: this.state.getSelectedPartai(),
          text: this.state.getTabulasiInput(),
          list_id: this.state.getInputDprri(),
          username: this.username,
        };
        if (this.msg.text === "Benar") {
          bot
            .sendMessage(this.chatId, "❕Sedang menyimpan data")
            .then((sent) => {
              this.dprdModel.saveInput(data, (err, res) => {
                if (err) {
                  console.log(err);
                  bot
                    .editMessageText("❗Tidak berhasil menyimpan data", {
                      chat_id: this.chatId,
                      message_id: sent.message_id,
                    })
                    .then(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Input gagal, silahkan pilih ulangi atau pilih perintah yang tersedia",
                        {
                          reply_markup: {
                            keyboard: [
                              [
                                {
                                  text: "Ulangi",
                                },
                              ],
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
                        }
                      );
                    });
                } else {
                  this.state.resetTabulasi();
                  this.state.reset();
                  bot
                    .editMessageText("✅ Berhasil menyimpan data", {
                      chat_id: this.chatId,
                      message_id: sent.message_id,
                    })
                    .then(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Input selesai, silahkan pilih perintah yang tersedia",
                        {
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
                        }
                      );
                    });
                }
              });
            });
        } else if (this.msg.text === "Ulangi") {
          this.state.goToStep(0);
          this.Dprpro();
        } else {
          bot.sendMessage(
            this.chatId,
            "Silahkan pilih benar atau ulangi input"
          );
        }
        break;
      case 4:
        bot.sendMessage(this.chatId, "end");
        break;
    }
  }
}

module.exports = TabulasiCommand;
