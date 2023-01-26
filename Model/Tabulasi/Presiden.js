const connection = require("../../Config/database");

class PresidenModel {
  constructor() {
    this.db = connection;
    this.time = new Date();
  }

  getPresiden(callback) {
    this.db.query("SELECT * FROM calon_presidens", (err, res) => {
      if (err) return callback(err);
      callback(null, res);
    });
  }

  savePresiden(data, callback) {
    let text = data.text
    text.map((e, index) => {
      this.db.query(
        "INSERT INTO `suara_presidens`(`id_tps`, `id_calon`, `suara`, `user_created`, `created_at`) VALUES (?,?,?,?,?)",
        [
          data.tps_id,
          index + 1,
          e,
          data.username,
          this.time
        ],
        (err, res) => {
          if (err) return callback(err);
          callback(null, res);
        }
      );
    });
  }

  getValidation(telegram_id, callback) {
    this.db.query(
      "SELECT * FROM users WHERE telegram_id = ?",
      [telegram_id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
      }
    );
  }
}

module.exports = PresidenModel;
