import React, { useState } from 'react'
import styles from './contact.module.scss'
import contact from '../../images/contact2.png'
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser'
import SocialsBox from '../common/SocialsBox'

export default function ContactPage() {
    return (
        <div className={styles.contact}>
            <ContactMain />
            <EmailMe />
        </div>
    )
}

function ContactMain() {
    return (
        <div className={styles.section}>
            <div className={styles.element}>
                <div className={styles.contactBody}>
                    <TextBox />
                    <SocialsBox />
                </div>
            </div>
            <div className={styles.imageContainer}>
                <img src={contact} alt={'loading...'} />
            </div>
        </div>
    )
}

function EmailMe() {
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
        <div className={styles.textBox}>
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

function EmailBox() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [emailError, setEmailError] = useState<
        EmailJSResponseStatus | undefined
    >(undefined)
    const [validationError, setValidationError] = useState<string>('')

    function capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    function checkErrors(): string {
        const errors = []
        if (!name) errors.push('missing name')
        if (!email) errors.push('missing name')
        else if (!email.includes('@') || !email.includes('.'))
            errors.push('not a valid email')
        if (!message) errors.push('missing message')
        return capitalizeFirstLetter(errors.join(', '))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSuccess(false)
        setEmailError(undefined)
        setValidationError('')
        const templateParams = {
            domain: 'test',
            name: name,
            email: email,
            message: message,
        }

        const validationErrors = checkErrors()
        setValidationError(validationErrors)
        if (!validationErrors)
            emailjs
                .send(
                    'default_service',
                    process.env.REACT_APP_EMAILJS_TEMPLATE_ID!!,
                    templateParams,
                    process.env.REACT_APP_EMAILJS_PUBLIC_KEY!!
                )
                .then(
                    (_: EmailJSResponseStatus) => {
                        setSuccess(true)
                        setEmailError(undefined)
                    },
                    (err: EmailJSResponseStatus) => {
                        setSuccess(false)
                        setEmailError(err)
                    }
                )
                .finally(() => {
                    setName('')
                    setEmail('')
                    setMessage('')
                })
    }

    return (
        <div className={styles.emailContainer}>
            <div className={styles.title}>Send me an email</div>
            <form className={styles.emailForm}>
                <div className={styles.nameEmail}>
                    <label htmlFor="name">Name</label>
                    <input
                        required
                        id="name"
                        name="name"
                        autoComplete={'name'}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            setValidationError('')
                        }}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        required
                        autoComplete={'email'}
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setValidationError('')
                        }}
                    />
                    {emailError && (
                        <span
                            className={`${styles.response} ${styles.responseError} ${styles.responseFadeInOut}`}
                        >
                            It seems like something's a bit off right now. Try
                            contacting me through any of the other links above
                            instead!
                        </span>
                    )}
                    {validationError && (
                        <span
                            className={`${styles.response} ${styles.responseError} ${styles.responseFadeIn}`}
                        >
                            {validationError}
                        </span>
                    )}
                    {success && (
                        <span
                            className={`${styles.response} ${styles.responseFadeInOut}`}
                        >
                            Thanks for the email! I'll get back to you as soon
                            as I can!
                        </span>
                    )}
                </div>
                <div className={styles.messageAndButton}>
                    <label htmlFor="message">Message</label>
                    <textarea
                        required
                        id="message"
                        name="message"
                        rows={4}
                        cols={50}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value)
                            setValidationError('')
                        }}
                    />
                    <button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}
