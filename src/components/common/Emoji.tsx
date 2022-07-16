import React from 'react'

export default function Emoji({
    label,
    symbol,
    fontSize,
}: {
    label?: string
    symbol: string
    fontSize?: string
}) {
    return (
        <span
            role="img"
            aria-label={label}
            aria-hidden={!label}
            style={{
                fontSize: fontSize ?? '22pt',
                margin: '15px 5px 0 5px',
            }}
        >
            {symbol}
        </span>
    )
}
