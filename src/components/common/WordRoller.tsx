import type React from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './common.module.scss'

const HOLD_MS = 2200

// Words that roll up one by one, like a slot-machine reel.
export default function WordRoller({ words }: { words: string[] }) {
    const [index, setIndex] = useState(0)
    const [animate, setAnimate] = useState(true)
    const [width, setWidth] = useState<number>()
    const reelRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimate(true)
            setIndex((i) => i + 1)
        }, HOLD_MS)
        return () => clearInterval(timer)
    }, [])

    // The box takes the width of the current word, so the line stays centered.
    useLayoutEffect(() => {
        const word = reelRef.current?.children[index] as HTMLElement | undefined
        if (word) setWidth(word.scrollWidth)
    }, [index])

    // The list ends with a copy of the first word. When the reel reaches it,
    // jump back to the real first word without animation, so the loop is seamless.
    function onTransitionEnd(e: React.TransitionEvent) {
        if (e.propertyName === 'transform' && index === words.length) {
            setAnimate(false)
            setIndex(0)
        }
    }

    const reel = [...words, words[0]]
    return (
        <span
            className={styles.roller}
            style={{ width, transition: animate ? undefined : 'none' }}
            aria-live="off"
        >
            <span
                ref={reelRef}
                className={styles.rollerReel}
                style={{
                    transform: `translateY(${-index * 1.25}em)`,
                    transition: animate ? undefined : 'none',
                }}
                onTransitionEnd={onTransitionEnd}
            >
                {reel.map((word, i) => (
                    <span key={i} className={styles.rollerWord}>
                        {word}
                    </span>
                ))}
            </span>
        </span>
    )
}
