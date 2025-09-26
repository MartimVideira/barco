
function Keyboard({ keys, handleKey }) {
  const keyboard = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ['Backspace', '⌫']]
  ]



  return <div className='keyboard'>
    <div className='keyboard-line'>
      {keyboard[0].map((k) => <Key handleKey={handleKey} key={keyFromk(k)} k={k} keys={keys} />)}
    </div>

    <div className='keyboard-line'>
      <div className='fake-key' id='key-caps'></div>
      {keyboard[1].map((k) => <Key handleKey={handleKey} key={keyFromk(k)} k={k} keys={keys} />)}
    </div>

    <div className='keyboard-line'>
      {keyboard[2].map((k) => <Key handleKey={handleKey} key={keyFromk(k)} k={k} keys={keys} />)}
    </div>
  </div>
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

export default Keyboard;