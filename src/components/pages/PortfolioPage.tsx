import React from 'react'
import styles from './portfolio.module.scss'
import colorsplash from '../../images/colorsplash.png'
import tripletex from '../../images/tripletex.png'
import ztl from '../../images/ztl.png'
import payex from '../../images/payex.png'
import technicalDebt from '../../images/technical-debt.png'
import tripletexIntegrations from '../../images/tripletex-integrations.png'

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
            />
            <PortfolioCard
                image={ztl}
                company={'ZTL Payment Solution AS'}
                project={'PSD2 B2B payment solution'}
            />
            <PortfolioCard
                image={tripletexIntegrations}
                company={'Tripletex'}
                project={'Sbanken integration'}
            />
            <PortfolioCard
                image={technicalDebt}
                company={'Tripletex'}
                project={'Technical debt'}
            />
            <PortfolioCard
                image={tripletex}
                company={'Tripletex'}
                project={'Incoming payments'}
            />
        </div>
    )
}

function PortfolioCard({
    image,
    company,
    project,
}: {
    image: string
    company: string
    project: string
}) {
    return (
        <div className={styles.portfolioCard}>
            <img src={image} alt={'Loading...'} />
            <div className={styles.company}>{company}</div>
            <div className={styles.project}>{project}</div>
        </div>
    )
}
