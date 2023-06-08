const { default: axios } = require("axios");
const { base_url } = require("./api");

function sendNotification(title, data, type, cb) {
  try {
    let datas = {
      title: title,
      data: data,
      type: type,
    };
    axios
      .post(`${base_url}/notify`, datas)
      .then((e) => cb())
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendNotification;
