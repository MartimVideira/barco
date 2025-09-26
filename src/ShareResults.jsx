import { N_GUESSES, evaluateWord } from "./words";

function ShareResults({ state }) {
  const guesses = state.guesses;
  const won = state.won;
  const CORRECT = state.correct;
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


export default ShareResults;