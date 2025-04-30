import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../services/userService';
import ToggleSwitch from '../components/ui/ToogleSwitch/ToogleSwitch';
import { useToast } from '../hooks/useToast';



const CommunicationPreferences = () => {
    const [status, setStatus] = useState('');
    const { getToken } = useAuth();
    const { showSuccess, showError } = useToast();
    const [emailSwapNotifications, setEmailSwapNotifications] = useState(true);
    const [emailReminderNotifications, setEmailReminderNotifications] = useState(true);


    useEffect(() => {
        async function fetchPreferences() {
            try {
                const token = await getToken();
                const prefs = await getUserPreferences(token);
                setEmailSwapNotifications(prefs?.receive_emails_swap ?? true);
                setEmailReminderNotifications(prefs?.receive_emails_reminders ?? true);
            } catch (err) {
                setStatus('Error loading preferences');
            }
        }
        fetchPreferences();
    }, [getToken]);


    // handler swap
    const handleSwapToggleChange = async (newValue) => {
        try {
            setEmailSwapNotifications(newValue);
            const token = await getToken();
            await updateUserPreferences({ receive_emails_swap: newValue }, token);
            showSuccess('Preferencias actualizadas correctamente');
        } catch {
            showError('Error actualizando preferencias');
        }

    };

    // handler reminders
    const handleReminderToggleChange = async (newValue) => {
        try {
            setEmailReminderNotifications(newValue);
            const token = await getToken();
            await updateUserPreferences({ receive_emails_reminders: newValue }, token);
            showSuccess('Preferencias actualizadas correctamente');
        } catch {
            showError('Error actualizando preferencias');
        }
    };


    return (
        <div>
            <h2>Communication Preferences</h2>

            <ToggleSwitch
                label="Recibir emails sobre actividad de swaps"
                checked={emailSwapNotifications}
                onChange={handleSwapToggleChange}
            />

            <ToggleSwitch
                label="Recibir recordatorios de turnos por email"
                checked={emailReminderNotifications}
                onChange={handleReminderToggleChange}
            />

        </div>
    );
};

export default CommunicationPreferences;
