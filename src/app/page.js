"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from '../assets/pokeball.svg';
import Card from "./components/Card";
import generate from '../api/generate';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [pokemonType, setPokemonType] = useState("Normal");
  const [pokemonWord, setPokemonWord] = useState("mushroom");
  const [pokemonDesc, setPokemonDesc] = useState("");
  const [pokemonWhere, setPokemonWhere] = useState("");

  const [prediction, setPrediction] = useState({
    output: ['https://pbxt.replicate.delivery/wUV5RJb7jzbVAFEOEqR1UUU0NGvM6JYY6yBmmXrwpDl1stbE/out-0.png']
  });
  const [textResult, setTextResult] = useState({
    Description: "A ghostly Pokemon perched upon dark clouds, channeling the power of lightning like a spectral Zeus. It crackles with electric energy, ready to unleash its shocking wrath.",
    HP: "800",
    Height: "3 feet 6 inches",
    Moves: ['1. Thunderbolt', '2. Shadow Ball'],
    Name: "Voltcloud",
    Weight: "45 pounds"
  });
  const [error, setError] = useState(null);

  const submitImage = async () => {
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `portrait of a ${pokemonType}-type, ${pokemonWord}-type, digital art, sugimori, chibi, centered, full body, lives in ${pokemonWhere}, ${pokemonDesc}`,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({prediction})
      setPrediction(prediction);
    }
  };

  async function submitText() {
    
    try {
      const data = await generate(pokemonType, pokemonWord, pokemonDesc, pokemonWhere);
      const accStart = { Moves: [] };

      const result = data[0]?.message?.content.split('\n').reduce((acc, curr) => {
        const [key, value] = curr.split(': ');
        if (key && key !== 'Moves:') {
          if (value) {
            acc[key] = value;
          } else {
            acc.Moves.push(key);
          }
        }
        
        return acc;
      }, accStart);

      console.log(data[0]?.message?.content);
      console.log(result);
      setTextResult(result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitText();
    submitImage();
  };

  return (
    <div className={styles.container}>
      <div className={styles.side}>
        <Head>
          <title>William's Tech Fair</title>
        </Head>

        <Image src={logo} className={styles.logo} alt="logo" />
        <h2 className="App-header">
          William's Pokemon Generator
        </h2>
        <h3>Tech Fair 2023</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label htmlFor="pokemonType">Pokemon Type</label>
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
          <div className={styles.formRow}>
            <label htmlFor="description">Describe the Pokemon</label>
            <input 
              type="text" 
              name="description" 
              value={pokemonDesc}
              onChange={e => setPokemonDesc(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="word">Describe with one word</label>
            <input 
              type="text" 
              name="word" 
              value={pokemonWord}
              onChange={e => setPokemonWord(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="where">Where does the Pokemon live?</label>
            <input 
              type="text" 
              name="where" 
              value={pokemonWhere}
              onChange={e => setPokemonWhere(e.target.value)}
            />
          </div>

          <button type="submit">Generate Pokemon</button>
        </form>

        {error && <div>{error}</div>}
      </div>
      <div className={styles.vl}></div>
      <div className={styles.side}>
        <h3>Results</h3>
        <div className={styles.results}>
          <Card 
            description={textResult.Description}
            height={textResult.Height}
            weight={textResult.Weight}
            word={pokemonWord}
            hp={textResult.HP}
            image={prediction?.output?.[0]}
            name={textResult.Name}
            type={pokemonType} 
          />

          {false && prediction && (
            <div>

              <p>status: {prediction.status}</p>
            </div>
          )}
          {false && textResult && (
            Object.keys(textResult).map((key) =>
              <div key={key} style={{ display: 'flex', gap: 10 }}>
                <span>{key}:</span>
                <span>{textResult[key]}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}