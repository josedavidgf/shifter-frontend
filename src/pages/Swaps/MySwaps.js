import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSwapApi } from '../../api/useSwapApi';
import MySwapsTable from '../../components/MySwapsTable';
import useTrackPageView from '../../hooks/useTrackPageView';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';
import Loader from '../../components/ui/Loader/Loader';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { useNavigate } from 'react-router-dom';
import useMinimumDelay from '../../hooks/useMinimumDelay';
import { useToast } from '../../hooks/useToast'; // ya lo usas en otras vistas

const MySwaps = () => {
  const { getToken } = useAuth();
  const { getSentSwaps, getReceivedSwaps } = useSwapApi();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showError } = useToast();
  const showLoader = useMinimumDelay(loading, 500);



  useTrackPageView('my-swaps');

  useEffect(() => {
    async function fetchSwaps() {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const [sent, received] = await Promise.all([
          getSentSwaps(token),
          getReceivedSwaps(token),
        ]);

        const markedSent = sent.map(s => ({ ...s, direction: 'sent' }));
        const markedReceived = received.map(r => ({ ...r, direction: 'received' }));
        const all = [...markedSent, ...markedReceived];
        const sorted = all.sort((a, b) => new Date(a.shift?.date) - new Date(b.shift?.date));

        setSwaps(sorted);
      } catch (err) {
        console.error('❌ Error al cargar swaps:', err.message);
        showError('Error al cargar los intercambios. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }

    fetchSwaps();
  }, [getToken]);

  if (showLoader) {
    return <Loader text="Cargando intercambios..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudo cargar la información"
        description={error}
        ctaLabel="Reintentar"
        onCtaClick={() => window.location.reload()}
      />
    );
  }


  return (
    <>
      <HeaderFirstLevel title="Tus cambios" />
      <div className="page page-primary">
        <div className="container">
          {!loading && swaps.length === 0 ? (
            <EmptyState
              title="No tienes intercambios activos"
              description="Cuando propongas o te propongan un intercambio, aparecerán aquí."
              ctaLabel="Buscar turnos"
              onCtaClick={() => navigate('/shifts/hospital')}
            />
          ) : null}

          {!loading && swaps.length > 0 && (
            <MySwapsTable swaps={swaps} isLoading={loading} />
          )}
        </div>
      </div>
    </>
  );
};

export default MySwaps;
