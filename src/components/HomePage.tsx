import React from 'react'
import styles from './homepage.module.scss'

const codeBody =
    'Fullstack developer with a passion for clean code, ' +
    'functional paradigms and beautiful modules.'
const scienceBody =
    'Computer-Science enthusiast excited about ' +
    'current trends and advancements in the field.'

export default function HomePage() {
    return (
        <div className={styles.homepage}>
            <HalfPage title={'<code>'} body={codeBody} />
            <HalfPage title={'science'} body={scienceBody} />
        </div>
    )
}

function HalfPage({ title, body }: { title: String; body: String }) {
    return (
        <div className={styles.halfPage}>
            <div className={styles.title}>{title}</div>
            <div className={styles.body}>{body}</div>
        </div>
    )
}
