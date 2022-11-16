import React from 'react'
import styles from './header.module.scss'
import githubLogo from '../../images/github.png'
import netlightLogo from '../../images/netlight.jpg'

export default function Socials() {
    return (
        <div className={styles.socials}>
            <Social
                logo={githubLogo}
                link={'https://github.com/torland-klev'}
                alt={'Github logo'}
            />
            <Social
                logo={netlightLogo}
                link={'https://www.netlight.com/'}
                alt={'Netlight logo'}
            />
        </div>
    )
}

function Social({
    logo,
    link,
    alt,
}: {
    logo: string
    link: string
    alt: string
}) {
    return (
        <div
            className={styles.social}
            onClick={() => (window.location.href = link)}
        >
            <img src={logo} alt={alt} />
        </div>
    )
}
