import React from 'react'
import styles from './homepage.module.scss'
import color from '../../images/colorblur.png'
import pastel from '../../images/pastelblur.jpg'
import Emoji from '../common/Emoji'

const codeBody =
    'Fullstack developer with a passion for clean code, ' +
    'functional paradigms and beautiful modules.'
const scienceBody =
    'Computer-Science enthusiast excited about ' +
    'current trends and advancements in science and technology.'

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
                onClick={() => (window.location.href = '/portfolio')}
            />
            <HalfPage
                title={<ScienceTitleComponent />}
                body={scienceBody}
                image={pastel}
                onClick={() => (window.location.href = '/blog')}
            />
        </div>
    )
}

function HalfPage({
    title,
    body,
    image,
    onClick,
}: {
    title: string | JSX.Element
    body: string
    image?: string
    onClick: () => {}
}) {
    return (
        <div className={styles.halfPage} onClick={onClick}>
            <div className={styles.textContainer}>
                <div className={styles.title}>{title}</div>
                <div className={styles.body}>{body}</div>
            </div>
            {image && <img src={image} alt={'loading...'} />}
        </div>
    )
}
