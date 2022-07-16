import React from 'react'

export default function Emoji({
    label,
    symbol,
    fontSize,
    transform,
}: {
    label?: string
    symbol: string
    fontSize?: string
    transform?: string
}) {
    return (
        <span
            className="emoji"
            role="img"
            aria-label={label}
            aria-hidden={!label}
            style={{
                fontSize: fontSize,
                marginTop: '29px',
                margin: 'auto',
                transform: transform,
            }}
        >
            {symbol}
        </span>
    )
}
