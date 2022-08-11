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
import Tags from '../common/Tags'
import Typewriter from 'typewriter-effect'
import { Link } from 'react-router-dom'
import { Chrono } from 'react-chrono'
import { skillTags, storyItems } from './items'
import SocialsBox from '../common/SocialsBox'

export default function AboutPage() {
    return (
        <div className={styles.about} id={'about-id'}>
            <AboutMain />
            <Hobbies />
            <Developer />
            <Story />
            <Skills />
            <Consultant />
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
            <div style={{ maxWidth: '1200px', margin: '2vh 0' }}>
                <Tags tags={skillTags} />
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
                    <br />
                    <br />
                    Even if you're not interested in hiring me, you should reach
                    out anyways! I'll buy you a coffee.
                </div>
                <SocialsBox />
            </div>
            <div className={styles.consultantRight}>
                <img src={netlight} alt={'Loading...'} />
            </div>
        </div>
    )
}

function Story() {
    const theme = {
        primary: '#333333',
        secondary: '#393e46',
        cardBgColor: '#fcfcfc',
        cardForeColor: '#333333',
        titleColor: '#333333',
        titleColorActive: '#fcfcfc',
    }

    return (
        <div className={styles.story}>
            <div className={styles.storyTitle} />
            <div style={{ maxWidth: '3000px', width: '100%' }}>
                <Chrono
                    items={storyItems}
                    mode="HORIZONTAL"
                    theme={theme}
                    hideControls
                    cardPositionHorizontal={'TOP'}
                    cardWidth={1000}
                    itemWidth={350}
                    cardHeight={120}
                    focusActiveItemOnLoad={false}
                />
            </div>
        </div>
    )
}
