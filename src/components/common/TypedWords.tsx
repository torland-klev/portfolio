import { useEffect, useState } from 'react'
import styles from './common.module.scss'

const TYPE_MS = 70
const DELETE_MS = 40
const HOLD_MS = 1400
const BLANK_MS = 400

type Phase = 'typing' | 'holding' | 'deleting' | 'blank'

// Types each word out letter by letter, holds it, deletes it, then moves on
// to the next word, looping forever.
//
// This replaces the typewriter-effect package, which wraps its own
// requestAnimationFrame loop in a class component and stops it in
// componentWillUnmount. On this site that loop is torn down mid-animation
// whenever a route change unmounts the page, and stopping it throws
// ("... is not a function") from inside React's own unmount pass. Plain
// setTimeout plus a cleanup function (as WordRoller already does for the
// light-mode variant) does not have that failure mode.
export default function TypedWords({ words }: { words: string[] }) {
    const [wordIndex, setWordIndex] = useState(0)
    const [length, setLength] = useState(0)
    const [phase, setPhase] = useState<Phase>('typing')

    const word = words[wordIndex % words.length]

    useEffect(() => {
        const delay =
            phase === 'typing'
                ? TYPE_MS
                : phase === 'deleting'
                  ? DELETE_MS
                  : phase === 'holding'
                    ? HOLD_MS
                    : BLANK_MS

        const timer = setTimeout(() => {
            switch (phase) {
                case 'typing':
                    if (length < word.length) setLength(length + 1)
                    else setPhase('holding')
                    break
                case 'holding':
                    setPhase('deleting')
                    break
                case 'deleting':
                    if (length > 0) setLength(length - 1)
                    else setPhase('blank')
                    break
                case 'blank':
                    setWordIndex((i) => i + 1)
                    setPhase('typing')
                    break
            }
        }, delay)

        return () => clearTimeout(timer)
    }, [phase, length, word])

    return (
        <span className={styles.typed} aria-live="off">
            {word.slice(0, length)}
            <span className={styles.typedCursor} aria-hidden />
        </span>
    )
}
