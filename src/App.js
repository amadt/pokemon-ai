import logo from './pokeball.svg';
import './App.css';
import { useState } from "react";

import generate from './api/generate';

function App() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const data = await generate(animalInput);
      console.log(data);

      setResult(data[0]?.message?.content);
      setAnimalInput("");
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

      <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>

        <div>{result}</div>

    </div>
  );
}

export default App;
