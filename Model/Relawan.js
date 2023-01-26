const connection = require("../Config/database");

class TimModel {
  constructor() {
    this.db = connection;
  }

  save(data, callback) {
    let inp = {
      data: data,
    };
    console.log(inp);
    this.db.query(
      "INSERT INTO `master_tim_pemenangans`(`nama`,`no_handphone`, `no_tps`, `tim`, `jabatan`, `kecamatan_id`,`kelurahan_id`,`rt`,`alamat`,`telegram_photo`,`telegram_id`, `rw`, 'user_created') VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        inp.data.nama,
        inp.data.no_handphone,
        inp.data.id_tps,
        inp.data.tim,
        inp.data.jabatan,
        inp.data.kecamatan_id.id,
        inp.data.kelurahan_id.id,
        inp.data.rt,
        `${inp.data.rw}/${inp.data.rt}, ${inp.data.kecamatan_id.nama}, ${inp.data.kelurahan_id.nama}, Jakarta Utara`,
        inp.data.photo.photo[photo.photo.length - 1].file_id,
        inp.data.telegram_id,
        inp.data.rw,
        inp.data.user_created,
      ],
      function (err, result) {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  }

  getValidation(telegram_id, callback) {
    this.db.query(
      `SELECT * FROM users WHERE telegram_id = ?`,
      [telegram_id],
      (err, res) => {
        if (err) return callback(err);
        callback(null, res);
      }
    );
  }

  getKecamatan(callback) {
    this.db.query("SELECT * FROM kecamatans", (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }

  getKelurahan(kec_id, callback) {
    this.db.query(
      `SELECT * FROM kelurahans WHERE kecamatan_id = ?`,
      [kec_id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  }
  getKecamatanBySlug(slug, callback) {
    this.db.query(
      "SELECT * FROM kecamatans where slug = ?",
      [slug],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result[0]);
      }
    );
  }

  getKelurahanBySlug(slug, callback) {
    this.db.query(
      "SELECT * FROM kelurahans where slug = ?",
      [slug],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result[0]);
      }
    );
  }

  getKategori(callback) {
    this.db.query("SELECT * FROM master_tims", function (err, result) {
      if (err) return callback(err);
      callback(null, result);
    });
  }
}

module.exports = TimModel;
