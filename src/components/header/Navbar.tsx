import styles from './header.module.scss'
import { NavLink } from 'react-router-dom'

const pages = ['about', 'blog', 'portfolio', 'contact']

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            {pages.map((page) => (
                <NavLink
                    key={page}
                    to={`/${page}`}
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.inactive
                    }
                >
                    {page}
                </NavLink>
            ))}
        </nav>
    )
}
