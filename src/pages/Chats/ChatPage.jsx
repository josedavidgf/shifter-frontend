import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwapApi } from '../../api/useSwapApi';
import { useWorkerApi } from '../../api/useWorkerApi';
import { buildChatContext } from '../../utils/chatUtils';
import ChatBox from '../../components/ChatBox';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getVerb, getOtherVerb } from '../../utils/dateUtils';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';


const ChatPage = () => {
    const { swapId } = useParams();
    const { getToken } = useAuth();
    const { getMyWorkerProfile } = useWorkerApi();
    const { getAcceptedSwaps, loading, error } = useSwapApi(); // 🆕
    const [swap, setSwap] = useState(null);
    const [workerId, setWorkerId] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        async function fetchData() {
            try {
                const token = await getToken();
                const worker = await getMyWorkerProfile(token);
                setWorkerId(worker.worker_id);

                const swapsData = await getAcceptedSwaps(token);
                const selected = swapsData.find(s => s.swap_id === swapId);
                setSwap(selected || null);
            } catch (err) {
                console.error('❌ Error cargando chat:', err.message);
            }
        }

        fetchData();
    }, [swapId, getToken]);

    if (loading) {
        return <p>Cargando conversación...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!swap || !workerId) {
        return <p style={{ padding: '1rem' }}>Cargando conversación...</p>;
    }

    const {
        otherPersonName,
        otherPersonSurname,
        otherWorkerId,
        myDate,
        otherDate
    } = buildChatContext(swap, workerId);

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
            />
            <div className="page page-secondary">
                <div className="container">

                    <div className="chat-page-header">
                        <div>
                            <strong>{otherPersonName} {otherPersonSurname}</strong><br />
                            <small>
                                {getVerb(myDate)} {formatDate(myDate)} · {otherPersonName} {getOtherVerb(otherDate)} {formatDate(otherDate)}
                            </small>
                        </div>
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
