import styles from './scenes.module.scss'
import Town, { Smoke } from './Town'
import {
    farRidge,
    farSnow,
    FJORD_TOP,
    GROUND_TOP,
    H,
    nearRidge,
    SHORE,
    SUN,
    W,
} from './rooftops'

// The same rooftops as the dark scenes, painted in watercolor.
// Both variants share every shape. Only the colors and the details differ.

type Variant = 'commits' | 'convictions'

const PALETTES = {
    convictions: {
        skyTop: '#fde8d6',
        skyBottom: '#ffd9b0',
        skyBlobs: ['#ffc4a8', '#ffe0a8', '#f9c6d6'],
        sun: '#ffb347',
        far: '#c9b3e0',
        near: '#a58fcc',
        fjord: ['#9fd3e6', '#6fb3d3'],
        // Falu red, ochre, white, mustard, pale blue and green wooden houses.
        facades: [
            '#c8553d',
            '#e0a458',
            '#f4ede1',
            '#e9c46a',
            '#a9cce3',
            '#8fb996',
        ],
        roofs: [
            '#5b3a3a',
            '#7a4b3a',
            '#4f5d75',
            '#6d4c41',
            '#5e6b73',
            '#3f5e5a',
        ],
        windows: '#4a3450',
        ground: '#b9a38f',
        spire: '#6fb5a2',
        smoke: '#9d8ba8',
    },
    // Spring sunrise: pale morning sky, fresh greens and blossom pinks.
    commits: {
        skyTop: '#e3f1ff',
        skyBottom: '#fff4d6',
        skyBlobs: ['#ffe3ec', '#fff1b8', '#d6f0ff'],
        sun: '#ffd95a',
        far: '#b9d8c8',
        near: '#8cc3a4',
        fjord: ['#bfe6f2', '#8fd0e3'],
        facades: [
            '#f7b7c8',
            '#fff0a8',
            '#fbfaf4',
            '#b8e0b0',
            '#bfe0f5',
            '#ffd6a8',
        ],
        roofs: [
            '#6f8f5e',
            '#8a6f8f',
            '#5e7f8f',
            '#7f8f5e',
            '#8f6f6a',
            '#5e8f7a',
        ],
        windows: '#4f6b5a',
        ground: '#c8d8a8',
        spire: '#7fbfa4',
        smoke: '#b8c4b0',
    },
}

const INK = '#4f6b5a'
const BIRDS = [
    { x: 330, y: 190, s: 1 },
    { x: 380, y: 220, s: 0.8 },
    { x: 1120, y: 170, s: 1.1 },
    { x: 1180, y: 205, s: 0.75 },
]

export default function WatercolorScene({ variant }: { variant: Variant }) {
    const p = PALETTES[variant]
    const id = `wc-${variant}`
    const wash = `url(#${id}-wash)`
    const multiply = { mixBlendMode: 'multiply' as const }

    return (
        <svg
            className={styles.scene}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMax slice"
            aria-hidden
        >
            <defs>
                {/* Ragged, slightly bled edges, like pigment on wet paper. */}
                <filter
                    id={`${id}-wash`}
                    x="-5%"
                    y="-5%"
                    width="110%"
                    height="110%"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.02"
                        numOctaves="3"
                        seed="7"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="12"
                        xChannelSelector="R"
                        yChannelSelector="G"
                        result="ragged"
                    />
                    <feGaussianBlur in="ragged" stdDeviation="0.9" />
                </filter>
                <filter
                    id={`${id}-ink`}
                    x="-5%"
                    y="-5%"
                    width="110%"
                    height="110%"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05"
                        numOctaves="2"
                        seed="3"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="3.5"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter id={`${id}-soft`}>
                    <feGaussianBlur stdDeviation="45" />
                </filter>
                {/* Paper grain over the whole painting. */}
                <filter id={`${id}-grain`}>
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="2"
                        seed="11"
                    />
                    <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.3  0 0 0 0.09 0" />
                </filter>
                <linearGradient
                    id={`${id}-sky`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={FJORD_TOP}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor={p.skyTop} />
                    <stop offset="1" stopColor={p.skyBottom} />
                </linearGradient>
                {/* Hides the sun wherever the far mountains are. */}
                <mask
                    id={`${id}-behind-ridge`}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width={W}
                    height={H}
                >
                    <rect width={W} height={FJORD_TOP} fill="#fff" />
                    <path d={farRidge} fill="#000" />
                </mask>
            </defs>

            <rect width={W} height={H} fill="#fffdf9" />
            <rect width={W} height={FJORD_TOP + 10} fill={`url(#${id}-sky)`} />
            <g filter={`url(#${id}-soft)`} opacity="0.7">
                {p.skyBlobs.map((color, i) => (
                    <ellipse
                        key={i}
                        className={styles.cloudDrift}
                        style={{ animationDuration: `${60 + i * 20}s` }}
                        cx={250 + i * 550}
                        cy={140 + (i % 2) * 110}
                        rx="340"
                        ry="120"
                        fill={color}
                    />
                ))}
            </g>

            {/* A low sun, half behind the mountains */}
            <g mask={`url(#${id}-behind-ridge)`}>
                {/* Commits: the sun rises from the left. Convictions: it sets to the right. */}
                <g
                    className={
                        variant === 'commits' ? styles.sunRise : styles.sunSet
                    }
                >
                    <g className={styles.breathe}>
                        <circle
                            cx={SUN.x}
                            cy={SUN.y}
                            r={SUN.r * 2.4}
                            fill={p.sun}
                            opacity="0.2"
                            filter={`url(#${id}-soft)`}
                        />
                        <circle
                            cx={SUN.x}
                            cy={SUN.y}
                            r={SUN.r}
                            fill={p.sun}
                            opacity="0.85"
                            filter={wash}
                        />
                    </g>
                </g>
            </g>

            {variant === 'convictions' &&
                BIRDS.map((b, i) => (
                    <path
                        key={i}
                        d={`M${b.x} ${b.y} q${8 * b.s} ${-9 * b.s} ${16 * b.s} 0 q${8 * b.s} ${-9 * b.s} ${16 * b.s} 0`}
                        stroke="#7a4a6a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.6"
                    />
                ))}

            <g filter={wash} style={multiply}>
                <path d={farRidge} fill={p.far} opacity="0.6" />
                <path d={farSnow} fill="#ffffff" opacity="0.8" />
                <path d={nearRidge} fill={p.near} opacity="0.55" />
            </g>
            <g filter={wash} style={multiply}>
                <rect
                    y={FJORD_TOP}
                    width={W}
                    height={40}
                    fill={p.fjord[0]}
                    opacity="0.6"
                />
                <rect
                    y={FJORD_TOP + 34}
                    width={W}
                    height={SHORE - FJORD_TOP}
                    fill={p.fjord[1]}
                    opacity="0.6"
                />
            </g>
            {variant === 'convictions' && (
                <g filter={wash} opacity="0.6">
                    {Array.from({ length: 4 }, (_, i) => (
                        <rect
                            key={i}
                            className={styles.shimmer}
                            style={{ animationDelay: `${i * 0.5}s` }}
                            x={SUN.x - (70 - i * 14)}
                            y={FJORD_TOP + 10 + i * 16}
                            width={(70 - i * 14) * 2}
                            height="5"
                            rx="2.5"
                            fill="#ffe0a3"
                        />
                    ))}
                </g>
            )}

            <rect
                y={GROUND_TOP}
                width={W}
                height={H - GROUND_TOP}
                fill={p.ground}
                opacity="0.55"
                filter={wash}
            />
            <Town
                paint={{
                    facade: (h) => ({ fill: p.facades[h.color], opacity: 0.8 }),
                    roof: (h, row) => ({
                        fill: p.roofs[h.color],
                        opacity: row === 'front' ? 0.85 : 0.75,
                    }),
                    window: (w, row) =>
                        row === 'front'
                            ? undefined
                            : { fill: p.windows, opacity: w.lit ? 0.45 : 0.25 },
                    chimney: () => ({ fill: p.roofs[0], opacity: 0.8 }),
                    church: {
                        body: { fill: p.facades[2], opacity: 0.85 },
                        spire: { fill: p.spire, opacity: 0.9 },
                    },
                    rowGroup: () => ({ filter: wash, style: multiply }),
                }}
            />
            {variant === 'commits' && (
                <g filter={`url(#${id}-ink)`} opacity="0.6">
                    <Town
                        paint={{
                            facade: () => ({
                                fill: 'none',
                                stroke: INK,
                                strokeWidth: 1.2,
                            }),
                            roof: () => ({
                                fill: 'none',
                                stroke: INK,
                                strokeWidth: 1.2,
                            }),
                            chimney: () => ({
                                fill: 'none',
                                stroke: INK,
                                strokeWidth: 1,
                            }),
                            church: {
                                body: {
                                    fill: 'none',
                                    stroke: INK,
                                    strokeWidth: 1.2,
                                },
                                spire: {
                                    fill: 'none',
                                    stroke: INK,
                                    strokeWidth: 1.2,
                                },
                            },
                        }}
                    />
                </g>
            )}
            <Smoke color={p.smoke} opacity={0.22} />

            <rect width={W} height={H} filter={`url(#${id}-grain)`} />
        </svg>
    )
}
