import React from 'react'
import styles from './blog.module.scss'
import { BlogItem, BlogItemMetaData, blogItems } from './items'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function BlogPage() {
    return (
        <div className={styles.blog}>
            <div className={styles.blogWrapper}>
                {blogItems.map((item) => (
                    <BlogCard blogItem={item} key={item.id} />
                ))}
            </div>
        </div>
    )
}

function BlogCard({ blogItem }: { blogItem: BlogItem }) {
    const [expanded, setExpanded] = React.useState(false)

    function readTime(body: string): string {
        const wpm = 200
        const words = body.trim().split(/\s+/).length
        const time = Math.ceil(words / wpm)
        return time === 1 || time === 0 ? '1 minute' : time + ' minutes'
    }

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
            <div className={styles.blogReadMore}>
                <button
                    className={styles.blogReadMoreButton}
                    onClick={() => setExpanded(!expanded)}
                >
                    Read {expanded ? 'less' : 'more'}
                </button>
                <div className={styles.blogReadMoreTime}>
                    {readTime(blogItem.body)}
                </div>
            </div>
            {expanded && (
                <div className={styles.body}>
                    <ReactMarkdown
                        children={blogItem.body}
                        remarkPlugins={[remarkGfm]}
                    />
                </div>
            )}
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
