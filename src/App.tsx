import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import NotificationCenter from './components/NotificationCenter/NotificationCenter';
import DynamicPage from './components/DynamicPage/DynamicPage';
import AICustomerService from './components/AICustomerService/AICustomerService';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SupabaseTest from './components/SupabaseTest';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';
import Careers from './pages/Careers/Careers';
import ProjectEstimation from './pages/ProjectEstimation/ProjectEstimation';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import PriceComparison from './pages/PriceComparison/PriceComparison';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Admin from './pages/Admin/Admin';
import TestAdminPage from './pages/TestAdmin';
import NotFound from './pages/NotFound/NotFound';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  console.log('🚀 Main App component mounted/rendered');
  
  return (
    <Provider store={store}>
      <AuthProvider>
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
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/project-estimation" element={<ProjectEstimation />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/supabase-test" element={<SupabaseTest />} />
                    <Route path="/test-admin" element={<TestAdminPage />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/*" element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } />
                    <Route path="/404" element={<NotFound />} />
                    {/* Dynamic page route for user-created articles - must be last before catch-all */}
                    <Route path="/:slug" element={<DynamicPage />} />
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
      </AuthProvider>
    </Provider>
  );
}

export default App;
