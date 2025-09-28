import { N_GUESSES, evaluateWord } from "./words";

const FLAGS = {
  ENG: "🇬🇧",
  PT: "🇵🇹",
}

function ShareResults({ state, language, isDaily }) {
  const guesses = state.guesses;
  const won = state.won;
  const CORRECT = state.correct;
  const copyResultsToClipBoard = () => {

    const res = [];
    for (const guess of guesses) {
      if (guess == "" || guess == null) {
        break;
      }
      res.push(evaluateWord(guess, state.correct));
    }
    let s = `Barco ${isDaily ? "Daily" : "Random"} ${FLAGS[language]} ${res.length}/${N_GUESSES}\n`;
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
    <p>{won ? "VICTORY" : "DEFEAT word was: " + CORRECT[1]}</p>
    <button onClick={copyResultsToClipBoard}>Share</button>
  </div>

}


export default ShareResults;