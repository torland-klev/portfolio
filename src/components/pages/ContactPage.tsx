import React from 'react'
import styles from './contact.module.scss'
import contact from '../../images/contact2.png'
import netlight from '../../images/netlight-color.png'
import linkedin from '../../images/linkedin-color.png'
import instagram from '../../images/instagram-color.png'
import snapchat from '../../images/snapchat-color.png'

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
        <div className={styles.section}>
            <div className={styles.element} />
            <div className={styles.element}>
                <TextBox />
                <SocialsBox />
            </div>
            <div className={styles.imageContainer}>
                <img src={contact} alt={'loading...'} />
            </div>
        </div>
    )
}

function EmilMe() {
    return (
        <div className={`${styles.section} ${styles.emailWrapper}`}>
            <div className={styles.element} />
            <EmailBox />
            <div className={styles.element} />
        </div>
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
                    Just want to chat? <br /> <br />
                    Don't hesitate to contact me!
                </div>
            </div>
        </div>
    )
}

function SocialsBox() {
    return (
        <div className={styles.socialsBox}>
            <img
                src={linkedin}
                alt={'linkedin logo color'}
                onClick={() =>
                    (window.location.href =
                        'https://no.linkedin.com/in/henrik-klev-5b5938192')
                }
            />
            <img
                src={netlight}
                alt={'netlight logo color'}
                onClick={() =>
                    (window.location.href = 'https://www.netlight.com/')
                }
            />
            <img
                src={instagram}
                alt={'instagram logo color'}
                onClick={() =>
                    (window.location.href =
                        'https://www.instagram.com/henrik_klev/')
                }
            />
            <img
                src={snapchat}
                alt={'snapchat logo color'}
                onClick={() =>
                    (window.location.href =
                        'https://www.snapchat.com/add/henklev?share_id=RDgwQjQ4QjQtNkUxMC00RTQyLTg2QTktMjEzQUY0NDQ2NjQ3&locale=nb_NO&fbclid=IwAR31A4EXuL0IDQEP05bD0-r1uzZ2Wt6DbpwWgzmNkdfnc7f8UPnOKN07iB0')
                }
            />
        </div>
    )
}

function EmailBox() {
    return (
        <div className={styles.emailContainer}>
            <div className={styles.title}>Send me an email!</div>
            <form>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" />
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" />
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} cols={50} />
                <button type={'submit'}>Send email</button>
            </form>
        </div>
    )
}
