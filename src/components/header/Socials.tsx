import React from 'react'
import styles from './styles.module.scss'
import linkedinLogo from '../../images/linkedin.png'
import githubLogo from '../../images/github.png'
import netlightLogo from '../../images/netlight.png'

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
                style={styles.smaller}
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
    style,
}: {
    logo: string
    link: string
    alt: string
    style?: string
}) {
    return (
        <div
            className={styles.social + ' ' + style}
            onClick={() => (window.location.href = link)}
        >
            <img src={logo} alt={alt} />
        </div>
    )
}
