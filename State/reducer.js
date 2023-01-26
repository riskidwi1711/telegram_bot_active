function reducer(state = {}, action) {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        [action.chatId]: {
          question: action.data,
        },
      };
    case "SETSTEP":
      return {
        ...state,
        [action.chatId]: {
          step: action.data,
        },
      };
    default:
      return state;
  }
}

module.exports = reducer;
