import { Link, NavLink } from "react-router";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link className={styles.logo} to="/">rastro</Link>
        <NavLink to="/" end>Anuncios</NavLink>
        <NavLink to="/listings/new">Publicar</NavLink>
        <span className={styles.spacer} />
      </nav>
    </header>
  );
}
