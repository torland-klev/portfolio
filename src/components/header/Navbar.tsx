import React from 'react'
import styles from './header.module.scss'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <div className={styles.navbar}>
            <Link to={'/about'}>about</Link>
            <Link to={'/featured'}>featured</Link>
            <Link to={'/blog'}>blog</Link>
            <Link to={'/portfolio'}>portfolio</Link>
            <Link to={'/contact'}>contact</Link>
        </div>
    )
}
