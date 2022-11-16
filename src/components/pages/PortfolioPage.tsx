import React, { useState } from 'react'
import styles from './portfolio.module.scss'
import colorbanner from '../../images/colorbanner.png'
import tripletex from '../../images/tripletex.png'
import ztl from '../../images/ztl.png'
import payex from '../../images/payex.png'
import technicalDebt from '../../images/technical-debt.png'
import tripletexIntegrations from '../../images/tripletex-integrations.png'
import uio from '../../images/uio.png'
import { wait } from '@testing-library/user-event/dist/utils'
import LeftRight from '../common/LeftRight'
import Tags from '../common/Tags'

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
        <LeftRight
            title={'My portfolio'}
            img={colorbanner}
            imgStyles={{ height: 'calc(91vh + 2px)', marginTop: '-1px' }}
            height={'25vh'}
            minHeight={'200px'}
        >
            I've been working at a couple of project over the last few years,
            and you'll find most of them here.
            <br />
            <br />
            Feel free to poke around, and, should any question arise, feel free
            to contact me about any of them!
        </LeftRight>
    )
}

function PortfolioBody() {
    const tripletexTags = [
        'Java',
        'React',
        'TypeScript',
        'React Redux',
        'React Saga',
        'React Router',
        'Maria DB',
        'AWS',
        'SQL',
        'Grafana',
        'Prometheus',
        'Cypress',
        'Spring',
        'ORM',
        'Maven',
        'Docker',
        'IntelliJ',
        'Tomcat',
        'Webpack',
        'Vite',
        'Nods.js',
        'npm',
        'Jenkins',
        'Kibana',
        'sass',
        'JSP',
    ]

    const tripletexBasic =
        'Tripletex is one of the leading accounting systems in Norway, and has been operational for more than 20 years. ' +
        'As part of the Piggy Bank Crew, the team responsible for banking and bank integrations, I partook in a couple of projects. ' +
        'The team consisted of a handful developers, a QA and a UX designer.'

    return (
        <div className={styles.portfolioBody}>
            <PortfolioCard
                image={payex}
                company={'PayEx'}
                project={'Android Payment Terminal'}
                role={'Android developer'}
                text={
                    'PayEx is a leading nordic payment provider that provides complete payment solutions for stores and e-commerce. ' +
                    'As part of an agile team consisting of 10 developers, 3 QA and team lead, ' +
                    'I helped develop a new line of stand-alone PAX30 payment terminals. The terminals are to be ' +
                    'deployed to major retailers, such as Coop, Volvo, Circle K, Narvesen, 7-Eleven, and others by Q4 2022. ' +
                    'The terminals where written in Android using Kotlin, Jetpack Compose and Dagger, with ' +
                    'a test-suite utilizing Mockito and JUnit 4.'
                }
                period={'May 2022 - Ongoing'}
                tags={[
                    'Kotlin',
                    'Android',
                    'Jetpack Compose',
                    'Dagger',
                    'Mockito',
                    'JUnit 4',
                    'Gradle',
                    'Agile',
                    'Fintech',
                    'Git',
                    'Jira',
                    'GitHub',
                    'Nexo Acquirer',
                    'Docker',
                    'IntelliJ',
                    'Android Studio',
                ]}
            />
            <PortfolioCard
                image={ztl}
                company={'ZTL Payment Solution'}
                project={'PSD2 B2B Payment Solution'}
                role={'Fullstack developer'}
                text={
                    'ZTL Payment Solution is a fintech scale-up that utilizes the PSD2 APIs of financial instituions ' +
                    'to provide real-time payment solutions and account services. During my time there, I helped develop their' +
                    ' REST API-based payment solution and internal management system. The payment solution was written in Kotlin ' +
                    'using KTOR, JDBI and PSQL, hosted on MicroSoft Azure, while their management system was React+TypeScript-based.'
                }
                period={'Nov 2021 - May 2022'}
                tags={[
                    'Kotlin',
                    'React',
                    'TypeScript',
                    'Fintech',
                    'Git',
                    'Jira',
                    'Bitbucket',
                    'PSD2',
                    'ISO 20022',
                    'New Relic',
                    'Grafana',
                    'PSQL',
                    'MicroSoft Azure',
                    'Ktor',
                    'Docker',
                    'IntelliJ',
                    'Nods.js',
                    'npm',
                    'sass',
                ]}
            />
            <PortfolioCard
                image={tripletexIntegrations}
                company={'Tripletex'}
                project={'Sbanken Integration'}
                role={'Fullstack developer, Team security lead'}
                text={
                    tripletexBasic +
                    '\n\nMy final project at Tripletex consisted of integration towards the PSD2 API of Sbanken.' +
                    'As a result, all customers that had an account in Sbanken, would seamlessly receive all their account information and payments directly into ' +
                    'Tripletex. This gave customers full control over their accounts, enabled automatic reconciliation and closing of invoices, and enabled them ' +
                    'to pay their invoices directly from Tripletex.'
                }
                period={'May 2021 - Nov 2021'}
                tags={tripletexTags}
            />
            <PortfolioCard
                image={technicalDebt}
                company={'Tripletex'}
                project={'Technical Debt'}
                role={'Fullstack developer, Team security lead, Frontend lead'}
                text={
                    tripletexBasic +
                    '\n\nMy second project at Tripletex was focused on removing technical debt. ' +
                    'When a system becomes as large, old and complex as that of Tripletex, you debt just starts piling up and ' +
                    'the latency goes through the roof. By systematically analyzing the system in its multi-threaded setting, ' +
                    'and exposing the bottlenecks that caused the most perceived latency, some modules became as ' +
                    'much as 15 times more efficient.'
                }
                period={'Feb 2021 - May 2021'}
                tags={tripletexTags}
            />
            <PortfolioCard
                image={tripletex}
                company={'Tripletex'}
                project={'Incoming Payments'}
                role={'Fullstack developer'}
                text={
                    tripletexBasic +
                    '\n\nMy first project at Tripletex consisted of automatically fetching, parsing, posting and reconciling incoming payments. ' +
                    'When the project was finished, customers received all the payments for their accounts automatically into their accounting systems, ' +
                    'where all the payments were closed to the correct invoice and reconciled towards the corresponding bank-statement entry.'
                }
                period={'Oct 2020 - Feb 2021'}
                tags={tripletexTags}
            />
            <PortfolioCard
                image={uio}
                company={'University of Oslo'}
                project={'M. Sc.'}
                role={'Researcher'}
                text={
                    "To receive my Master's degree in Computer Science, I focused in formally verifying parts of the " +
                    'official Norwegian electoral system, EVA. By use of deductive verification and dynamic logic, I was able to ' +
                    'mathematically prove that certain core components of the system both adhered to the program specification and that' +
                    ' it would never fail to do so. The project was completed with guidance of the Reliable Systems group at the University of Oslo ' +
                    'and the Formal Methods division at University of Gothenburg.'
                }
                period={'Aug 2018 - Jun 2020'}
                tags={[
                    'Java',
                    'JUnit 4',
                    'Deductive verification',
                    'Formal methods',
                    'Dynamic logic',
                    'KeY',
                ]}
            />
        </div>
    )
}

function PortfolioCard({
    image,
    company,
    project,
    role,
    text,
    period,
    tags,
}: {
    image: string
    company: string
    project: string
    role: string
    text: string
    period: string
    tags: string[]
}) {
    const [popoutVisible, setPopoutVisible] = useState(false)

    const popout = (
        <PopoutCard
            company={company}
            project={project}
            text={text}
            role={role}
            visible={popoutVisible}
            onClose={() => setPopoutVisible(false)}
            period={period}
            tags={tags}
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
    role,
    visible,
    onClose,
    period,
    tags,
}: {
    company: string
    project: string
    text: string
    role: string
    visible?: boolean
    onClose: () => void
    period: string
    tags: string[]
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
                            <div className={styles.popoutCardBodyProject}>
                                {project}
                            </div>
                            <div className={styles.companyAndPeriod}>
                                <div>{company}</div>
                                <div>{role}</div>
                                <div>{period}</div>
                            </div>
                            <div className={styles.popoutCardBodyText}>
                                {text}
                            </div>
                            <Tags tags={tags} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
