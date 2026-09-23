import styles from './header.module.scss'
import { Link } from 'react-router-dom'

export default function Logo() {
    return (
        <Link to="/" className={styles.logo} aria-label="Henrik Klev, home">
            <span className={styles.logoText}>
                klev
                <span className={styles.logoDot} aria-hidden />
            </span>
        </Link>
    )
}
