import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { validateEmail } from '../../utils/validation';
import { Save, X } from 'lucide-react';
import './ProfileEditForm.css';

export const ProfileEditForm = ({ profile, onSave, onCancel, isSaving }) => {
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [lastName, setLastName] = useState(profile.lastName || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [city, setCity] = useState(profile.city || '');
  const [country, setCountry] = useState(profile.country || '');
  const [additionalInfo, setAdditionalInfo] = useState(profile.additionalInfo || '');

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      country: country.trim(),
      additionalInfo: additionalInfo.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="gt-profile-edit-form flex-col gap-4 animate-fade-in">
      <div className="gt-edit-form__header flex justify-between items-center">
        <h3 className="text-lg font-bold brand-serif">Edit Personal Profile</h3>
        <span className="text-xs text-muted">* Required fields</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="edit-firstname"
          label="First Name *"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            if (errors.firstName) setErrors({ ...errors, firstName: null });
          }}
          error={errors.firstName}
          required
        />

        <Input
          id="edit-lastname"
          label="Last Name *"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            if (errors.lastName) setErrors({ ...errors, lastName: null });
          }}
          error={errors.lastName}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="edit-email"
          label="Email Address *"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: null });
          }}
          error={errors.email}
          required
        />

        <Input
          id="edit-phone"
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="edit-city"
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Ahmedabad"
        />

        <Input
          id="edit-country"
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="e.g. India"
        />
      </div>

      <Textarea
        id="edit-additional-info"
        label="Additional Information / Travel Preferences"
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
        rows={3}
        placeholder="Share your travel interests, favorite activities, or dietary preferences..."
      />

      <div className="gt-edit-form__footer flex justify-between items-center">
        <Button variant="outline" type="button" onClick={onCancel} icon={X}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          icon={Save}
          loading={isSaving}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
