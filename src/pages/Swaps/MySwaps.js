import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSentSwaps } from '../../services/swapService';
import MySwapsTable from '../../components/MySwapsTable';
import useTrackPageView from '../../hooks/useTrackPageView';

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
    <div>
      <h2>Mis intercambios propuestos</h2>
      {/* {error && <p style={{ color: 'red' }}>{error}</p>}

      {mySwaps.length === 0 ? (
        <p>No has propuesto ningún intercambio todavía.</p>
      ) : (
        mySwaps.map((swap) => (
          <div key={swap.swap_id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <p><strong>Turno objetivo:</strong> {swap.shift?.date} ({swap.shift?.shift_type})</p>
            <p><strong>Ofrecido:</strong> {swap.offered_date || '—'} / {swap.offered_type} / {swap.offered_label}</p>
            <p><strong>Estado:</strong> {swap.status}</p>

            {swap.status === 'proposed' && (
              <button onClick={() => handleCancelSwap(swap.swap_id)}>❌ Cancelar</button>
            )}
          </div>
        ))
      )} */}
      {mySwaps.length === 0 ? (
        <p>No has propuesto ningún intercambio todavía.</p>
      ) : (
        <MySwapsTable />
      )}
    </div>
  );
};

export default MySwaps;
