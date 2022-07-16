import React from 'react'
import styles from './contact.module.scss'

export default function ContactPage() {
    return (
        <div className={styles.contact}>
            <ContactMain />
            <EmilMe />
        </div>
    )
}

function ContactMain() {
    return (
        <div className={`${styles.section} ${styles.contactWrapper}`}>
            <div className={styles.element} />
            <div className={styles.element}>
                <TextBox />
                <SocialsBox />
            </div>
            <div className={styles.element} />
            <div className={styles.element} />
        </div>
    )
}

function EmilMe() {
    return (
        <div className={`${styles.section} ${styles.emailWrapper}`}>Email</div>
    )
}

function TextBox() {
    return (
        <div className={styles.contactContainer}>
            <div className={styles.title}>
                <div>Get in touch!</div>
            </div>
            <div className={styles.body}>
                <div>
                    Interested in working together? <br />
                    Got some feedback for me? <br />
                    Just want to have a chat? <br /> <br />
                    Don't hesitate to contact me!
                </div>
            </div>
        </div>
    )
}

function SocialsBox() {
    return <div className={styles.element}>Socials box</div>
}
