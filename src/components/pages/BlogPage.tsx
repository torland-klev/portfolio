import React from 'react'
import styles from './blog.module.scss'
import { BlogItem, blogItems, BlogItemMetaData } from './items'

export default function BlogPage() {
    return (
        <div className={styles.blog}>
            <div className={styles.blogWrapper}>
                {blogItems.map((item) => (
                    <BlogCard blogItem={item} />
                ))}
            </div>
        </div>
    )
}

function BlogCard({ blogItem }: { blogItem: BlogItem }) {
    const [expanded, setExpanded] = React.useState(false)

    return (
        <div className={styles.blogCard}>
            <img
                src={blogItem.image}
                alt={blogItem.id}
                className={styles.blogImage}
            />
            <div className={styles.blogTitle}>{blogItem.title}</div>
            <div className={styles.blogSubtitle}>{blogItem.subtitle}</div>
            <BlogMetaData data={blogItem.meta} />
            {expanded && <div className={styles.body}>{blogItem.body}</div>}
            <button
                className={styles.blogReadMore}
                onClick={() => setExpanded(!expanded)}
            >
                Read {expanded ? 'less' : 'more'}
            </button>
        </div>
    )
}

function BlogMetaData({ data }: { data: BlogItemMetaData }) {
    return (
        <div className={styles.blogMeta}>
            <img
                src={data.authorImage}
                alt={'author'}
                className={styles.blogMetaImage}
            />
            <div className={styles.blogMetaText}>
                {data.authorName} <br />
                {data.publishDate}
            </div>
        </div>
    )
}
