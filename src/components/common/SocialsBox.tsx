import styles from './common.module.scss'
import linkedin from '../../images/linkedin-color.png'
import github from '../../images/github.png'
import instagram from '../../images/instagram-color.png'
import snapchat from '../../images/snapchat-color.png'
import { socialLinks } from '../socialLinks'

const socials = [
    { name: 'LinkedIn', logo: linkedin, url: socialLinks.linkedin },
    { name: 'GitHub', logo: github, url: socialLinks.github },
    { name: 'Instagram', logo: instagram, url: socialLinks.instagram },
    { name: 'Snapchat', logo: snapchat, url: socialLinks.snapchat },
]

export default function SocialsBox() {
    return (
        <div className={styles.socialsBox}>
            {socials.map(({ name, logo, url }) => (
                <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                >
                    <img src={logo} alt="" />
                </a>
            ))}
        </div>
    )
}
