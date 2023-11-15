import styles from './styles/Gallery.module.css';
import data from '../data/gallery';
import Image from "next/image";
import Icon from "./Icon";

export default function Gallery({ onClose }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className="App-header">
          William&apos;s Pokemon Generator
        </h2>
        <h3>Creation Gallery</h3>
      </div>
      <div className={styles.gallery}>
        {data.map((item) => (
          <div key={item.id} className={styles.item}>
            <Image
              src={item.image}
              className={styles.image}  
            />
            <table className={styles.table}>
              <tbody>
                <tr>
                  <th className={styles.tableKey}>Type</th>
                  <td>
                    <span className={styles.type}>
                      <Icon type={item.type} size={16} /> {item.type}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{item.descibe}</td>
                </tr>
                <tr>
                  <th>Location</th>
                  <td>{item.where}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
