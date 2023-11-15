import styles from './styles/Menu.module.css'
import { useMediaQuery } from 'react-responsive';

export default function Menu({
  navigation,
  onNavigate 
}) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  return (
    <div className={styles.root}>
      <div 
        onClick={() => onNavigate('generate')} 
        className={`${styles.link} ${navigation === 'generate' ? styles.selected : ''}`}
      >
        Generate
      </div>
      {isTabletOrMobile && (
        <div 
          onClick={() => onNavigate('results')} 
          className={`${styles.link} ${navigation === 'results' ? styles.selected : ''}`}
        >
          Results
        </div>
      )}
      <div 
        onClick={() => onNavigate('gallery')} 
        className={`${styles.link} ${navigation === 'gallery' ? styles.selected : ''}`}
      >
        Gallery
      </div>
    </div>

  );
  
};