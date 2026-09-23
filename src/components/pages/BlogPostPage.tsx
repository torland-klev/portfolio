import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './blog.module.scss'
import { blogItems } from './items'
import { BlogMetaData } from './BlogPage'
import { readTime } from './blogFormat'
import { usePageTitle } from '../../hooks'

export default function BlogPostPage() {
    const { postId } = useParams()
    const post = blogItems.find((item) => item.id === postId)
    usePageTitle(post?.title)

    if (!post) return <Navigate to="/blog" replace />

    return (
        <div className={styles.blog}>
            <article className={`${styles.blogWrapper} ${styles.blogPost}`}>
                <Link to="/blog" className={styles.blogBack}>
                    ← All posts
                </Link>
                {!post.body.includes(post.image) && (
                    <img src={post.image} alt="" className={styles.blogImage} />
                )}
                <h1 className={styles.blogTitle}>{post.title}</h1>
                <div className={styles.blogSubtitle}>{post.subtitle}</div>
                <BlogMetaData data={post.meta} />
                <div className={styles.blogReadMoreTime}>
                    {readTime(post.body)} read
                </div>
                <div className={styles.body}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.body}
                    </ReactMarkdown>
                </div>
                <Link to="/blog" className={styles.blogBack}>
                    ← All posts
                </Link>
            </article>
        </div>
    )
}
