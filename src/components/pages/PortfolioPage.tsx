import React, { useEffect, useRef, useState } from 'react'
import styles from './portfolio.module.scss'
import splash from '../../images/splash.svg'
import splashDark from '../../images/splash-dark.svg'
import Tags from '../common/Tags'
import { Project, projects, withCategory } from './items'
import { usePageTitle } from '../../hooks'

const CLOSE_ANIMATION_MS = 200

export default function PortfolioPage() {
    usePageTitle('Portfolio')

    return (
        <div className={styles.portfolio}>
            {/* Fixed behind the whole page, header and footer included. */}
            <div
                className={`${styles.portfolioBackdrop} ${styles.light}`}
                style={{ backgroundImage: `url(${splash})` }}
                aria-hidden
            />
            <div
                className={`${styles.portfolioBackdrop} ${styles.dark}`}
                style={{ backgroundImage: `url(${splashDark})` }}
                aria-hidden
            />
            <h1 className={styles.visuallyHidden}>Portfolio</h1>
            <div className={styles.portfolioBody}>
                {projects.map((project) => (
                    <PortfolioCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    )
}

// Lines like "Technical debt (Feb 2021 - May 2021)" are section titles.
const SECTION_TITLE = /^[^.]+\([A-Z][a-z]{2} \d{4} - [A-Z][a-z]{2} \d{4}\)$/

function ProjectText({ text }: { text: string }) {
    return (
        <>
            {text.split('\n').map((line, i) =>
                SECTION_TITLE.test(line) ? (
                    <strong key={i} className={styles.sectionTitle}>
                        {line}
                        {'\n'}
                    </strong>
                ) : (
                    <span key={i}>
                        {line}
                        {'\n'}
                    </span>
                )
            )}
        </>
    )
}

function LogoTile({ project, large }: { project: Project; large?: boolean }) {
    return (
        <div
            className={`${styles.logoTile} ${large ? styles.logoTileLarge : ''}`}
            style={
                project.logoBg ? { backgroundColor: project.logoBg } : undefined
            }
        >
            <img src={project.image} alt={`${project.company} logo`} />
        </div>
    )
}

function PortfolioCard({ project }: { project: Project }) {
    const [popoutVisible, setPopoutVisible] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    function close() {
        setPopoutVisible(false)
        buttonRef.current?.focus()
    }

    return (
        <>
            {popoutVisible && <PopoutCard project={project} onClose={close} />}
            <button
                ref={buttonRef}
                className={styles.portfolioCardContainer}
                onClick={() => setPopoutVisible(true)}
                aria-haspopup="dialog"
            >
                <div
                    className={`${styles.portfolioCard} ${
                        popoutVisible ? styles.portfolioCardActive : ''
                    }`}
                >
                    <LogoTile project={project} />
                    <div className={styles.company}>{project.company}</div>
                    <div className={styles.project}>{project.project}</div>
                </div>
            </button>
        </>
    )
}

const FOCUSABLE =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function PopoutCard({
    project,
    onClose,
}: {
    project: Project
    onClose: () => void
}) {
    const [closing, setClosing] = useState(false)
    const dialogRef = useRef<HTMLDivElement>(null)

    function handleClose() {
        setClosing(true)
        setTimeout(onClose, CLOSE_ANIMATION_MS)
    }

    // Stop the page behind the dialog from scrolling.
    useEffect(() => {
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [])

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Escape') {
            handleClose()
            return
        }
        if (e.key !== 'Tab' || !dialogRef.current) return

        // Keep keyboard focus inside the dialog.
        const focusable = [
            ...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ]
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
        }
    }

    const titleId = `${project.id}-title`

    return (
        <div
            className={`${styles.portfolioPopoutCardContainer} ${
                closing ? styles.closing : ''
            }`}
            onClick={handleClose}
        >
            <div
                ref={dialogRef}
                className={styles.popoutCard}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={onKeyDown}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <button
                    className={styles.closeButton}
                    onClick={handleClose}
                    aria-label="Close"
                    autoFocus
                >
                    ×
                </button>
                <LogoTile project={project} large />
                <div className={styles.popoutCardBody}>
                    <h2 className={styles.popoutCardBodyProject} id={titleId}>
                        {project.project}
                    </h2>
                    <div className={styles.companyAndPeriod}>
                        <div>{project.company}</div>
                        <div>{project.role}</div>
                        <div>{project.period}</div>
                    </div>
                    <div className={styles.popoutCardBodyText}>
                        <ProjectText text={project.text} />
                    </div>
                    {project.link && (
                        <a
                            className={styles.popoutCardBodyLink}
                            href={project.link.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {project.link.label} ↗
                        </a>
                    )}
                    <Tags tags={project.tags.map(withCategory)} />
                </div>
            </div>
        </div>
    )
}
