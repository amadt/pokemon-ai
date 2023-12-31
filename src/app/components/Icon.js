import Image from "next/image";

import dark from '../../assets/icons/dark.svg';
import dragon from '../../assets/icons/dragon.svg';
import electric from '../../assets/icons/electric.svg';
import fairy from '../../assets/icons/fairy.svg';
import fighting from '../../assets/icons/fighting.svg';
import fire from '../../assets/icons/fire.svg';
import grass from '../../assets/icons/grass.svg';
import normal from '../../assets/icons/normal.svg';
import psychic from '../../assets/icons/psychic.svg';
import steel from '../../assets/icons/steel.svg';
import water from '../../assets/icons/water.svg';

import styles from "./styles/Icon.module.css";

const MAP = {
  Bug: grass,
  Colorless: normal,
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

const STYLE_MAP = {
  Water: styles.water,
  Bug: styles.grass,
  Colorless: styles.normal,
  Dark: styles.dark,
  Dragon: styles.dragon,
  Electric: styles.electric,
  Fairy: styles.fairy,
  Fighting: styles.fighting,
  Fire: styles.fire,
  Flying: styles.normal,
  Grass: styles.grass,
  Ghost: styles.psychic,
  Ground: styles.fighting,
  Ice: styles.water,
  Normal: styles.normal,
  Poison: styles.dark,
  Psychic: styles.psychic,
  Rock: styles.fighting,
  Steel: styles.steel,
  Water: styles.water,
};

export default function Icon({
  multiplier,
  size,
  value,
  type
}) {
  return (
    <div className={styles.row}>
      <div 
        className={`${STYLE_MAP[type]} ${styles.circle}`}
        style={{ width: size + 6, height: size + 6 } }
      >
        <Image
          className={styles.icon}
          src={MAP[type]}
          width={size}
          height={size} 
        />
      </div>
      {multiplier && (
        <div className={styles.multRow}>
          <span className={styles.multiplier} style={{ height: 17 }}>x</span>
          <span className={styles.multiplier}>{multiplier}</span>
        </div>
      )}
      {value && (
        <span className={styles.multiplier}>{value}</span>
      )}
    </div>
  )
}