import { useState } from 'react';

export function useSettings(initialHousehold: string, initialGoal: string) {
  // Preferences State
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefHousehold, setPrefHousehold] = useState(initialHousehold || '1');
  const [prefGoal, setPrefGoal] = useState(initialGoal || 'save-money');

  // Password State
  const [passSaving, setPassSaving] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  return {
    prefSaving, setPrefSaving,
    prefHousehold, setPrefHousehold,
    prefGoal, setPrefGoal,
    passSaving, setPassSaving,
    passError, setPassError,
    passSuccess, setPassSuccess,
    isLogoutModalOpen, setIsLogoutModalOpen,
    isLoggingOut, setIsLoggingOut,
    isEditProfileModalOpen, setIsEditProfileModalOpen
  };
}
