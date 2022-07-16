import React from 'react'
import styles from './header.module.scss'
import linkedinLogo from '../../images/linkedin.jpg'
import githubLogo from '../../images/github.jpg'
import netlightLogo from '../../images/netlight.jpg'

export default function Socials() {
    return (
        <div className={styles.socials}>
            <Social
                logo={linkedinLogo}
                link={'https://no.linkedin.com/in/henrik-klev-5b5938192'}
                alt={'LinkedIn Logo'}
            />
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
