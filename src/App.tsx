import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import NotificationCenter from './components/NotificationCenter/NotificationCenter';
import DynamicPage from './components/DynamicPage/DynamicPage';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';
import Admin from './pages/Admin/Admin';
import NotFound from './pages/NotFound/NotFound';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppProvider>
          <Router>
            <div className="App">
              <Navigation />
              <NotificationCenter />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  {/* Dynamic page route - should be last to catch custom URLs */}
                  <Route path="/:slug" element={<DynamicPage />} />
                  {/* 404 fallback */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
