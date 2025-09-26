
import { useState, useEffect, useReducer } from 'react'
import { WORD_SET, wordOfTheDay, N_GUESSES, WORD_LEN, WAIT_FOR_WORD_TIMEOUT, evaluateWord } from './words';
import { INITIAL_GAME_STATE, reducer } from './gameReducer.js';
import Board from './Board.jsx'
import Keyboard from './Keyboard.jsx';
import ShareResults from './ShareResults.jsx';



function Game({ initialState, language, isDaily, storeState }) {
  const [animationOver, setAnimationOver] = useState(false);
  const [state, dispatch] = useReducer(reducer, INITIAL_GAME_STATE);

  useEffect(() => { setAnimationOver(false); console.log(initialState); dispatch({ type: 'INITIALIZE', payload: initialState }) }, [initialState]);
  useEffect(() => storeState(state), [state]);


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
      {((state.isGameOver && !state.won) || animationOver) && <ShareResults state={state} />}
    </div>
  );
}



export default Game;
