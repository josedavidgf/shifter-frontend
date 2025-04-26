import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSentSwaps } from '../../services/swapService';
import MySwapsTable from '../../components/MySwapsTable';
import useTrackPageView from '../../hooks/useTrackPageView';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';

const MySwaps = () => {
  const { getToken } = useAuth();
  const [mySwaps, setMySwaps] = useState([]);
  const [, setError] = useState(null);

  useTrackPageView('my-swaps');

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const token = await getToken();
        const swaps = await getSentSwaps(token);
        setMySwaps(swaps);
      } catch (err) {
        console.error('❌ Error al cargar swaps enviados:', err.message);
        setError('Error al cargar swaps');
      }
    }
    fetchSwaps();
  }, [getToken]);



  return (
    <>
      <HeaderFirstLevel
        title="Intercambios propuestos"
      />
      <div className="container page">
        {mySwaps.length === 0 ? (
          <p>No has propuesto ningún intercambio todavía.</p>
        ) : (
          <MySwapsTable />
        )}
      </div>
    </>
  );
};

export default MySwaps;
