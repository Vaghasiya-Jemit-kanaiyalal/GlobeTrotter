import React, { useState } from 'react';
import { User, Eye, Ban, CheckCircle2, Trash2, MapPin } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import './UserTable.css';

export const UserTable = ({
  users = [],
  onSelectUser,
  onToggleStatus,
  onDeleteUser,
}) => {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null, // 'disable' | 'delete'
    user: null,
  });

  const handleConfirmAction = () => {
    if (!confirmModal.user) return;
    if (confirmModal.action === 'disable') {
      const newStatus = confirmModal.user.status === 'Active' ? 'Disabled' : 'Active';
      onToggleStatus(confirmModal.user.id, newStatus);
    } else if (confirmModal.action === 'delete') {
      onDeleteUser(confirmModal.user.id);
    }
    setConfirmModal({ isOpen: false, action: null, user: null });
  };

  return (
    <div className="gt-user-table-card">
      <div className="gt-user-table-wrapper overflow-x-auto">
        <table className="gt-user-table w-full text-left border-collapse">
          <thead>
            <tr>
              <th>User Profile</th>
              <th>Email</th>
              <th>Country</th>
              <th>Trips</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-subtle transition-all">
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className="gt-user-avatar-small">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-navy-900">{u.name}</span>
                      {u.role === 'admin' && (
                        <span className="text-xs font-bold text-amber-700">Administrator</span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="text-xs text-navy-700">{u.email}</td>

                <td className="text-xs text-navy-700">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    {u.country}
                  </span>
                </td>

                <td className="text-xs font-bold text-navy-900">{u.tripsCount}</td>

                <td className="text-xs text-muted">{u.joinedDate}</td>

                <td>
                  <span className={`gt-user-status-pill ${u.status === 'Active' ? 'gt-user-status-pill--active' : 'gt-user-status-pill--disabled'}`}>
                    {u.status === 'Active' ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : <Ban className="w-3 h-3 inline mr-1" />}
                    {u.status}
                  </span>
                </td>

                <td>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="gt-user-act-btn"
                      onClick={() => onSelectUser(u)}
                      title="View user details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      className="gt-user-act-btn"
                      onClick={() => setConfirmModal({ isOpen: true, action: 'disable', user: u })}
                      title={u.status === 'Active' ? 'Disable account' : 'Enable account'}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      className="gt-user-act-btn gt-user-act-btn--danger"
                      onClick={() => setConfirmModal({ isOpen: true, action: 'delete', user: u })}
                      title="Delete account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, user: null })}
        title={confirmModal.action === 'delete' ? 'Confirm Delete User' : 'Confirm Change Status'}
        size="small"
      >
        <div className="p-1 text-sm text-navy-800">
          <p className="mb-4">
            Are you sure you want to {confirmModal.action} user account{' '}
            <strong>{confirmModal.user?.name}</strong> ({confirmModal.user?.email})?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmModal({ isOpen: false, action: null, user: null })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmModal.action === 'delete' ? 'danger' : 'primary'}
              onClick={handleConfirmAction}
            >
              Confirm {confirmModal.action === 'delete' ? 'Delete' : 'Update'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
