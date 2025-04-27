import React, { useState } from 'react';
import Button from '../../../components/ui/Button/Button'; // Ajusta ruta si necesario
import { UserCircle } from '../../../theme/icons'; // Icono de ejemplo

export default function ButtonDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFakeSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Acción completada');
    }, 2000); // Simula 2 segundos de carga
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Botones normales</h2>

      <Button
        label="Primary Button"
        variant="primary"
        size="md"
        onClick={() => alert('Primary')}
      />

      <Button
        label="Secondary Button"
        variant="secondary"
        size="md"
        onClick={() => alert('Secondary')}
      />

      <Button
        label="Outline Button"
        variant="outline"
        size="md"
        onClick={() => alert('Outline')}
      />

      <Button
        label="Ghost Button"
        variant="ghost"
        size="md"
        onClick={() => alert('Ghost')}
      />

      <h2>Botones con iconos</h2>

      <Button
        label="Profile Left"
        variant="primary"
        size="md"
        leftIcon={<UserCircle size={20} />}
        onClick={() => alert('Left Icon')}
      />

      <Button
        label="Profile Right"
        variant="primary"
        size="md"
        rightIcon={<UserCircle size={20} />}
        onClick={() => alert('Right Icon')}
      />

      <h2>Botones deshabilitados</h2>

      <Button
        label="Primary Disabled"
        variant="primary"
        size="md"
        disabled
      />

      <Button
        label="Outline Disabled"
        variant="outline"
        size="md"
        disabled
      />

      <h2>Botones en Loading</h2>

      <Button
        label="Guardar cambios"
        variant="primary"
        size="md"
        isLoading={isLoading}
        onClick={handleFakeSubmit}
      />

      <Button
        label="Buscar"
        variant="outline"
        size="md"
        isLoading
      />

      <Button
        label="Procesando"
        variant="ghost"
        size="md"
        isLoading
      />

    </div>
  );
}
