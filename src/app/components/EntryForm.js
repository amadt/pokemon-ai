import styles from './styles/EntryForm.module.css';

export default function EntryForm({
  isLoading,
  onSubmit,
  onType,
  onDesc,
  onWhere,
  type,
  desc,
  where
}) {
  return (
  <form className={styles.form} onSubmit={onSubmit}>
    <div className={styles.formRow}>
      <label htmlFor="pokemonType">Pokemon Type</label>
      <select
        value={type}
        onChange={(e) => onType(e.target.value) }
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
        value={desc}
        onChange={e => onDesc(e.target.value)}
      />
    </div>
    <div className={styles.formRow}>
      <label htmlFor="where">Where does the Pokemon live?</label>
      <input 
        type="text" 
        name="where" 
        value={where}
        onChange={e => onWhere(e.target.value)}
      />
    </div>
    <button disabled={isLoading} type="submit" >Generate Pokemon</button>
  </form>

  );
}