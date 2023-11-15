"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from '../assets/pokeball.svg';
import Card from "./components/Card";
import Loading from "./components/Loading";
import Gallery from "./components/Gallery";
import EntryForm from "./components/EntryForm";
import Menu from './components/Menu';
import generate from '../api/generate';
import html2canvas from "html2canvas";
import { useMediaQuery } from 'react-responsive';

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
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

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
  const [navigation, setNavigation] = useState('generate');

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
    if (isTabletOrMobile) { setNavigation('results'); }
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

  return (
    <div className={styles.root}>
      <Menu navigation={navigation} onNavigate={setNavigation} />
      {navigation === 'gallery' ? <Gallery /> : 
       navigation === 'results' ? (
        <div className={styles.side}>
          {(isLoading) && <Loading />}
          {!isLoading && textResult && (
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
            </div>
          )}
        </div>
       ) : (
        <div className={styles.container}>
          <div className={styles.side}>
            <Head>
              <title>William&apos;s Tech Fair</title>
            </Head>

            <Image src={logo} className={styles.logo} alt="logo" />
            <h2 className={styles.header}>
              William&apos;s Pokemon Generator
            </h2>
            <h3 className={styles.subheader}>Tech Fair 2023</h3>
            <EntryForm 
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onDesc={setPokemonDesc}
              onType={setPokemonType}
              onWhere={setPokemonWhere}
              desc={pokemonDesc}
              type={pokemonType}
              where={pokemonWhere}
            />
          </div>
          {!isTabletOrMobile && <div className={styles.vl}></div>}
          {!isTabletOrMobile && (
            <div className={styles.side}>
              {(isLoading) && <Loading />}
              {!isLoading && textResult && (
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
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}