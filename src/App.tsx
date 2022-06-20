import './App.css'
import HomePage from './components/HomePage'
import { Route, Routes } from 'react-router-dom'
import React from 'react'
import Header from './components/header/Header'

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="about" element={<div> about </div>} />
                <Route path="featured" element={<div> featured </div>} />
                <Route path="blog" element={<div> blog </div>} />
                <Route path="portfolio" element={<div> portfolio </div>} />
                <Route path="contact" element={<div> contact </div>} />
            </Routes>
        </div>
    )
}

export default App
