import Image from "next/image";
import styles from "./styles/Card.module.css";

import dark from '../../assets/cards/dark.png';
import dragon from '../../assets/cards/dragon.png';
import electric from '../../assets/cards/electric.png';
import fairy from '../../assets/cards/fairy.png';
import fighting from '../../assets/cards/fighting.png';
import fire from '../../assets/cards/fire.png';
import grass from '../../assets/cards/grass.png';
import normal from '../../assets/cards/normal.png';
import psychic from '../../assets/cards/psychic.png';
import steel from '../../assets/cards/steel.png';
import water from '../../assets/cards/water.png';
import Icon from "./Icon";

const MAP = {
  Bug: grass,
  Dark: dark,
  Dragon: dragon,
  Electric: electric,
  Fairy: fairy,
  Fighting: fighting,
  Fire: fire,
  Flying: normal,
  Grass: grass,
  Ghost: psychic,
  Ground: fighting,
  Ice: water,
  Normal: normal,
  Poison: dark,
  Psychic: psychic,
  Rock: fighting,
  Steel: steel,
  Water: water,
}

const fixWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const fixHeight = (height) => {
  return height.replace(' feet', '\'').replace(' inches', '"')
}
const fixWeight = (weight) => {
  return weight.replace('pounds', 'lbs');
}

export default function Card({
  description,
  hp,
  image,
  name,
  type,
  height,
  weight,
  word
}) {
  return (
    <div className={styles.card}>
      <Image
        src={MAP[type]}
        className={styles.background}  
      />
      {image && (
        <Image
          src={image}
          alt="output"
          className={styles.image}
          width={256}
          height={171}
        />
      )}
      <div className={styles.name}>
        {name}
      </div>
      <div className={styles.hp}>
        {hp}
      </div>
      <div className={styles.bar}>
        <span>{fixWord(word)} Pokemon</span>
        <span>HT {fixHeight(height)}</span>
        <span>WT {fixWeight(weight)}</span>
      </div>
      <div class={styles.desc}>
        <div class={styles.clipLeft}></div>
        <div class={styles.clipRight}></div>
        <p>
          {description}
        </p>
      </div>
      <div className={styles.weakness}>
        <Icon type="Water" size={12} />
      </div>
    </div>
  );   
}