import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAcceptedSwaps } from '../../services/swapService';
import { getMyWorkerProfile } from '../../services/workerService';
import { buildChatContext } from '../../utils/chatUtils';
import ChatBox from '../../components/ChatBox';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getVerb, getOtherVerb } from '../../utils/dateUtils';

const ChatPage = () => {
    const { swapId } = useParams();
    const [swap, setSwap] = useState(null);
    const [workerId, setWorkerId] = useState(null);
    const { getToken } = useAuth();

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

    return (
        <div className="chat-page">
            <div className="chat-page-header">
                <BackButton />
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
    );
};

export default ChatPage;
