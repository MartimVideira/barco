
import { useState, useEffect } from 'react'
import { WORD_SET, wordOfTheDay,  N_GUESSES, WORD_LEN, WAIT_FOR_WORD_TIMEOUT , evaluateWord } from './words';
import Board from './Board.jsx'
import Keyboard from './Keyboard.jsx';


const TODAY = new Date().toISOString().split('T')[0];

function Game() {
  const [initialized, setInitialized] = useState(false);
  const [guessCount, setGuessCount] = useState(0)
  const [guesses, setGuesses] = useState([""]);
  const [isGameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keys, setKeys] = useState({});
  const [animationOver, setAnimtionOver] = useState(false);

  const [isInvalidGuess, setInvalidGuess] = useState(false);

  const [CORRECT, setCorrectWord] = useState("");

  async function initialize() {
    const word = await wordOfTheDay();
    setCorrectWord(word);
    const hasPlayed = window.localStorage.getItem(TODAY);
    if (!hasPlayed) {
    } else {
      const data = JSON.parse(hasPlayed);
      setGuessCount(data.guessCount);
      setGuesses(data.guesses);
      setGameOver(data.isGameOver);
      setWon(data.won);
      setKeys(data.keys);
    }
    setInitialized(true);
  }

  function storeState() {
    if (!initialized) {
      return
    }
    console.log("Storing State");
    let dump = {
      guessCount: guessCount,
      guesses: guesses,
      isGameOver: isGameOver,
      won: won,
      keys: keys,
    }
    console.log(dump);
    localStorage.setItem(TODAY, JSON.stringify(dump));
  }

  useEffect(() => { initialize() }, []);
  useEffect(storeState, [guessCount, guesses, isGameOver, won, keys, initialized]);

  const [shouldWaitForWord, setWaitingForWord] = useState(false);
  useEffect(() => {
    setTimeout(() => setWaitingForWord(true), 1000 * WAIT_FOR_WORD_TIMEOUT);
  }, []);

  const updateKeys = (guess) => {
    const newKeys = { ...keys };
    const colors = evaluateWord(guess, CORRECT);
    for (let i = 0; i < WORD_LEN; i++) {
      let key = guess[i];
      let value = colors[i];
      if (value == "correct" || newKeys[key] == null || (newKeys[key] == "partial" && value == "correct")) {
        newKeys[key] = value;
      }
    }
    setKeys(newKeys);
  }

  const onAnimationEnd = () => {
    setInvalidGuess(() => false);
    if (isGameOver) {
      setAnimtionOver(true);
    }

  }

  const handleKey = (e) => {
    if (guessCount >= N_GUESSES || isGameOver) {
      return;
    }
    if (e.key == 'Enter') {
      if (guesses[guessCount].length != WORD_LEN) {
        setInvalidGuess(p => !p);
        return;
      }
      if (WORD_SET.has(guesses[guessCount])) {
        updateKeys(guesses[guessCount]);
        if (guesses[guessCount] === CORRECT) {
          setWon(true);
          setGameOver(true);
        }
        if (guessCount + 1 >= N_GUESSES) {
          setGameOver(true);
        }
        setGuessCount(guessCount + 1);
        setGuesses([...guesses, ""]);

      }
      else {
        setInvalidGuess(p => !p);
      }
      return;
    }

    if (e.key == 'Backspace') {
      if (guesses[guessCount].length > 0) {
        const newGuesses = [...guesses];
        newGuesses[guessCount] = newGuesses[guessCount].slice(0, guesses[guessCount].length - 1);
        setGuesses(newGuesses);
      }
      return;
    }

    const isValidKey = (c) => "abcdefghijklmnopqrstuwvxyz".search(c) >= 0;

    if (isValidKey(e.key) && guesses[guessCount].length < WORD_LEN) {
      const newGuesses = [...guesses];
      const guess = (newGuesses[guessCount] + e.key).toUpperCase();
      newGuesses[guessCount] = guess;
      setGuesses(newGuesses);

    }

  }
  useEffect(() => {
    wordOfTheDay()
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);

  }, [guesses, guessCount, isGameOver]);

  return (
    <div className='app'>
      <Board guesses={guesses} correct={CORRECT} guessCount={guessCount} won={won} isInvalid={isInvalidGuess} onAnimationEnd={onAnimationEnd} />
      <Keyboard keys={keys} handleKey={handleKey} />
      {(isGameOver && !won) || animationOver ? <ShareResults guesses={guesses} won={won} correct={CORRECT} /> : <></>}
      {shouldWaitForWord && CORRECT == "" ? <p>WAITING FOR WORD...</p> : <></>}
    </div>
  );
}

function ShareResults({ guesses, won, correct }) {

  const copyResultsToClipBoard = () => {

    const res = [];
    for (const guess of guesses) {
      if (guess == "" || guess == null) {
        break;
      }
      res.push(evaluateWord(guess, correct));
    }
    let s = `Barco ${res.length}/${N_GUESSES}\n\n`;
    const emojiString = (a) => {
      let m = { "correct": "🟩", "incorrect": "⬛", "partial": "🟨" }
      return a.map((w) => m[w]).join("")
    }
    res.forEach((e) => {
      s = s + emojiString(e) + "\n";
    })

    navigator.clipboard.writeText(s)
  }
  return <div className='shareResults'>
    <p>{won ? "VICTORY" : "DEFEAT word was: " + CORRECT}</p>
    <button onClick={copyResultsToClipBoard}>Share</button>
  </div>

}



export default Game;
