

'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function App() {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (showAlert) {
      Swal.fire({
        title: 'Operação Falhou!',
        text: 'Ocorreu um erro ao realizar a ação.',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33' // Define a cor de fundo do botão como vermelho
      }).then((result) => {
        if (result.isConfirmed) {
          setShowAlert(false); // Fecha o alerta e atualiza o estado
        }
      });
    }
  }, [showAlert]);

  return null;
}
