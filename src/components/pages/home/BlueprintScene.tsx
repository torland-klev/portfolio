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
    stars,
    SUN,
    W,
} from './city'

// The same city as SkylineScene, drawn as a neon wireframe that is being rendered from code.

const CYAN = '#3ff0ff'
const MAGENTA = '#ff4fd8'
const VANISH_X = W / 2
const GRID_ROWS = 9

function WirePalm({ x, scale, flip }: (typeof PALMS)[number]) {
    return (
        <g
            transform={`translate(${x} ${H}) scale(${flip ? -scale : scale} ${scale})`}
        >
            <g className={styles.sway}>
                <path
                    d={PALM_TRUNK}
                    stroke={MAGENTA}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                />
                <g transform="translate(70 -330)">
                    {PALM_FRONDS.map((angle) => (
                        <path
                            key={angle}
                            transform={`rotate(${angle})`}
                            d={PALM_FROND}
                            fill="#1a0630"
                            fillOpacity="0.6"
                            stroke={MAGENTA}
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </g>
            </g>
        </g>
    )
}

export default function BlueprintScene() {
    return (
        <svg
            className={styles.scene}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMax slice"
            aria-hidden
        >
            <defs>
                <linearGradient
                    id="bp-sky"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={HORIZON}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#060418" />
                    <stop offset="0.55" stopColor="#1a0a3f" />
                    <stop offset="1" stopColor="#3d1463" />
                </linearGradient>
                <linearGradient
                    id="bp-floor"
                    x1="0"
                    y1={HORIZON}
                    x2="0"
                    y2={H}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#1c0835" />
                    <stop offset="1" stopColor="#05020d" />
                </linearGradient>
                <clipPath id="bp-sun-clip">
                    <circle cx={SUN.x} cy={SUN.y} r={SUN.r} />
                </clipPath>
                <clipPath id="bp-floor-clip">
                    <rect y={HORIZON} width={W} height={H - HORIZON} />
                </clipPath>
                <clipPath id="bp-city-clip">
                    <rect width={W} height={HORIZON} />
                </clipPath>
            </defs>

            <rect width={W} height={HORIZON} fill="url(#bp-sky)" />
            {stars.map((s, i) => (
                <circle
                    key={i}
                    className={styles.twinkle}
                    style={{ animationDelay: `${s.delay}s` }}
                    cx={s.x}
                    cy={s.y}
                    r={s.r * 0.8}
                    fill={CYAN}
                />
            ))}

            {/* Wireframe sun */}
            <g
                className={`${styles.sunSink} ${styles.glow}`}
                style={{ color: MAGENTA }}
            >
                <circle
                    cx={SUN.x}
                    cy={SUN.y}
                    r={SUN.r}
                    fill={MAGENTA}
                    fillOpacity="0.08"
                    stroke={MAGENTA}
                    strokeWidth="3"
                />
                <g clipPath="url(#bp-sun-clip)">
                    <g className={styles.sunStripes}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <line
                                key={i}
                                x1={SUN.x - SUN.r}
                                x2={SUN.x + SUN.r}
                                y1={SUN.y - SUN.r + 20 + i * 36}
                                y2={SUN.y - SUN.r + 20 + i * 36}
                                stroke={MAGENTA}
                                strokeOpacity="0.5"
                                strokeWidth="2"
                            />
                        ))}
                    </g>
                </g>
            </g>

            {/* Wireframe city, with a scan line that sweeps over it */}
            <g className={styles.glow} style={{ color: CYAN }}>
                {farRow.map((b, i) => (
                    <rect
                        key={i}
                        x={b.x}
                        y={HORIZON - b.h}
                        width={b.w}
                        height={b.h}
                        fill="#0b0626"
                        stroke="#6c4bd6"
                        strokeOpacity="0.55"
                        strokeWidth="1.5"
                    />
                ))}
                {nearRow.map((b, i) => (
                    <g key={i}>
                        <rect
                            x={b.x}
                            y={HORIZON - b.h}
                            width={b.w}
                            height={b.h}
                            fill="#090420"
                            stroke={b.neon ?? CYAN}
                            strokeWidth={b.neon ? 2.5 : 1.5}
                        />
                        {b.windows.map((w, j) => (
                            <rect
                                key={j}
                                x={w.x}
                                y={w.y}
                                width="6"
                                height="9"
                                fill="none"
                                stroke={CYAN}
                                strokeOpacity="0.6"
                                strokeWidth="1"
                                className={
                                    w.flicker >= 0 ? styles.flicker : undefined
                                }
                                style={
                                    w.flicker >= 0
                                        ? { animationDelay: `${w.flicker}s` }
                                        : undefined
                                }
                            />
                        ))}
                    </g>
                ))}
            </g>
            <g clipPath="url(#bp-city-clip)">
                <rect
                    className={styles.scan}
                    x="0"
                    y={HORIZON - 4}
                    width={W}
                    height="4"
                    fill={CYAN}
                    opacity="0.55"
                />
            </g>

            {/* Neon grid floor that rolls toward the viewer */}
            <rect
                y={HORIZON}
                width={W}
                height={H - HORIZON}
                fill="url(#bp-floor)"
            />
            <g
                clipPath="url(#bp-floor-clip)"
                className={styles.glow}
                style={{ color: MAGENTA }}
            >
                {Array.from({ length: 31 }, (_, i) => {
                    const offset = (i - 15) * 120
                    return (
                        <line
                            key={i}
                            x1={VANISH_X + offset * 0.12}
                            y1={HORIZON}
                            x2={VANISH_X + offset * 1.6}
                            y2={H}
                            stroke={MAGENTA}
                            strokeOpacity="0.55"
                            strokeWidth="1.5"
                        />
                    )
                })}
                {Array.from({ length: GRID_ROWS }, (_, i) => (
                    <line
                        key={i}
                        className={styles.gridRow}
                        style={{ animationDelay: `${(-i * 4) / GRID_ROWS}s` }}
                        x1="0"
                        x2={W}
                        y1={HORIZON}
                        y2={HORIZON}
                        stroke={MAGENTA}
                        strokeOpacity="0.7"
                        strokeWidth="2"
                    />
                ))}
            </g>
            <rect y={HORIZON} width={W} height="2" fill={CYAN} opacity="0.9" />

            {PALMS.map((palm) => (
                <WirePalm key={palm.x} {...palm} />
            ))}
        </svg>
    )
}
