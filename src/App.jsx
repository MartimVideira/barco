import { useState, useEffect } from 'react'
import { WordProvider } from './words';
import './App.css'
import Game from './Game';


const TODAY = new Date().toISOString().split('T')[0];

const FLAGS = {
  ENG: "🇬🇧",
  PT: "🇵🇹",
}

const wordProviders = { ENG: new WordProvider("ENG"), PT: new WordProvider("PT") };
function App() {

  const [isDailyMode, setMode] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [initialState, setInitialState] = useState(null);
  const [currentLang, setCurrentLang] = useState("ENG");
  const wordProvider = wordProviders[currentLang];
  async function initialize() {
    const word = await wordProvider.wordOfTheDay();
    const gameState = {}
    gameState.correct = word;
    gameState.wordProvider = wordProvider;
    const hasPlayed = window.localStorage.getItem(TODAY);
    if (hasPlayed) {
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

  useEffect(() => {
    if (isDailyMode) {
      initialize();
    }
    else {
      playRandomWord();
    }
  }, [isDailyMode, currentLang])

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
    const word = wordProvider.randomWord();
    console.log(word);
    setInitialState({ correct: word, wordProvider: wordProvider });
    setMode(() => false);
  }
  useEffect(() => { initialize() }, []);

  const toggleLanguage = () => setCurrentLang(currentLang == "ENG" ? "PT" : "ENG");

  return (
    <>
      <h1>Barco ⛵</h1>
      <div className='setting-container'>
        <div className="calendar" onClick={() => setMode(m => !m)}>Mode: {isDailyMode ? "Daily 🗓️" : "Random 🎲"}</div>
        <span>|</span>
        <div className="language" onClick={toggleLanguage}>Language: {FLAGS[currentLang]}</div>
      </div>
      <Game initialState={initialState} language="ENG" isDaily={isDailyMode} storeState={storeState} />
      {!isDailyMode && <div className='my-button reset-button' onClick={playRandomWord}>🔀 NEW GAME</div>}
      {!initialized && <p>WAITING FOR WORD...</p>}
    </>
  );

}

export default App;
