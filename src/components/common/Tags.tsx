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

export default function Tags({ tags }: { tags: string[] | TagWithCategory[] }) {
    return tags.length > 0 ? (
        <div className={styles.tags}>
            {tags.sort().map((tag, i) => (
                <Tag key={'tag' + i} tag={tag} />
            ))}
        </div>
    ) : null
}

function Tag({ tag }: { tag: string | TagWithCategory }) {
    function getStyle(tag: TagWithCategory): React.CSSProperties {
        switch (tag.category) {
            case TagCategory.LANGUAGE:
                return {
                    backgroundColor: '#FFA9AC',
                    color: '#333333',
                    fontWeight: 450,
                }
            case TagCategory.DEVOPS:
                return {
                    backgroundColor: '#E3FF9C',
                    color: '#333333',
                    fontWeight: 450,
                }
            case TagCategory.TOOL:
                return {
                    backgroundColor: '#84FF74',
                    color: '#333333',
                    fontWeight: 450,
                }
            case TagCategory.FRAMEWORK:
                return {
                    backgroundColor: '#FFDC64',
                    color: '#333333',
                    fontWeight: 450,
                }
            case TagCategory.TECHNOLOGY:
                return {
                    backgroundColor: '#BDA5FF',
                    color: '#333333',
                    fontWeight: 450,
                }
            case TagCategory.OTHER:
                return {
                    backgroundColor: '#98DDFF',
                    color: '#333333',
                    fontWeight: 450,
                }
        }
    }

    return typeof tag === 'string' ? (
        <div className={styles.tag}>{tag}</div>
    ) : (
        <div className={styles.tag} style={getStyle(tag)}>
            {tag.tag}
        </div>
    )
}
