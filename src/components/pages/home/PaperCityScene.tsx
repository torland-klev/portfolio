import styles from './scenes.module.scss'
import {
    farRow,
    H,
    HORIZON,
    nearRow,
    PALM_FROND,
    PALM_FRONDS,
    PALM_TRUNK,
    PALMS,
    SUN,
    W,
} from './city'
import { cloudPath, wavePath } from './paper'

// The same city as the dark scenes, cut from pastel paper in daylight.

const TOWER_COLORS = [
    '#7ec8e3',
    '#ff9aa2',
    '#ffc8a2',
    '#b5ead7',
    '#c7ceea',
    '#ffdac1',
]
const WINDOW_SHADE = 'rgba(40, 30, 70, 0.16)'
const CLOUDS = [
    { x: 140, y: 170, s: 1.3, speed: 70 },
    { x: 980, y: 120, s: 1.6, speed: 90 },
    { x: 1250, y: 280, s: 1, speed: 60 },
    { x: 520, y: 300, s: 0.9, speed: 80 },
]
const WAVES = [
    { y: HORIZON + 20, color: '#8fe3dc', speed: 9 },
    { y: HORIZON + 80, color: '#4ecdc4', speed: 7 },
    { y: HORIZON + 150, color: '#2bb3b1', speed: 8 },
    { y: HORIZON + 215, color: '#1b8a8f', speed: 6 },
]

function PaperPalm({ x, scale, flip }: (typeof PALMS)[number]) {
    return (
        <g
            className={styles.paper}
            transform={`translate(${x} ${H}) scale(${flip ? -scale : scale} ${scale})`}
        >
            <g className={styles.sway}>
                <path
                    d={PALM_TRUNK}
                    stroke="#c68b59"
                    strokeWidth="18"
                    strokeLinecap="round"
                    fill="none"
                />
                <g transform="translate(70 -330)">
                    {PALM_FRONDS.map((angle, i) => (
                        <path
                            key={angle}
                            transform={`rotate(${angle})`}
                            d={PALM_FROND}
                            fill={i % 2 ? '#43aa8b' : '#5cc08f'}
                        />
                    ))}
                </g>
            </g>
        </g>
    )
}

export default function PaperCityScene() {
    return (
        <svg
            className={styles.scene}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMax slice"
            aria-hidden
        >
            <rect width={W} height={H} fill="#fff4e6" />

            {/* Sun: stacked paper circles */}
            <g className={`${styles.paper} ${styles.breathe}`}>
                <circle cx={SUN.x} cy={SUN.y} r={SUN.r + 70} fill="#ffe6a7" />
                <circle cx={SUN.x} cy={SUN.y} r={SUN.r + 30} fill="#ffd166" />
                <circle cx={SUN.x} cy={SUN.y} r={SUN.r - 10} fill="#ffb347" />
                <circle cx={SUN.x} cy={SUN.y} r={SUN.r - 60} fill="#ff8c61" />
            </g>

            {CLOUDS.map((c, i) => (
                <path
                    key={i}
                    className={`${styles.paper} ${styles.cloudDrift}`}
                    style={{ animationDuration: `${c.speed}s` }}
                    d={cloudPath(c.x, c.y, c.s)}
                    fill="#ffffff"
                />
            ))}

            <g className={styles.paper}>
                {farRow.map((b, i) => (
                    <rect
                        key={i}
                        x={b.x}
                        y={HORIZON - b.h}
                        width={b.w}
                        height={b.h}
                        rx="4"
                        fill="#d7c5f2"
                    />
                ))}
            </g>
            <g className={styles.paper}>
                {nearRow.map((b, i) => (
                    <g key={i}>
                        <rect
                            x={b.x}
                            y={HORIZON - b.h}
                            width={b.w}
                            height={b.h + 20}
                            rx="4"
                            fill={TOWER_COLORS[i % TOWER_COLORS.length]}
                        />
                        {b.windows.map((w, j) => (
                            <rect
                                key={j}
                                x={w.x}
                                y={w.y}
                                width="6"
                                height="9"
                                rx="1.5"
                                fill={WINDOW_SHADE}
                            />
                        ))}
                    </g>
                ))}
            </g>

            {WAVES.map((wave, i) => (
                <path
                    key={i}
                    className={`${styles.paper} ${styles.waveBob}`}
                    style={{ animationDuration: `${wave.speed}s` }}
                    d={wavePath(wave.y, 12 + i * 3, 220 + i * 40, H + 40, i)}
                    fill={wave.color}
                />
            ))}

            {PALMS.map((palm) => (
                <PaperPalm key={palm.x} {...palm} />
            ))}
        </svg>
    )
}
