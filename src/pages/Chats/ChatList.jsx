import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyWorkerProfile } from '../../services/workerService';
import { getAcceptedSwaps } from '../../services/swapService'; // creamos este servicio
import ChatBox from '../../components/ChatBox';
import { formatDate, getVerb, getOtherVerb } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';



const ChatsList = () => {
    const { getToken } = useAuth();
    const [swaps, setSwaps] = useState([]);
    const [workerId, setWorkerId] = useState(null);
    const [selectedSwap] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const token = await getToken();
            const worker = await getMyWorkerProfile(token);
            setWorkerId(worker.worker_id);

            const swaps = await getAcceptedSwaps(token);
            setSwaps(swaps);
        }
        fetchData();
    }, [getToken]);
    console.log('selectedSwap:', selectedSwap);
    const isActive = (swap) => {
        const turnoDate = new Date(swap.shift.date);
        const offeredDate = new Date(swap.offered_date);
        const maxDate = turnoDate > offeredDate ? turnoDate : offeredDate;


        return new Date() <= maxDate;
    };

    const activeSwaps = swaps.filter(isActive);

    return (
        <div>
            <h2>Chats Activos</h2>

            {selectedSwap ? (
                <>
                    <ChatBox
                        swapId={selectedSwap.swap_id}
                        myWorkerId={workerId}
                        otherWorkerId={selectedSwap.requester_id === workerId ? selectedSwap.shift.worker_id : selectedSwap.requester_id}
                        otherPersonName={selectedSwap.requester_id === workerId ? selectedSwap.shift.worker?.name : selectedSwap.requester?.name}
                        otherPersonSurname={selectedSwap.requester_id === workerId ? selectedSwap.shift.worker?.surname : selectedSwap.requester?.surname}
                        myDate={selectedSwap.requester_id === workerId ? selectedSwap.offered_date : selectedSwap.shift.date}
                        otherDate={selectedSwap.requester_id === workerId ? selectedSwap.shift.date : selectedSwap.offered_date}
                    />
                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {activeSwaps.map((swap) => {
                        const iAmRequester = swap.requester_id === workerId;
                        const myDate = iAmRequester ? swap.offered_date : swap.shift.date;
                        const myDateType = iAmRequester ? swap.offered_type : swap.shift.shift_type;
                        const otherDate = iAmRequester ? swap.shift.date : swap.offered_date;
                        const otherType = iAmRequester ? swap.shift.shift_type : swap.offered_type;

                        const otherPersonName = iAmRequester
                            ? `${swap.shift.worker?.name} ${swap.shift.worker?.surname}`
                            : `${swap.requester?.name} ${swap.requester?.surname}`;

                        return (
                            <div
                                key={swap.swap_id}
                                className="chat-card"
                                onClick={() => navigate(`/chats/${swap.swap_id}`)}
                            >
                                <strong>Intercambio #{swap.swap_id}</strong>
                                <span>
                                    {getVerb(myDate)} el {formatDate(myDate)} {myDateType} y {otherPersonName} {getOtherVerb(otherDate)} el {formatDate(otherDate)} {otherType}
                                </span>
                            </div>
                        );
                    })}

                    {activeSwaps.length === 0 && (
                        <p>No tienes chats activos ahora mismo.</p>
                    )}
                </div>

            )}
        </div>
    );

};

export default ChatsList;
