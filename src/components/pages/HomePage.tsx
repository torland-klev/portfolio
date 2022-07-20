import React from 'react'
import styles from './homepage.module.scss'
import color from '../../images/colorblur.png'
import pastel from '../../images/pastelblur.jpg'
import Emoji from '../common/Emoji'
import HalfPage from '../common/HalfPage'

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
                image={color}
                onClick={() => (window.location.href = '/portfolio')}
                titleFontSize={'42pt'}
            >
                {codeBody}
            </HalfPage>
            <HalfPage
                title={<ScienceTitleComponent />}
                image={pastel}
                onClick={() => (window.location.href = '/blog')}
                titleFontSize={'42pt'}
            >
                {scienceBody}
            </HalfPage>
        </div>
    )
}
