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

function Palm({ x, scale, flip }: (typeof PALMS)[number]) {
    return (
        <g
            transform={`translate(${x} ${H}) scale(${flip ? -scale : scale} ${scale})`}
        >
            <g className={styles.sway}>
                <path
                    d={PALM_TRUNK}
                    stroke="#07020f"
                    strokeWidth="16"
                    strokeLinecap="round"
                    fill="none"
                />
                <g transform="translate(70 -330)">
                    {PALM_FRONDS.map((angle) => (
                        <path
                            key={angle}
                            transform={`rotate(${angle})`}
                            d={PALM_FROND}
                            fill="#07020f"
                        />
                    ))}
                </g>
            </g>
        </g>
    )
}

export default function SkylineScene() {
    return (
        <svg
            className={styles.scene}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMax slice"
            aria-hidden
        >
            <defs>
                <linearGradient
                    id="sky-bg"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={HORIZON}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#12062e" />
                    <stop offset="0.38" stopColor="#3c1266" />
                    <stop offset="0.66" stopColor="#b3246f" />
                    <stop offset="0.86" stopColor="#ff6a3d" />
                    <stop offset="1" stopColor="#ffb35c" />
                </linearGradient>
                <linearGradient
                    id="sky-sun"
                    x1="0"
                    y1={SUN.y - SUN.r}
                    x2="0"
                    y2={SUN.y + SUN.r}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#ffe27a" />
                    <stop offset="0.55" stopColor="#ff8a4c" />
                    <stop offset="1" stopColor="#ff3f8e" />
                </linearGradient>
                <radialGradient id="sky-glow">
                    <stop offset="0" stopColor="#ff7ab8" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#ff7ab8" stopOpacity="0" />
                </radialGradient>
                <linearGradient
                    id="sky-water"
                    x1="0"
                    y1={HORIZON}
                    x2="0"
                    y2={H}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#3a0f55" />
                    <stop offset="1" stopColor="#090314" />
                </linearGradient>
                {/* Stripes cut through the sun below the middle and slide down. */}
                <mask
                    id="sky-sun-mask"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width={W}
                    height={H}
                >
                    <rect width={W} height={H} fill="#fff" />
                    <g className={styles.sunStripes}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <rect
                                key={i}
                                x={SUN.x - SUN.r}
                                y={SUN.y - SUN.r * 0.35 + i * 22}
                                width={SUN.r * 2}
                                height={3 + i * 1.4}
                                fill="#000"
                            />
                        ))}
                    </g>
                </mask>
            </defs>

            <rect width={W} height={HORIZON} fill="url(#sky-bg)" />
            {stars.map((s, i) => (
                <circle
                    key={i}
                    className={styles.twinkle}
                    style={{ animationDelay: `${s.delay}s` }}
                    cx={s.x}
                    cy={s.y}
                    r={s.r}
                    fill="#fff"
                />
            ))}

            <circle cx={SUN.x} cy={SUN.y} r={SUN.r * 2} fill="url(#sky-glow)" />
            <g className={styles.sunSink}>
                <circle
                    cx={SUN.x}
                    cy={SUN.y}
                    r={SUN.r}
                    fill="url(#sky-sun)"
                    mask="url(#sky-sun-mask)"
                />
            </g>

            {farRow.map((b, i) => (
                <rect
                    key={i}
                    x={b.x}
                    y={HORIZON - b.h}
                    width={b.w}
                    height={b.h}
                    fill="#43175f"
                />
            ))}
            {nearRow.map((b, i) => (
                <g key={i}>
                    <rect
                        x={b.x}
                        y={HORIZON - b.h}
                        width={b.w}
                        height={b.h}
                        fill="#15061f"
                        stroke={b.neon}
                        strokeWidth={b.neon ? 2.5 : 0}
                        className={b.neon ? styles.neon : undefined}
                        style={b.neon ? { color: b.neon } : undefined}
                    />
                    {b.windows.map((w, j) => (
                        <rect
                            key={j}
                            x={w.x}
                            y={w.y}
                            width="6"
                            height="9"
                            rx="1"
                            fill={w.color}
                            opacity="0.85"
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

            <rect
                y={HORIZON}
                width={W}
                height={H - HORIZON}
                fill="url(#sky-water)"
            />
            <rect
                y={HORIZON}
                width={W}
                height="2"
                fill="#ff9ad5"
                opacity="0.8"
            />
            {Array.from({ length: 7 }, (_, i) => (
                <rect
                    key={i}
                    className={styles.shimmer}
                    style={{ animationDelay: `${i * 0.4}s` }}
                    x={SUN.x - (SUN.r - i * 22)}
                    y={HORIZON + 14 + i * 26}
                    width={(SUN.r - i * 22) * 2}
                    height="5"
                    rx="2.5"
                    fill="#ff8a9e"
                    opacity={0.5 - i * 0.05}
                />
            ))}

            {PALMS.map((palm) => (
                <Palm key={palm.x} {...palm} />
            ))}
        </svg>
    )
}
