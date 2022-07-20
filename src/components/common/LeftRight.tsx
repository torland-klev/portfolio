import React, { CSSProperties, ReactNode } from 'react'
import styles from './common.module.scss'

type LeftRightProps = {
    title: ReactNode
    img: string
    imgAlt?: string
    imgStyles?: CSSProperties
    height?: string
}

export default function LeftRight({
    children,
    title,
    img,
    imgAlt,
    imgStyles,
    height,
}: React.PropsWithChildren<LeftRightProps>) {
    return (
        <div
            className={styles.leftRight}
            style={{ height: height ?? 'fit-content' }}
        >
            <div className={styles.left}>
                <div className={styles.title}>{title}</div>
                <div className={styles.text}>{children}</div>
            </div>
            <div className={styles.right}>
                <img style={imgStyles} src={img} alt={imgAlt ?? 'Loading...'} />
            </div>
        </div>
    )
}
