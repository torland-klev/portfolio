import { useLocation } from 'react-router-dom'
import styles from './footer.module.scss'
import { socialLinks } from '../socialLinks'

export default function Footer() {
    // The home and portfolio backgrounds run behind the footer.
    const overBackground = ['/', '/portfolio'].includes(useLocation().pathname)

    return (
        <footer
            className={`${styles.footer} ${overBackground ? styles.transparent : ''}`}
        >
            <a href={`mailto:${socialLinks.email}`}>{socialLinks.email}</a>
            <span>&copy; {new Date().getFullYear()} Henrik Torland Klev</span>
        </footer>
    )
}
