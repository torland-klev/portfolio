import React from 'react'
import styles from './homepage.module.scss'
import color from '../images/color.png'
import Emoji from './common/Emoji'

const codeBody =
    'Fullstack developer with a passion for clean code, ' +
    'functional paradigms and beautiful modules.'
const scienceBody =
    'Computer-Science enthusiast excited about ' +
    'current trends and advancements in the field.'

const ScienceTitleComponent = () => (
    <div className={styles.emojiTitle}>
        <Emoji symbol={'🔬'} fontSize={'32px'} />
        <div className={styles.title}>science</div>
        <Emoji symbol={'🧪'} fontSize={'32px'} transform={'rotate(315deg)'} />
    </div>
)

export default function HomePage() {
    return (
        <div className={styles.homepage}>
            <HalfPage title={'<code>'} body={codeBody} image={color} />
            <HalfPage title={<ScienceTitleComponent />} body={scienceBody} />
        </div>
    )
}

function HalfPage({
    title,
    body,
    image,
}: {
    title: string | JSX.Element
    body: string
    image?: string
}) {
    return (
        <div className={styles.halfPage}>
            <div className={styles.textContainer}>
                {<div className={styles.title}>{title}</div>}
                <div className={styles.body}>{body}</div>
            </div>
            {image && <img src={image} alt={'loading...'} />}
        </div>
    )
}
