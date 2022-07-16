import React from 'react'
import styles from './homepage.module.scss'
import color from '../images/color.png'
import pastel from '../images/pastel.jpg'
import Emoji from './common/Emoji'

const codeBody =
    'Fullstack developer with a passion for clean code, ' +
    'functional paradigms and beautiful modules.'
const scienceBody =
    'Computer-Science enthusiast excited about ' +
    'current trends and advancements in the field.'

const ScienceTitleComponent = () => (
    <div className={styles.emojiTitle}>
        <Emoji symbol={'🔬'} />
        <div className={styles.title}>science</div>
        <Emoji symbol={'🧪'} />
    </div>
)

const CodeTitleComponent = () => (
    <div className={styles.emojiTitle}>
        <Emoji symbol={'💻'} />
        <div className={styles.title}>code</div>
        <Emoji symbol={'💾'} />
    </div>
)

export default function HomePage() {
    return (
        <div className={styles.homepage}>
            <HalfPage
                title={<CodeTitleComponent />}
                body={codeBody}
                image={color}
            />
            <HalfPage
                title={<ScienceTitleComponent />}
                body={scienceBody}
                image={pastel}
            />
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
