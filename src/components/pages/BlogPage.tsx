import { Link } from 'react-router-dom'
import styles from './blog.module.scss'
import { BlogItem, BlogItemMetaData, blogItems } from './items'
import { formatDate, readTime } from './blogFormat'
import { usePageTitle } from '../../hooks'

export default function BlogPage() {
    usePageTitle('Blog')

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
    const to = `/blog/${blogItem.id}`

    return (
        <article className={styles.blogCard}>
            <Link to={to} tabIndex={-1} aria-hidden>
                <img src={blogItem.image} alt="" className={styles.blogImage} />
            </Link>
            <h2 className={styles.blogTitle}>
                <Link to={to}>{blogItem.title}</Link>
            </h2>
            <div className={styles.blogSubtitle}>{blogItem.subtitle}</div>
            <BlogMetaData data={blogItem.meta} />
            <div className={styles.blogReadMore}>
                <Link to={to} className={styles.blogReadMoreButton}>
                    Read more
                </Link>
                <div className={styles.blogReadMoreTime}>
                    {readTime(blogItem.body)}
                </div>
            </div>
        </article>
    )
}

export function BlogMetaData({ data }: { data: BlogItemMetaData }) {
    return (
        <div className={styles.blogMeta}>
            <img
                src={data.authorImage}
                alt=""
                className={styles.blogMetaImage}
            />
            <div className={styles.blogMetaText}>
                {data.authorName} <br />
                <time dateTime={data.publishDate}>
                    {formatDate(data.publishDate)}
                </time>
            </div>
        </div>
    )
}
