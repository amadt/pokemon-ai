"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from '../assets/pokeball.svg';
import Card from "./components/Card";
import Loading from "./components/Loading";
import Gallary from "./components/Gallary";
import generate from '../api/generate';
import html2canvas from "html2canvas";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const processMoves = (moves) => {
  let moveIndex = -1;
  const splitMoves = moves.split('\n');
  const result = [];

  splitMoves.forEach((curr) => {
    console.log(curr);
    if (curr.indexOf('1. ') >= 0) {
      moveIndex = 0;
    } else if (curr.indexOf('2. ') >= 0) {
      moveIndex = 1;
    }
    if (!result[moveIndex] && moveIndex >= 0) {
      const split = curr.split('. ');
      result[moveIndex] = {
        name: split[1]
      }
    }
    const [key, value] = curr.split(': ');
    if (key.toLowerCase().indexOf('energy') >= 0) {
      result[moveIndex].energyCost = value.split(' ');
    }
    if (key.toLowerCase().indexOf('damage') >= 0) {
      result[moveIndex].damage = value;
    }
    if (key.toLowerCase().indexOf('instructions') >= 0) {
      result[moveIndex].instructions = value;
    }
  });

  console.log("Result:", result);
  return result;
};

const processResults = (data) => {
  const accStart = {};

  const splitUp = data[0]?.message?.content.split('Moves:');

  const result = splitUp[0].split('\n').reduce((acc, curr) => {
    const [key, value] = curr.split(': ');
    if (key && value) {
      acc[key] = value;
    }

    return acc;
  }, accStart);
  const addedMoves = { ...result, Moves: processMoves(splitUp[1]) };

  console.log(addedMoves);
  return addedMoves;
}


const EXAMPLE_CARD = {
  Classification: "Electric",
  Description: "A ghostly Pokemon perched upon dark clouds, channeling the power of lightning like a spectral Zeus. It crackles with electric energy, ready to unleash its shocking wrath.",
  HP: "800",
  Height: "3 feet 6 inches",
  Moves: ['1. Thunderbolt', '2. Shadow Ball'],
  Name: "Voltcloud",
  Weight: "45 pounds",
  'Retreat Value': 2,
  Weakness: "Fighting",
  Resistance: "Psychic",
  Moves: processMoves(
    `
    1. Ember Charge
    - Energy Cost: Fire Fire
    - Damage: 40
    - Instructions: This attack does 40 damage to one of your opponent's Pokemon. Don't apply Weakness and Resistance for Benched Pokemon.
  
    2. Flame Burst
    - Energy Cost: Fire Fire Normal
    - Damage: 80
    - Instructions: Discard 1 Energy attached to this Pokemon. This attack does 20 damage to 2 of your opponent's Benched Pokemon. (Don't apply Weakness and Resistance for Benched Pokemon.)
    `
  )
};



export default function Home() {
  // const [prompt, setPrompt] = useState("");
  // const [result, setResult] = useState("");
  // const [instructions, setInstructions] = useState("");
  
  const [loadingData, setLoadingData] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [pokemonType, setPokemonType] = useState("Normal");
  const [pokemonDesc, setPokemonDesc] = useState("");
  const [pokemonWhere, setPokemonWhere] = useState("");

  const [prediction, setPrediction] = useState({
    output: ['https://pbxt.replicate.delivery/wUV5RJb7jzbVAFEOEqR1UUU0NGvM6JYY6yBmmXrwpDl1stbE/out-0.png']
  });
  const [textResult, setTextResult] = useState();
  const [error, setError] = useState(null);
  const [isGallery, setIsGallery] = useState(false);

  const submitImage = async () => {
    setLoadingImage(true);
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // prompt: `portrait of a ${pokemonType}-type creature, digital art, sugimori, chibi, centered, full body, lives in ${pokemonWhere}, ${pokemonDesc}`,
        prompt: `portrait, digital art, sugimori, chibi, centered, full body, lives in ${pokemonWhere}, ${pokemonDesc}`,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setLoadingImage(false);
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
    setLoadingImage(false);
  };

  async function submitText() {
    setLoadingData(true);
    try {
      const data = await generate(pokemonType, pokemonDesc, pokemonWhere);
      setLoadingData(false);
      setTextResult(processResults(data));
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
  const isLoading = loadingData || loadingImage;

  const handleSave = () => {
    const captureElement = document.querySelector('#card');
    html2canvas(captureElement)
        .then(canvas => {
            canvas.style.display = 'none'
            document.body.appendChild(canvas)
            return canvas
        })
        .then(canvas => {
            const image = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.setAttribute('download', `${textResult.Name}.png`)
            a.setAttribute('href', image)
            a.click()
            canvas.remove()
        })
  }

  if (isGallery) {
    return (
      <Gallary onClose={() => setIsGallery(false)} />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.gallaryButton} onClick={() => setIsGallery(true)}>Gallary</div>
      <div className={styles.side}>
        <Head>
          <title>William&apos;s Tech Fair</title>
        </Head>

        <Image src={logo} className={styles.logo} alt="logo" />
        <h2 className="App-header">
          William&apos;s Pokemon Generator
        </h2>
        <h3>Tech Fair 2023</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/*
          <div className={styles.formRow}>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              style={{ height: 100, width: 500 }}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value) }
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="prompt">Prompt</label>
            <textarea
              style={{ height: 100, width: 500 }}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value) }
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="result">Result</label>
            <textarea
              style={{ height: 100, width: 500 }}
              value={result}
            />
          </div>
          */}
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
            <label htmlFor="where">Where does the Pokemon live?</label>
            <input 
              type="text" 
              name="where" 
              value={pokemonWhere}
              onChange={e => setPokemonWhere(e.target.value)}
            />
          </div>
          <button disabled={isLoading} type="submit" >Generate Pokemon</button>
        </form>

        {error && <div>{error}</div>}
      </div>
      <div className={styles.vl}></div>
      <div className={styles.side}>
        {(isLoading) && <Loading />}
        {!isLoading && textResult && (
          <>
            <div className={styles.results}>
              <h3>Results</h3>
              <Card 
                description={textResult.Description}
                height={textResult.Height}
                weight={textResult.Weight}
                word={textResult.Classification}
                hp={textResult.HP}
                image={prediction?.output?.[0]}
                name={textResult.Name || textResult['Pokemon Name']}
                resistance={textResult.Resistance}
                type={pokemonType} 
                retreat={textResult['Retreat Value']}
                weakness={textResult.Weakness}
                moves={textResult.Moves}
              />
              <span class={styles.resultButtons}>
                <button onClick={handleSave}>Save</button>
                <button onClick={submitImage}>Redo Image</button>
              </span>

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
          </>
        )}
      </div>
    </div>
  );
}