import styles from './scenes.module.scss'
import { H, HORIZON, SUN, W } from './city'
import { wavePath } from './paper'

// A paper-cut studio: code brackets, code cards being typed, and floating confetti.
// It shares the sun position and the wave layers with PaperCityScene, so the two cross-fade well.

function seeded(seed: number) {
    return () => {
        seed = (seed * 1664525 + 1013904223) >>> 0
        return seed / 4294967296
    }
}

const STRIP_COLORS = ['#b388eb', '#7ec8e3', '#ff9aa2', '#5cc08f', '#ffc857']
const CONFETTI_COLORS = ['#ff9aa2', '#7ec8e3', '#ffc857', '#b388eb', '#5cc08f']
const WAVES = [
    { y: HORIZON + 20, color: '#e4d4fb', speed: 9 },
    { y: HORIZON + 80, color: '#cdb4f6', speed: 7 },
    { y: HORIZON + 150, color: '#f5a3c7', speed: 8 },
    { y: HORIZON + 215, color: '#e26fa4', speed: 6 },
]

const rand = seeded(42)

const cards = [
    { x: 120, y: 110, w: 430, h: 250, rotate: -3 },
    { x: 1060, y: 90, w: 420, h: 270, rotate: 2.5 },
].map((card) => ({
    ...card,
    lines: Array.from({ length: 7 }, () => {
        const indent = Math.floor(rand() * 3) * 24
        return Array.from({ length: 1 + Math.floor(rand() * 3) }, () => ({
            w: 40 + rand() * 80,
            color: STRIP_COLORS[Math.floor(rand() * STRIP_COLORS.length)],
            indent,
        }))
    }),
}))

type Shape = 'circle' | 'triangle' | 'square' | 'squiggle'
const confetti = Array.from({ length: 26 }, () => ({
    shape: (['circle', 'triangle', 'square', 'squiggle'] as Shape[])[
        Math.floor(rand() * 4)
    ],
    x: rand() * W,
    y: 40 + rand() * (HORIZON - 80),
    size: 10 + rand() * 18,
    color: CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)],
    duration: 8 + rand() * 10,
    delay: -rand() * 18,
}))

function ConfettiPiece({
    shape,
    x,
    y,
    size,
    color,
}: (typeof confetti)[number]) {
    switch (shape) {
        case 'circle':
            return <circle cx={x} cy={y} r={size / 2} fill={color} />
        case 'square':
            return (
                <rect
                    x={x - size / 2}
                    y={y - size / 2}
                    width={size}
                    height={size}
                    rx="3"
                    fill={color}
                />
            )
        case 'triangle':
            return (
                <path
                    d={`M${x} ${y - size / 2} L${x + size / 2} ${y + size / 2} L${x - size / 2} ${y + size / 2} Z`}
                    fill={color}
                />
            )
        case 'squiggle':
            return (
                <path
                    d={`M${x - size} ${y} q${size / 2} ${-size / 2} ${size} 0 t${size} 0`}
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                />
            )
    }
}

// Thick paper strips shaped like code brackets.
const BRACKETS = [
    {
        d: 'M150 380 Q90 380 90 440 L90 500 Q90 530 60 540 Q90 550 90 580 L90 640 Q90 700 150 700',
        color: '#7ec8e3',
    },
    {
        d: 'M1450 380 Q1510 380 1510 440 L1510 500 Q1510 530 1540 540 Q1510 550 1510 580 L1510 640 Q1510 700 1450 700',
        color: '#ff9aa2',
    },
]

export default function PaperCommitsScene() {
    return (
        <svg
            className={styles.scene}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMax slice"
            aria-hidden
        >
            <rect width={W} height={H} fill="#f4f0ff" />

            {/* The sun, as a stack of paper circles with a </> cut-out */}
            <g className={`${styles.paper} ${styles.breathe}`}>
                <circle cx={SUN.x} cy={SUN.y} r={SUN.r + 70} fill="#e9e0ff" />
                <circle cx={SUN.x} cy={SUN.y} r={SUN.r + 30} fill="#cfe9f7" />
                <circle cx={SUN.x} cy={SUN.y} r={SUN.r - 10} fill="#a5d8f0" />
                <circle cx={SUN.x} cy={SUN.y} r={SUN.r - 60} fill="#7ec8e3" />
                <path
                    d={`M${SUN.x - 55} ${SUN.y - 45} L${SUN.x - 95} ${SUN.y} L${SUN.x - 55} ${SUN.y + 45} M${SUN.x + 55} ${SUN.y - 45} L${SUN.x + 95} ${SUN.y} L${SUN.x + 55} ${SUN.y + 45} M${SUN.x + 20} ${SUN.y - 60} L${SUN.x - 20} ${SUN.y + 60}`}
                    stroke="#ffffff"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </g>

            {confetti.map((c, i) => (
                <g
                    key={i}
                    className={`${styles.paper} ${styles.confetti}`}
                    style={{
                        animationDuration: `${c.duration}s`,
                        animationDelay: `${c.delay}s`,
                    }}
                >
                    <ConfettiPiece {...c} />
                </g>
            ))}

            {cards.map((card, i) => (
                <g
                    key={i}
                    className={styles.paper}
                    transform={`rotate(${card.rotate} ${card.x + card.w / 2} ${card.y + card.h / 2})`}
                >
                    <rect
                        x={card.x}
                        y={card.y}
                        width={card.w}
                        height={card.h}
                        rx="14"
                        fill="#ffffff"
                    />
                    <circle
                        cx={card.x + 24}
                        cy={card.y + 22}
                        r="6"
                        fill="#ff9aa2"
                    />
                    <circle
                        cx={card.x + 44}
                        cy={card.y + 22}
                        r="6"
                        fill="#ffc857"
                    />
                    <circle
                        cx={card.x + 64}
                        cy={card.y + 22}
                        r="6"
                        fill="#5cc08f"
                    />
                    {card.lines.map((line, row) => {
                        let x = card.x + 28 + line[0].indent
                        return line.map((strip, j) => {
                            const el = (
                                <rect
                                    key={`${row}-${j}`}
                                    className={styles.typeStrip}
                                    style={{
                                        animationDelay: `${(row * 3 + j) * 0.35 + i * 0.8}s`,
                                    }}
                                    x={x}
                                    y={card.y + 52 + row * 27}
                                    width={strip.w}
                                    height="13"
                                    rx="6.5"
                                    fill={strip.color}
                                />
                            )
                            x += strip.w + 12
                            return el
                        })
                    })}
                </g>
            ))}

            {BRACKETS.map((b) => (
                <path
                    key={b.color}
                    className={styles.paper}
                    d={b.d}
                    stroke={b.color}
                    strokeWidth="26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            ))}

            {WAVES.map((wave, i) => (
                <path
                    key={i}
                    className={`${styles.paper} ${styles.waveBob}`}
                    style={{ animationDuration: `${wave.speed}s` }}
                    d={wavePath(wave.y, 12 + i * 3, 220 + i * 40, H + 40, i)}
                    fill={wave.color}
                />
            ))}
        </svg>
    )
}
