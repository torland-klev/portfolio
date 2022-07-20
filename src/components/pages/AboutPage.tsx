import React from 'react'
import styles from './about.module.scss'
import LeftRight from '../common/LeftRight'
import famsquad from '../../images/famsquad.png'
import scratcher from '../../images/scratcher.jpg'
import runners from '../../images/runners.jpg'
import fireside from '../../images/fireside.jpg'
import fitness from '../../images/fitness.jpg'
import beginners from '../../images/beginners.jpg'
import coder from '../../images/coder.gif'
import designer from '../../images/designer.gif'
import Emoji from '../common/Emoji'
import HalfPage from '../common/HalfPage'
import Typewriter from 'typewriter-effect'

export default function AboutPage() {
    return (
        <div className={styles.about}>
            <AboutMain />
            <Developer />
            <Hobbies />
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
                Meanwhile, while waiting for the specification to magically sort
                itself out, I've been working primarily in the financial sector
                where I've been developing accounting software, banking
                integrations and payment solutions.
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
    return <div></div>
}

function Consultant() {
    return <div></div>
}

function Story() {
    return <div></div>
}

function FollowMe() {
    return <div></div>
}
