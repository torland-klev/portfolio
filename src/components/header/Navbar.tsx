import React, { useState } from 'react'
import styles from './header.module.scss'
import { Link } from 'react-router-dom'

export default function Navbar({
    navigateToHome,
    clickHandler,
}: {
    navigateToHome?: boolean
    clickHandler: (active: string) => void
}) {
    const [active, setActive] = useState('')

    function NavBarLink({ title }: { title: string }) {
        return (
            <Link
                to={`/${title}`}
                className={
                    !navigateToHome &&
                    (active === title || window.location.href.includes(title))
                        ? styles.active
                        : styles.inactive
                }
                onClick={() => {
                    setActive(title)
                    clickHandler(title)
                }}
            >
                {title}
            </Link>
        )
    }

    return (
        <div className={styles.navbar}>
            <NavBarLink title={'about'} />
            <NavBarLink title={'blog'} />
            <NavBarLink title={'portfolio'} />
            <NavBarLink title={'contact'} />
        </div>
    )
}
