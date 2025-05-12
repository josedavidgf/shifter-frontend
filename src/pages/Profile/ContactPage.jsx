import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';
import { useSupportApi } from '../../api/useSupportApi';
import useTrackPageView from '../../hooks/useTrackPageView';
import { trackEvent } from '../../hooks/useTrackPageView';
import { EVENTS } from '../../utils/amplitudeEvents';
import { useToast } from '../../hooks/useToast';


const ContactPage = () => {
    const [form, setForm] = useState({ title: '', description: '' });
    const { sendSupportContact, loading } = useSupportApi();
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning } = useToast();


    useTrackPageView('contact-page');

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/calendar');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const isValid = form.title.trim() && form.description.trim();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        trackEvent(EVENTS.CONTACT_FORM_SUBMITTED, {
            titleLength: form.title.trim().length,
            descriptionLength: form.description.trim().length,
        });
        const result = await sendSupportContact(form.title.trim(), form.description.trim());

        if (result) {
            trackEvent(EVENTS.CONTACT_FORM_SUCCESS);
            showSuccess('Mensaje enviado con éxito. Te responderemos lo antes posible.');
            setForm({ title: '', description: '' });
            navigate('/profile');
        } else {
            trackEvent(EVENTS.CONTACT_FORM_FAILED);
            showError('No hemos podido enviar tu mensaje. Intenta de nuevo más tarde.');
        }

    };

    return (
        <>
            <HeaderSecondLevel title="Contacto" showBackButton onBack={handleBack} />

            <div className="page page-secondary">
                <div className="container">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-lg font-semibold mb-1">¿Tienes algún problema?</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Cuéntanos brevemente qué ha pasado y te responderemos lo antes posible.
                        </p>

                        <InputField
                            name="title"
                            label="Título del mensaje"
                            placeholder="Por ejemplo: Error al publicar turno"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />

                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe el problema que has tenido..."
                                rows={5}
                            />
                        </div>

                        <div className="btn-group mt-3">
                            <Button
                                label="Enviar mensaje"
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={!isValid}
                                isLoading={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ContactPage;
