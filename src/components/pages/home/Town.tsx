import type { SVGProps } from 'react'
import styles from './scenes.module.scss'
import {
    backRow,
    church,
    frontRoofs,
    House,
    midRow,
    roofPath,
    shoreRow,
    smokingChimneys,
    Window,
} from './rooftops'

export type RowName = 'shore' | 'back' | 'mid' | 'front'
type Props = SVGProps<SVGElement>

// How one scene paints the shared town. Return undefined to leave a part out.
export type TownPaint = {
    facade: (house: House, row: RowName) => Props
    roof: (house: House, row: RowName) => Props
    window?: (window: Window, row: RowName) => Props | undefined
    chimney: (row: RowName) => Props
    church: { body: Props; spire: Props }
    // A wrapper for each row, for example a filter or a blend mode.
    rowGroup?: (row: RowName) => Props
}

function HouseShape({
    house,
    row,
    paint,
}: {
    house: House
    row: RowName
    paint: TownPaint
}) {
    return (
        <g>
            {house.chimney && (
                <rect
                    x={house.chimney.x}
                    y={house.chimney.y}
                    width={house.chimney.w}
                    height={house.chimney.h}
                    {...(paint.chimney(row) as SVGProps<SVGRectElement>)}
                />
            )}
            <rect
                x={house.x}
                y={house.base - house.h}
                width={house.w}
                height={house.h + 2}
                {...(paint.facade(house, row) as SVGProps<SVGRectElement>)}
            />
            <path
                d={roofPath(house)}
                {...(paint.roof(house, row) as SVGProps<SVGPathElement>)}
            />
            {paint.window &&
                house.windows.map((w, i) => {
                    const props = paint.window!(w, row)
                    if (!props) return null
                    return (
                        <rect
                            key={i}
                            x={w.x}
                            y={w.y}
                            width={w.w}
                            height={w.h}
                            className={
                                w.flicker >= 0 ? styles.flicker : undefined
                            }
                            style={
                                w.flicker >= 0
                                    ? { animationDelay: `${w.flicker}s` }
                                    : undefined
                            }
                            {...(props as SVGProps<SVGRectElement>)}
                        />
                    )
                })}
        </g>
    )
}

function Row({
    houses,
    row,
    paint,
}: {
    houses: House[]
    row: RowName
    paint: TownPaint
}) {
    return (
        <g {...(paint.rowGroup?.(row) as SVGProps<SVGGElement>)}>
            {houses.map((house, i) => (
                <HouseShape key={i} house={house} row={row} paint={paint} />
            ))}
        </g>
    )
}

export default function Town({ paint }: { paint: TownPaint }) {
    const c = church
    return (
        <>
            <Row houses={shoreRow} row="shore" paint={paint} />
            <Row houses={backRow} row="back" paint={paint} />
            <g {...(paint.rowGroup?.('back') as SVGProps<SVGGElement>)}>
                <rect
                    x={c.x}
                    y={c.base - c.towerH}
                    width={c.w}
                    height={c.towerH}
                    {...(paint.church.body as SVGProps<SVGRectElement>)}
                />
                <path
                    d={`M${c.x - 4} ${c.base - c.towerH} L${c.x + c.w / 2} ${c.base - c.towerH - c.spireH} L${c.x + c.w + 4} ${c.base - c.towerH} Z`}
                    {...(paint.church.spire as SVGProps<SVGPathElement>)}
                />
            </g>
            <Row houses={midRow} row="mid" paint={paint} />
            <Row houses={frontRoofs} row="front" paint={paint} />
        </>
    )
}

// Smoke that rises from some of the chimneys.
export function Smoke({ color, opacity }: { color: string; opacity: number }) {
    return (
        <g>
            {smokingChimneys.map((c, i) =>
                [0, 1, 2].map((puff) => (
                    <circle
                        key={`${i}-${puff}`}
                        className={styles.smoke}
                        style={{ animationDelay: `${-(puff * 2 + i * 0.7)}s` }}
                        cx={c.x}
                        cy={c.y - 6}
                        r="9"
                        fill={color}
                        opacity={opacity}
                    />
                ))
            )}
        </g>
    )
}
