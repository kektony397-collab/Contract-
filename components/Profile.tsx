import React, { useState, useEffect } from 'react';
import { ProfileData } from '../types';
import { Button } from './Button';
import { InputGroup } from './InputGroup';

interface ProfileProps {
  initialProfile: ProfileData;
  onSave: (profile: ProfileData) => void;
}

export const Profile: React.FC<ProfileProps> = ({ initialProfile, onSave }) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-medium text-[--on-surface-variant] mb-4">Rider Profile</h2>
      <form onSubmit={handleSubmit} className="p-6 bg-[--surface-container] rounded-2xl shadow-[var(--elevation-1)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputGroup id="name" name="name" label="Rider Name *" type="text" value={profile.name} onChange={handleChange} required />
          <InputGroup id="licenseNumber" name="licenseNumber" label="License Number" type="text" value={profile.licenseNumber} onChange={handleChange} />
          <InputGroup id="rapidoId" name="rapidoId" label="Rapido ID" type="text" value={profile.rapidoId} onChange={handleChange} />
          <InputGroup id="uberId" name="uberId" label="Uber ID" type="text" value={profile.uberId} onChange={handleChange} />
          <InputGroup id="olaId" name="olaId" label="Ola ID" type="text" value={profile.olaId} onChange={handleChange} />
        </div>
        <div className="mt-8 flex justify-center">
            <Button type="submit" icon="save">Save Profile</Button>
        </div>
      </form>
    </div>
  );
};
