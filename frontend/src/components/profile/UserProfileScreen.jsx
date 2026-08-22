import React, { useState, useEffect } from 'react';
import { Navbar } from '../layout/Navbar';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileDetails } from './ProfileDetails';
import { ProfileEditForm } from './ProfileEditForm';
import { ProfileStats } from './ProfileStats';
import { ProfileSkeleton } from './ProfileSkeleton';
import { DeleteAccountModal } from './DeleteAccountModal';
import { TripCard } from '../trips/TripCard';
import { EmptyTripState } from '../trips/EmptyTripState';
import { EditTripModal } from '../trips/EditTripModal';
import { ShareTripModal } from '../trips/ShareTripModal';
import { DeleteTripModal } from '../trips/DeleteTripModal';
import { profileApi } from '../../services/profileApi';
import { tripApi } from '../../services/tripApi';
import { Button } from '../ui/Button';
import { Compass, AlertTriangle, ShieldAlert } from 'lucide-react';
import './UserProfileScreen.css';

export const UserProfileScreen = ({
  currentUser,
  onNavigate,
  onOpenCreateTrip,
  onViewTripDetails,
  onShowToast,
}) => {
  // Profile State
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Trips State
  const [tripsData, setTripsData] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [tripsError, setTripsError] = useState(null);

  // Modals
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [editTrip, setEditTrip] = useState(null);
  const [shareTrip, setShareTrip] = useState(null);
  const [deleteTrip, setDeleteTrip] = useState(null);

  // Fetch Profile Data
  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await profileApi.getProfile();
      setProfile(res.data);
    } catch (err) {
      setProfileError('Unable to load your profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch User Trips Data
  const fetchTrips = async () => {
    setTripsLoading(true);
    setTripsError(null);
    try {
      const res = await tripApi.getTrips();
      setTripsData(res.data);
    } catch (err) {
      setTripsError('Unable to load trips. Please try again.');
    } finally {
      setTripsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTrips();
  }, []);

  const handleSaveProfile = async (updatedFields) => {
    setIsSaving(true);
    try {
      const res = await profileApi.updateProfile(updatedFields);
      setProfile(res.data);
      setIsEditing(false);
      onShowToast('Profile updated successfully.', 'success');
    } catch (err) {
      onShowToast('Unable to update profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (url) => {
    const res = await profileApi.updateAvatar(url);
    setProfile((prev) => ({ ...prev, avatarUrl: res.avatarUrl }));
    onShowToast('Profile picture updated', 'success');
  };

  const handleAvatarRemove = async () => {
    await profileApi.updateAvatar('');
    setProfile((prev) => ({ ...prev, avatarUrl: '' }));
    onShowToast('Profile photo removed', 'info');
  };

  const handleSaveEditTrip = async (id, updatedFields) => {
    await tripApi.updateTrip(id, updatedFields);
    onShowToast('Trip updated successfully!', 'success');
    fetchTrips();
  };

  const handleDeleteTripSubmit = async (id) => {
    await tripApi.deleteTrip(id);
    onShowToast('Trip deleted from your account', 'info');
    fetchTrips();
  };

  const handlePlanSimilarTrip = async (tripToClone) => {
    const clonedTripData = {
      title: `${tripToClone.title} (New)`,
      primaryLocation: tripToClone.primaryLocation,
      coverImage: tripToClone.coverImage,
      startDate: '2026-11-01',
      endDate: '2026-11-08',
      dateRange: '01 Nov – 08 Nov 2026',
      destinations: tripToClone.destinations,
      summary: `Cloned itinerary based on ${tripToClone.title}.`,
    };
    await tripApi.createTrip(clonedTripData);
    onShowToast(`Created new trip based on "${tripToClone.title}"!`, 'success');
    fetchTrips();
  };

  const handleDeleteAccountSubmit = () => {
    onShowToast('Account deleted successfully', 'info');
    onNavigate('landing');
  };

  // Separate Trips into Preplanned & Previous
  const preplannedTrips = tripsData.filter(
    (t) => t.calculatedStatus === 'Upcoming' || t.calculatedStatus === 'Ongoing'
  );
  const previousTrips = tripsData.filter((t) => t.calculatedStatus === 'Completed');

  return (
    <div className="gt-user-profile-screen">
      {/* 1. Header Navigation */}
      <Navbar
        currentUser={profile || currentUser}
        activeTab="profile"
        onNavigate={onNavigate}
        onOpenCreateTrip={onOpenCreateTrip}
        onSwitchToAuth={onNavigate}
        onLogout={() => onNavigate('landing')}
      />

      <div className="gt-profile-container max-w-[1080px] mx-auto px-4 py-6 flex flex-col gap-7">
        {/* 2. User Profile Information Section */}
        {profileLoading ? (
          <ProfileSkeleton />
        ) : profileError ? (
          <div className="gt-profile-error-card flex-col items-center text-center gap-3">
            <AlertTriangle style={{ width: 36, height: 36, color: 'var(--color-error)' }} />
            <p className="font-semibold">{profileError}</p>
            <Button variant="outline" size="sm" onClick={fetchProfile}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="gt-profile-main-card flex flex-col gap-4 bg-white border border-border rounded-xl p-5 shadow-xs animate-fade-in">
            <div className="gt-profile-top-row flex items-start gap-4 flex-wrap sm:flex-nowrap">
              {/* Profile Image */}
              <ProfileAvatar
                avatarUrl={profile.avatarUrl}
                onAvatarChange={handleAvatarChange}
                onAvatarRemove={handleAvatarRemove}
              />

              {/* User Details OR Edit Form */}
              <div className="gt-profile-details-wrapper flex-1">
                {!isEditing ? (
                  <ProfileDetails
                    profile={profile}
                    onEditClick={() => setIsEditing(true)}
                  />
                ) : (
                  <ProfileEditForm
                    profile={profile}
                    onSave={handleSaveProfile}
                    onCancel={() => setIsEditing(false)}
                    isSaving={isSaving}
                  />
                )}
              </div>
            </div>

            {/* Profile Statistics Bar (Compact 4-Column Card) */}
            <ProfileStats
              tripsCount={tripsData.length}
              destinationsCount={12}
              activitiesCount={32}
              countriesCount={4}
            />
          </div>
        )}

        {/* 3. Preplanned Trips Section (Compact 2 Cards per row on desktop) */}
        <section className="gt-profile-trip-section flex flex-col gap-3">
          <div className="gt-trip-section-header flex justify-between items-center pb-1">
            <div>
              <h2 className="gt-trip-section-title brand-serif text-xl font-bold text-navy-900 m-0">Preplanned Trips</h2>
              <p className="text-xs text-muted m-0 mt-0.5">Upcoming and active travel plans</p>
            </div>
            <Button variant="text" size="sm" onClick={() => onNavigate('trips')} className="text-amber-600 font-bold hover:underline text-xs">
              View All &rarr;
            </Button>
          </div>

          {tripsLoading ? (
            <div className="text-xs text-muted py-3">Loading preplanned trips...</div>
          ) : tripsError ? (
            <div className="text-xs text-error py-2">{tripsError}</div>
          ) : preplannedTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {preplannedTrips.map((t) => (
                <TripCard
                  key={t.id}
                  trip={t}
                  onViewTrip={onViewTripDetails}
                  onContinuePlanning={() => onNavigate('itinerary-builder')}
                  onEditTrip={(t) => setEditTrip(t)}
                  onShareTrip={(t) => setShareTrip(t)}
                  onPlanSimilarTrip={handlePlanSimilarTrip}
                  onDeleteTrip={(t) => setDeleteTrip(t)}
                />
              ))}
            </div>
          ) : (
            <EmptyTripState status="upcoming" onPlanTrip={onOpenCreateTrip} />
          )}
        </section>

        {/* 4. Previous Trips Section (Compact 2 Cards per row on desktop) */}
        <section className="gt-profile-trip-section flex flex-col gap-3">
          <div className="gt-trip-section-header flex justify-between items-center pb-1">
            <div>
              <h2 className="gt-trip-section-title brand-serif text-xl font-bold text-navy-900 m-0">Previous Trips</h2>
              <p className="text-xs text-muted m-0 mt-0.5">Completed journeys and past itineraries</p>
            </div>
            <Button variant="text" size="sm" onClick={() => onNavigate('trips')} className="text-amber-600 font-bold hover:underline text-xs">
              View All &rarr;
            </Button>
          </div>

          {tripsLoading ? (
            <div className="text-xs text-muted py-3">Loading previous trips...</div>
          ) : tripsError ? (
            <div className="text-xs text-error py-2">{tripsError}</div>
          ) : previousTrips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {previousTrips.map((t) => (
                <TripCard
                  key={t.id}
                  trip={t}
                  onViewTrip={onViewTripDetails}
                  onContinuePlanning={() => onNavigate('itinerary-builder')}
                  onEditTrip={(t) => setEditTrip(t)}
                  onShareTrip={(t) => setShareTrip(t)}
                  onPlanSimilarTrip={handlePlanSimilarTrip}
                  onDeleteTrip={(t) => setDeleteTrip(t)}
                />
              ))}
            </div>
          ) : (
            <EmptyTripState status="completed" />
          )}
        </section>
      </div>

      {/* Modals */}
      <EditTripModal
        trip={editTrip}
        isOpen={Boolean(editTrip)}
        onClose={() => setEditTrip(null)}
        onSave={handleSaveEditTrip}
      />

      <ShareTripModal
        trip={shareTrip}
        isOpen={Boolean(shareTrip)}
        onClose={() => setShareTrip(null)}
        onShowToast={onShowToast}
      />

      <DeleteTripModal
        trip={deleteTrip}
        isOpen={Boolean(deleteTrip)}
        onClose={() => setDeleteTrip(null)}
        onDelete={handleDeleteTripSubmit}
      />

      <DeleteAccountModal
        isOpen={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        onDeleteAccount={handleDeleteAccountSubmit}
      />
    </div>
  );
};
