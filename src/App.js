//CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// data
import {wordsList} from "./data/words.js"

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

// tornar dinâmico a quantidade de tentativas criando uma const ao invés de declarar o valor direto no setGuesses(3) por exemplo
const guessesQty = 3;

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  
  // letras adivinhadas, array para guardar cada uma
  const [guessedLetters, setGuessedLetters] = useState([]);
  
  // letras erradas , array para guardar cada uma
  const [wrongLetters, setWrongLetters] = useState([]);
  
  // quantidade de palpites  cont--
  const [guesses, setGuesses] = useState(guessesQty);
  
  // pontuação   cont++
  const [score, setScore] = useState(0);
  
  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    //seleciona os objetos do array words(carro, fruta etc)  
    const categories = Object.keys(words);
    // são 6 categorias e preciso gerar um random de 0 a 6
    // categories[0..?] = vai retornar um valor inteiro entre 0 e o total de obj(length)     
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    //const category = categories[Math.floor(Math.random() * categories.length)];
    
    //pick a random word
    //    word = words[0..?][0..?]   words[3][1] [computador][teclado]
    // vai ser a categoria vezes o length da própria categoria
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    // words[category].length vai ser o número de palavras da categoria selecionada
    
    // RESUMINDO: um random para categoria e um random para palavra e o retorno desses valores para a pagina;
    
    return {word, category};

  },[words]);

  // starts the secret word game - tela para abrir o componente game.js
  const startGame = useCallback(() => {

    // clear all letters
    clearLetterStates();

    // pick word and pick category
    const {word, category} = pickWordAndCategory();

    //create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((letra)=> letra.toLowerCase());
    // A primeira letra vai ser gerada em maiusculo e o javascript é case sensitive, ou seja, vai obrigar a digitar somente em maiusculo, para evitar esse problema usa o metodo toLowercase para mudar tudo para minusculo.

    // fill states

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the letter input 
   //recebe a letra enviada pelo component game por props  
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //check if letter has alredy been utilized
    // se algum for verdadeiro (letra estiver inclusa em guessedL ou em wrongLetters) retorne 

    // push guessed letter or remove a guess
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
      // se a letra já estiver dentro de guessedLetter ou wrongLetter, não adicione ela.
      // retorna pois não faz sentido  o usuario perder uma chance com uma letra que ele já adivinhou
    }

    if(letters.includes(normalizedLetter)){ // letra certa
        setGuessedLetters((actualGuessedLetters)=> [ 
          ...actualGuessedLetters,   //selecionar todas as letras
          normalizedLetter           // adicionar a nova letra no setGuess
        ]);
    } else {    // letra errada
        setWrongLetters((actualWrongLetter)=> [
          ...actualWrongLetter,
          normalizedLetter
        ]);
        //pega todos os elementos atuas do array e adiciona um novo, ou seja, está unindo um elemento a um array
        
        //         actualGuesses é o valor definido que foi 3 
        setGuesses((actualGuesses)=> actualGuesses - 1);
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //useEffect vai monitorar o estado da guesses
  //ele pode monitorar dados
  // vai ter uma função que vai ser executada cada vez que esse dado for alterado.
  //o segundo argumento da função [], vai ser o dado que se quer monitorar

  //check if guesses ended

   //useEffect é uma função que vai ser executada cada vez que os dados forem alterados.

  useEffect(()=> {
    if(guesses <= 0){
      //após o termino do jogo, ao iniciar novamente as tentativas continuam com 0 e não 3, então é preciso limpar todos os states para iniciar novamente o jogo, para isso será criado uma função.
      //reset all states
      clearLetterStates();
      
      setGameStage(stages[2].name);
    }

  }, [guesses]);

  // check win condition
  // todo dado dinâmico que é utilizado no useEffect tem que ser colocado no ambiente de monitoramento
  useEffect(()=> {
    // o Set só retorna itens únicos dentro do array(repetidos)
    // por exemplo a palavra java dentro do array set vai ficar jav. Retira letras que possuem mais de uma.
    const uniqueLetters = [...new Set(letters)];

    //win condition
    //quando a quantia for igual termina o jogo
    if(guessedLetters.length === uniqueLetters.length){
        //add score
        setScore((actualScore)=> (actualScore += 100));
        // restart game with new word
        startGame();
    }

  }, [guessedLetters, letters, startGame]);


  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
    
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && (
      <Game
        verifyLetter={verifyLetter} 
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />
      )}

      {gameStage === "end" && <GameOver 
      retry={retry}
      score={score}
      />}
    </div>
  );
}

export default App;
