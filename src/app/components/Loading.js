import Image from "next/image";
import logo from '../../assets/pokeball.svg';
import styles from "./styles/Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.root}>
      <Image src={logo} className={styles.logo} alt="loading" />
      <span>Loading</span>
      <span style={{ fontSize: 10, marginTop: 8 }}>This might take a minute</span>
    </div>
  )
}

