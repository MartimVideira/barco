import { useState, useEffect } from 'react'
import { WORD_LIST, WORD_SET, wordOfTheDay} from './words';
import './App.css'

const N_GUESSES = 6;
const WORD_LEN  = 5;

const CORRECT = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
function App() {
  const [guessCount, setGuessCount] = useState(0)
  const [guesses, setGuesses] = useState([""]);
  const [isGameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keys, setKeys] = useState({});
  const [animationOver, setAnimtionOver] = useState(false);
  const [isInvalidGuess, setInvalidGuess] = useState(false);

  const updateKeys = (guess) => {
    const newKeys = { ...keys };
    const colors = evaluateWord(guess);
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
    <>
      <h1>Barco</h1>
      <div className='app'>
        <Board guesses={guesses} guessCount={guessCount} won={won} isInvalid={isInvalidGuess} onAnimationEnd={onAnimationEnd} />
        <Keyboard keys={keys} handleKey={handleKey} />
      </div>
      {(isGameOver && !won) || animationOver ? <ShareResults guesses={guesses} won={won} /> : <></>}
    </>
  );
}

function ShareResults({ guesses, won }) {

  const copyResultsToClipBoard = () => {

    const res = [];
    for (const guess of guesses) {
      if (guess == "" || guess == null) {
        break;
      }
      res.push(evaluateWord(guess));
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

function Board({ guesses, guessCount, won, isInvalid, onAnimationEnd }) {

  const lines = [];
  for (let i = 0; i < N_GUESSES; i++) {
    const isCurrentGuess = (i + 1) == guessCount;
    lines.push(<Line onAnimationEnd={onAnimationEnd} key={i} guess={guesses[i] ?? ''} isInvalid={isInvalid && (i == guessCount)} isSet={i < guessCount} won={won && isCurrentGuess} />)
  }
  return <div className='board'>
    {lines}
  </div>;

}

function evaluateWord(guess) {
  const colors = [];
  const chars = {};
  for (let i = 0; i < WORD_LEN; i++) {
    colors.push(null);
    chars[CORRECT[i]] = (chars[CORRECT[i]] ?? 0) + 1;
    if (guess[i] == CORRECT[i]) {
      colors[i] = "correct";
      chars[CORRECT[i]] = (chars[CORRECT[i]]) - 1;
    }
  }

  for (let i = 0; i < WORD_LEN; i++) {
    if (colors[i] != null) {
      continue;
    }
    if ((chars[guess[i]] ?? 0) > 0) {
      colors[i] = 'partial';
      chars[guess[i]] = chars[guess[i]] - 1;
    } else {
      colors[i] = 'incorrect';
    }
  }
  return colors;

}

function Cell({ char, state, reveal, delay, won }) {
  let flipEnd = 1600;
  let s = {
    transition: `transform 1.5s ${delay * 100}ms, background-color 0s ${600 + delay * 120}ms, border-color 0s ${600 + delay * 120}ms`,

  };
  let s1 = {}
  if (reveal && won) {

    s.animation = `500ms ease-out ${flipEnd + 120 * delay}ms bounce`
    // need to apply animation to child otherwise weird things happen (letters flip)
    s1.animation = s.animation;
  }
  if (state == null) {
    state = "empty";
  }

  return <div className={`cell ${state} `} won={won} reveal={reveal ? "reveal" : null} style={s}>
    <div className={char != null ? "pop-letter" : ""} style={s1}>{char}</div>
  </div>
}

function Line({ guess, isSet, won, isInvalid, onAnimationEnd }) {
  const cells = [];

  let colors = [];
  if (isSet) {
    colors = evaluateWord(guess);
  }

  let animationStyle = {}
  if (isInvalid) {
    animationStyle.animation = `bounce-x 50ms ease-out 3 alternate forwards`
  }

  for (let i = 0; i < WORD_LEN; i++) {

    cells.push(<Cell key={i} char={guess[i]} state={colors[i]} reveal={isSet} delay={i} won={won} />);
  }
  return <div onAnimationEnd={onAnimationEnd} className='line' style={animationStyle}>{cells}</div>
}


function keyFromk(k) {
  if (Array.isArray(k)) {
    return k[0]
  }
  return k;
}


const Key = ({ k, keys, handleKey }) => {
  let code = k;
  let view = k;
  if (Array.isArray(k)) {
    code = k[0];
    view = k[1];
  }
  return <div onClick={() => handleKey({ key: code })} className={'key ' + keys[code.toUpperCase()]}>
    <div>{view.toUpperCase()}</div>
  </div>
}

function Keyboard({ keys, handleKey }) {
  const keyboard = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ['Backspace', '⌫']]
  ]



  return <div className='keyboard'>
    <div className='keyboard-line'>
      <div className='fake-key' id='key-tab'></div>
      {keyboard[0].map((k) => <Key handleKey={handleKey} key={keyFromk(k)} k={k} keys={keys} />)}
    </div>

    <div className='keyboard-line'>
      <div className='fake-key' id='key-caps'></div>
      {keyboard[1].map((k) => <Key handleKey={handleKey} key={keyFromk(k)} k={k} keys={keys} />)}
    </div>

    <div className='keyboard-line'>
      <div className='fake-key' id='key-shift'></div>
      {keyboard[2].map((k) => <Key handleKey={handleKey} key={keyFromk(k)} k={k} keys={keys} />)}
    </div>
  </div>
}




export default App;
