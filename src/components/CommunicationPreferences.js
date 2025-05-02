import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../services/userService';
import ToggleSwitch from '../components/ui/ToogleSwitch/ToogleSwitch';
import { useToast } from '../hooks/useToast';
import Loader from '../components/ui/Loader/Loader';
import useMinimumDelay from '../hooks/useMinimumDelay';

const CommunicationPreferences = () => {
  const { getToken } = useAuth();
  const { showSuccess, showError } = useToast();

  const [emailSwapNotifications, setEmailSwapNotifications] = useState(true);
  const [emailReminderNotifications, setEmailReminderNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [loadingReminder, setLoadingReminder] = useState(false);

  const showLoader = useMinimumDelay(loading, 400);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const token = await getToken();
        const prefs = await getUserPreferences(token);
        setEmailSwapNotifications(prefs?.receive_emails_swap ?? true);
        setEmailReminderNotifications(prefs?.receive_emails_reminders ?? true);
      } catch (err) {
        showError('No se pudieron cargar las preferencias');
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
  }, [getToken]);

  const handleSwapToggleChange = async (newValue) => {
    setLoadingSwap(true);
    try {
      setEmailSwapNotifications(newValue);
      const token = await getToken();
      await updateUserPreferences({ receive_emails_swap: newValue }, token);
      showSuccess('Preferencias actualizadas correctamente');
    } catch {
      showError('Error actualizando preferencias');
    } finally {
      setLoadingSwap(false);
    }
  };

  const handleReminderToggleChange = async (newValue) => {
    setLoadingReminder(true);
    try {
      setEmailReminderNotifications(newValue);
      const token = await getToken();
      await updateUserPreferences({ receive_emails_reminders: newValue }, token);
      showSuccess('Preferencias actualizadas correctamente');
    } catch {
      showError('Error actualizando preferencias');
    } finally {
      setLoadingReminder(false);
    }
  };

  if (showLoader) return <Loader text="Cargando preferencias..." />;

  return (
    <div>
      <h2>Preferencias de comunicación</h2>

      <ToggleSwitch
        label="Recibir emails sobre actividad de swaps"
        checked={emailSwapNotifications}
        onChange={handleSwapToggleChange}
        disabled={loadingSwap}
      />

      <ToggleSwitch
        label="Recibir recordatorios de turnos por email"
        checked={emailReminderNotifications}
        onChange={handleReminderToggleChange}
        disabled={loadingReminder}
      />
    </div>
  );
};

export default CommunicationPreferences;
