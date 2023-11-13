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
  return word?.charAt(0).toUpperCase() + word?.slice(1);
}

const fixHeight = (height) => {
  return height.replace(' feet', '\'').replace(' inches', '"')
}
const fixWeight = (weight) => {
  return weight.replace('pounds', 'lbs');
}

const isDark = (type) => {
  if (type === 'Dark') return true;
  if (type === 'Poison') return true;
  return false;
}


export default function Card({
  description,
  hp,
  image,
  name,
  type,
  height,
  moves,
  retreat,
  resistance,
  weakness,
  weight,
  word
}) {
  return (
    <div className={`${styles.card} ${isDark(type) ? styles.dark : styles.light}`} id="card">
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
      <div className={styles.desc}>
        <div className={styles.clipLeft}></div>
        <div className={styles.clipRight}></div>
        <p>
          {description}
        </p>
      </div>
      <div className={styles.moves}>
        {moves.map((move) => (
          <div className={styles.move} key={move.name}>
            <div className={styles.move}>
            <div className={styles.moveTitle}>
              <div className={styles.moveTitleLeft}>
                <div className={styles.moveIcons}>
                  {move.energyCost.map((energy, i) => (
                    <Icon type={energy} size={16} key={`element${i}`}  />
                  ))}
                </div>
                <div className={styles.moveName}>
                  {move.name}
                </div>
              </div>
              <div className={styles.moveValue}>
                {move.damage}
              </div>
            </div>
            <div className={styles.moveDescription}>
              {move.instructions}
            </div>
          </div>
        </div>
      ))}
      </div>
      <div className={styles.weakness}>
        {weakness ? <Icon type={weakness} size={10} multiplier="2" /> : ''}
      </div>
      <div className={styles.resistance}>
        {resistance && resistance !== 'None' && (
          <Icon type={resistance} size={10} value="-30" />
        )}
      </div>
      <div className={styles.retreat}>
        {retreat >= 1 && <Icon type="Normal" size={10} />}
        {retreat >= 2 && <Icon type="Normal" size={10} />}
        {retreat >= 3 && <Icon type="Normal" size={10} />}
      </div>
    </div>
  );   
}