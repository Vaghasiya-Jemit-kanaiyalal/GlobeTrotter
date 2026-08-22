import React, { useState } from 'react';
import { MainLandingPage } from './components/landing/MainLandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { ItineraryViewPage } from './components/itinerary/ItineraryViewPage';
import { Toast } from './components/ui/Toast';
import { INITIAL_TRIPS_DATA } from './data/tripsData';
import { Home, LogIn, UserPlus, Compass, MapPin } from 'lucide-react';
import './styles/global.css';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'register' | 'itinerary'
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Morgan',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  });
  const [trips, setTrips] = useState(INITIAL_TRIPS_DATA);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddTrip = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('landing');
    showToast(`Welcome back, ${user.name || 'Traveler'}!`);
  };

  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('landing');
    showToast(`Account created successfully! Welcome to GlobeTrotter, ${user.firstName}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of GlobeTrotter', 'info');
  };

  return (
    <div className="gt-app-root">
      {/* Top QA / Screen Navigation Switcher Bar */}
      <div className="gt-screen-switcher-bar flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Compass className="gt-switcher-icon" />
          <span className="gt-switcher-brand brand-serif">GlobeTrotter Prototype</span>
          <span className="gt-switcher-badge">Screen Navigator</span>
        </div>

        <div className="gt-switcher-buttons flex gap-2 flex-wrap">
          <button
            type="button"
            className={`gt-switcher-btn ${currentView === 'landing' ? 'gt-switcher-btn--active' : ''}`}
            onClick={() => setCurrentView('landing')}
          >
            <Home className="gt-icon" />
            <span>Screen 3: Landing Page</span>
          </button>

          <button
            type="button"
            className={`gt-switcher-btn ${currentView === 'itinerary' ? 'gt-switcher-btn--active' : ''}`}
            onClick={() => setCurrentView('itinerary')}
          >
            <MapPin className="gt-icon text-amber-500" />
            <span>Screen 9: Itinerary & Budget View</span>
          </button>

          <button
            type="button"
            className={`gt-switcher-btn ${currentView === 'login' ? 'gt-switcher-btn--active' : ''}`}
            onClick={() => setCurrentView('login')}
          >
            <LogIn className="gt-icon" />
            <span>Screen 1: Login</span>
          </button>

          <button
            type="button"
            className={`gt-switcher-btn ${currentView === 'register' ? 'gt-switcher-btn--active' : ''}`}
            onClick={() => setCurrentView('register')}
          >
            <UserPlus className="gt-icon" />
            <span>Screen 2: Registration</span>
          </button>
        </div>
      </div>

      {/* Screen Views */}
      {currentView === 'landing' && (
        <MainLandingPage
          currentUser={currentUser}
          trips={trips}
          onAddTrip={handleAddTrip}
          onNavigate={(view) => setCurrentView(view)}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {currentView === 'itinerary' && (
        <ItineraryViewPage
          currentUser={currentUser}
          onBack={() => setCurrentView('landing')}
          onOpenCreateTrip={() => {
            setCurrentView('landing');
            showToast('Opening Create Trip modal on Landing Page');
          }}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {currentView === 'login' && (
        <div className="app-container">
          <div className="gt-auth-wrapper w-full">
            <LoginForm
              onSwitchToRegister={() => setCurrentView('register')}
              onLoginSuccess={handleLoginSuccess}
              onOpenForgotPassword={() => setForgotPasswordOpen(true)}
            />
          </div>
        </div>
      )}

      {currentView === 'register' && (
        <div className="app-container">
          <div className="gt-auth-wrapper w-full">
            <RegisterForm
              onSwitchToLogin={() => setCurrentView('login')}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </div>
        </div>
      )}

      {/* Interactive Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onShowToast={showToast}
      />

      {/* Floating Global Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

