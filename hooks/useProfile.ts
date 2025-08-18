import { useState, useEffect, useCallback } from 'react';
import { ProfileData } from '../types';

const PROFILE_KEY = 'fareAppRiderProfile';

const initialProfile: ProfileData = {
    name: '',
    licenseNumber: '',
    rapidoId: '',
    uberId: '',
    olaId: '',
};

export const useProfile = (): [ProfileData, (profile: ProfileData) => void] => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile from localStorage", error);
    }
  }, []);

  const saveProfile = useCallback((newProfile: ProfileData) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error("Failed to save profile to localStorage", error);
    }
  }, []);

  return [profile, saveProfile];
};
