import logo from './pokeball.svg';
import './App.css';
import { useState } from "react";

import generate from './api/generate';

function App() {
  const [pokemonType, setPokemonType] = useState("Normal");
  const [pokemonWord, setPokemonWord] = useState("");
  const [pokemonDesc, setPokemonDesc] = useState("");

  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      console.log(pokemonDesc, pokemonType, pokemonWord);
      const data = await generate(pokemonType, pokemonWord, pokemonDesc);

      setResult(data[0]?.message?.content);
      
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <h2 className="App-header">
        William's Pokemon Generator
      </h2>
      <h3>Tech Fair 2023</h3>

      <form 
        onSubmit={onSubmit}
        className="pokemonForm"
      >
        <div
          className="formRow"
        >
          Pokemon Type
        
          <select
            value={pokemonType}
            onChange={(e) => setPokemonType(e.target.value) }
          >
            <option>Normal</option>
            <option>Fire</option>
            <option>Water</option>
            <option>Grass</option>
            <option>Bug</option>
            <option>Dark</option>
            <option>Dragon</option>
            <option>Electric</option>
            <option>Fairy</option>
            <option>Fighting</option>
            <option>Flying</option>
            <option>Ghost</option>
            <option>Ground</option>
            <option>Ice</option>
            <option>Poison</option>
            <option>Psychic</option>
            <option>Rock</option>
            <option>Steel</option>
            
          </select>

        </div>
        <div
          className="formRow"
        >
          One word description
        
          <input
            type="text"
            name="animal"
            placeholder="Enter a word"
            value={pokemonWord}
            onChange={(e) => setPokemonWord(e.target.value)}
          />

        </div>
        <div
          className="formRow"
        >
          Describe
        
          <input
            type="text"
            name="animal"
            placeholder="Enter a description"
            value={pokemonDesc}
            onChange={(e) => setPokemonDesc(e.target.value)}
          />

        </div>

        <input type="submit" value="Generate Pokemon" />
      </form>

      <div>{result}</div>
        
    </div>
  );
}

export default App;
