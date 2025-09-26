import PortugueseWords from "./words/portuguese.js"
import EnglishWords from "./words/english.js"

export const N_GUESSES = 6;
export const WORD_LEN = 5;
export const WAIT_FOR_WORD_TIMEOUT = 5;

export class WordProvider {
  constructor(lang) {
    let words =[];
    if (lang == "PT"){
      words = PortugueseWords;
    }else {
      words = EnglishWords;
    }
    this.WORD_LIST = words;
    this.WORD_SET = new Map();
    for (const word of this.WORD_LIST){
      if (Array.isArray(word)){
        this.WORD_SET.set(word[0],word[1]);
      }else{
        this.WORD_SET.set(word[0],word[1]);
      }
    }
    
  }
  _getWord(i){
    const word = this.WORD_LIST[i];
    if (Array.isArray(word)){
      return word;
    }else{
      return [word,word];
    }
  }
  randomWord() {
    const word =this._getWord(Math.floor(Math.random() * this.WORD_LIST.length));
    return word;
  }

  async wordOfTheDay() {
    const date = new Date().toISOString().split('T')[0];
    const arrybuf = (new TextEncoder()).encode(date)
    const digest = await window.crypto.subtle.digest("SHA-256", arrybuf);
    const hasharray = Array.from(new Uint32Array(digest))
    const num = hasharray[0];
    const normalized = num / 0xffffffff;
    const word = this._getWord(Math.floor(normalized * this.WORD_LIST.length));
    return word;
  }
}




export function evaluateWord(guess,corretWord) {
  const colors = [];
  const chars = {};
  const correct = corretWord[0];
  for (let i = 0; i < WORD_LEN; i++) {
    colors.push(null);
    chars[correct[i]] = (chars[correct[i]] ?? 0) + 1;
    if (guess[i] == correct[i]) {
      colors[i] = "correct";
      chars[correct[i]] = (chars[correct[i]]) - 1;
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

