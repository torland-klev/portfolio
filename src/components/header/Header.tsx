import React, { useState } from 'react'
import styles from './header.module.scss'
import Logo from './Logo'
import Navbar from './Navbar'
import Socials from './Socials'

export default function Header() {
    const [navigatedToHome, setNavigatedToHome] = useState(false)

    return (
        <div className={styles.header}>
            <Logo clickHandler={() => setNavigatedToHome(true)} />
            <Navbar
                navigateToHome={navigatedToHome}
                clickHandler={() => setNavigatedToHome(false)}
            />
            <Socials />
        </div>
    )
}
