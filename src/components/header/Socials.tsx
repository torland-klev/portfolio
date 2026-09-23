import type React from 'react'
import styles from './header.module.scss'
import linkedinLogo from '../../images/linkedin.png'
import { socialLinks } from '../socialLinks'
import { useTheme } from '../../hooks'

// Hidden for now. Set to true to show the LinkedIn logo in the header again.
const SHOW_LINKEDIN = false

export default function Socials() {
    const [theme, toggleTheme] = useTheme()
    const next = theme === 'dark' ? 'light' : 'dark'

    return (
        <div className={styles.socials}>
            <Social
                icon={<GitHubIcon />}
                link={socialLinks.github}
                name="GitHub"
            />
            {SHOW_LINKEDIN && (
                <Social
                    icon={<img src={linkedinLogo} alt="" />}
                    link={socialLinks.linkedin}
                    name="LinkedIn"
                />
            )}
            <button
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label={`Switch to ${next} mode`}
                title={`Switch to ${next} mode`}
            >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
        </div>
    )
}

function Social({
    icon,
    link,
    name,
}: {
    icon: React.ReactNode
    link: string
    name: string
}) {
    return (
        <a
            className={styles.social}
            href={link}
            target="_blank"
            rel="noreferrer"
            aria-label={name}
        >
            {icon}
        </a>
    )
}

function SunIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <circle cx="12" cy="12" r="4.5" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="1.5" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22.5" />
                <line x1="1.5" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22.5" y2="12" />
                <line x1="4.6" y1="4.6" x2="6.3" y2="6.3" />
                <line x1="17.7" y1="17.7" x2="19.4" y2="19.4" />
                <line x1="4.6" y1="19.4" x2="6.3" y2="17.7" />
                <line x1="17.7" y1="6.3" x2="19.4" y2="4.6" />
            </g>
        </svg>
    )
}

function MoonIcon() {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path
                fill="currentColor"
                d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z"
            />
        </svg>
    )
}

function GitHubIcon() {
    return (
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
            <path
                fill="currentColor"
                d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
            />
        </svg>
    )
}
