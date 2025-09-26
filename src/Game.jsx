
import { useState, useEffect, useReducer } from 'react'
import { WORD_SET, wordOfTheDay, N_GUESSES, WORD_LEN, WAIT_FOR_WORD_TIMEOUT, evaluateWord } from './words';
import { INITIAL_GAME_STATE, reducer } from './gameReducer.js';
import Board from './Board.jsx'
import Keyboard from './Keyboard.jsx';
import ShareResults from './ShareResults.jsx';


const TODAY = new Date().toISOString().split('T')[0];



function Game() {
  const [initialized, setInitialized] = useState(false);
  const [animationOver, setAnimationOver] = useState(false);
  const [shouldWaitForWord, setWaitingForWord] = useState(false);

  const [state, dispatch] = useReducer(reducer, INITIAL_GAME_STATE);


  async function initialize() {
    const word = await wordOfTheDay();
    const gameState = {}
    gameState.correct= word;
    const hasPlayed = window.localStorage.getItem(TODAY);
    if (!hasPlayed) {
    } else {
      const data = JSON.parse(hasPlayed);
      gameState.guesses = data.guesses;
      gameState.guessCount = data.guessCount;
      gameState.isGameOver = data.isGameOver;
      gameState.won = data.won;
      gameState.keys = data.keys;
    }
    setInitialized(true);
    dispatch({ type: 'INITIALIZE', payload: gameState })
  }

  function storeState() {
    if (!initialized) {
      return
    }
    console.log("Storing State");
    let dump = state;
    console.log(dump);
    localStorage.setItem(TODAY, JSON.stringify(dump));
  }

  useEffect(() => { initialize() }, []);
  useEffect(storeState, [state, initialized]);

  useEffect(() => {
    setTimeout(() => setWaitingForWord(true), 1000 * WAIT_FOR_WORD_TIMEOUT);
  }, []);


  const onAnimationEnd = () => {
    dispatch({ type: "INVALID_GUESS_OVER" });
    if (state.isGameOver) {
      setAnimationOver(true);
    }

  }
  const handleKey = (e) => dispatch({ type: "HANDLE_KEY", payload: e });

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);

  }, [state]);

  return (
    <div className='app'>
      <Board state={state} onAnimationEnd={onAnimationEnd} />
      <Keyboard keys={state.keys} handleKey={handleKey} />
      {(state.isGameOver && !state.won) || animationOver ? <ShareResults state={state} /> : <></>}
      {shouldWaitForWord && state.correct == "" ? <p>WAITING FOR WORD...</p> : <></>}
    </div>
  );
}



export default Game;
