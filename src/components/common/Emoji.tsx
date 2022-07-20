import React from 'react'

export default function Emoji({
    label,
    symbol,
    fontSize,
    margin,
}: {
    label?: string
    symbol: string
    fontSize?: string
    margin?: string
}) {
    return (
        <span
            role="img"
            aria-label={label}
            aria-hidden={!label}
            style={{
                fontSize: fontSize ?? '22pt',
                margin: margin ?? '15px 5px 0 5px',
            }}
        >
            {symbol}
        </span>
    )
}
