import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../services/userService';
import { useNavigate } from 'react-router-dom';


const CommunicationPreferences = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [status, setStatus] = useState('');
    const { getToken } = useAuth();
    const navigate = useNavigate();



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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            await updateUserPreferences({ email_notifications: emailNotifications }, token);
            setStatus('✅ Preferences updated successfully');
        } catch (err) {
            console.error('Error updating preferences:', err.message);
            setStatus('❌ Failed to update preferences');
        }
    };

    return (
        <div>
            <h2>Communication Preferences</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    Receive email notifications for swap activity
                </label>
                <br />
                <button type="submit">Save</button>
                {status && <p>{status}</p>}
            </form>
            <hr />
            <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
        </div>
    );
};

export default CommunicationPreferences;
