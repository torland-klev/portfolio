import styles from './common.module.scss'
import React, { ReactNode } from 'react'

export default function HalfPage({
    children,
    title,
    image,
    onClick,
    titleFontSize,
}: React.PropsWithChildren<{
    title: ReactNode
    image?: string
    onClick?: () => {}
    titleFontSize?: string
}>) {
    return (
        <div
            className={`${styles.halfPage} ${onClick ? styles.clickable : ''}`}
            onClick={onClick}
        >
            <div className={styles.textContainer}>
                <div
                    className={styles.title}
                    style={{ fontSize: titleFontSize ?? 'xx-large' }}
                >
                    {title}
                </div>
                <div className={styles.body}>{children}</div>
            </div>
            {image && <img src={image} alt={'loading...'} />}
        </div>
    )
}
