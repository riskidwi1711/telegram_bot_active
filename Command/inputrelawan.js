const { default: axios } = require("axios");
const FormData = require("form-data");
const bot = require("../Config/bot");
const ButtonBot = require("../Config/Button");
const connection = require("../Config/database");
const TimModel = require("../Model/Relawan");

class InputTim {
  constructor(msg, state) {
    this.msg = msg;
    this.chatId = this.msg.chat.id;
    this.state = state;
    this.username = this.msg.from.username;
    this.ButtonBot = new ButtonBot();
    this.timModel = new TimModel();
    this.db = connection;
    this.opts = {
      reply_markup: { remove_keyboard: true },
    };
  }

  init() {
    this.timModel.getValidation(this.username, (err, res) => {
      if (err) {
        bot.sendMessage(this.chatId, "Akses dilarang");
      } else {
        if (res.length >= 1) {
          this.state.createState("/input_tim");
          if (
            this.msg.text === "Ulangi" ||
            this.msg.text === "Ulangi menginput data"
          ) {
            this.state.goToStep(0);
          }
          bot.on("photo", (photo) => {
            if (photo.chat.id === this.chatId) {
              this.state.saveInput("photo", photo);
            }
          });
          this.conversation();
        } else {
          bot.sendMessage(this.chatId, "Akses dilarang");
        }
      }
    });
  }

  uploadFoto(fileId, callback) {
    bot.getFileLink(fileId).then((link) => {
      const formDatas = new FormData();
      formDatas.append("url", link);
      try {
        axios
          .post("http://127.0.0.1:8000/api/uploadfromtelegram", formDatas)
          .then((res) => {
            return callback(null, res);
          })
          .catch((err) => {
            return callback(err);
          });
      } catch (error) {
        return callback(err);
      }
    });
  }

  validatePhone(input) {
    let regex = /^\d{10,}$/;
    let exec = regex.test(input);
    return exec;
  }

  validateWord(input) {
    let regex = /^[a-zA-Z\s]+$/;
    let exec = regex.test(input);
    return exec;
  }

  validateNumber(input) {
    let regex = /^[0-9]+$/;
    let exec = regex.test(input);
    return exec;
  }

  validatePhoto(input) {
    if (!input.photo) {
      return true;
    } else {
      return false;
    }
  }

  conversation() {
    switch (this.state.getStep()) {
      case 0:
        bot.sendMessage(this.chatId, "Masukan nama", {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Ulangi",
                },
                {
                  text: "Batal",
                },
              ],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        this.state.goToNext();
        break;
      case 1:
        if (!this.validateWord(this.msg.text)) {
          bot.sendMessage(this.chatId, "❗Hanya boleh huruf");
          bot.sendMessage(this.chatId, "Masukan ulang nama");
        } else {
          this.state.saveInput("nama", this.msg.text);
          bot.sendMessage(this.chatId, "Masukan no handphone");
          this.state.saveInput("user_created", this.username);
          this.state.goToNext();
        }
        break;
      case 2:
        if (!this.validatePhone(this.msg.text)) {
          bot.sendMessage(this.chatId, "❗Hanya boleh angka, minimal 10 digit");
          bot.sendMessage(this.chatId, "Masukan ulang no handphone");
        } else {
          this.state.saveInput("no_handphone", this.msg.text);
          bot.sendMessage(this.chatId, "Masukan jabatan");
          this.state.goToNext();
        }
        break;
      case 3:
        this.state.saveInput("jabatan", this.msg.text);
        bot.sendMessage(this.chatId, "Masukan Foto");
        this.state.goToNext();
        break;
      case 4:
        if (this.validatePhoto(this.msg)) {
          bot.sendMessage(this.chatId, "❗Hanya menerima input foto");
          bot.sendMessage(this.chatId, "Masukan ulang foto");
        } else {
          bot.sendMessage(this.chatId, "Masukan RT");
          this.state.goToNext();
        }
        break;
      case 5:
        if (!this.validateNumber(this.msg.text)) {
          bot.sendMessage(this.chatId, "❗Hanya menerima input angka");
          bot.sendMessage(this.chatId, "Masukan ulang RT");
        } else {
          this.state.saveInput("rt", this.msg.text);
          bot.sendMessage(this.chatId, "Masukan RW");
          this.state.goToNext();
        }
        break;
      case 6:
        if (!this.validateNumber(this.msg.text)) {
          bot.sendMessage(this.chatId, "❗Hanya menerima input angka");
          bot.sendMessage(this.chatId, "Masukan ulang RW");
        } else {
          this.state.saveInput("rw", this.msg.text);
          this.timModel.getKecamatan((err, res) => {
            if (err) {
            } else {
              let keyb = [];
              res.map((e) => {
                keyb.push({ text: e.slug });
              });
              bot.sendMessage(this.chatId, "Pilih kecamatan", {
                reply_markup: this.ButtonBot.createKeybMarkup(keyb, 2),
              });
            }
          });
          this.state.goToNext();
        }
        break;
      case 7:
        this.timModel.getKecamatanBySlug(this.msg.text, (err, res) => {
          if (err) {
          } else {
            this.state.saveInput("kecamatan", {
              id: res.id,
              nama: res.nama,
              slug: res.slug,
            });

            this.timModel.getKelurahan(res.id, (errr, ress) => {
              if (errr) {
              } else {
                let keyb = [];
                ress.map((e) => {
                  keyb.push({ text: e.slug });
                });
                bot.sendMessage(this.chatId, "Pilih kelurahan", {
                  reply_markup: this.ButtonBot.createKeybMarkup(keyb, 2),
                });
              }
            });
          }
        });

        this.state.goToNext();
        break;
      case 8:
        this.timModel.getKelurahanBySlug(this.msg.text, (err, res) => {
          if (err) {
          } else {
            this.state.saveInput("kelurahan", {
              id: res.id,
              nama: res.nama,
              slug: res.slug,
            });
          }
        });
        this.timModel.getKategori((err, res) => {
          if (err) {
          } else {
            bot.sendMessage(
              this.chatId,
              "Silahkan Masukan Kategori" +
                res.map((e) => `\n${e.id}. ${e.nama_tim}`).join("") +
                "\n\nKategori dapat lebih dari satu, contoh memilih kategori korsak dan korte maka balas 1,4"
            );
          }
        });

        this.state.goToNext();
        break;
      case 9:
        this.state.saveInput("kategori", this.msg.text);
        bot.sendMessage(this.chatId, "Pilih refrensi", {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Suhud Alynudin",
                },
                {
                  text: "Ketua DPD",
                },
              ],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        this.state.goToNext();
        break;
      case 10:
        this.state.saveInput("refrensi", this.msg.text);
        let photo = this.state.getTimData().photo;
        bot
          .sendMessage(
            this.chatId,
            `Apakah data yang diinputkan sudah benar\n\nNama :\n➡️ ${
              this.state.getTimData().nama
            }\n\nNo handphone :\n➡️ ${
              this.state.getTimData().no_handphone
            }\n\nJabatan :\n➡️ ${
              this.state.getTimData().jabatan
            }\n\nRT : \n➡️ ${this.state.getTimData().rt}\n\nRW : \n➡️ ${
              this.state.getTimData().rw
            }\n\nKecamatan : \n➡️ ${
              this.state.getTimData().kecamatan_id.nama
            }\n\nKelurahan : \n➡️ ${
              this.state.getTimData().kelurahan_id.nama
            }\n\nKategori : \n➡️ ${
              this.state.getTimData().tim
            }\n\nReferensi : \n➡️ ${
              this.state.getTimData().refrensi
            }
          `
          )
          .then(
            (e) =>
              setTimeout(() => {
                bot
                  .sendPhoto(
                    this.chatId,
                    photo.photo[photo.photo.length - 1].file_id
                  )
                  .then((e) => {
                    setTimeout(() => {
                      bot.sendMessage(
                        this.chatId,
                        "Pilih benar untuk menyimpan, ulangi untuk mengulangi inputan",
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
                    }, 1000);
                  });
              }),
            2000
          );
        this.state.goToNext();
        break;
      case 11:
        if (
          this.msg.text === "Benar" ||
          this.msg.text === "Ulangi menyimpan data"
        ) {
          let inp = this.state.getTimData();
          let photo = inp.photo;
          let fileName = null;
          bot
            .sendMessage(this.chatId, "❕Sedang menyimpan data")
            .then((sentMessage) => {
              this.uploadFoto(
                photo.photo[photo.photo.length - 1].file_id,
                (err, res) => {
                  if (err) {
                    bot
                      .editMessageText("❗Data tidak berhasil disimpan", {
                        chat_id: this.chatId,
                        message_id: sentMessage.message_id,
                      })
                      .then((p) => {
                        bot.sendMessage(this.chatId, "Ulangi menyimpan data", {
                          reply_markup: {
                            keyboard: [
                              [
                                {
                                  text: "Ulangi menyimpan data",
                                },
                                {
                                  text: "Ulangi menginput data",
                                },
                                {
                                  text: "Batal",
                                },
                              ],
                            ],
                            one_time_keyboard: true,
                            resize_keyboard: true,
                          },
                        });
                      });
                  } else {
                    fileName = res.data.file_name;
                    this.db.query(
                      "INSERT INTO `master_tim_pemenangans`(`nama`,`no_handphone`, `no_tps`, `tim`, `jabatan`, `kecamatan_id`,`kelurahan_id`,`rt`,`alamat`,`telegram_photo`,`telegram_id`, `rw`, `user_created`,`photo`,referensi) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                      [
                        inp.nama,
                        inp.no_handphone,
                        inp.id_tps,
                        inp.tim,
                        inp.jabatan,
                        inp.kecamatan_id.id,
                        inp.kelurahan_id.id,
                        inp.rt,
                        `${inp.rw}/${inp.rt}, ${inp.kecamatan_id.nama}, ${inp.kelurahan_id.nama}, Jakarta Utara`,
                        photo.photo[photo.photo.length - 1].file_id,
                        null,
                        inp.rw,
                        inp.user_created,
                        fileName,
                        inp.refrensi
                      ],
                      (err, result) => {
                        if (err) console.log(err);
                        bot
                          .editMessageText("✅ Data berhasil disimpan", {
                            chat_id: this.chatId,
                            message_id: sentMessage.message_id,
                          })
                          .then((s) => {
                            bot.sendMessage(
                              this.chatId,
                              "Terimkasih telah menginputkan data",
                              this.opts
                            );
                          });
                      }
                    );
                  }
                }
              );
            });
        }
        break;
      default:
        bot.sendMessage(
          this.chatId,
          "Maaf, silahkan masukan sesuai dengan urutan"
        );
        break;
    }
  }
}

module.exports = InputTim;
