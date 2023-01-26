const { saveRelawan } = require("../Model/Relawan");

exports.saveRelawan = (ctx, bot) => {
    const relawan = {
        nama: ctx.nama,
        no_handphone: ctx.no_handphone,
        no_tps: ctx.no_tps,
        tim: ctx.tim,
        jabatan: ctx.jabatan,
        kecamatan_id: ctx.kecamatan_id,
        kelurahan_id: ctx.kelurahan_id,
        rt: ctx.rt,
        alamat: ctx.alamat,
        telegram_photo: ctx.telegram_photo,
        telegram_id: ctx.telegram_id
      };

      if(saveRelawan(relawan)){
        bot.reply('Tim pemenangan berhasil disimpan')
      }else{
        bot.reply('Tim pemenangan gagal disimpan')
      }
};
