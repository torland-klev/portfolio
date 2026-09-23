import styles from './homepage.module.scss'
import HalfPage from '../common/HalfPage'
import BlueprintScene from './home/BlueprintScene'
import SkylineScene from './home/SkylineScene'
import PaperCommitsScene from './home/PaperCommitsScene'
import PaperCityScene from './home/PaperCityScene'
import WatercolorScene from './home/WatercolorScene'
import { usePageTitle } from '../../hooks'

// Light mode style. Set to 'papercraft' to use the paper-cut scenes instead.
const LIGHT_STYLE: 'watercolor' | 'papercraft' = 'watercolor'

export default function HomePage() {
    usePageTitle()

    return (
        <div className={styles.homepage}>
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
            </div>
            <div className={styles.halves}>
                <HalfPage
                    title="commits"
                    to="/portfolio"
                    titleFontSize={'48pt'}
                    className={styles.commits}
                />
                <HalfPage
                    title="convictions"
                    to="/blog"
                    titleFontSize={'48pt'}
                    className={styles.convictions}
                />
            </div>
        </div>
    )
}
