import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import DomeGallery from './components/DomeGallery'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SocialSwipe from './components/SocialSwipe'
import AdminPage from './pages/AdminPage'
import './App.css'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialSwipe />
      <Services />
      <Portfolio />
      <DomeGallery />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
