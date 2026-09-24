import styles from './homepage.module.scss'
import HalfPage from '../common/HalfPage'
import BlueprintScene from './home/BlueprintScene'
import SkylineScene from './home/SkylineScene'
import PaperCommitsScene from './home/PaperCommitsScene'
import PaperCityScene from './home/PaperCityScene'
import WatercolorScene from './home/WatercolorScene'
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery, usePageTitle } from '../../hooks'

// Light mode style. Set to 'papercraft' to use the paper-cut scenes instead.
const LIGHT_STYLE: 'watercolor' | 'papercraft' = 'watercolor'

type Scene = 'commits' | 'convictions'

export default function HomePage() {
    usePageTitle()

    // Phones have no hover. There, the section you scroll to decides the scene.
    const isMobile = useMediaQuery('(max-width: 800px)')
    const [mobileScene, setMobileScene] = useState<Scene>('commits')
    const commitsRef = useRef<HTMLDivElement>(null)
    const convictionsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isMobile) return
        const update = () => {
            const convictions = convictionsRef.current?.getBoundingClientRect()
            if (!convictions) return
            // Switch once the convictions section reaches the middle of the screen.
            setMobileScene(
                convictions.top < window.innerHeight / 2
                    ? 'convictions'
                    : 'commits'
            )
        }
        update()
        window.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            window.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [isMobile])

    const cycleClass = isMobile
        ? mobileScene === 'commits'
            ? styles.showCommits
            : styles.showConvictions
        : ''

    return (
        <div className={`${styles.homepage} ${cycleClass}`}>
            {/* Covers everything below the header, the footer included.
                Hovering either half shows that half's scene across the whole area. */}
            <div className={styles.backdrop} aria-hidden>
                <div className={`${styles.layer} ${styles.layerCommits}`}>
                    <div className={styles.light}>
                        {LIGHT_STYLE === 'watercolor' ? (
                            <WatercolorScene variant="commits" />
                        ) : (
                            <PaperCommitsScene />
                        )}
                    </div>
                    <div className={styles.dark}>
                        <BlueprintScene />
                    </div>
                </div>
                <div className={`${styles.layer} ${styles.layerConvictions}`}>
                    <div className={styles.light}>
                        {LIGHT_STYLE === 'watercolor' ? (
                            <WatercolorScene variant="convictions" />
                        ) : (
                            <PaperCityScene />
                        )}
                    </div>
                    <div className={styles.dark}>
                        <SkylineScene />
                    </div>
                </div>
            </div>
            <div className={styles.intro}>
                <h1>Henrik Klev</h1>
                <p>Senior backend developer in Oslo, Norway</p>
                <span className={styles.scrollHint} aria-hidden>
                    ⌄
                </span>
            </div>
            <div className={styles.halves}>
                <div ref={commitsRef} className={styles.section}>
                    <HalfPage
                        title={<Choice word="commits" caption="portfolio" />}
                        to="/portfolio"
                        titleFontSize={'48pt'}
                        className={styles.commits}
                    />
                </div>
                <div ref={convictionsRef} className={styles.section}>
                    <HalfPage
                        title={<Choice word="convictions" caption="blog" />}
                        to="/blog"
                        titleFontSize={'48pt'}
                        className={styles.convictions}
                    />
                </div>
            </div>
        </div>
    )
}

// On phones the word becomes a pill with an arrow and a caption, so it reads as a button.
function Choice({ word, caption }: { word: string; caption: string }) {
    return (
        <span className={styles.choice}>
            <span className={styles.choicePill}>
                {word}
                <span className={styles.choiceArrow} aria-hidden>
                    →
                </span>
            </span>
            <span className={styles.choiceCaption}>{caption}</span>
        </span>
    )
}
