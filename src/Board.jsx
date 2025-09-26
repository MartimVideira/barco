
import { N_GUESSES, WORD_LEN, evaluateWord } from './words.js';

function Board({ state, onAnimationEnd }) {

  const lines = [];
  for (let i = 0; i < N_GUESSES; i++) {
    const guessCount = state.guessCount;
    const isCurrentGuess = (i + 1) == guessCount;
    lines.push(<Line correct={state.correct} onAnimationEnd={onAnimationEnd} key={i} guess={state.guesses[i] ?? ''} isInvalid={state.isInvalidGuess && (i == guessCount)} isSet={i < guessCount} won={state.won && isCurrentGuess} />)
  }
  return <div className='board'>
    {lines}
  </div>;

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

function Line({ guess, correct, isSet, won, isInvalid, onAnimationEnd }) {
  const cells = [];

  let colors = [];
  if (isSet) {
    colors = evaluateWord(guess, correct);
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

export default Board;