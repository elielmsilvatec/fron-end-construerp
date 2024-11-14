'use client';
import { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function App() {

  const [showAlert, setShowAlert] = useState(true);


  useEffect(() => {
    if (showAlert) {
      Swal.fire({
        title: 'Operação Concluída!',
        text: 'Sua ação foi realizada com sucesso.',
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#4CAF50' // Define a cor de fundo do botão como verde
      }).then((result) => {
        if (result.isConfirmed) {
          setShowAlert(false); // Fecha o alerta e atualiza o estado
        }
      });
    }
  }, [showAlert]);

  return null
}