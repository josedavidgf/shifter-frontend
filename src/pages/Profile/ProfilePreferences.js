import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommunicationPreferences from '../../components/CommunicationPreferences';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';

const ProfilePreferences = () => {
    const navigate = useNavigate();

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
