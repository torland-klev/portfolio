import styles from './common.module.scss'
import React from 'react'

export enum TagCategory {
    LANGUAGE,
    DEVOPS,
    TOOL,
    FRAMEWORK,
    OTHER,
    TECHNOLOGY,
}

export type TagWithCategory = {
    tag: string
    category: TagCategory
}

const categoryColors: Record<TagCategory, string> = {
    [TagCategory.LANGUAGE]: '#FFA9AC',
    [TagCategory.DEVOPS]: '#E3FF9C',
    [TagCategory.TOOL]: '#84FF74',
    [TagCategory.FRAMEWORK]: '#FFDC64',
    [TagCategory.TECHNOLOGY]: '#BDA5FF',
    [TagCategory.OTHER]: '#98DDFF',
}

const categoryNames: Record<TagCategory, string> = {
    [TagCategory.LANGUAGE]: 'Languages',
    [TagCategory.FRAMEWORK]: 'Frameworks & platforms',
    [TagCategory.DEVOPS]: 'Cloud & DevOps',
    [TagCategory.TECHNOLOGY]: 'Data & technologies',
    [TagCategory.TOOL]: 'Tools',
    [TagCategory.OTHER]: 'Methods & domains',
}

const categoryOrder = [
    TagCategory.LANGUAGE,
    TagCategory.FRAMEWORK,
    TagCategory.DEVOPS,
    TagCategory.TECHNOLOGY,
    TagCategory.TOOL,
    TagCategory.OTHER,
]

export function GroupedTags({ tags }: { tags: TagWithCategory[] }) {
    return (
        <div className={styles.tagGroups}>
            {categoryOrder.map((category) => {
                const inGroup = tags.filter((t) => t.category === category)
                if (inGroup.length === 0) return null
                return (
                    <section key={category}>
                        <h3>
                            <i
                                style={{
                                    backgroundColor: categoryColors[category],
                                }}
                                aria-hidden
                            />
                            {categoryNames[category]}
                        </h3>
                        <Tags tags={inGroup} />
                    </section>
                )
            })}
        </div>
    )
}

export default function Tags({ tags }: { tags: (string | TagWithCategory)[] }) {
    if (tags.length === 0) return null
    const label = (tag: string | TagWithCategory) =>
        typeof tag === 'string' ? tag : tag.tag
    const sorted = [...tags].sort((a, b) => label(a).localeCompare(label(b)))

    return (
        <ul className={styles.tags}>
            {sorted.map((tag) => (
                <Tag key={label(tag)} tag={tag} />
            ))}
        </ul>
    )
}

function Tag({ tag }: { tag: string | TagWithCategory }) {
    if (typeof tag === 'string') return <li className={styles.tag}>{tag}</li>

    const style: React.CSSProperties = {
        backgroundColor: categoryColors[tag.category],
        color: '#333333',
        fontWeight: 450,
    }
    return (
        <li className={styles.tag} style={style}>
            {tag.tag}
        </li>
    )
}
