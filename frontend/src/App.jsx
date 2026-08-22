import React, { useState } from 'react';
import { MainLandingPage } from './components/landing/MainLandingPage';
import { CreateTripScreen } from './components/trips/CreateTripScreen';
import { BuildItineraryWorkspace } from './components/itinerary/BuildItineraryWorkspace';
import { UserTripListingScreen } from './components/trips/UserTripListingScreen';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { Toast } from './components/ui/Toast';
import { INITIAL_TRIPS_DATA } from './data/tripsData';
import { Home, PlusCircle, LogIn, UserPlus, Compass, Calendar, MapPin } from 'lucide-react';
import './styles/global.css';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'create-trip' | 'itinerary-builder' | 'my-trips' | 'login' | 'register'
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Morgan',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  });

  const [trips, setTrips] = useState(INITIAL_TRIPS_DATA);
  const [activeTrip, setActiveTrip] = useState(INITIAL_TRIPS_DATA[0]);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCreateTripSuccess = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTrip(newTrip);
    setCurrentView('itinerary-builder');
    showToast(`Trip "${newTrip.title}" created successfully!`, 'success');
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
      {/* Top Prototype Navigation Bar */}
      <div className="gt-screen-switcher-bar flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Compass className="gt-switcher-icon" />
          <span className="gt-switcher-brand brand-serif">GlobeTrotter Prototype</span>
          <span className="gt-switcher-badge">Screen Navigator</span>
        </div>

        <div className="gt-switcher-buttons flex gap-2">
          <button
            type="button"
            className={`gt-switcher-btn ${currentView === 'landing' ? 'gt-switcher-btn--active' : ''}`}
            onClick={() => setCurrentView('landing')}
          >
            <Home className="gt-icon" />
            <span>Screen 3: Landing</span>
          </button>

          <button
            type="button"
            className={`gt-switcher-btn ${currentView === 'my-trips' ? 'gt-switcher-btn--active' : ''}`}
            onClick={() => setCurrentView('my-trips')}
          >
            <MapPin className="gt-icon" />
            <span>Screen 6: My Trips</span>
          </button>

          <button
            type="button"
            className={`gt-switcher-btn ${currentView === 'create-trip' ? 'gt-switcher-btn--active' : ''}`}
            onClick={() => setCurrentView('create-trip')}
          >
            <PlusCircle className="gt-icon" />
            <span>Screen 4: Create Trip</span>
          </button>

          <button
            type="button"
            className={`gt-switcher-btn ${currentView === 'itinerary-builder' ? 'gt-switcher-btn--active' : ''}`}
            onClick={() => setCurrentView('itinerary-builder')}
          >
            <Calendar className="gt-icon" />
            <span>Screen 5: Build Itinerary</span>
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
            <span>Screen 2: Register</span>
          </button>
        </div>
      </div>

      {/* Screen Views */}
      {currentView === 'landing' && (
        <MainLandingPage
          currentUser={currentUser}
          trips={trips}
          onAddTrip={(newTrip) => {
            setTrips((prev) => [newTrip, ...prev]);
            setActiveTrip(newTrip);
          }}
          onNavigate={(view) => {
            if (view === 'trips') setCurrentView('my-trips');
            else setCurrentView(view);
          }}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {currentView === 'my-trips' && (
        <UserTripListingScreen
          currentUser={currentUser}
          onNavigate={(view) => {
            if (view === 'trips') setCurrentView('my-trips');
            else setCurrentView(view);
          }}
          onOpenCreateTrip={() => setCurrentView('create-trip')}
          onViewTripDetails={(t) => {
            setActiveTrip(t);
            setCurrentView('itinerary-builder');
          }}
          onShowToast={showToast}
        />
      )}

      {currentView === 'create-trip' && (
        <CreateTripScreen
          currentUser={currentUser}
          onNavigate={(view) => {
            if (view === 'trips') setCurrentView('my-trips');
            else setCurrentView(view);
          }}
          onCreateTripSuccess={handleCreateTripSuccess}
        />
      )}

      {currentView === 'itinerary-builder' && (
        <BuildItineraryWorkspace
          trip={activeTrip}
          currentUser={currentUser}
          onNavigate={(view) => {
            if (view === 'trips') setCurrentView('my-trips');
            else setCurrentView(view);
          }}
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
