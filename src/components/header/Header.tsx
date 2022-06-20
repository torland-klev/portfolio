import React from 'react'
import styles from './styles.module.scss'
import Logo from './Logo'
import Navbar from './Navbar'
import Socials from './Socials'

export default function Header() {
    return (
        <div className={styles.header}>
            <Logo />
            <Navbar />
            <Socials />
        </div>
    )
}
