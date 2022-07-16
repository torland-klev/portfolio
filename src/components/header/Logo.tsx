import React from 'react'
import styles from './header.module.scss'
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom'

export default function Logo() {
    return (
        <Link to={'/'} className={styles.logo}>
            <img src={logo} className="App-logo" alt="logo" />
        </Link>
    )
}
