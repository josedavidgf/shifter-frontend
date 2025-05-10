// components/ui/Feedback/FullScreenFeedback.jsx
import React from 'react';
import Button from '../Button/Button'; // asegúrate de que esta ruta es correcta
import HeaderSecondLevel from '../Header/HeaderSecondLevel';
import { X } from '../../../theme/icons'; // Ajusta la ruta según tu estructura de carpetas

export default function FullScreenFeedback({
    illustration,
    title_1,
    title_2,
    description_1,
    description_2,
    ctaLabel = 'Cerrar',
    onClose,
    secondaryActionLabel,
    onSecondaryAction,
}) {
    return (
        <>
            <HeaderSecondLevel
                rightAction={{
                    label: 'Cerrar',
                    icon: <X size={20} />,
                    onClick: onClose,
                }}
            />

            <div className="page page-secondary">
                <div className="container">
                    <div className="feedback-container">
                        <div className="home-hero">
                            <img src={illustration} alt="Ilustración" className="feedback-illustration" />
                        </div>
                        <h2 className="feedback-title">{title_1}</h2>
                        <h2 className="feedback-title">{title_2}</h2>
                        <p className="feedback-description">{description_1}</p>
                        <p className="feedback-description">{description_2}</p>

                    </div>
                    <div className="feedback-actions btn-sticky-footer mt-2">
                        {secondaryActionLabel && (
                            <Button
                                label={secondaryActionLabel}
                                variant="secondary"
                                onClick={onSecondaryAction}
                                size="md"
                            />
                        )}
                        <Button
                            label={ctaLabel}
                            variant="primary"
                            onClick={onClose}
                            size="lg"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
