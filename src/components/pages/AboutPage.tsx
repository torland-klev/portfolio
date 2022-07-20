import React from 'react'
import styles from './about.module.scss'
import LeftRight from '../common/LeftRight'
import famsquad from '../../images/famsquad.png'
import scratcher from '../../images/scratcher.jpg'
import runners from '../../images/runners.jpg'
import fireside from '../../images/fireside.jpg'
import fitness from '../../images/fitness.jpg'
import netlight from '../../images/netlight-color.png'
import beginners from '../../images/beginners.jpg'
import coder from '../../images/coder.gif'
import designer from '../../images/designer.gif'
import Emoji from '../common/Emoji'
import HalfPage from '../common/HalfPage'
import Tags, { TagCategory } from '../common/Tags'
import Typewriter from 'typewriter-effect'
import { Link } from 'react-router-dom'

export default function AboutPage() {
    return (
        <div className={styles.about}>
            <AboutMain />
            <Hobbies />
            <Developer />
            <Skills />
            <Consultant />
            <Story />
            <FollowMe />
        </div>
    )
}

function AboutMain() {
    const Title = () => (
        <>
            <>Hi! I'm Henrik</> <Emoji symbol={'👋'} margin={'0'} />
        </>
    )

    function ImageSlide() {
        const Image = ({ src }: { src: string }) => (
            <div className={styles.imageContainer}>
                <img src={src} alt={'Loading...'} />
            </div>
        )

        return (
            <div className={styles.imageSlide}>
                <Image src={beginners} />
                <Image src={scratcher} />
                <Image src={runners} />
                <Image src={fitness} />
                <Image src={fireside} />
            </div>
        )
    }

    return (
        <div>
            <LeftRight
                title={<Title />}
                img={famsquad}
                imgStyles={{ padding: '40px', width: '100%' }}
            >
                I'm a fullstack developer based in wonderful Oslo, Norway.
                <br />
                <br />
                Since 2015 I've been trying to code the perfect program. I have
                currently not succeeded, and I suspect there is a problem with
                the specification.
                <br />
                <br />
                While the specification is magically sorting itself out, I'm
                working primarily in the financial sector. <br /> Here I've been
                developing accounting software, banking integrations and payment
                solutions.
            </LeftRight>
            <ImageSlide />
        </div>
    )
}

function Developer() {
    const Backend = () => (
        <HalfPage title={'Backend & Operations'} image={coder}>
            <div style={{ marginLeft: '24px' }}>
                <ul>
                    <li>development</li>
                    <li>integrations</li>
                    <li>automation</li>
                    <li>operations</li>
                </ul>
                <br /> ... and everything else! <br />
            </div>
        </HalfPage>
    )

    const Frontend = () => (
        <HalfPage title={'Frontend & Design'} image={designer}>
            <div style={{ marginLeft: '24px' }}>
                <ul>
                    <li>react</li>
                    <li>typescript</li>
                    <li>node</li>
                    <li>jetpack</li>
                </ul>
                <br /> ... and a lot more! <br />
            </div>
        </HalfPage>
    )

    return (
        <div className={styles.developer}>
            <Backend />
            <Frontend />
        </div>
    )
}

function Hobbies() {
    const activities = [
        'program.',
        'watch sports.',
        'play games.',
        'work out.',
        'hike.',
        'run.',
        'socialize.',
        'drink.',
        'eat.',
        'shop fancy clothes.',
        'spend money.',
        'play chess.',
        'learn.',
        'read.',
        'teach.',
        'drink coffee.',
        'swim.',
        'vibe.',
        'dance.',
    ]

    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array
    }

    return (
        <div className={styles.hobbies}>
            <div className={styles.hobbiesTitle}>
                On my free time, I like to
                <div className={styles.hobbiesTitleActivity}>
                    <Typewriter
                        options={{
                            strings: shuffleArray(activities),
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

function Skills() {
    return (
        <div className={styles.skills}>
            <div className={styles.skillsTitle}>
                Technologies I love and enjoy
            </div>
            <div style={{ maxWidth: '1200px', marginBottom: '2vh' }}>
                <Tags
                    tags={[
                        { tag: 'Kotlin', category: TagCategory.LANGUAGE },
                        { tag: 'Java', category: TagCategory.LANGUAGE },
                        { tag: 'Android', category: TagCategory.FRAMEWORK },
                        {
                            tag: 'Jetpack Compose',
                            category: TagCategory.FRAMEWORK,
                        },
                        { tag: 'R', category: TagCategory.LANGUAGE },
                        { tag: 'Matlab', category: TagCategory.LANGUAGE },
                        { tag: 'JSP', category: TagCategory.LANGUAGE },
                        { tag: 'JML', category: TagCategory.OTHER },
                        { tag: 'KeY', category: TagCategory.TOOL },
                        { tag: 'Azure', category: TagCategory.DEVOPS },
                        { tag: 'AWS', category: TagCategory.DEVOPS },
                        { tag: 'SQL', category: TagCategory.TECHNOLOGY },
                        { tag: 'Git', category: TagCategory.TECHNOLOGY },
                        { tag: 'Dagger', category: TagCategory.TECHNOLOGY },
                        { tag: 'Spring', category: TagCategory.FRAMEWORK },
                        { tag: 'Hibernate', category: TagCategory.TECHNOLOGY },
                        { tag: 'React', category: TagCategory.FRAMEWORK },
                        { tag: 'TypeScript', category: TagCategory.LANGUAGE },
                        { tag: 'HTML', category: TagCategory.LANGUAGE },
                        { tag: 'CSS', category: TagCategory.TECHNOLOGY },
                        { tag: 'SASS', category: TagCategory.TECHNOLOGY },
                        { tag: 'IntelliJ', category: TagCategory.TOOL },
                        { tag: 'Docker', category: TagCategory.TECHNOLOGY },
                        {
                            tag: 'React Redux',
                            category: TagCategory.TECHNOLOGY,
                        },
                        { tag: 'React Saga', category: TagCategory.TECHNOLOGY },
                        { tag: 'Jenkins', category: TagCategory.DEVOPS },
                        { tag: 'GitHub', category: TagCategory.TOOL },
                        { tag: 'Gradle', category: TagCategory.DEVOPS },
                        { tag: 'Maven', category: TagCategory.DEVOPS },
                        { tag: 'UNIX', category: TagCategory.TECHNOLOGY },
                        { tag: 'Windows', category: TagCategory.OTHER },
                        { tag: 'Scheme', category: TagCategory.LANGUAGE },
                        { tag: 'Stata', category: TagCategory.TOOL },
                        { tag: 'Firebase', category: TagCategory.TECHNOLOGY },
                        { tag: 'PostgreSQL', category: TagCategory.LANGUAGE },
                        { tag: 'Android Studio', category: TagCategory.TOOL },
                        { tag: 'JUnit', category: TagCategory.FRAMEWORK },
                        { tag: 'Mockito', category: TagCategory.FRAMEWORK },
                    ].sort((a, b) => a.tag.localeCompare(b.tag))}
                />
                <br />
                <div className={styles.skillsTitle}>
                    ...and probably a lot more that I've forgotten about!
                </div>
                <div className={styles.skillsTitle}>
                    Looking for something specific?{' '}
                    <Link to={'/contact'}>Contact</Link> me!
                </div>
            </div>
        </div>
    )
}

function Consultant() {
    return (
        <div className={styles.consultant}>
            <div className={styles.consultantLeft}>
                <div className={styles.consultantTitle}>
                    Did you know you can hire me?
                </div>
                <div className={styles.consultantText}>
                    I'm part the the incredible consulting firm{' '}
                    <Link to={'https://www.netlight.com/'}>Netlight</Link>,
                    which means that there is always a possibility that I can
                    join your team. To check if I'm available and interested,
                    you can contact me any way you'd like.
                </div>
            </div>
            <div className={styles.consultantRight}>
                <img src={netlight} alt={'Loading...'} />
            </div>
        </div>
    )
}

function Story() {
    return <div></div>
}

function FollowMe() {
    return <div></div>
}
