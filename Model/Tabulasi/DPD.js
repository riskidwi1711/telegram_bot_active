const connection = require("../../Config/database");

class Dpd {
  constructor() {
    this.db = connection;
    this.time = new Date();
  }

  getPartais() {
    this.db.query("SELECT * FROM partais", (err, res) => {
      if (err) return callback(err);
      callback(null, res);
    });
  }

  getDpd(callback) {
    this.db.query(
      "SELECT * FROM calons WHERE tipe = ? ORDER BY no_urut",
      ["dpd"],
      (err, res) => {
        if (err) return callback(err);
        callback(null, res);
      }
    );
  }

  saveDPD(data, callback) {
    let text = data.text;
    let id = data.list_id;
    text.map((e, index) => {
      this.getCalegId(id[index], (err, res) => {
        if (err) {
        } else {
          this.db.query(
            "INSERT INTO `suaras` (`id_tps`, `id_partai`, `id_caleg`, `suara`, `user_created`,`created_at`) VALUES (?,?,?,?,?,?)",
            [1, res[0].id_partai, res[0].id, e, data.username, this.time],
            (error, result) => {
              if (error) {
                return callback(error);
              } else {
                if (index + 1 === text.length) {
                  callback(null, result);
                }
              }
            }
          );
        }
      });
    });
  }

  getCalegId(id, callback) {
    this.db.query(
      "SELECT * FROM calons WHERE tipe = ? AND id = ?",
      ["dpd", id],
      (err, res) => {
        if (err) return callback(err);
        callback(null, res);
      }
    );
  }
}

module.exports = Dpd;
