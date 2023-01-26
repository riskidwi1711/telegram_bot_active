const connection = require("../../Config/database");

class Dprpro {
  constructor() {
    this.db = connection;
    this.time = new Date();
  }

  getPartaiId(nama, callback) {
    this.db.query(
      "SELECT * FROM partais WHERE nama_partai = ?",
      [nama],
      (err, res) => {
        if (err) return callback(err);
        callback(null, res[0]);
      }
    );
  }

  getPartai(callback) {
    this.db.query("SELECT * FROM partais", (err, res) => {
      if (err) return callback(err);
      callback(null, res);
    });
  }

  getCalegByNamaPartai(nama_partai, callback) {
    this.db.query(
      `SELECT * FROM partais WHERE nama_partai = ?`,
      [nama_partai],
      (err, res) => {
        if (err) {
        } else {
          this.db.query(
            `SELECT * FROM calons WHERE tipe = ? AND id_partai = ? ORDER BY no_urut`,
            ["dprdpro", res[0].id],
            (err, res) => {
              if (err) return callback(err);
              callback(null, res);
            }
          );
        }
      }
    );
  }

  getCalegId(no_urut, id, callback) {
    this.db.query(
      "SELECT * FROM calons WHERE tipe = ? AND no_urut = ? AND id_partai = ?",
      ["dprdpro", no_urut, id],
      (err, res) => {
        if (err) return callback(err);
        callback(null, res[0]);
      }
    );
  }

  saveInput(data, callback) {
    let texts = data.text;
    let list_id = data.list_id;
    texts.map((text, index) => {
      this.db.query(
        "INSERT INTO `suaras` (`id_tps`, `id_partai`, `id_caleg`, `suara`, `user_created`,`created_at`) VALUES (?,?,?,?,?,?)",
        [0, data.selectedPartai, list_id[index], text, data.username, this.time],
        (err, res) => {
          if (err) {
            return callback(err);
          } else {
            if (index + 1 === texts.length) {
              return callback(null, res);
            }
          }
        }
      );
    });
  }
}

module.exports = Dprpro;
