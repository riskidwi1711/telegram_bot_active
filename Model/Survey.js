const connection = require("../Config/database");

class SurveyModel {
  constructor() {
    this.table = "surveys";
    this.db = connection;
    this.slugList = [];
    this.time = new Date();
  }

  getSurveys(callback) {
    this.db.query("SELECT * FROM surveys", (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
      rows.map((list) => this.slugList.push(list.slug));
    });
  }

  getAllSlug(callback) {
    this.db.query("SELECT slug FROM surveys", (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  getSurveysBySlug(slug, callback) {
    this.db.query(
      "SELECT * FROM surveys WHERE slug = ?",
      [slug],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      }
    );
  }

  getValidation(user_id, callback) {
    this.db.query(
      "SELECT * FROM users WHERE telegram_id = ?",
      [user_id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
      }
    );
  }

  isInputed(username, survey_id, callback) {
    this.db.query(
      "SELECT * FROM survey_data WHERE user_created = ? AND survey_id = ?",
      [username, survey_id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
      }
    );
  }

  getQuestion(survey_id, callback) {
    this.db.query(
      "SELECT * FROM questions WHERE survey_id = ?",
      [survey_id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
      }
    );
  }

  getChoice(question_id, callback) {
    this.db.query(
      "SELECT * FROM question_props WHERE question_id = ?",
      [question_id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows);
      }
    );
  }

  saveSurvey(survey_id, data, username, callback) {
    data.map((ans, index) => {
      this.db.query(
        "INSERT INTO `survey_data`(`survey_id`,`q_id`,`value`,`user_created`, `created_at`) VALUES (?,?,?,?,?)",
        [survey_id, ans[0], ans[1], username, this.time],
        (err, res) => {
          if (err) {
            return callback("Mohon maaf silahkan klik /start untuk mengulangi");
          } else {
            if (index == data.length - 1) {
              callback(
                null,
                "Jawaban berhasil disimpan, terimakasih telah mengisi survey"
              );
            }
          }
        }
      );
    });
  }
}

module.exports = SurveyModel;
