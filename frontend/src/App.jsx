import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { MainLandingPage } from './components/landing/MainLandingPage';
import { CreateTripScreen } from './components/trips/CreateTripScreen';
import { BuildItineraryWorkspace } from './components/itinerary/BuildItineraryWorkspace';
import { UserTripListingScreen } from './components/trips/UserTripListingScreen';
import { UserProfileScreen } from './components/profile/UserProfileScreen';
import { ActivitySearchScreen } from './components/search/ActivitySearchScreen';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AdminLoginForm } from './components/auth/AdminLoginForm';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { ItineraryViewPage } from './components/itinerary/ItineraryViewPage';
import { CalendarViewPage } from './components/calendar/CalendarViewPage';
import { CommunityTabScreen } from './components/community/CommunityTabScreen';
import { AdminPanelScreen } from './components/admin/AdminPanelScreen';
import { Toast } from './components/ui/Toast';
import { INITIAL_TRIPS_DATA } from './data/tripsData';
import './styles/global.css';
import './App.css';

// Protected User Routes (Require authentication)
const PROTECTED_USER_ROUTES = ['my-trips', 'create-trip', 'itinerary-builder', 'itinerary', 'calendar', 'profile'];

// Admin Protected Routes (Require role === 'admin')
const ADMIN_ROUTES = ['admin'];

export default function App() {
  // Restore current user session from persistent authService
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  // URL Hash-based Route State (e.g. #/my-trips -> 'my-trips')
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'landing';
  });

  const [trips, setTrips] = useState(INITIAL_TRIPS_DATA);
  const [activeTrip, setActiveTrip] = useState(INITIAL_TRIPS_DATA[0]);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Verify backend session token on mount
  useEffect(() => {
    async function initSession() {
      const verifiedUser = await authService.verifySession();
      if (verifiedUser) {
        setCurrentUser(verifiedUser);
      }
    }
    initSession();
  }, []);

  // Fetch live trips when user is logged in
  useEffect(() => {
    async function loadUserTrips() {
      if (currentUser) {
        try {
          const res = await tripApi.getTrips();
          if (res.data && res.data.length > 0) {
            setTrips(res.data);
            setActiveTrip(res.data[0]);
          }
        } catch (e) {
          console.warn('Trips fetch warning:', e);
        }
      }
    }
    loadUserTrips();
  }, [currentUser]);

  // Sync route with browser location hash and enforce route protection guards
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '') || 'landing';
      
      // Guard 1: User Protected Route Check
      if (PROTECTED_USER_ROUTES.includes(hash) && !authService.isAuthenticated()) {
        window.location.hash = '#/login';
        setCurrentRoute('login');
        showToast('Please sign in to access your trips and workspace.', 'info');
        return;
      }

      // Guard 2: Admin Protected Route Check
      if (ADMIN_ROUTES.includes(hash) && !authService.isAdmin()) {
        window.location.hash = '#/admin/login';
        setCurrentRoute('admin/login');
        showToast('Administrator authentication required for access.', 'warning');
        return;
      }

      setCurrentRoute(hash);
    };

    // Initial check on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Central Navigation Handler
  const navigateTo = (targetRoute) => {
    let cleanRoute = targetRoute;
    if (targetRoute === 'explore') cleanRoute = 'search';
    if (targetRoute === 'trips') cleanRoute = 'my-trips';

    // Route Protection Checks before navigating
    if (PROTECTED_USER_ROUTES.includes(cleanRoute) && !authService.isAuthenticated()) {
      window.location.hash = '#/login';
      showToast('Please sign in to continue.', 'info');
      return;
    }

    if (ADMIN_ROUTES.includes(cleanRoute) && !authService.isAdmin()) {
      window.location.hash = '#/admin/login';
      showToast('Administrator authentication required.', 'warning');
      return;
    }

    window.location.hash = `#/${cleanRoute}`;
  };

  // Auth Handlers
  const handleLoginSuccess = async (user) => {
    const session = await authService.login(user.email, user.password || 'password123');
    setCurrentUser(session.user);
    if (session.user.role === 'admin') {
      navigateTo('admin');
      showToast(`Welcome Administrator, ${session.user.name}!`);
    } else {
      navigateTo('my-trips');
      showToast(`Welcome back, ${session.user.firstName || session.user.name}!`);
    }
  };

  const handleAdminLoginSuccess = async (email, password) => {
    const session = await authService.loginAdmin(email, password);
    setCurrentUser(session.user);
    navigateTo('admin');
    showToast(`Administrator authenticated successfully. Welcome, ${session.user.name}!`);
  };

  const handleRegisterSuccess = async (user) => {
    const session = await authService.register(user);
    setCurrentUser(session.user);
    navigateTo('my-trips');
    showToast(`Account created! Welcome to GlobeTrotter, ${session.user.firstName || session.user.name}.`);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigateTo('landing');
    showToast('Signed out of GlobeTrotter', 'info');
  };

  const handleCreateTripSuccess = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTrip(newTrip);
    navigateTo('itinerary-builder');
    showToast(`Trip "${newTrip.title || newTrip.name}" created successfully!`, 'success');
  };

  const handleAddTrip = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
  };

  return (
    <div className="gt-app-root">
      {/* Route Views */}
      {(currentRoute === 'landing' || currentRoute === '') && (
        <MainLandingPage
          currentUser={currentUser}
          trips={trips}
          onAddTrip={handleAddTrip}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'search' && (
        <ActivitySearchScreen
          currentUser={currentUser}
          onNavigate={navigateTo}
          onOpenCreateTrip={() => navigateTo('create-trip')}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'community' && (
        <CommunityTabScreen
          currentUser={currentUser}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'my-trips' && (
        <UserTripListingScreen
          currentUser={currentUser}
          onNavigate={navigateTo}
          onOpenCreateTrip={() => navigateTo('create-trip')}
          onViewTripDetails={(t) => {
            setActiveTrip(t);
            navigateTo('itinerary-builder');
          }}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'profile' && (
        <UserProfileScreen
          currentUser={currentUser}
          onNavigate={navigateTo}
          onOpenCreateTrip={() => navigateTo('create-trip')}
          onViewTripDetails={(t) => {
            setActiveTrip(t);
            navigateTo('itinerary-builder');
          }}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'create-trip' && (
        <CreateTripScreen
          currentUser={currentUser}
          onNavigate={navigateTo}
          onCreateTripSuccess={handleCreateTripSuccess}
        />
      )}

      {currentRoute === 'itinerary-builder' && (
        <BuildItineraryWorkspace
          trip={activeTrip}
          currentUser={currentUser}
          onNavigate={navigateTo}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'itinerary' && (
        <ItineraryViewPage
          currentUser={currentUser}
          onBack={() => navigateTo('my-trips')}
          onOpenCreateTrip={() => navigateTo('create-trip')}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'calendar' && (
        <CalendarViewPage
          currentUser={currentUser}
          onBack={() => navigateTo('my-trips')}
          onOpenCreateTrip={() => navigateTo('create-trip')}
          onNavigateToItinerary={() => navigateTo('itinerary')}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'admin' && (
        <AdminPanelScreen
          currentUser={currentUser}
          onBack={() => navigateTo('landing')}
          onNavigateToUserTrips={() => navigateTo('my-trips')}
          onLogout={handleLogout}
          onShowToast={showToast}
        />
      )}

      {currentRoute === 'admin/login' && (
        <AdminLoginForm
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onBackToApp={() => navigateTo('landing')}
        />
      )}

      {currentRoute === 'login' && (
        <div className="app-container">
          <div className="gt-auth-wrapper w-full">
            <LoginForm
              onSwitchToRegister={() => navigateTo('register')}
              onLoginSuccess={handleLoginSuccess}
              onOpenForgotPassword={() => setForgotPasswordOpen(true)}
            />
          </div>
        </div>
      )}

      {currentRoute === 'register' && (
        <div className="app-container">
          <div className="gt-auth-wrapper w-full">
            <RegisterForm
              onSwitchToLogin={() => navigateTo('login')}
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
