const bot = require("../Config/bot");
const ButtonBot = require("../Config/Button");
const SurveyModel = require("../Model/Survey");

class SurveyCommand {
  constructor(msg, state) {
    this.msg = msg;
    this.state = state;
    this.chatId = msg.chat.id;
    this.username = this.msg.from.username;
    this.buttonBot = new ButtonBot();
    this.surveyModel = new SurveyModel();

    this.selectedSurveyData = {
      id_survey: "",
      question: [],
      survey_step: 0,
    };
  }

  survey() {
    this.state.createState("/survey");
    if (this.msg.text === "/survey") {
      this.state.resetStep();
    }

    this.surveyModel.getValidation(this.msg.from.username, (err, res) => {
      if (res.length > 0) {
        this.surveyModel.getAllSlug((err, result) => {
          let slug = [];
          let msges = this.msg.text;
          if (err) {
          } else {
            result.map((sl) => {
              slug.push(sl.slug);
            });
            if (slug.includes(msges.replace("/", ""))) {
              this.surveyModel.getSurveysBySlug(
                msges.replace("/", ""),
                (err, res) => {
                  if (!err) {
                    this.surveyModel.getQuestion(res.id, (fail, succ) => {
                      if (!fail) {
                        this.state.setSelectedSurveyData({
                          id_survey: res.id,
                          question: succ,
                          survey_step: 0,
                          inData: [],
                        });
                      }
                    });
                  }
                  this.surveyModel.isInputed(
                    this.username,
                    res.id,
                    (gagal, hasi) => {
                      if (gagal) {
                      } else {
                        if (hasi.length > 0) {
                          bot.sendMessage(this.chatId, 'Sudah mengisi survey, silahkan pilih perintah yang tersedia', {
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
                        } else {
                          this.state.goToStep(1);
                          this.conversation();
                        }
                      }
                    }
                  );
                }
              );
            } else {
              this.conversation();
            }
          }
        });
      } else {
        this.state.reset();
        bot.sendMessage(this.chatId, "Tidak dapat mengakses perintah ini");
      }
    });
  }

  conversation() {
    switch (this.state.getStep()) {
      case 0:
        this.surveyModel.getSurveys((err, result) => {
          if (err) {
          } else {
            bot.sendMessage(
              this.chatId,
              `Silahkan pilih salah satu survey yang tersedia dibawah ini \n\n${result.map(
                (e) => `/${e.slug}`
              ).join('\n')}`,
              {
                reply_markup: { remove_keyboard: true },
              }
            );
          }
        });
        break;
      case 1:
        if (this.msg.text === "Mulai survey") {
          this.state.goToStep(2);
          this.conversation();
        } else if (this.msg.text === "Batal") {
          this.state.goToStep(0);
          this.conversation();
        } else {
          bot.sendMessage(
            this.chatId,
            "Pilih mulai survey untuk memulai menjawab pertanyaan",
            {
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "Mulai survey",
                    },
                    {
                      text: "Batal",
                    },
                  ],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
              },
            }
          );
        }

        break;
      case 2:
        let state = this.state.getSelectedSurveyData();
        let question = state.question;
        let step = state.survey_step;

        if (step < question.length) {
          if (question[step].type === "multi_choice") {
            this.surveyModel.getChoice(question[step].id, (err, choice) => {
              if (!err) {
                let kybd = [];
                choice.map((choic) => kybd.push({ text: choic.value }));
                bot
                  .sendMessage(this.chatId, `${question[step].pertanyaan}`, {
                    reply_markup: {
                      keyboard: [kybd],
                      one_time_keyboard: true,
                      resize_keyboard: true,
                    },
                  })
                  .then((sendMessage) => (kybd = []));
              }
            });
          } else {
            bot.sendMessage(this.chatId, question[step].pertanyaan, {
              reply_markup: { remove_keyboard: true },
            });
          }

          if (step > 0) {
            if (this.state.getInputData()) {
              this.state.setInputData(question[step - 1].id, this.msg.text);
            }
          }
          this.state.nextQuestion();
        } else {
          if (this.state.getInputData()) {
            this.state.setInputData(question[step - 1].id, this.msg.text);
          }
          this.state.goToNext();
          this.conversation();
        }
        break;
      case 3:
        let stateQ = this.state.getSelectedSurveyData();

        if (this.msg.text === "Benar") {
          bot
            .sendMessage(this.chatId, "❕Sedang menyimpan data")
            .then((sentMessage) => {
              this.surveyModel.saveSurvey(
                stateQ.id_survey,
                this.state.getInputData(),
                this.username,
                (err, res) => {
                  if (err) {
                    bot.editMessageText("❗Data tidak berhasil disimpan", {
                      chat_id: this.chatId,
                      message_id: sentMessage.message_id,
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
                  } else {
                    bot
                      .editMessageText("✅ Data berhasil disimpan", {
                        chat_id: this.chatId,
                        message_id: sentMessage.message_id,
                      })
                      .then((edited) => {
                        this.state.goToStep(4);
                        this.conversation();
                      });
                  }
                }
              );
            });
        } else if (this.msg.text === "Ulangi") {
          this.state.goToStep(1);
          this.state.resetQuestion();
          this.conversation();
        } else {
          bot.sendMessage(
            this.chatId,
            `Apakah yang di inputkan sudah benar? \n\n${
              this.state.getInputData()
                ? this.state
                    .getInputData()
                    .map(
                      (item) =>
                        `${
                          stateQ.question.find((e) => e.id === item[0])
                            .pertanyaan
                        }\n➡️ ${item[1]}`
                    )
                    .join("\n\n")
                : ""
            }\n\nPilih "Benar" untuk menyimpan data\nPilih "Ulangi" untuk mengulangi menjawab pertanyaan`,
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
        }
        break;
      case 4:
        if (this.state.getInputData()) {
          console.log(this.state.getInputData());
        }
        bot.sendMessage(
          this.chatId,
          "Survey selesai, silahkan pilih menu yang tersedia",
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
        this.state.reset();
        break;
    }
  }
}

module.exports = SurveyCommand;
