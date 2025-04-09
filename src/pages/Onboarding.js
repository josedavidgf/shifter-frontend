import React, { useState, useEffect } from 'react';
import { getWorkerTypes, createWorker } from '../services/workerService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Onboarding() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [workerType, setWorkerType] = useState('');
    const [workerTypes, setWorkerTypes] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { getToken,completeOnboarding } = useAuth();


    useEffect(() => {
        async function fetchWorkerTypes() {
            try {
                const types = await getWorkerTypes();
                setWorkerTypes(types);
            } catch (err) {
                console.error('Error al obtener tipos de trabajador:', err.message);
                setError('Error al cargar tipos de trabajador');
            }
        }
        fetchWorkerTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await getToken();
        try {
            // Recoger los datos del formulario
            const workerData = {
                name: name.trim(),
                surname: surname.trim(),
                workerType: workerType,
            };
            console.log('Datos a enviar:', workerData);
    
            const response = await createWorker(workerData,token);
            console.log('Response:', response);
            if (response?.success) {
                alert('Trabajador creado con éxito');
                localStorage.setItem('hasCompletedOnboarding', 'true');
                completeOnboarding(); // 👈 actualiza el estado y localStorage
                navigate('/dashboard');
            } else {
                throw new Error(response?.message || 'Error al crear el trabajador');
            }
        } catch (err) {
            console.error('Error al crear el trabajador:', err.message);
            alert('Error al crear el trabajador: ' + err.message);
        }
    };
    
    

    return (
        <div>
            <h2>Completa tu Onboarding</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input 
                        type="text" 
                        value={surname} 
                        onChange={(e) => setSurname(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Tipo de Trabajador:</label>
                    <select 
                        value={workerType} 
                        onChange={(e) => setWorkerType(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Selecciona un tipo</option>
                        {workerTypes.map((type) => (
                            <option key={type.worker_type_id} value={type.worker_type_id}>
                                {type.worker_type_name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default Onboarding;
