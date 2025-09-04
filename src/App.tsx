import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import NotificationCenter from './components/NotificationCenter/NotificationCenter';
import AICustomerService from './components/AICustomerService/AICustomerService';
import SupabaseTest from './components/SupabaseTest';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';
import ScheduleCall from './pages/ScheduleCall/ScheduleCall';
import Careers from './pages/Careers/Careers';
import ProjectEstimation from './pages/ProjectEstimation/ProjectEstimation';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import PriceComparison from './pages/PriceComparison/PriceComparison';
import NotFound from './pages/NotFound/NotFound';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  console.log('🚀 Main App component mounted/rendered');
  
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
            <ScrollToTop />
            <div className="App">
              <Navigation />
              <NotificationCenter />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/price-comparison" element={<PriceComparison />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/schedule-a-call" element={<ScheduleCall />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/project-estimation" element={<ProjectEstimation />} />
                  <Route path="/supabase-test" element={<SupabaseTest />} />
                  <Route path="/404" element={<NotFound />} />
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              
              {/* AI Customer Service Chat Widget - Available on all pages */}
              <AICustomerService />
            </div>
          </Router>
        </AppProvider>
      </ThemeProvider>
  );
}

export default App;
