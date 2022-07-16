import HomePage from './components/pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import React from 'react'
import Header from './components/header/Header'
import styles from './app.module.scss'
import Footer from './components/footer/Footer'
import ContactPage from './components/pages/ContactPage'

export default function App() {
    return (
        <div className={styles.app}>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="about" element={<div> about </div>} />
                <Route path="featured" element={<div> featured </div>} />
                <Route path="blog" element={<div> blog </div>} />
                <Route path="portfolio" element={<div> portfolio </div>} />
                <Route path="contact" element={<ContactPage />} />
            </Routes>
            <Footer />
        </div>
    )
}
