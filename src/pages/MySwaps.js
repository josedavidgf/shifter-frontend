import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSentSwaps, cancelSwap } from '../services/swapService';
import { useNavigate } from 'react-router-dom';
import MySwapsTable from '../components/MySwapsTable';

const MySwaps = () => {
  const { getToken } = useAuth();
  const [mySwaps, setMySwaps] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleCancelSwap = async (swapId) => {
    try {
      const token = await getToken();
      await cancelSwap(swapId, token);
      const updated = await getSentSwaps(token);
      setMySwaps(updated);
    } catch (err) {
      console.error('❌ Error al cancelar swap:', err.message);
      alert('Error al cancelar el intercambio');
    }
  };


  return (
    <div>
      <h2>Mis intercambios propuestos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
      )}
      {mySwaps.length === 0 ? (
        <p>No has propuesto ningún intercambio todavía.</p>
      ) : (
        <MySwapsTable />
      )}
      <hr />
      <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
    </div>
  );
};

export default MySwaps;
