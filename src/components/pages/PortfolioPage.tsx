import React, { useState } from 'react'
import styles from './portfolio.module.scss'
import colorsplash from '../../images/colorsplash.png'
import tripletex from '../../images/tripletex.png'
import ztl from '../../images/ztl.png'
import payex from '../../images/payex.png'
import technicalDebt from '../../images/technical-debt.png'
import tripletexIntegrations from '../../images/tripletex-integrations.png'
import { wait } from '@testing-library/user-event/dist/utils'

export default function PortfolioPage() {
    return (
        <div className={styles.portfolio}>
            <PortfolioTitle />
            <PortfolioBody />
        </div>
    )
}

function PortfolioTitle() {
    return (
        <div className={styles.portfolioTitle}>
            <div className={styles.left}>
                <div className={styles.title}>My portfolio</div>
                <div className={styles.text}>
                    I've been working at a couple of project over the last few
                    years, and you'll find most of them here.
                    <br />
                    <br />
                    Feel free to poke around, and, should any question arise,
                    feel free to contact me about any of them!
                </div>
            </div>
            <div className={styles.right}>
                <img src={colorsplash} alt={'Loading...'} />
            </div>
        </div>
    )
}

function PortfolioBody() {
    return (
        <div className={styles.portfolioBody}>
            <PortfolioCard
                image={payex}
                company={'PayEx'}
                project={'PAX30 payment terminal'}
                text={'foo'}
                period={'May 2022 - Ongoing'}
            />
            <PortfolioCard
                image={ztl}
                company={'ZTL Payment Solution AS'}
                project={'PSD2 B2B payment solution'}
                text={'foo'}
                period={'November 2021 - May 2022'}
            />
            <PortfolioCard
                image={tripletexIntegrations}
                company={'Tripletex'}
                project={'Sbanken integration'}
                text={'foo'}
                period={'May 2021 - November 2021'}
            />
            <PortfolioCard
                image={technicalDebt}
                company={'Tripletex'}
                project={'Technical debt'}
                text={'foo'}
                period={'Feb 2021 - May 2021'}
            />
            <PortfolioCard
                image={tripletex}
                company={'Tripletex'}
                project={'Incoming payments'}
                text={'foo'}
                period={'Okt 2020 - Feb 2021'}
            />
        </div>
    )
}

function PortfolioCard({
    image,
    company,
    project,
    text,
    period,
}: {
    image: string
    company: string
    project: string
    text: string
    period: string
}) {
    const [popoutVisible, setPopoutVisible] = useState(false)

    const popout = (
        <PopoutCard
            company={company}
            project={project}
            text={text}
            visible={popoutVisible}
            onClose={() => setPopoutVisible(false)}
            period={period}
        />
    )

    return (
        <>
            {popout}
            <div
                className={styles.portfolioCardContainer}
                onClick={() => setPopoutVisible(true)}
            >
                <div
                    className={`${styles.portfolioCard} ${
                        popoutVisible ? styles.portfolioCardActive : ''
                    }`}
                >
                    <img src={image} alt={'Loading...'} />
                    <div className={styles.company}>{company}</div>
                    <div className={styles.project}>{project}</div>
                </div>
            </div>
        </>
    )
}

function PopoutCard({
    company,
    project,
    text,
    visible,
    onClose,
    period,
}: {
    company: string
    project: string
    text: string
    visible?: boolean
    onClose: () => void
    period: string
}) {
    const [closing, setClosing] = useState(false)

    function handleClose() {
        setClosing(true)
        wait(300).then((_) => {
            setClosing(false)
            onClose()
        })
    }

    return (
        <>
            {visible && (
                <div
                    className={`${styles.portfolioPopoutCardContainer} ${
                        closing ? styles.closing : ''
                    }`}
                    onClick={handleClose}
                >
                    <div
                        className={`${styles.popoutCard} ${
                            closing ? styles.closing : ''
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={handleClose}
                        >
                            x
                        </button>
                        <div className={styles.popoutCardBody}>
                            <div className={styles.project}>{project}</div>
                            <div className={styles.companyAndPeriod}>
                                <div>{company}</div>
                                <div>{period}</div>
                            </div>
                            <div className={styles.text}>{text}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
