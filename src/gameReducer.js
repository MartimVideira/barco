import { N_GUESSES, WORD_LEN,evaluateWord } from './words';

export const INITIAL_GAME_STATE = {
  guesses: [""],
  guessCount: 0,
  isGameOver: false,
  wordProvider:null,
  won: false,
  keys: {},
  correct: "",
  isInvalidGuess: false,
}
const updateKeys = (keys, correct, guessArray) => {
  const newKeys = { ...keys };
  const colors = evaluateWord(guessArray, correct);
  const guess = guessArray[0];
  for (let i = 0; i < WORD_LEN; i++) {
    let key = guess[i];
    let value = colors[i];
    if (value == "correct" || newKeys[key] == null || (newKeys[key] == "partial" && value == "correct")) {
      newKeys[key] = value;
    }
  }
  return newKeys;
}

const updateCurrentGuess = (oldState, newGuess) => {
  let newState = { ...oldState }
  newState.guesses = [...oldState.guesses];
  newState.guesses[newState.guessCount] = newGuess;
  return newState;
}


const handleKey = (oldState, e) => {
  const guessCount = oldState.guessCount;
  const isGameOver = oldState.isGameOver;
  const currentGuess = oldState.guesses[guessCount];
  if (guessCount >= N_GUESSES || isGameOver) {
    return oldState;
  }
  if (e.key == 'Enter') {
    let newState = { ...oldState }
    const guessInProvider = oldState.wordProvider.WORD_SET.get(currentGuess)
    if (currentGuess.length != WORD_LEN || (guessInProvider == null)) {
      newState.isInvalidGuess = true;
    }
    else {
      const guess = [currentGuess,guessInProvider];
      newState.keys = updateKeys(newState.keys, newState.correct,guess);
      if (guess[0] === newState.correct[0]) {
        newState.won = true;
        newState.isGameOver = true;
      }
      if (guessCount + 1 >= N_GUESSES) {
        newState.isGameOver = true;
      }
      newState = updateCurrentGuess(newState,guess);
      newState.guessCount = oldState.guessCount + 1;

      newState.guesses = [...newState.guesses, ""];
    }
    return newState;
  }

  if (e.key == 'Backspace' && currentGuess.length > 0) {
    return updateCurrentGuess(oldState, currentGuess.slice(0, currentGuess.length - 1));
  }

  const isValidKey = (c) => "abcdefghijklmnopqrstuwvxyz".search(c) >= 0;

  if (isValidKey(e.key) && currentGuess.length < WORD_LEN) {
    return updateCurrentGuess(oldState, (currentGuess + e.key).toUpperCase());
  }

  return oldState;

}

export const reducer = (oldState, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      {
        let newState = {...INITIAL_GAME_STATE};
        for (const key in action.payload) {
          newState[key] = action.payload[key];
        }
        return newState;
      }
    case "INVALID_GUESS_OVER": {
      let newState = { ...oldState };
      newState.isInvalidGuess =!oldState.isInvalidGuess;
      return newState;
    }

    case "HANDLE_KEY":
      return handleKey(oldState, action.payload);

    default:
      console.log(`Unhandled Action: ${action}`);
      return oldState;
  }

}