import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './auth/AuthContext';
import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import Welcome from './components/Welcome/Welcome';
import Timeline from './components/Timeline/Timeline';
import Highlights from './components/Highlights/Highlights';
import Location from './components/Location/Location';
import RSVP from './components/RSVP/RSVP';
import Footer from './components/Footer/Footer';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Set page title
    document.title = 'Farm Aris Grand Opening - October 10-11, 2025';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const HomePage = () => (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <main>
        <Hero />
        
        {/* Welcome Section */}
        <Welcome />
        
        {/* Timeline Section */}
        <Timeline />
        
        {/* Highlights Section */}
        <Highlights />
        
        {/* Location Section */}
        <Location />
        
        {/* RSVP Section */}
        <RSVP />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );

  return (
    <Router>
      <AuthProvider>
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </Router>
  );
}

export default App;