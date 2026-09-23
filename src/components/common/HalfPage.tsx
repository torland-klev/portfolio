import styles from './common.module.scss'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function HalfPage({
    children,
    title,
    to,
    titleFontSize,
    className,
}: React.PropsWithChildren<{
    title: ReactNode
    to?: string
    titleFontSize?: string
    className?: string
}>) {
    const content = (
        <div className={styles.textContainer}>
            <div
                className={styles.title}
                style={{ fontSize: titleFontSize ?? 'xx-large' }}
            >
                {title}
            </div>
            {children && <div className={styles.body}>{children}</div>}
        </div>
    )
    const classes = `${styles.halfPage} ${className ?? ''}`

    return to ? (
        <Link to={to} className={`${classes} ${styles.clickable}`}>
            {content}
        </Link>
    ) : (
        <div className={classes}>{content}</div>
    )
}
