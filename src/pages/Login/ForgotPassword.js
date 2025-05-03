import { useState } from 'react';
import supabase from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showError, showInfo } = useToast();


    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo:
                process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/auth/callback'
                    : 'https://pre-app.apptanda.com/auth/callback',
        });

        if (error) {
            showError("No hemos podido enviar el email. ¿Está bien escrito?");
        } else {
            showInfo("Si tu correo está registrado, te hemos enviado instrucciones.");
            navigate('/login');
        }

        setLoading(false);
    };
    const handleBack = () => {
        navigate('/login');

    };


    return (
        <>
            <HeaderSecondLevel
                title="Recuperar contraseña"
                showBackButton
                onBack={handleBack}
            />
            <div className="page">
                <div className='container'>
                    <form onSubmit={handlePasswordReset}>
                        <InputField
                            name="email"
                            label="Correo electrónico"
                            placeholder="ejemplo@tanda.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                        />
                        <Button
                            label="Enviar enlace"
                            type="submit"
                            isLoading={loading}
                            variant="primary"
                            size="lg"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
