
import "./Game.css";
import { useState, useRef } from "react";
// useRef cria uma referencia a algum lugar

const Game = ({
  verifyLetter, 
  pickedWord, 
  pickedCategory, 
  guesses, 
  wrongLetters, 
  letters,  
  guessedLetters, 
  score,
  }) => {

  const [letter, setLetter] = useState("");

  const letterInputRef = useRef(null);
  

  const handleSubmit = (e) => {
    e.preventDefault();

    verifyLetter(letter);//vai enviar a letra do input por prop para a tela app

    setLetter(""); // vai limpar o setLetter e o input após envio da letra
    
    // vai sempre deixar o campo de letra selecionado, sem a necessidade de usar o mouse cada vez para clicar no campo
    letterInputRef.current.focus();

  }

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Adivinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span> 
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>
      <div className="wordContainer">
        {/*  //método map() invoca a função callback passada por argumento para cada elemento do Array e devolve um novo Array como resultado.
          //se incluir a letra no guessedLetters, ou seja, se a letra já estiver sido adivinhado
          //O método includes() determina se um array contém um determinado elemento, retornando true ou false apropriadamente.*/}
        {letters.map((letter, i) =>(
          guessedLetters.includes(letter) ? (
            <span className="letter" key={i}>
              {letter}
              </span>
                ) : (
              <span key={i} className="blankSquare"></span>
                )
            ))}
      </div>
      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="letter" 
            maxLength="1" 
            required 
            onChange={(e) => setLetter(e.target.value)}
            value={letter}
            ref={letterInputRef}
            />
          <button>JOGAR!</button>
        </form>
      </div>
      <div className="wrongLettersContainer">
          <p>Letras já utilizadas:</p>
          {wrongLetters.map((letter, i) => (
            <span key={i}>{letter}, </span>
          ))}
      </div>
    </div>
  )
}

export default Game