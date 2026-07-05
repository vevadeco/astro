import { useState, type FormEvent } from 'react';
import type { BirthProfile } from '../models/types';
import { validateProfile } from '../services/validation';
import { useApp } from '../context/AppContext';

interface ProfileInputFormProps {
  mode?: 'create' | 'edit';
  onCancel?: () => void;
}

const PERSISTENCE_MESSAGES: Record<string, string> = {
  storage_full: 'Could not save profile — browser storage is full. Try clearing site data.',
  unavailable: 'Could not save profile — local storage is unavailable.',
  corrupted_data: 'Saved profile was corrupted and could not be loaded.',
};

export function ProfileInputForm({ mode = 'create', onCancel }: ProfileInputFormProps) {
  const { profile, saveProfile, saveError, loadError, clearSaveError } = useApp();

  const [name, setName] = useState(profile?.name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth ?? '');
  const [birthTime, setBirthTime] = useState(profile?.birthTime ?? '');
  const [location, setLocation] = useState(profile?.location ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    clearSaveError();
    setSaved(false);

    const draft: Partial<BirthProfile> = {
      name,
      dateOfBirth,
      birthTime,
      location: location.trim() || undefined,
    };

    const result = validateProfile(draft);
    if (!result.valid) {
      const errors: Record<string, string> = {};
      for (const err of result.errors) {
        errors[err.field] = err.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    const success = saveProfile(draft as BirthProfile);
    if (success) {
      setSaved(true);
    }
  };

  const persistenceError = saveError ? PERSISTENCE_MESSAGES[saveError] : null;
  const loadErrorMessage = loadError ? PERSISTENCE_MESSAGES[loadError] : null;

  return (
    <div className="profile-form-container">
      <h1>{mode === 'edit' ? 'Edit Birth Profile' : 'Create Your Birth Profile'}</h1>
      <p className="subtitle">
        {mode === 'create'
          ? 'Enter your birth details to unlock personalized astrological insights.'
          : 'Update your birth details. All astrological data will be recalculated.'}
      </p>

      {loadErrorMessage && <div className="alert alert-error">{loadErrorMessage}</div>}

      <form className="profile-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            autoComplete="name"
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            min="1900-01-01"
            max={new Date().toISOString().slice(0, 10)}
          />
          {fieldErrors.dateOfBirth && (
            <span className="field-error">{fieldErrors.dateOfBirth}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="birthTime">Birth Time (24-hour)</label>
          <input
            id="birthTime"
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
          />
          {fieldErrors.birthTime && (
            <span className="field-error">{fieldErrors.birthTime}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="location">Birth Location (optional)</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={200}
            placeholder="City, Country"
          />
          {fieldErrors.location && (
            <span className="field-error">{fieldErrors.location}</span>
          )}
        </div>

        {persistenceError && <div className="alert alert-error">{persistenceError}</div>}
        {saved && <div className="alert alert-success">Profile saved successfully!</div>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {mode === 'edit' ? 'Save Changes' : 'Create Profile'}
          </button>
          {mode === 'edit' && onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
