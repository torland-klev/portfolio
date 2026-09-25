import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './about.module.scss'
import LeftRight from '../common/LeftRight'
import henrik from '../../images/henrik.jpg'
import scratcher from '../../images/scratcher.jpg'
import runners from '../../images/runners.jpg'
import fireside from '../../images/fireside.jpg'
import fitness from '../../images/fitness.jpg'
import firi from '../../images/firi.jpg'
import beginners from '../../images/beginners.jpg'
import famsquad from '../../images/famsquad.png'
import Emoji from '../common/Emoji'
import { GroupedTags } from '../common/Tags'
import TypedWords from '../common/TypedWords'
import { Link } from 'react-router-dom'
import {
    education,
    experience,
    favoriteLanguages,
    ResumeEntry,
    skillTags,
    spokenLanguages,
    storyItems,
} from './items'
import { socialLinks } from '../socialLinks'
import SocialsBox from '../common/SocialsBox'
import WordRoller from '../common/WordRoller'
import { useMediaQuery, usePageTitle } from '../../hooks'

export default function AboutPage() {
    usePageTitle('About')

    return (
        <div className={styles.about}>
            <AboutMain />
            <Story />
            <Skills />
            <Hobbies />
            <Resume />
            <Now />
        </div>
    )
}

function AboutMain() {
    const Title = () => (
        <>
            Hi! I'm Henrik <Emoji symbol={'👋'} margin={'0'} />
        </>
    )

    const images = [beginners, scratcher, runners, fitness, fireside, famsquad]

    return (
        <div className={styles.aboutMain}>
            <LeftRight
                title={<Title />}
                img={henrik}
                imgAlt="Henrik Klev"
                imgStyles={{
                    width: 'calc(100% - 80px)',
                    margin: '40px',
                    borderRadius: '50%',
                }}
            >
                I'm a senior backend developer at Firi, based in wonderful Oslo,
                Norway.
                <br />
                <br />
                Since 2015 I've been trying to code the perfect program. I have
                currently not succeeded, and I suspect there is a problem with
                the specification.
                <br />
                <br />
                While the specification is magically sorting itself out, I've
                worked mostly in fintech. Here I've been developing accounting
                software, banking integrations, payment terminals and crypto
                trading. Along the way, I also led the Android development of an
                end-to-end encrypted communication platform.
            </LeftRight>
            <div className={styles.imageSlide}>
                {images.map((src) => (
                    <div className={styles.imageContainer} key={src}>
                        <img src={src} alt="" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// Single words that say what drives me. The typewriter cycles through them.
const drivers = [
    'curiosity.',
    'craftsmanship.',
    'rigor.',
    'simplicity.',
    'pragmatism.',
    'ownership.',
    'fairness.',
    'clarity.',
    'coffee.',
]

function shuffled<T>(array: T[]): T[] {
    const copy = [...array]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

function Hobbies() {
    const strings = useMemo(() => shuffled(drivers), [])

    return (
        <div className={styles.hobbies}>
            <div className={styles.hobbiesTitle}>
                Driven by
                {/* Dark mode types the words. Light mode rolls them. */}
                <div
                    className={`${styles.hobbiesTitleActivity} ${styles.typewriter}`}
                >
                    <TypedWords words={strings} />
                </div>
                <div
                    className={`${styles.hobbiesTitleActivity} ${styles.rolling}`}
                >
                    <WordRoller words={strings} />
                </div>
            </div>
        </div>
    )
}

function Skills() {
    return (
        <div className={styles.skills}>
            <div className={styles.skillsInner}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                <GroupedTags tags={skillTags} />
                <br />
                <div className={styles.skillsTitle}>
                    ...and probably a lot more that I've forgotten about!
                </div>
                <div className={styles.skillsTitle}>
                    Looking for something specific?{' '}
                    <Link to={'/contact'}>Contact me</Link>!
                </div>
            </div>
        </div>
    )
}

function ResumeList({ entries }: { entries: ResumeEntry[] }) {
    return (
        <ul className={styles.resumeList}>
            {entries.map((entry) => (
                <li key={entry.title + entry.period}>
                    <div className={styles.resumePeriod}>{entry.period}</div>
                    <div>
                        <div className={styles.resumeTitle}>{entry.title}</div>
                        <div className={styles.resumePlace}>{entry.place}</div>
                        {entry.text && <div>{entry.text}</div>}
                        {entry.link && (
                            <a
                                href={entry.link.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {entry.link.label} ↗
                            </a>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    )
}

function Resume() {
    return (
        <div className={styles.resume}>
            <div className={styles.resumeColumn}>
                <h2 className={styles.resumeHeading}>Experience</h2>
                <ResumeList entries={experience} />
            </div>
            <div className={styles.resumeColumn}>
                <h2 className={styles.resumeHeading}>Education</h2>
                <ResumeList entries={education} />

                <h2 className={styles.resumeHeading}>Languages</h2>
                <div>{spokenLanguages.join(', ')}</div>

                <h2 className={styles.resumeHeading}>
                    Favorite languages{' '}
                    <Emoji symbol={'❤️'} fontSize={'16pt'} margin={'0'} />
                </h2>
                <div>{favoriteLanguages.join(', ')}</div>

                <h2 className={styles.resumeHeading}>GitHub</h2>
                <div className={styles.resumeLinks}>
                    <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                    >
                        github.com/torland-klev
                    </a>
                    <a
                        href={socialLinks.githubWork}
                        target="_blank"
                        rel="noreferrer"
                    >
                        github.com/henrik-klev
                    </a>
                </div>
            </div>
        </div>
    )
}

function Now() {
    return (
        <div className={styles.consultant}>
            <div className={styles.consultantLeft}>
                <div className={styles.consultantInner}>
                    <h2 className={styles.sectionTitle}>Where am I now?</h2>
                    <div className={styles.consultantText}>
                        I'm a senior backend developer at{' '}
                        <a
                            href="https://firi.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Firi
                        </a>
                        , where I help people buy and store crypto safely.
                        <br />
                        <br />
                        Want to talk tech, fintech or formal verification? Reach
                        out! I'll buy you a coffee.
                    </div>
                    <SocialsBox />
                </div>
            </div>
            <div className={styles.consultantRight}>
                <img src={firi} alt="The Firi website" />
            </div>
        </div>
    )
}

const SCROLL_STEP_PX = 600

function Story() {
    const isMobile = useMediaQuery('(max-width: 800px)')

    return (
        <div className={styles.story}>
            <h2 className={styles.sectionTitle}>My story so far</h2>
            {isMobile ? <VerticalTimeline /> : <HorizontalTimeline />}
        </div>
    )
}

function VerticalTimeline() {
    return (
        <ol className={styles.timelineVertical}>
            {storyItems.map((item) => (
                <li key={item.title}>
                    <span className={styles.timelineDot} aria-hidden />
                    <div>
                        <div className={styles.timelineDatePill}>
                            {item.title}
                        </div>
                        <h3>{item.cardTitle}</h3>
                        <p>{item.cardDetailedText}</p>
                    </div>
                </li>
            ))}
        </ol>
    )
}

function HorizontalTimeline() {
    const [selected, setSelected] = useState(0)
    const [canScroll, setCanScroll] = useState({ left: false, right: false })
    const trackRef = useRef<HTMLOListElement>(null)

    useEffect(() => {
        const track = trackRef.current
        if (!track) return
        const update = () =>
            setCanScroll({
                left: track.scrollLeft > 0,
                right:
                    track.scrollLeft + track.clientWidth <
                    track.scrollWidth - 1,
            })
        update()
        const resizeObserver = new ResizeObserver(update)
        resizeObserver.observe(track)
        track.addEventListener('scroll', update, { passive: true })
        return () => {
            resizeObserver.disconnect()
            track.removeEventListener('scroll', update)
        }
    }, [])

    function select(index: number, focus = false) {
        setSelected(index)
        const button = trackRef.current?.querySelectorAll('button')[index]
        button?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
        })
        if (focus) button?.focus()
    }

    function onKeyDown(e: React.KeyboardEvent) {
        const last = storyItems.length - 1
        const next = {
            ArrowRight: Math.min(selected + 1, last),
            ArrowLeft: Math.max(selected - 1, 0),
            Home: 0,
            End: last,
        }[e.key]
        if (next === undefined) return
        e.preventDefault()
        select(next, true)
    }

    const item = storyItems[selected]

    return (
        <>
            <div
                className={`${styles.timeline} ${
                    canScroll.left ? styles.fadeLeft : ''
                } ${canScroll.right ? styles.fadeRight : ''}`}
            >
                <button
                    className={`${styles.timelineArrow} ${styles.timelineArrowLeft}`}
                    onClick={() =>
                        trackRef.current?.scrollBy({
                            left: -SCROLL_STEP_PX,
                            behavior: 'smooth',
                        })
                    }
                    aria-label="Scroll timeline back"
                    hidden={!canScroll.left}
                >
                    ‹
                </button>
                <ol
                    className={styles.timelineTrack}
                    ref={trackRef}
                    role="tablist"
                    aria-label="Timeline"
                    onKeyDown={onKeyDown}
                >
                    {storyItems.map((entry, index) => (
                        <li key={entry.title}>
                            <button
                                role="tab"
                                id={`story-tab-${index}`}
                                aria-selected={index === selected}
                                aria-controls="story-panel"
                                tabIndex={index === selected ? 0 : -1}
                                onClick={() => select(index)}
                            >
                                <span
                                    className={styles.timelineDot}
                                    aria-hidden
                                />
                                <span className={styles.timelineDate}>
                                    {entry.title}
                                </span>
                            </button>
                        </li>
                    ))}
                </ol>
                <button
                    className={`${styles.timelineArrow} ${styles.timelineArrowRight}`}
                    onClick={() =>
                        trackRef.current?.scrollBy({
                            left: SCROLL_STEP_PX,
                            behavior: 'smooth',
                        })
                    }
                    aria-label="Scroll timeline forward"
                    hidden={!canScroll.right}
                >
                    ›
                </button>
            </div>
            <div
                className={styles.timelineCard}
                id="story-panel"
                role="tabpanel"
                aria-labelledby={`story-tab-${selected}`}
            >
                <h3>{item.cardTitle}</h3>
                <p>{item.cardDetailedText}</p>
            </div>
        </>
    )
}
