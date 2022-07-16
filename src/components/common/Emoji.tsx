import React from 'react'

export default function Emoji({
    label,
    symbol,
    fontSize,
    transform,
    marginTop,
    marginRight,
}: {
    label?: string
    symbol: string
    fontSize?: string
    transform?: string
    marginTop?: string
    marginRight?: string
}) {
    return (
        <span
            className="emoji"
            role="img"
            aria-label={label}
            aria-hidden={!label}
            style={{
                fontSize: fontSize ?? '22pt',
                marginTop: marginTop ?? '32px',
                marginRight: marginRight ?? 'auto',
                margin: 'auto',
                transform: transform,
            }}
        >
            {symbol}
        </span>
    )
}
