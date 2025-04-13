import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSentSwaps, cancelSwap } from '../services/swapService';

const MySwapsTable = () => {
  const { getToken } = useAuth();
  const [mySwaps, setMySwaps] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [, setError] = useState(null);

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const token = await getToken();
        const swaps = await getSentSwaps(token);
        setMySwaps(swaps);
        setFiltered(swaps);
      } catch (err) {
        console.error('❌ Error al cargar swaps enviados:', err.message);
        setError('Error al cargar swaps');
      }
    }
    fetchSwaps();
  }, [getToken]);

  useEffect(() => {
    let result = mySwaps;

    if (filterStatus) {
      result = result.filter(s => s.status === filterStatus);
    }

    if (filterDate) {
      result = result.filter(s => s.shift?.date === filterDate);
    }

    setFiltered(result);
  }, [filterStatus, filterDate, mySwaps]);

  const clearFilters = () => {
    setFilterDate('');
    setFilterStatus('');
  };

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
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="proposed">Propuesto</option>
        <option value="accepted">Aceptado</option>
        <option value="rejected">Rechazado</option>
        <option value="cancelled">Cancelado</option>
      </select>
      <button onClick={clearFilters}>Limpiar filtros</button>
      <table>
        <thead>
          <tr>
            <th>Fecha objetivo</th>
            <th>Tipo objetivo</th>
            <th>Fecha ofrecida</th>
            <th>Tipo ofrecido</th>
            <th>Etiqueta ofrecida</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((swap) => (
            <tr key={swap.swap_id}>
              <td>{swap.shift?.date}</td>
              <td>{swap.shift?.shift_type}</td>
              <td>{swap.offered_date || '—'}</td>
              <td>{swap.offered_type}</td>
              <td>{swap.offered_label}</td>
              <td>{swap.status}</td>
              <td>
                {swap.status === 'proposed' && (
                  <button onClick={() => handleCancelSwap(swap.swap_id)}>❌ Cancelar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MySwapsTable;
