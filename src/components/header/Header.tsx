import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './header.module.scss'
import Logo from './Logo'
import Navbar from './Navbar'
import Socials from './Socials'

export default function Header() {
    const { pathname } = useLocation()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Transparent over the home scenes, and over the portfolio background until it scrolls.
    const overScene =
        pathname === '/' || (pathname === '/portfolio' && !scrolled)

    // Fully transparent over the home scenes. Elsewhere a faint glass, so content that scrolls under stays out of the way.
    return (
        <header
            className={`${styles.header} ${overScene ? styles.overScene : ''} ${
                scrolled ? styles.scrolled : ''
            }`}
        >
            <Logo />
            <Navbar />
            <Socials />
        </header>
    )
}
