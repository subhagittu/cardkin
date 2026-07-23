import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import CardStack from './components/CardStack';
import BankLogos from './components/BankLogos';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Features from './components/Features';
import About from './components/About';
import Testimonials from './components/Testimonials';
import SearchResults from './components/SearchResults';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import BackgroundAnimation from './components/BackgroundAnimation';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved : 'dark';
  });

  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    return ['landing', 'login', 'signup', 'dashboard', 'search-results', 'profile', 'edit-profile'].includes(view) ? view : 'landing';
  });
  const [activeSection, setActiveSection] = useState('home');
  const [currentSearchQuery, setCurrentSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  // Auth and Profile portfolio state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [myCards, setMyCards] = useState([]);

  // Supabase Auth listener
  useEffect(() => {
    import('./lib/supabaseClient').then(({ supabase }) => {

      const fetchProfile = async (session) => {
        if (!session) {
          setIsLoggedIn(false);
          setUser(null);
          setMyCards([]);
          return;
        }

        const { user } = session;
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, avatar_url, owned_cards, phone, kyc_verified')
          .eq('id', user.id)
          .single();

        if (data) {
          let syncedPhone = data.phone;
          let syncedKyc = data.kyc_verified;
          let needsUpdate = false;
          let updates = {};

          if (!syncedPhone && user.user_metadata?.phone) {
            syncedPhone = user.user_metadata.phone;
            updates.phone = syncedPhone;
            needsUpdate = true;
          }

          if (!syncedKyc && user.user_metadata?.kyc_verified) {
            syncedKyc = true;
            updates.kyc_verified = true;
            needsUpdate = true;
          }

          if (needsUpdate) {
            supabase.from('profiles').update(updates).eq('id', user.id).then();
          }

          setIsLoggedIn(true);
          setUser({
            id: user.id,
            name: data.full_name || user.email,
            email: data.email || user.email,
            avatar: data.avatar_url,
            phone: syncedPhone,
            kyc_verified: syncedKyc || false
          });
          setMyCards(data.owned_cards || []);
        } else {
          // Fallback if profile row isn't fully created yet but auth exists
          setIsLoggedIn(true);
          setUser({ id: user.id, name: user.user_metadata?.full_name || user.email, email: user.email, phone: user.user_metadata?.phone, kyc_verified: user.user_metadata?.kyc_verified || false });
          setMyCards([]);
        }
      };

      // Check active session
      supabase.auth.getSession().then(({ data: { session } }) => fetchProfile(session));

      // Listen for auth changes (e.g., login, logout)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        fetchProfile(session);
      });

      return () => subscription.unsubscribe();
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Synchronize initial rendering state in browser history
  useEffect(() => {
    window.history.replaceState(
      { view: currentView, searchQuery: currentSearchQuery },
      '',
      window.location.search || window.location.pathname
    );

    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        if (event.state.searchQuery !== undefined) {
          setCurrentSearchQuery(event.state.searchQuery);
        }
      } else {
        setCurrentView('landing');
        setCurrentSearchQuery('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Push state to browser window history when view transitions occur
  useEffect(() => {
    const currentState = window.history.state;
    if (!currentState || currentState.view !== currentView || currentState.searchQuery !== currentSearchQuery) {
      let url = window.location.pathname;
      if (currentView !== 'landing') {
        url = `?view=${currentView}`;
        if (currentView === 'search-results' && currentSearchQuery) {
          url += `&q=${encodeURIComponent(currentSearchQuery)}`;
        }
      }
      window.history.pushState(
        { view: currentView, searchQuery: currentSearchQuery },
        '',
        url
      );
    }
  }, [currentView, currentSearchQuery]);

  useEffect(() => {
    if (currentView !== 'landing') return;

    const sections = ['home', 'features', 'about'];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [currentView]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-container">
      {/* Animated credit card background */}
      <BackgroundAnimation theme={theme} />

      {currentView === 'dashboard' ? (
        <Dashboard
          onLogout={async () => {
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            setUser(null);
            setCurrentView('landing');
          }}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          myCards={myCards}
          setMyCards={setMyCards}
        />
      ) : (
        <>
          {/* Embedded top navbar — visible only on landing page */}
          {currentView === 'landing' && (
            <Header
              theme={theme}
              toggleTheme={toggleTheme}
              onSignUpClick={() => setCurrentView('signup')}
              onSignInClick={() => setCurrentView('login')}
              onHomeClick={() => setCurrentView('landing')}
              currentView={currentView}
              activeSection={activeSection}
              isLoggedIn={isLoggedIn}
              user={user}
              onLogout={async () => {
                await supabase.auth.signOut();
                setIsLoggedIn(false);
                setUser(null);
                setCurrentView('landing');
              }}
              onDashboardClick={() => setCurrentView('dashboard')}
              onProfileClick={() => setCurrentView('profile')}
              onAddCard={(newCard) => setMyCards((prev) => [...prev, newCard])}
            />
          )}

          <main className={`main-content ${currentView === 'search-results' ? 'search-full' : 'container'}`}>
            {currentView === 'landing' ? (
              <>
                <div id="home" className="hero-grid">
                  {/* Left Column (Hero Content + Statistics block) */}
                  <div className="left-column">
                    <Hero
                      onSignUpClick={() => setCurrentView('signup')}
                      onSearch={(query) => {
                        setCurrentSearchQuery(query);
                        setCurrentView('search-results');
                      }}
                      isLoggedIn={isLoggedIn}
                    />
                    <Stats />
                  </div>

                  {/* Right Column (Credit Card Stack display) */}
                  <div className="right-column">
                    <CardStack />
                  </div>
                </div>

                {/* Platform Features Section */}
                <Features />

                {/* About P2P Mission Section */}
                <About />

                {/* Social proof */}
                <Testimonials />

                {/* Partner banks strip */}
                <BankLogos />

                <Footer onSignUpClick={() => setCurrentView('signup')} />
              </>
            ) : currentView === 'signup' ? (
              <Signup
                onBack={() => setCurrentView('landing')}
                onNavigateHome={(userData) => {
                  if (userData) {
                    setIsLoggedIn(true);
                    setUser(userData);
                  }
                  setCurrentView('landing');
                }}
                onLogin={() => setCurrentView('login')}
              />
            ) : currentView === 'login' ? (
              <Login
                onBack={() => setCurrentView('landing')}
                onLoginSuccess={(userData) => {
                  if (userData) {
                    setIsLoggedIn(true);
                    setUser(userData);
                  }
                  setCurrentView('landing');
                }}
                onNavigateSignup={() => setCurrentView('signup')}
              />
            ) : currentView === 'profile' ? (
              <Profile
                user={user}
                myCards={myCards}
                setMyCards={setMyCards}
                onBack={() => setCurrentView('landing')}
                onEditProfile={() => setCurrentView('edit-profile')}
                onLogout={async () => {
                  await supabase.auth.signOut();
                  setIsLoggedIn(false);
                  setUser(null);
                  setCurrentView('landing');
                }}
              />
            ) : currentView === 'edit-profile' ? (
              <EditProfile
                user={user}
                onBack={() => setCurrentView('profile')}
                onSave={(updatedFields) => {
                  setUser(prev => ({ ...prev, ...updatedFields }));
                  setCurrentView('profile');
                }}
              />
            ) : (
              <SearchResults
                searchQuery={currentSearchQuery}
                onBack={() => setCurrentView('landing')}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}
