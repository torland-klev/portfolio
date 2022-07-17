import React from 'react'
import styles from './header.module.scss'
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom'

export default function Logo({ clickHandler }: { clickHandler: () => void }) {
    return (
        <Link to={'/'} className={styles.logo} onClick={clickHandler}>
            <img src={logo} className="App-logo" alt="logo" />
        </Link>
    )
}
