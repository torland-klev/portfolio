import React, { useState } from 'react'
import styles from './header.module.scss'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [active, setActive] = useState('')

    function NavBarLink({ title }: { title: string }) {
        return (
            <Link
                to={`/${title}`}
                className={
                    active === title || window.location.href.includes(title)
                        ? styles.active
                        : ''
                }
                onClick={() => setActive(title)}
            >
                {title}
            </Link>
        )
    }

    return (
        <div className={styles.navbar}>
            <NavBarLink title={'about'} />
            <NavBarLink title={'featured'} />
            <NavBarLink title={'blog'} />
            <NavBarLink title={'portfolio'} />
            <NavBarLink title={'contact'} />
        </div>
    )
}
