import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { User, Mail, Phone, MapPin, Calendar, Compass, CheckCircle2, Globe } from 'lucide-react';
import './UserDetailsModal.css';

export const UserDetailsModal = ({
  user,
  isOpen,
  onClose,
  onViewUserTrips,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Activity Overview"
      size="medium"
    >
      <div className="gt-user-details-content flex flex-col gap-3">
        {/* Header Profile Info */}
        <div className="flex items-center gap-3 p-3 bg-subtle rounded-lg border border-border">
          <div className="gt-user-modal-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <User className="w-6 h-6 text-navy-800" />
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-navy-900 brand-serif m-0">{user.name}</h3>
            <span className="text-xs text-muted flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-600 inline" /> {user.email}
            </span>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-navy-800 p-2 bg-white rounded-md border border-border">
          <div><strong>Country:</strong> {user.country}</div>
          <div><strong>Phone:</strong> {user.phone || 'N/A'}</div>
          <div><strong>Joined Date:</strong> {user.joinedDate}</div>
          <div><strong>Account Status:</strong> <span className="font-bold text-amber-700">{user.status}</span></div>
        </div>

        {/* Trips & Activities Stats Grid */}
        <h4 className="font-bold text-sm text-navy-900 m-0 mt-1">Platform Activity Metrics</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="gt-user-metric-card">
            <span className="gt-u-metric-val">{user.tripsCount || 0}</span>
            <span className="gt-u-metric-label">Total Trips</span>
          </div>
          <div className="gt-user-metric-card">
            <span className="gt-u-metric-val text-emerald-700">{user.completedTrips || 0}</span>
            <span className="gt-u-metric-label">Completed</span>
          </div>
          <div className="gt-user-metric-card">
            <span className="gt-u-metric-val text-amber-700">{user.publicTrips || 0}</span>
            <span className="gt-u-metric-label">Public Shared</span>
          </div>
          <div className="gt-user-metric-card">
            <span className="gt-u-metric-val text-teal-700">{user.activitiesAdded || 0}</span>
            <span className="gt-u-metric-label">Activities</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-3 border-t border-border mt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            icon={Compass}
            onClick={() => {
              onClose();
              onViewUserTrips(user);
            }}
          >
            View User Trips (Screen 6)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
