import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './components/pages/HomePage'
import Header from './components/header/Header'
import styles from './app.module.scss'
import Footer from './components/footer/Footer'

const AboutPage = lazy(() => import('./components/pages/AboutPage'))
const BlogPage = lazy(() => import('./components/pages/BlogPage'))
const BlogPostPage = lazy(() => import('./components/pages/BlogPostPage'))
const PortfolioPage = lazy(() => import('./components/pages/PortfolioPage'))
const ContactPage = lazy(() => import('./components/pages/ContactPage'))

// Pages whose background runs up behind the header.
export const FULL_BLEED = ['/', '/portfolio']

function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => window.scrollTo(0, 0), [pathname])
    return null
}

export default function App() {
    const { pathname } = useLocation()
    return (
        <div className={styles.app}>
            <ScrollToTop />
            <Header />
            <main
                className={`${styles.main} ${
                    FULL_BLEED.includes(pathname) ? styles.fullBleed : ''
                }`}
            >
                <Suspense fallback={null}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="blog" element={<BlogPage />} />
                        <Route path="blog/:postId" element={<BlogPostPage />} />
                        <Route path="portfolio" element={<PortfolioPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
