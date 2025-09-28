import { useState, useEffect } from 'react'
import { WordProvider } from './words';
import './App.css'
import Game from './Game';


const TODAY = new Date().toISOString().split('T')[0];

const FLAGS = {
  ENG: "🇬🇧",
  PT: "🇵🇹",
}

const modeState = () => {
  const x = window.localStorage.getItem("prefered-mode")
  if (x == null){
    return true;
  }
  return x == "daily";
}
const wordProviders = { ENG: new WordProvider("ENG"), PT: new WordProvider("PT") };
function App() {

  const [isDailyMode, setMode] = useState(modeState());
  const [initialized, setInitialized] = useState(false);
  const [initialState, setInitialState] = useState(null);
  const [currentLang, setCurrentLang] = useState(window.localStorage.getItem("prefered-lang")?? "ENG");
  const wordProvider = wordProviders[currentLang];
  async function initialize() {
    const word = await wordProvider.wordOfTheDay(); 
    const gameState = {}
    gameState.correct = word;
    gameState.wordProvider = wordProvider;
    const hasPlayed = window.localStorage.getItem(TODAY+currentLang);
    if (isDailyMode && hasPlayed) {
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
    window.localStorage.setItem("prefered-mode",isDailyMode ? "daily": "random");
    window.localStorage.setItem("prefered-lang",currentLang);
    if (isDailyMode) {
      initialize();
    }
    else {
      playRandomWord();
      setInitialized(true);
    }
  }, [isDailyMode, currentLang])

  // useEffect(() => {
  //   setTimeout(() => setWaitingForWord(true), 1000 * 5);
  // }, []);

  function storeState(state) {
    if (!initialized || !isDailyMode) {
      return
    }
    let dump = state;
    localStorage.setItem(TODAY+currentLang, JSON.stringify(dump));
  }
  function playRandomWord() {
    const word = wordProvider.randomWord();
    setInitialState({ correct: word, wordProvider: wordProvider });
    setMode(() => false);
  }

  const toggleLanguage = () => {
    const next = currentLang == "ENG" ? "PT" : "ENG";
    setCurrentLang(next);
  };

  return (
    <>
      <h1>Barco ⛵</h1>
      <div className='setting-container'>
        <div className="calendar" onClick={() => setMode(m => !m)}>Mode: {isDailyMode ? "Daily 🗓️" : "Random 🎲"}</div>
        <span>|</span>
        <div className="language" onClick={toggleLanguage}>Language: {FLAGS[currentLang]}</div>
      </div>
      <Game initialState={initialState} language={currentLang} isDaily={isDailyMode} storeState={storeState} />
      {!isDailyMode && <div className='my-button reset-button' onClick={playRandomWord}>🔀 NEW GAME</div>}
      {!initialized && <p>WAITING FOR WORD...</p>}
    </>
  );

}

export default App;
