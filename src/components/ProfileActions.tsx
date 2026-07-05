import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface ProfileActionsProps {
  onEdit: () => void;
}

export function ProfileActions({ onEdit }: ProfileActionsProps) {
  const { deleteProfile } = useApp();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    deleteProfile();
    setConfirming(false);
  };

  return (
    <div className="profile-actions">
      <button type="button" className="btn btn-secondary" onClick={onEdit}>
        Edit Profile
      </button>
      {!confirming ? (
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Delete Profile
        </button>
      ) : (
        <div className="delete-confirm">
          <span>Are you sure?</span>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Yes, Delete
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
