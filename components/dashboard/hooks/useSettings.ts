import { useState } from 'react';

export function useSettings(
  initialHousehold: string, 
  initialGoal: string[], 
  initialWeeklyReminders: boolean = true, 
  initialProductUpdates: boolean = true,
  initialMealFrequency: string = '3_meals'
) {
  // Preferences State
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefHousehold, setPrefHousehold] = useState(initialHousehold || '1');
  const [prefGoal, setPrefGoal] = useState<string[]>(initialGoal?.length > 0 ? initialGoal : ['save-money']);
  const [weeklyReminders, setWeeklyReminders] = useState(initialWeeklyReminders);
  const [productUpdates, setProductUpdates] = useState(initialProductUpdates);
  const [prefMealFrequency, setPrefMealFrequency] = useState(initialMealFrequency || '3_meals');

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
    weeklyReminders, setWeeklyReminders,
    productUpdates, setProductUpdates,
    prefMealFrequency, setPrefMealFrequency,
    passSaving, setPassSaving,
    passError, setPassError,
    passSuccess, setPassSuccess,
    isLogoutModalOpen, setIsLogoutModalOpen,
    isLoggingOut, setIsLoggingOut,
    isEditProfileModalOpen, setIsEditProfileModalOpen
  };
}
