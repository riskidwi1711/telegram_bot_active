class state {
  //constructor method
  constructor() {
    this.state = [
      {
        id: "",
        state: "",
        data: {
          step: 0,
          selectedSurveyData: {
            list_slug: [],
            id_survey: "",
            question: [],
            survey_step: 0,
            inData: [],
          },
          input_tim_data: {
            nama: "",
            alamat: "",
            no_handphone: "",
            no_tps: "",
            photo: "",
            telegram_photo: "",
            tim: "",
            telegram_id: "",
            jabatan: "",
            user_created: "",
            kecamatan_id: {
              id: "",
              nama: "",
              slug: "",
            },
            refrensi: "",
            kelurahan_id: {
              id: "",
              nama: "",
              slug: "",
            },
            rt: "",
            rw: "",
          },
          tabulasi: {
            type: "",
            data: {
              input: "",
              dprri: [],
              dpd:[],
              dprdpro:[],
              selectedPartai: "",
            },
          },
        },
      },
    ];
    this.id = "";
  }

  //main method
  createState(newState) {
    let indexUnique = this.state.findIndex((obj) => obj.id === this.id);
    if (indexUnique === -1) {
      this.state.push({
        id: this.id,
        state: newState,
        data: {
          step: 0,
          selectedSurveyData: {
            list_slug: [],
            id_survey: "",
            question: [],
            inData: [],
            survey_step: 0,
          },
          input_tim_data: {
            nama: "",
            alamat: "",
            no_handphone: "",
            no_tps: "",
            photo: "",
            telegram_photo: "",
            tim: "",
            telegram_id: "",
            jabatan: "",
            user_created: "",
            kecamatan_id: {
              id: "",
              nama: "",
              slug: "",
            },
            kelurahan_id: {
              id: "",
              nama: "",
              slug: "",
            },
            rt: "",
            refrensi: "",
            rw: "",
          },
          tabulasi: {
            type: "",
            data: {
              input: "",
              dpd:[],
              dprri: [],
              dprdpro:[],
              selectedPartai: "",
            },
          },
        },
      });
    }
  }

  changeState(newState) {
    return this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].state = newState)
      : false;
  }

  getAllState() {
    return this.state;
  }

  getState() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)]
      : this.state[0];
  }

  //survey method
  nextQuestion() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[
          this.getIndex(this.id)
        ].data.selectedSurveyData.survey_step =
          this.state[this.getIndex(this.id)].data.selectedSurveyData
            .survey_step + 1)
      : this.state[0].data.selectedSurveyData.survey_step;
  }

  resetQuestion() {
    this.state[this.getIndex(this.id)].data.selectedSurveyData.inData = [];
    return this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[
          this.getIndex(this.id)
        ].data.selectedSurveyData.survey_step = this.state[
          this.getIndex(this.id)
        ].data.selectedSurveyData.survey_step =
          0)
      : this.state[0].data.selectedSurveyData.survey_step;
  }

  goToNext() {
    this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].data.step =
          this.state[this.getIndex(this.id)].data.step + 1)
      : (this.state[0].data.step = this.state[0].data.step + 1);
  }

  goToStep(step) {
    this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].data.step = step)
      : (this.state[0].data.step = step);
  }

  resetStep() {
    this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].data.step = 0)
      : (this.state[0].data.step = 0);
  }

  getStep() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.step
      : this.state[0].data.step;
  }

  getIndex() {
    let index = this.state.findIndex((obj) => obj.id === this.id);
    return index;
  }

  setSelectedSurveyData(selectedSurveyData) {
    return this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].data.selectedSurveyData =
          selectedSurveyData)
      : this.state[0].data.selectedSurveyData;
  }

  getSelectedSurveyData() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.selectedSurveyData
      : this.state[0].data.selectedSurveyData;
  }

  setInputData(id, input) {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.selectedSurveyData.inData.push([
          id,
          input,
        ])
      : false;
  }

  getInputData() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.selectedSurveyData.inData
      : false;
  }

  //Input_tim method
  getTimData() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.input_tim_data
      : false;
  }

  saveInput(type, input) {
    switch (type) {
      case "nama":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[this.getIndex(this.id)].data.input_tim_data.nama =
              input)
          : false;
        break;
      case "no_handphone":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[
              this.getIndex(this.id)
            ].data.input_tim_data.no_handphone = input)
          : false;
        break;
      case "jabatan":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[this.getIndex(this.id)].data.input_tim_data.jabatan =
              input)
          : false;
        break;
      case "photo":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[this.getIndex(this.id)].data.input_tim_data.photo =
              input)
          : false;
        break;
      case "telegram_photo":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[
              this.getIndex(this.id)
            ].data.input_tim_data.telegram_photo = input)
          : false;
        break;
      case "rt":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[this.getIndex(this.id)].data.input_tim_data.rt = input)
          : false;
        break;
      case "rw":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[this.getIndex(this.id)].data.input_tim_data.rw = input)
          : false;
        break;
      case "kecamatan":
        this.state[this.getIndex(this.id)].data.input_tim_data.kecamatan_id.id =
          input.id;
        this.state[
          this.getIndex(this.id)
        ].data.input_tim_data.kecamatan_id.nama = input.nama;
        this.state[
          this.getIndex(this.id)
        ].data.input_tim_data.kecamatan_id.slug = input.slug;
        break;
      case "kelurahan":
        this.state[this.getIndex(this.id)].data.input_tim_data.kelurahan_id.id =
          input.id;
        this.state[
          this.getIndex(this.id)
        ].data.input_tim_data.kelurahan_id.nama = input.nama;
        this.state[
          this.getIndex(this.id)
        ].data.input_tim_data.kelurahan_id.slug = input.slug;
        break;
      case "kategori":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[this.getIndex(this.id)].data.input_tim_data.tim = input)
          : false;
        break;
      case "refrensi":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[this.getIndex(this.id)].data.input_tim_data.refrensi =
              input)
          : false;
        break;
      case "telegram_id":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[
              this.getIndex(this.id)
            ].data.input_tim_data.telegram_id = input)
          : false;
        break;
      case "user_created":
        this.state[this.getIndex(this.id)] !== undefined
          ? (this.state[
              this.getIndex(this.id)
            ].data.input_tim_data.user_created = input)
          : false;
        break;
    }
  }

  //tabulasi method
  changeType(type) {
    return this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].data.tabulasi.type = type)
      : false;
  }

  getType() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.tabulasi.type
      : false;
  }

  resetTabulasi() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].data.tabulasi.data = {
          input: "",
          dprri: [],
          dpd:[],
          dprdpro:[],
          selectedPartai: "",
        })
      : false;
  }

  setDpdId(input){
    return this.state[this.getIndex(this.id)] !== undefined
    ? this.state[this.getIndex(this.id)].data.tabulasi.data.dpd.push(input)
    : false;
  }

  getDpd(){
    return this.state[this.getIndex(this.id)] !== undefined
    ? this.state[this.getIndex(this.id)].data.tabulasi.data.dpd
    : false;
  }

  setInputTabulasi(input) {
    return this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].data.tabulasi.data.input = input)
      : false;
  }

  getTabulasiInput() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.tabulasi.data.input
      : false;
  }

  setInputDprri(data) {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.tabulasi.data.dprri.push(data)
      : false;
  }

  getInputDprri() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.tabulasi.data.dprri
      : false;
  }

  setSelectedPartai(input) {
    return this.state[this.getIndex(this.id)] !== undefined
      ? (this.state[this.getIndex(this.id)].data.tabulasi.data.selectedPartai =
          input)
      : false;
  }

  getSelectedPartai() {
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.tabulasi.data.selectedPartai
      : false;
  }

  setDprdpro(input){
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.tabulasi.data.dprdpro.push(input)
      : false;
  }

  getDprdpro(){
    return this.state[this.getIndex(this.id)] !== undefined
      ? this.state[this.getIndex(this.id)].data.tabulasi.data.dprdpro
      : false;
  }

  //reset_method

  reset() {
    this.state.splice(this.getIndex(this.id), 1);
  }
}

module.exports = state;
