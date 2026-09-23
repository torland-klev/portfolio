import React, { useState } from 'react'
import styles from './contact.module.scss'
import contact from '../../images/contact2.png'
import emailjs from '@emailjs/browser'
import SocialsBox from '../common/SocialsBox'
import { socialLinks } from '../socialLinks'
import { usePageTitle } from '../../hooks'

export default function ContactPage() {
    usePageTitle('Contact')

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
                <img src={contact} alt="" />
            </div>
        </div>
    )
}

function EmailMe() {
    return (
        <div className={`${styles.section} ${styles.emailWrapper}`}>
            <EmailBox />
        </div>
    )
}

function TextBox() {
    return (
        <div className={styles.textBox}>
            <h1 className={styles.title}>Get in touch!</h1>
            <div className={styles.body}>
                Interested in working together? <br />
                Got some feedback for me? <br />
                Want to chat?
            </div>
        </div>
    )
}

type Status = 'idle' | 'sending' | 'success' | 'error'

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function EmailBox() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<Status>('idle')
    const [validationError, setValidationError] = useState('')

    function checkErrors(): string {
        const errors = []
        if (!name.trim()) errors.push('missing name')
        if (!email.trim()) errors.push('missing email')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.push('not a valid email')
        if (!message.trim()) errors.push('missing message')
        return capitalizeFirstLetter(errors.join(', '))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const errors = checkErrors()
        setValidationError(errors)
        if (errors) return

        const templateId = import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID
        const publicKey = import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY
        if (!templateId || !publicKey) {
            openMailApp()
            return
        }

        setStatus('sending')
        try {
            await emailjs.send(
                'default_service',
                templateId,
                {
                    domain: window.location.hostname,
                    name,
                    email,
                    message,
                },
                { publicKey }
            )
            setStatus('success')
            setName('')
            setEmail('')
            setMessage('')
        } catch {
            // For example a blocked request. Keep the input and hand it to the mail app.
            setStatus('error')
            openMailApp()
        }
    }

    // Fallback: open the visitor's mail app with the message filled in.
    function openMailApp() {
        const subject = encodeURIComponent(`Message from ${name}`)
        const body = encodeURIComponent(`${message}\n\n${name} (${email})`)
        window.location.href = `mailto:${socialLinks.email}?subject=${subject}&body=${body}`
    }

    function onChange(setter: (value: string) => void) {
        return (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            setter(e.target.value)
            setValidationError('')
        }
    }

    return (
        <div className={styles.emailContainer}>
            <h2 className={styles.title}>Send me an email</h2>
            <form
                className={styles.emailForm}
                onSubmit={handleSubmit}
                noValidate
            >
                <div className={styles.nameEmail}>
                    <label htmlFor="name">Name</label>
                    <input
                        required
                        id="name"
                        name="name"
                        autoComplete="name"
                        value={name}
                        onChange={onChange(setName)}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        required
                        autoComplete="email"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange(setEmail)}
                    />
                    <div aria-live="polite">
                        {status === 'error' && (
                            <span
                                className={`${styles.response} ${styles.responseError} ${styles.responseFadeIn}`}
                            >
                                It seems like something's a bit off right now.
                                Try emailing me directly at{' '}
                                <a href={`mailto:${socialLinks.email}`}>
                                    {socialLinks.email}
                                </a>{' '}
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
                        {status === 'success' && (
                            <span
                                className={`${styles.response} ${styles.responseFadeInOut}`}
                            >
                                Thanks for the email! I'll get back to you as
                                soon as I can!
                            </span>
                        )}
                    </div>
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
                        onChange={onChange(setMessage)}
                    />
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={status === 'sending'}
                    >
                        {status === 'sending' ? 'Sending…' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    )
}
