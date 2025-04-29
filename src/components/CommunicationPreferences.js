import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../services/userService';
import ToggleSwitch from '../components/ui/ToogleSwitch/ToogleSwitch';
import { useToast } from '../hooks/useToast';



const CommunicationPreferences = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [status, setStatus] = useState('');
    const { getToken } = useAuth();
    const { showSuccess, showError } = useToast();


    useEffect(() => {
        async function fetchPreferences() {
            try {
                const token = await getToken();
                const prefs = await getUserPreferences(token);
                setEmailNotifications(prefs?.receive_emails ?? true);
            } catch (err) {
                console.error('Error loading preferences:', err.message);
                setStatus('Error loading preferences');
            }
        }
        fetchPreferences();
    }, [getToken]);

    const handleToggleChange = async (newValue) => {
        try {
            setEmailNotifications(newValue);
            const token = await getToken();
            await updateUserPreferences({ email_notifications: newValue }, token);
            showSuccess('Preferencias actualizadas correctamente');
        } catch (err) {
            console.error('Error updating preferences:', err.message);
            showError('Error actualizando preferencias');
        }
    };


    return (
        <div>
            <h2>Communication Preferences</h2>
            <ToggleSwitch
                label="Recibir notificaciones por email para actividad de swaps"
                checked={emailNotifications}
                onChange={handleToggleChange}
            />

        </div>
    );
};

export default CommunicationPreferences;
