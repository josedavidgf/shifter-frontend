import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwapApi } from '../../api/useSwapApi';
import { useWorkerApi } from '../../api/useWorkerApi';
import { buildChatContext } from '../../utils/chatUtils';
import ChatBox from '../../components/ChatBox';
import { useAuth } from '../../context/AuthContext';
import { getVerb, getOtherVerb } from '../../utils/dateUtils';
import { formatFriendlyDate } from '../../utils/formatFriendlyDate';
import { translateShiftType } from '../../utils/translateServices';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Loader from '../../components/ui/Loader/Loader'; // ✅
import { Phone } from '../../theme/icons';


const ChatPage = () => {
    const { swapId } = useParams();
    const { getToken } = useAuth();
    const { getMyWorkerProfile } = useWorkerApi();
    const { getAcceptedSwaps } = useSwapApi();
    const [swap, setSwap] = useState(null);
    const [workerId, setWorkerId] = useState(null);
    const [loading, setLoading] = useState(true); // ✅
    const [error, setError] = useState(null); // ✅
    const navigate = useNavigate();



    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            const startTime = Date.now();

            try {
                const token = await getToken();
                const worker = await getMyWorkerProfile(token);
                setWorkerId(worker.worker_id);

                const swapsData = await getAcceptedSwaps(token);
                const selectedSwap = swapsData.find(s => s.swap_id === swapId);
                setSwap(selectedSwap || null);
            } catch (err) {
                console.error('❌ Error cargando chat:', err.message);
                setError('Error al cargar la conversación.');
            } finally {
                const elapsed = Date.now() - startTime;
                const delay = Math.max(0, 600 - elapsed);
                setTimeout(() => {
                    setLoading(false);
                }, delay);
            }
        }

        fetchData();
    }, [swapId, getToken]);


    if (loading) {
        return <Loader text="Cargando conversación..." />;
    }

    if (error) {
        return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    }

    if (!swap || !workerId) {
        return <Loader text="Cargando conversación..." />;
    }

    console.log(swap)

    const {
        otherPersonName,
        otherPersonSurname,
        otherPersonMobileCountryCode,
        otherPersonMobilePhone,
        myDate,
        myDateType,
        otherDate,
        otherDateType,
        otherWorkerId,
    } = buildChatContext(swap, workerId);


    const fullPhone = `${otherPersonMobileCountryCode ?? ''}${otherPersonMobilePhone ?? ''}`.replace(/\s+/g, '');
    const phoneLink = fullPhone.length >= 10 ? `tel:${fullPhone}` : null;
    //const whatsappLink = fullPhone.length >= 10 ? `https://wa.me/${fullPhone}` : null;


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
                title={`Chat con ${otherPersonName}`}
                showBackButton
                onBack={handleBack}
                rightAction={
                    phoneLink
                        ? {
                            icon: <Phone size={20} />,
                            label: 'Llamar',
                            onClick: () => window.open(phoneLink, '_blank')
                        }

                        : undefined
                }
            />

            <div className="page">
                <div className="container">

                    <div className="chat-page-header">
                        {/*                             <strong>{otherPersonName} {otherPersonSurname}</strong><br />
 */}                            <p>
                            {getVerb(myDate)} {formatFriendlyDate(myDate)} de {translateShiftType(myDateType)} y {otherPersonName} {getOtherVerb(otherDate)} {formatFriendlyDate(otherDate)} de {translateShiftType(otherDateType)}
                        </p>
                    </div>
                    <div className="chat-page-content">
                        <ChatBox
                            swapId={swap.swap_id}
                            myWorkerId={workerId}
                            otherWorkerId={otherWorkerId}
                            otherPersonName={otherPersonName}
                            otherPersonSurname={otherPersonSurname}
                            myDate={myDate}
                            otherDate={otherDate}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatPage;
