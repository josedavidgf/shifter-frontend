import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSwapApi } from '../../api/useSwapApi';
import MySwapsTable from '../../components/MySwapsTable';
import useTrackPageView from '../../hooks/useTrackPageView';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';
import Loader from '../../components/ui/Loader/Loader'; // ✅

const MySwaps = () => {
  const { getToken } = useAuth();
  const { getSentSwaps, getReceivedSwaps } = useSwapApi();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useTrackPageView('my-swaps');

  useEffect(() => {
    async function fetchSwaps() {
      setLoading(true);
      setError(null);

      const startTime = Date.now(); // ⏱️

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
        setError('Error al cargar intercambios');
      } finally {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 1000 - elapsed); // queremos garantizar al menos 400ms de loading
        setTimeout(() => {
          setLoading(false);
        }, delay);
      }
    }

    fetchSwaps();
  }, [getToken]);

  if (loading) {
    return <Loader text="Cargando intercambios..." />;
  }

  if (error) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>;
  }

  return (
    <>
      <HeaderFirstLevel title="Intercambios propuestos" />
      <div className="page page-primary">
        <div className="container">
          {swaps.length === 0 ? (
            <p>No tienes intercambios aún.</p>
          ) : (
            <MySwapsTable swaps={swaps} />
          )}
        </div>
      </div>
    </>
  );
};

export default MySwaps;
