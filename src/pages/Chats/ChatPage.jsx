import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAcceptedSwaps } from '../../services/swapService';
import { getMyWorkerProfile } from '../../services/workerService';
import { buildChatContext } from '../../utils/chatUtils';
import ChatBox from '../../components/ChatBox';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getVerb, getOtherVerb } from '../../utils/dateUtils';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';


const ChatPage = () => {
    const { swapId } = useParams();
    const [swap, setSwap] = useState(null);
    const [workerId, setWorkerId] = useState(null);
    const { getToken } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            const token = await getToken();
            const worker = await getMyWorkerProfile(token);
            setWorkerId(worker.worker_id);

            const swaps = await getAcceptedSwaps(token);
            const selected = swaps.find(s => s.swap_id === swapId);
            setSwap(selected || null);
        };

        fetchData();
    }, [swapId, getToken]);

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
                title= {`Chat con ${otherPersonName}`}
                showBackButton
                onBack={handleBack}
            />
            <div className="container page">
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
        </>
    );
};

export default ChatPage;
