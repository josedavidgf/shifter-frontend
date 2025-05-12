import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommunicationPreferences from '../../components/CommunicationPreferences';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import useTrackPageView from '../../hooks/useTrackPageView';


const ProfilePreferences = () => {
    const navigate = useNavigate();
    useTrackPageView('profile-preferences');

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/calendar');
        }
    };
    return (
        <>
            <HeaderSecondLevel
                title="Preferencias"
                showBackButton
                onBack={handleBack}
            />
            <div className="page page-secondary">

                <div className="container">
                    <CommunicationPreferences />
                </div>
            </div>
        </>
    );
};

export default ProfilePreferences;
