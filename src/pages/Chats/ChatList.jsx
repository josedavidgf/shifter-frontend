import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useSwapApi } from '../../api/useSwapApi';
import { useNavigate } from 'react-router-dom';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';
import Loader from '../../components/ui/Loader/Loader';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ChatsListTable from '../../components/ChatsListTable';

const ChatsList = () => {
  const { getToken } = useAuth();
  const { getMyWorkerProfile } = useWorkerApi();
  const { getAcceptedSwaps } = useSwapApi();
  const [swaps, setSwaps] = useState([]);
  const [workerId, setWorkerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        if (swapsData) {
          setSwaps(swapsData);
        }
      } catch (err) {
        console.error('❌ Error cargando chats:', err.message);
        setError('No se pudieron cargar tus chats activos.');
      } finally {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 600 - elapsed);
        setTimeout(() => {
          setLoading(false);
        }, delay);
      }
    }

    fetchData();
  }, [getToken]);

  // Un chat se considera activo si hoy es anterior o igual a la fecha del turno o del turno ofrecido
  const isActive = (swap) => {
    const turnoDate = new Date(swap.shift.date);
    const offeredDate = new Date(swap.offered_date);
    const maxDate = turnoDate > offeredDate ? turnoDate : offeredDate;
    return new Date() <= maxDate;
  };

  const activeSwaps = swaps.filter(isActive);

  if (loading) {
    return <Loader text="Cargando chats activos..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error al cargar chats"
        description={error}
        ctaLabel="Reintentar"
        onCtaClick={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <HeaderFirstLevel title="Chats activos" />
      <div className="page page-secondary">
        <div className="container">
          {activeSwaps.length === 0 ? (
            <EmptyState
              title="No tienes chats activos"
              description="Cuando aceptes o propongas un intercambio, tendrás un chat activo aquí."
              ctaLabel="Ir al calendario"
              onCtaClick={() => navigate('/calendar')}
            />
          ) : (
            <ChatsListTable swaps={activeSwaps} workerId={workerId} />
          )}
        </div>
      </div>
    </>
  );
};

export default ChatsList;
