import { useState, useEffect } from 'react'
import { wordOfTheDay, randomWord } from './words';
import './App.css'
import Game from './Game';


const TODAY = new Date().toISOString().split('T')[0];
function App() {

  const [isDailyMode, setMode] = useState(true);
  const [initialState, setInitialState] = useState(null);
  const [initialized, setInitialized] = useState(false);
  async function initialize() {
    const word = await wordOfTheDay();
    const gameState = {}
    gameState.correct = word;
    const hasPlayed = window.localStorage.getItem(TODAY);
    if (false  && hasPlayed) {
      const data = JSON.parse(hasPlayed);
      gameState.guesses = data.guesses;
      gameState.guessCount = data.guessCount;
      gameState.isGameOver = data.isGameOver;
      gameState.won = data.won;
      gameState.keys = data.keys;
    }
    setInitialState(gameState);
    setInitialized(true);
  }

  // useEffect(() => {
  //   setTimeout(() => setWaitingForWord(true), 1000 * 5);
  // }, []);

  function storeState(state) {
    if (!initialized) {
      return
    }
    console.log("Storing State");
    let dump = state;
    console.log(dump);
    localStorage.setItem(TODAY, JSON.stringify(dump));
  }
  function playRandomWord() {
    const word = randomWord();
    console.log(word);
    setInitialState({ correct: word });
    setMode(() => false);
  }
  function toggleGameMode() {
    if (isDailyMode) {
      return playRandomWord();
    }
    else {
      setMode(() => true);
      initialize();

    }

  }
  useEffect(() => { initialize() }, []);

  return (
    <>
      <h1>Barco ⛵</h1><div className="my-button calendar" onClick={toggleGameMode}>{isDailyMode ? "🗓️" : "🎲"}</div>
      <Game initialState={initialState} language="ENG" isDaily={isDailyMode} storeState={storeState} />
      {!isDailyMode && <div className='my-button reset-button' onClick={randomWord}>🔀 NEW GAME</div>}
      {!initialized && <p>WAITING FOR WORD...</p>}
    </>
  );

}

export default App;
